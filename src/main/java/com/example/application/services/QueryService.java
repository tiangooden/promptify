package com.example.application.services;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.example.application.models.Document;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueryService {
    private final LLMService llmService;
    private final EmbeddingService embeddingService;
    private final DataSource dataSource;

    public String query(String prompt) throws IOException, InterruptedException {
        Double[] embeddingArray = embeddingService.getEmbedding(prompt);
        var similarDocuments = Arrays.stream(embeddingArray)
                .map(String::valueOf)
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
                        .embedding(parseVectorToDoubleArray(rs.getString("embedding")))
                        .build());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        String context = relevantDocs.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n---\n"));
        String answer = llmService.callLLMService(prompt, context);
        return answer;
    }

    private Double[] parseVectorToDoubleArray(String vectorStr) {
        if (vectorStr == null || vectorStr.isBlank())
            return new Double[0];
        vectorStr = vectorStr.replaceAll("[\\[\\]]", ""); // Remove brackets
        String[] parts = vectorStr.split(",");
        Double[] result = new Double[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Double.parseDouble(parts[i].trim());
        }
        return result;
    }
}
