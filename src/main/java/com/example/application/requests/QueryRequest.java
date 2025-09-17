package com.example.application.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class QueryRequest {
    @NotBlank(message = "Prompt is required")
    private String prompt;
}