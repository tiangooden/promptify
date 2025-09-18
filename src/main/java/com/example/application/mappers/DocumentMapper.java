package com.example.application.mappers;

import com.example.application.dtos.DocumentDTO;
import com.example.application.models.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    DocumentDTO documentToDocumentDTO(Document document);

    @Mapping(target = "embedding", ignore = true)
    Document documentDTOToDocument(DocumentDTO documentDTO);
}