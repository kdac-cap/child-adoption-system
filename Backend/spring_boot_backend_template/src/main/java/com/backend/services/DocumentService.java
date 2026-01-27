package com.backend.services;


import com.backend.entities.*;
import com.backend.daos.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    public Document submit(Document document) {
        document.setStatus(DocumentStatus.SUBMITTED);
        document.setSubmittedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }

    public Document verifyByStaff(Long docId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        doc.setStatus(DocumentStatus.STAFF_VERIFIED);
        doc.setStaffVerifiedAt(LocalDateTime.now());
        return documentRepository.save(doc);
    }

    public Document approveByAdmin(Long docId, String comments) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        doc.setStatus(DocumentStatus.ADMIN_APPROVED);
        doc.setAdminApprovedAt(LocalDateTime.now());
        doc.setAdminComments(comments);
        return documentRepository.save(doc);
    }
}

