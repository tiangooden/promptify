package com.example.application.services;

import com.example.application.models.Document;
import com.example.application.repositories.DocumentRepository;

import lombok.RequiredArgsConstructor;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class IngestService {

    private final DocumentRepository repo;
    private final EmbeddingService embeddingService;

    public void ingestText(String text) throws IOException, InterruptedException {
        Double[] embedding = embeddingService.getEmbedding(text);
        repo.save(Document.builder().content(text).embedding(embedding).build());
    }

    public void ingestFromUrl(String url) throws IOException, InterruptedException {
        String content = Jsoup.connect(url).get().text();
        Double[] embedding = embeddingService.getEmbedding(content);
        repo.save(Document.builder().content(content).embedding(embedding).build());
    }

    public void ingestFromFile(MultipartFile file) throws IOException, InterruptedException {
        String content = new String(file.getBytes());
        Double[] embedding = embeddingService.getEmbedding(content);
        repo.save(Document.builder().content(content).embedding(embedding).build());
    }
}