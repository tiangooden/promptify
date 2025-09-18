package com.example.application.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IngestTextRequest {
    @NotBlank(message = "Text content is required")
    private String text;
    @NotBlank(message = "Document name is required")
    private String name;
}