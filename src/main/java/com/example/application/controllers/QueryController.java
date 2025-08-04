package com.example.application.controllers;

import com.example.application.annotations.LogExecutionTime;
import com.example.application.models.Document;
import com.example.application.services.EmbeddingService;
import com.example.application.services.LLMService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import com.example.application.requests.QueryRequest;

@RestController
@RequestMapping("/api/query")
@RequiredArgsConstructor
public class QueryController {
    private final EmbeddingService embeddingService;
    private final DataSource dataSource;
    private final LLMService llmService;

    @PostMapping
    @LogExecutionTime
    public ResponseEntity<?> query(@RequestBody QueryRequest request) throws IOException, InterruptedException {
        String prompt = request.getPrompt();
        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }
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
        return ResponseEntity.ok(Map.of("answer", answer));
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
