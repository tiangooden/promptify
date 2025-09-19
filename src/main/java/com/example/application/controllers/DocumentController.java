package com.example.application.controllers;

import com.example.application.dtos.DocumentDTO;
import com.example.application.services.DocumentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        List<DocumentDTO> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}