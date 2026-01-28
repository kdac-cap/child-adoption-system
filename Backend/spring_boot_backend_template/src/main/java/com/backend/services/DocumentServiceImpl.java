package com.backend.services;

import com.backend.daos.ApplicationRepository;
import com.backend.daos.DocumentRepository;
import com.backend.daos.ParentRepository;
import com.backend.entities.Application;
import com.backend.entities.ApplicationStatus;
import com.backend.entities.Document;
import com.backend.entities.DocumentStatus;
import com.backend.entities.Parent;
import com.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private ParentRepository parentRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Override
    public Document submitDocuments(Long parentId, Long applicationId, Document document) {
        Parent parent = parentRepository.findById(parentId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        document.setParent(parent);
        document.setApplication(application);
        document.setParentUsername(parent.getUser().getUsername());
        document.setStatus(DocumentStatus.PENDING);
        document.setSubmittedAt(LocalDateTime.now());
        
        Document saved = documentRepository.save(document);
        
        application.setStatus(ApplicationStatus.DOCUMENTS_SUBMITTED);
        applicationRepository.save(application);
        
        notificationService.createNotification(
            parent.getUser().getId(),
            "Documents Submitted",
            "Your documents have been submitted successfully and are under review."
        );
        
        return saved;
    }
    
    @Override
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }
    
    @Override
    public Document getDocumentByApplicationId(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId)
            .orElse(null);
    }
    
    @Override
    public List<Document> getDocumentsByParentId(Long parentId) {
        return documentRepository.findByParentId(parentId);
    }
    
    @Override
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
    
    @Override
    public Document uploadDocument(org.springframework.web.multipart.MultipartFile file, Long applicationId, String documentType, Long userId) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        Document document = documentRepository.findByApplicationId(applicationId)
            .orElse(new Document());
        
        document.setApplication(application);
        document.setParent(application.getParent());
        document.setParentUsername(application.getParentUsername());
        document.setStatus(DocumentStatus.PENDING);
        document.setSubmittedAt(LocalDateTime.now());
        
        String fileName = file.getOriginalFilename();
        switch (documentType.toLowerCase()) {
            case "identity_proof" -> document.setIdentityProof(fileName);
            case "address_proof" -> document.setAddressProof(fileName);
            case "income_proof" -> document.setIncomeProof(fileName);
            case "marriage_proof" -> document.setMarriageProof(fileName);
            case "medical_certificate" -> document.setMedicalCertificate(fileName);
            case "police_verification" -> document.setPoliceVerification(fileName);
        }
        
        Document saved = documentRepository.save(document);
        
        // Update application status to DOCUMENTS_SUBMITTED
        application.setStatus(ApplicationStatus.DOCUMENTS_SUBMITTED);
        applicationRepository.save(application);
        
        notificationService.createNotification(
            application.getParent().getUser().getId(),
            "Document Uploaded",
            "Your " + documentType + " has been uploaded successfully."
        );
        
        return saved;
    }
    
    @Override
    public List<Document> getDocumentsByUser(Long userId) {
        // Find parent by user ID and get their documents
        Parent parent = parentRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
        return documentRepository.findByParentId(parent.getId());
    }
    
    @Override
    public Document verifyDocuments(Long id, DocumentStatus status, String comments) {
        Document document = getDocumentById(id);
        document.setStatus(status);
        document.setAdminComments(comments);
        document.setStaffVerifiedAt(LocalDateTime.now());
        
        Document updated = documentRepository.save(document);
        
        if (status == DocumentStatus.VERIFIED) {
            Application application = document.getApplication();
            application.setStatus(ApplicationStatus.DOCUMENTS_VERIFIED);
            applicationRepository.save(application);
            
            notificationService.createNotification(
                document.getParent().getUser().getId(),
                "Documents Verified",
                "Your documents have been verified successfully. Admin will review your application."
            );
            
            auditLogService.logAction(
                "DOCUMENT_VERIFIED",
                "Document",
                id,
                "Staff",
                null,
                "Documents verified for application #" + application.getId()
            );
        } else if (status == DocumentStatus.REJECTED) {
            Application application = document.getApplication();
            application.setStatus(ApplicationStatus.DOCUMENTS_REQUESTED);
            applicationRepository.save(application);
            
            notificationService.createNotification(
                document.getParent().getUser().getId(),
                "Documents Rejected",
                "Your documents have been rejected. Please resubmit. Reason: " + comments
            );
            
            auditLogService.logAction(
                "DOCUMENT_REJECTED",
                "Document",
                id,
                "Staff",
                null,
                "Documents rejected for application #" + application.getId() + ". Reason: " + comments
            );
        }
        
        return updated;
    }
}
