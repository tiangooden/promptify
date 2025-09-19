package com.example.application.repositories;

import com.example.application.dtos.DocumentDTO;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class DocumentDTORowMapper implements RowMapper<DocumentDTO> {

    @Override
    public DocumentDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new DocumentDTO(rs.getLong("id"), rs.getString("name"), rs.getString("content"));
    }
}