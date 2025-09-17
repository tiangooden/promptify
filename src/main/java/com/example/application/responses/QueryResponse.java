package com.example.application.responses;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QueryResponse {
    private String answer;
}