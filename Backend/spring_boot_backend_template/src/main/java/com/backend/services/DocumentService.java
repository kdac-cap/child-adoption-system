package com.backend.services;

import com.backend.entities.Document;
import com.backend.entities.DocumentStatus;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface DocumentService {
    Document submitDocuments(Long parentId, Long applicationId, Document document);
    Document uploadDocument(MultipartFile file, Long applicationId, String documentType, Long userId);
    Document getDocumentById(Long id);
    Document getDocumentByApplicationId(Long applicationId);
    List<Document> getDocumentsByParentId(Long parentId);
    List<Document> getDocumentsByUser(Long userId);
    List<Document> getAllDocuments();
    Document verifyDocuments(Long id, DocumentStatus status, String comments);
}
