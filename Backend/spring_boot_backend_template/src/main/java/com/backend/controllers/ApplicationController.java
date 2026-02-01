package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.entities.Application;
import com.backend.entities.ApplicationStatus;
import com.backend.entities.Parent;
import com.backend.entities.User;
import com.backend.daos.UserRepository;
import com.backend.daos.ParentRepository;
import com.backend.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://child-adoption-portal.netlify.app/"})
public class ApplicationController {
    
    @Autowired
    private ApplicationService applicationService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ParentRepository parentRepository;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createApplication(@RequestBody Map<String, Long> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Parent parent = parentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        
        Application application = applicationService.createApplication(
            parent.getId(),
            request.get("childId")
        );
        return ResponseEntity.ok(new ApiResponse(true, "Application created successfully. Your application is under review.", application));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }
    
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<Application>> getApplicationsByParent(@PathVariable Long parentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByParentId(parentId));
    }
    
    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Parent parent = parentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        
        return ResponseEntity.ok(applicationService.getApplicationsByParentId(parent.getId()));
    }
    
    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Application>> getApplicationsByStatus(@PathVariable ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.getApplicationsByStatus(status));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        ApplicationStatus status = ApplicationStatus.valueOf(request.get("status"));
        String message = request.get("message");
        Application updated = applicationService.updateApplicationStatus(id, status, message);
        return ResponseEntity.ok(new ApiResponse(true, "Application status updated", updated));
    }
    
    @PutMapping("/{id}/request-documents")
    public ResponseEntity<ApiResponse> requestDocuments(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Please submit required documents");
        Application updated = applicationService.requestDocuments(id, message);
        return ResponseEntity.ok(new ApiResponse(true, "Documents requested from parent", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.ok(new ApiResponse("Application deleted successfully", true));
    }
}
