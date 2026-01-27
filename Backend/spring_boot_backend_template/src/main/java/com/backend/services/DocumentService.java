package com.backend.services;

import com.backend.entities.Document;
import com.backend.entities.DocumentStatus;
import java.util.List;

public interface DocumentService {
    Document submitDocuments(Long parentId, Long applicationId, Document document);
    Document getDocumentById(Long id);
    Document getDocumentByApplicationId(Long applicationId);
    List<Document> getDocumentsByParentId(Long parentId);
    List<Document> getAllDocuments();
    Document verifyDocuments(Long id, DocumentStatus status, String comments);
}
