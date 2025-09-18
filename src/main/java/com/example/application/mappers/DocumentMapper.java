package com.example.application.mappers;

import com.example.application.dtos.DocumentDTO;
import com.example.application.models.Document;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    DocumentDTO documentToDocumentDTO(Document document);

    Document documentDTOToDocument(DocumentDTO documentDTO);
}