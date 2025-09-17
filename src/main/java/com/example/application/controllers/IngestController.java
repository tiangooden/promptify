package com.example.application.controllers;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.application.annotations.LogExecutionTime;
import com.example.application.requests.IngestTextRequest;
import com.example.application.requests.IngestUrlRequest;
import com.example.application.services.IngestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ingest")
@RequiredArgsConstructor
public class IngestController {
    
    private final IngestService ingestService;

    @PostMapping("/text")
    @LogExecutionTime
    public ResponseEntity<?> ingestText(@RequestBody IngestTextRequest request)
            throws IOException, InterruptedException {
        ingestService.ingestText(request.getText());
        return ResponseEntity.ok("Ingested");
    }

    @PostMapping("/url")
    @LogExecutionTime
    public ResponseEntity<?> ingestFromUrl(@RequestBody IngestUrlRequest request)
            throws IOException, InterruptedException {
        ingestService.ingestFromUrl(request.getUrl());
        return ResponseEntity.ok("URL content ingested");
    }

    @PostMapping("/file")
    @LogExecutionTime
    public ResponseEntity<?> ingestFromFile(@RequestParam("file") MultipartFile file)
            throws IOException, InterruptedException {
        ingestService.ingestFromFile(file);
        return ResponseEntity.ok("File content ingested");
    }
}
