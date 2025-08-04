package com.example.application.services;

import com.example.application.config.OllamaConfigProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmbeddingService {
    private HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final OllamaConfigProperties ollamaConfigProperties;

    public Double[] getEmbedding(String inputText) throws IOException, InterruptedException {
        return getEmbedding(inputText, ollamaConfigProperties.getEmbedModelName());
    }

    @PostConstruct
    private void init() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public Double[] getEmbedding(String inputText, String model) throws IOException, InterruptedException {
        // Escape special characters in the input text
        String escapedText = inputText.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
        String payload = String.format("""
                {
                    "model": "%s",
                    "prompt": "%s"
                }
                """, model, escapedText);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ollamaConfigProperties.getHost() + ollamaConfigProperties.getEmbedPath()))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to get embedding: " + response.body());
        }
        JsonNode jsonNode = objectMapper.readTree(response.body());
        JsonNode embeddingNode = jsonNode.get("embedding");
        if (embeddingNode == null || !embeddingNode.isArray()) {
            throw new RuntimeException("Invalid response: embedding field is missing or not an array.");
        }
        return objectMapper.convertValue(embeddingNode, Double[].class);
    }
}
