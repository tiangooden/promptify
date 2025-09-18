package com.example.application.repositories;

import com.example.application.dtos.DocumentDTO;
import com.example.application.models.Document;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<DocumentDTO> findAllProjectedBy();
}