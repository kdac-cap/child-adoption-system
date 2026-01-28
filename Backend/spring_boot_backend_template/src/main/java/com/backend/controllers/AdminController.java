package com.backend.controllers;

import com.backend.daos.*;
import com.backend.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private DocumentRepository documentRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalChildren = childRepository.count();
        long pendingApplications = applicationRepository.countByStatus(ApplicationStatus.PENDING_STAFF_APPROVAL);
        long approvedApplications = applicationRepository.countByStatus(ApplicationStatus.APPROVED);
        long rejectedApplications = applicationRepository.countByStatus(ApplicationStatus.REJECTED);
        long totalDocuments = documentRepository.count();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalChildren", totalChildren);
        stats.put("pendingApplications", pendingApplications);
        stats.put("approvedApplications", approvedApplications);
        stats.put("rejectedApplications", rejectedApplications);
        stats.put("totalDocuments", totalDocuments);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Map<String, Object>>> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Application app : applications) {
            Map<String, Object> appData = new HashMap<>();
            appData.put("id", app.getId());
            appData.put("status", app.getStatus().toString());
            appData.put("submissionDate", app.getSubmittedAt());
            
            // Parent data
            Map<String, Object> parentData = new HashMap<>();
            parentData.put("fullName", app.getParent().getUser().getFullName());
            parentData.put("email", app.getParent().getUser().getEmail());
            appData.put("parent", parentData);
            
            // Child data
            Map<String, Object> childData = new HashMap<>();
            childData.put("name", app.getChild().getName());
            childData.put("age", app.getChild().getAge());
            appData.put("child", childData);
            
            // Documents count (placeholder)
            appData.put("documents", new ArrayList<>());
            
            result.add(appData);
        }
        
        return ResponseEntity.ok(result);
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<Map<String, Object>> updateApplicationStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        
        Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        ApplicationStatus status = ApplicationStatus.valueOf(request.get("status"));
        application.setStatus(status);
        applicationRepository.save(application);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Application status updated successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (User user : users) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("fullName", user.getFullName());
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            userData.put("role", user.getRole().toString());
            result.add(userData);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/children")
    public ResponseEntity<List<Map<String, Object>>> getAllChildren() {
        List<Child> children = childRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Child child : children) {
            Map<String, Object> childData = new HashMap<>();
            childData.put("id", child.getId());
            childData.put("name", child.getName());
            childData.put("age", child.getAge());
            childData.put("gender", child.getGender());
            childData.put("healthReport", child.getHealthReport());
            childData.put("status", child.getStatus());
            result.add(childData);
        }
        
        return ResponseEntity.ok(result);
    }
}