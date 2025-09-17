package com.example.application.controllers;

import com.example.application.annotations.LogExecutionTime;
import com.example.application.services.QueryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import com.example.application.requests.QueryRequest;
import com.example.application.responses.QueryResponse;

@RestController
@RequestMapping("/api/query")
@RequiredArgsConstructor
public class QueryController {
    private final QueryService queryService;

    @PostMapping
    @LogExecutionTime
    public ResponseEntity<?> query(@Valid @RequestBody QueryRequest request) throws IOException, InterruptedException {
        String answer = queryService.query(request.getPrompt());
        return ResponseEntity.ok(QueryResponse.builder().answer(answer).build());
    }
}
