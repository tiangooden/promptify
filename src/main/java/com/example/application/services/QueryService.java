package com.example.application.services;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.sql.DataSource;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Service;

import com.example.application.models.Document;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueryService {
    private final DataSource dataSource;
    private final EmbeddingModel embeddingModel;
    private final OllamaChatModel chatModel;

    public String query(String prompt) throws IOException, InterruptedException {
        EmbeddingResponse embeddingResponse = this.embeddingModel.embedForResponse(List.of(prompt));
        float[] output = embeddingResponse.getResult().getOutput();
        String similarDocuments = IntStream.range(0, output.length)
                .mapToObj(i -> String.valueOf(output[i]))
                .collect(Collectors.joining(",", "[", "]"));
        List<Document> relevantDocs = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            String sql = "SELECT * FROM document ORDER BY embedding <-> CAST(? AS vector) LIMIT 5";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, similarDocuments);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                relevantDocs.add(Document.builder()
                        .id(rs.getLong("id"))
                        .content(rs.getString("content"))
                        .embedding(parseVectorToFloatArray(rs.getString("embedding")))
                        .build());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        String context = relevantDocs.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n---\n"));
        String answer = chatModel.call(context + "\n\n" + prompt);
        return answer;
    }

    private float[] parseVectorToFloatArray(String vectorStr) {
        if (vectorStr == null || vectorStr.isBlank())
            return new float[0];
        vectorStr = vectorStr.replaceAll("[\\[\\]]", ""); // Remove brackets
        String[] parts = vectorStr.split(",");
        float[] result = new float[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Float.parseFloat(parts[i].trim());
        }
        return result;
    }
}
