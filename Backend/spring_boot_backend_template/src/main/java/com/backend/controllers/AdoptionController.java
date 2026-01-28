package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.entities.Application;
import com.backend.entities.Parent;
import com.backend.services.ApplicationService;
import com.backend.daos.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class AdoptionController {

    private final ApplicationService applicationService;
    private final ParentRepository parentRepository;

    @PostMapping("/apply/{childId}")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<Application> applyForAdoption(@PathVariable Long childId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Parent parent = parentRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        
        Application application = applicationService.createApplication(parent.getId(), childId);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<Application>> getMyApplications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Parent parent = parentRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        
        List<Application> applications = applicationService.getApplicationsByParent(parent.getId());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long applicationId) {
        Application application = applicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{applicationId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> approveApplication(
            @PathVariable Long applicationId,
            @RequestBody(required = false) Map<String, String> body) {
        String message = body != null ? body.getOrDefault("message", "Approved") : "Approved";
        Application application = applicationService.approveApplication(applicationId, message);
        return ResponseEntity.ok(application);
    }

    @PutMapping("/{applicationId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> rejectApplication(
            @PathVariable Long applicationId,
            @RequestBody(required = false) Map<String, String> body) {
        String message = body != null ? body.getOrDefault("message", "Rejected") : "Rejected";
        Application application = applicationService.rejectApplication(applicationId, message);
        return ResponseEntity.ok(application);
    }
}
