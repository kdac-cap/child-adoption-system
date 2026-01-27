package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.entities.Document;
import com.backend.entities.DocumentStatus;
import com.backend.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DocumentController {
    
    @Autowired
    private DocumentService documentService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> submitDocuments(@RequestBody Map<String, Object> request) {
        Long parentId = Long.valueOf(request.get("parentId").toString());
        Long applicationId = Long.valueOf(request.get("applicationId").toString());
        
        Document document = new Document();
        document.setIdentityProof((String) request.get("identityProof"));
        document.setAddressProof((String) request.get("addressProof"));
        document.setAgeProof((String) request.get("ageProof"));
        document.setIncomeProof((String) request.get("incomeProof"));
        document.setMarriageProof((String) request.get("marriageProof"));
        document.setMedicalCertificate((String) request.get("medicalCertificate"));
        document.setPoliceVerification((String) request.get("policeVerification"));
        document.setPoliceClearance((String) request.get("policeClearance"));
        document.setPhotographs((String) request.get("photographs"));
        
        Document saved = documentService.submitDocuments(parentId, applicationId, document);
        return ResponseEntity.ok(new ApiResponse("Documents submitted successfully", true, saved));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }
    
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<Document> getDocumentByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(documentService.getDocumentByApplicationId(applicationId));
    }
    
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<Document>> getDocumentsByParent(@PathVariable Long parentId) {
        return ResponseEntity.ok(documentService.getDocumentsByParentId(parentId));
    }
    
    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }
    
    @PutMapping("/{id}/verify")
    public ResponseEntity<ApiResponse> verifyDocuments(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        DocumentStatus status = DocumentStatus.valueOf(request.get("status"));
        String comments = request.get("comments");
        Document updated = documentService.verifyDocuments(id, status, comments);
        return ResponseEntity.ok(new ApiResponse("Documents verified", true, updated));
    }
}
