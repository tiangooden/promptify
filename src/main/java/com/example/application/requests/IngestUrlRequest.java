package com.example.application.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IngestUrlRequest {
    @NotBlank(message = "URL is required")
    private String url;
}