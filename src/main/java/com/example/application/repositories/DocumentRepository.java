package com.example.application.repositories;

import com.example.application.dtos.DocumentDTO;
import com.example.application.models.Document;

import lombok.RequiredArgsConstructor;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class DocumentRepository {

    private final JdbcTemplate jdbcTemplate;
    private final DocumentDTORowMapper documentDTORowMapper;

    public List<DocumentDTO> findAllProjectedBy() {
        String sql = "SELECT id, name, content FROM document";
        return jdbcTemplate.query(sql, documentDTORowMapper);
    }

    public void save(Document document) {
        if (document.getId() == null) {
            String sql = "INSERT INTO document (name, content, embedding) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, document.getName(), document.getContent(), document.getEmbedding());
        } else {
            String sql = "UPDATE document SET name = ?, content = ?, embedding = ? WHERE id = ?";
            jdbcTemplate.update(sql, document.getName(), document.getContent(), document.getEmbedding(), document.getId());
        }
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM document WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}