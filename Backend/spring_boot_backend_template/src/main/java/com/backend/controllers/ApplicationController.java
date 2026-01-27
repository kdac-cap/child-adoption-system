package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.entities.Application;
import com.backend.entities.ApplicationStatus;
import com.backend.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ApplicationController {
    
    @Autowired
    private ApplicationService applicationService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createApplication(@RequestBody Map<String, Long> request) {
        Application application = applicationService.createApplication(
            request.get("parentId"),
            request.get("childId")
        );
        return ResponseEntity.ok(new ApiResponse("Application created successfully", true, application));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }
    
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<Application>> getApplicationsByParent(@PathVariable Long parentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByParentId(parentId));
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
        return ResponseEntity.ok(new ApiResponse("Application status updated", true, updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.ok(new ApiResponse("Application deleted successfully", true));
    }
}
