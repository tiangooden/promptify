package com.example.application.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IngestTextRequest {
    @NotBlank(message = "Prompt is required")
    private String text;
}