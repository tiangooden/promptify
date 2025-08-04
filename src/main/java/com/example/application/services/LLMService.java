package com.example.application.services;

import com.example.application.config.OllamaConfigProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LLMService {
    private final ObjectMapper objectMapper;
    private final OllamaConfigProperties ollamaConfigProperties;

    public String callLLMService(String prompt, String context) throws IOException, InterruptedException {
        String payload = objectMapper.writeValueAsString(Map.of(
                "model", ollamaConfigProperties.getQueryModelName(),
                "prompt", prompt + "\n\nContext:\n" + context,
                "stream", false));
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ollamaConfigProperties.getHost() + ollamaConfigProperties.getQueryPath()))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to get LLM response: " + response.body());
        }
        JsonNode json = objectMapper.readTree(response.body());
        return json.get("response").asText();
    }
}