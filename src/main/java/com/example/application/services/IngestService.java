package com.example.application.services;

import com.example.application.models.Document;
import com.example.application.repositories.DocumentRepository;

import lombok.RequiredArgsConstructor;

import org.jsoup.Jsoup;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IngestService {

    private final DocumentRepository repo;
    private final EmbeddingModel embeddingModel;

    public void ingestText(String text, String name) throws IOException, InterruptedException {
        EmbeddingResponse embeddingResponse = this.embeddingModel.embedForResponse(List.of(text));
        float[] output = embeddingResponse.getResult().getOutput();
        repo.save(Document.builder().content(text).name(name).embedding(output).build());
    }

    public void ingestFromUrl(String url) throws IOException, InterruptedException {
        String content = Jsoup.connect(url).get().text();
        // Double[] embedding = embeddingService.getEmbedding(content);
        // repo.save(Document.builder().content(content).embedding(embedding).build());
    }

    public void ingestFromFile(MultipartFile file) throws IOException, InterruptedException {
        String content = new String(file.getBytes());
        // Double[] embedding = embeddingService.getEmbedding(content);
        // repo.save(Document.builder().content(content).embedding(embedding).build());
    }
}