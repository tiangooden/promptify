package com.example.application.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import com.example.application.models.Document;
import com.pgvector.PGvector;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueryService {
    private final EmbeddingModel embeddingModel;
    private final OllamaChatModel chatModel;
    private final JdbcTemplate jdbcTemplate;

    public String query(String prompt) throws IOException, InterruptedException {
        EmbeddingResponse embeddingResponse = this.embeddingModel.embedForResponse(List.of(prompt));
        float[] output = embeddingResponse.getResult().getOutput();
        String sql = "SELECT * FROM document ORDER BY embedding <-> CAST(? AS vector) LIMIT 5";
        RowMapper<Document> rowMapper = (rs, rowNum) -> {
            PGvector embeddings = (PGvector) rs.getObject("embedding");
            return Document.builder()
                    .id(rs.getLong("id"))
                    .content(rs.getString("content"))
                    .embedding(embeddings.toArray())
                    .build();
        };
        List<Document> relevantDocs = jdbcTemplate.query(connection -> {
            PGvector.addVectorType(connection);
            var ps = connection.prepareStatement(sql);
            ps.setObject(1, new PGvector(output));
            return ps;
        }, rowMapper);
        String context = relevantDocs.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n---\n"));
        return chatModel.call(context + "\n\n" + prompt);
    }
}
