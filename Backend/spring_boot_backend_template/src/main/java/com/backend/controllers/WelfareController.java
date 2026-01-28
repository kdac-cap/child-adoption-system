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
@RequestMapping("/api/welfare")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class WelfareController {
    
    @Autowired
    private ApplicationService applicationService;
    
    @GetMapping("/pending-visits")
    public ResponseEntity<List<Application>> getPendingWelfareVisits() {
        List<Application> documentsSubmitted = applicationService.getApplicationsByStatus(ApplicationStatus.DOCUMENTS_SUBMITTED);
        List<Application> documentsVerified = applicationService.getApplicationsByStatus(ApplicationStatus.DOCUMENTS_VERIFIED);
        
        // Combine both lists
        documentsSubmitted.addAll(documentsVerified);
        return ResponseEntity.ok(documentsSubmitted);
    }
    
    @GetMapping("/scheduled-visits")
    public ResponseEntity<List<Application>> getScheduledVisits() {
        List<Application> scheduled = applicationService.getApplicationsByStatus(ApplicationStatus.WELFARE_VISIT_SCHEDULED);
        List<Application> completed = applicationService.getApplicationsByStatus(ApplicationStatus.WELFARE_VISIT_COMPLETED);
        
        // Combine both lists
        scheduled.addAll(completed);
        return ResponseEntity.ok(scheduled);
    }
    
    @PutMapping("/{id}/schedule-visit")
    public ResponseEntity<ApiResponse> scheduleHomeVisit(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Home visit scheduled");
        Application updated = applicationService.updateApplicationStatus(
            id, 
            ApplicationStatus.WELFARE_VISIT_SCHEDULED, 
            message
        );
        return ResponseEntity.ok(new ApiResponse(true, "Home visit scheduled successfully", updated));
    }
    
    @PutMapping("/{id}/complete-visit")
    public ResponseEntity<ApiResponse> completeHomeVisit(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Home visit completed");
        Application updated = applicationService.updateApplicationStatus(
            id, 
            ApplicationStatus.WELFARE_VISIT_COMPLETED, 
            message
        );
        return ResponseEntity.ok(new ApiResponse(true, "Home visit marked as completed", updated));
    }
    
    @PutMapping("/{id}/approve-welfare")
    public ResponseEntity<ApiResponse> approveWelfare(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Welfare check approved");
        Application updated = applicationService.updateApplicationStatus(
            id, 
            ApplicationStatus.WELFARE_APPROVED, 
            message
        );
        return ResponseEntity.ok(new ApiResponse(true, "Welfare check approved", updated));
    }
}
