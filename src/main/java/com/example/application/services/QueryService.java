package com.example.application.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Service;

import com.example.application.models.Document;
import com.example.application.repositories.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueryService {
    private final EmbeddingModel embeddingModel;
    private final OllamaChatModel chatModel;
    private final DocumentRepository documentRepository;

    public String query(String prompt) throws IOException, InterruptedException {
        EmbeddingResponse embeddingResponse = this.embeddingModel.embedForResponse(List.of(prompt));
        float[] output = embeddingResponse.getResult().getOutput();
        List<Document> relevantDocs = documentRepository.findRelevantDocuments(output);
        String context = relevantDocs.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n---\n"));
        return chatModel.call(context + "\n\n" + prompt);
    }
}
