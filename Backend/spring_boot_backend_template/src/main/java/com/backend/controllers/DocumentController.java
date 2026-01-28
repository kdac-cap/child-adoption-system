package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.entities.Document;
import com.backend.entities.DocumentStatus;
import com.backend.entities.Parent;
import com.backend.entities.User;
import com.backend.daos.UserRepository;
import com.backend.daos.ParentRepository;
import com.backend.services.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
@Slf4j
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submitDocuments(
            @RequestBody Map<String, Object> request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Parent parent = parentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        
        Long parentId = parent.getId();
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
        return ResponseEntity.ok(new ApiResponse(true, "Documents submitted successfully", saved));
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("applicationId") Long applicationId,
            @RequestParam("documentType") String documentType) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Document document = documentService.uploadDocument(file, applicationId, documentType, user.getId());
        return ResponseEntity.ok(document);
    }

    @GetMapping("/my-documents")
    public ResponseEntity<List<Document>> getMyDocuments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Document> documents = documentService.getDocumentsByUser(user.getId());
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<Document> getDocumentByApplicationId(@PathVariable Long applicationId) {
        Document document = documentService.getDocumentByApplicationId(applicationId);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }
    
    @PutMapping("/{id}/verify")
    public ResponseEntity<ApiResponse> verifyDocuments(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Document verification request received for document ID: {}", id);
        try {
            DocumentStatus status = DocumentStatus.valueOf(request.get("status"));
            String comments = request.get("comments");
            log.info("Verifying document {} with status: {} and comments: {}", id, status, comments);
            
            Document updated = documentService.verifyDocuments(id, status, comments);
            log.info("Document {} verification completed successfully", id);
            
            return ResponseEntity.ok(new ApiResponse(true, "Document status updated", updated));
        } catch (Exception e) {
            log.error("Error verifying document {}", id, e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Failed to verify document: " + e.getMessage(), null));
        }
    }
}
