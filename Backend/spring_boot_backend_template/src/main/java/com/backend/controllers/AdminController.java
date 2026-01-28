package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.entities.*;
import com.backend.services.AdminService;
import com.backend.services.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private AuditLogService auditLogService;
    
    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }
    
    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        UserRole role = UserRole.valueOf(request.get("role"));
        User updated = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(new ApiResponse(true, "User role updated", updated));
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse("User deleted", true));
    }
    
    // Application Management
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(adminService.getAllApplicationsForAdmin());
    }
    
    @PutMapping("/applications/{id}/approve")
    public ResponseEntity<ApiResponse> approveApplication(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Application approved");
        Application approved = adminService.approveApplication(id, message);
        return ResponseEntity.ok(new ApiResponse(true, "Application approved", approved));
    }
    
    @PutMapping("/applications/{id}/reject")
    public ResponseEntity<ApiResponse> rejectApplication(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Application rejected");
        Application rejected = adminService.rejectApplication(id, message);
        return ResponseEntity.ok(new ApiResponse(true, "Application rejected", rejected));
    }
    
    // Welfare Review
    @PutMapping("/applications/{id}/welfare-review")
    public ResponseEntity<ApiResponse> requestWelfareReview(@PathVariable Long id) {
        Application updated = adminService.requestWelfareReview(id);
        return ResponseEntity.ok(new ApiResponse(true, "Welfare review requested", updated));
    }
    
    @PutMapping("/applications/{id}/welfare-approve")
    public ResponseEntity<ApiResponse> approveWelfareReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String comments = request.getOrDefault("comments", "Welfare review approved");
        Application approved = adminService.approveWelfareReview(id, comments);
        return ResponseEntity.ok(new ApiResponse(true, "Welfare review approved", approved));
    }
    
    // Document Management
    @GetMapping("/documents")
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(adminService.getAllDocumentsForAdmin());
    }
    
    // Child Management
    @GetMapping("/children")
    public ResponseEntity<List<Child>> getAllChildren() {
        return ResponseEntity.ok(adminService.getAllChildrenForAdmin());
    }
    
    // Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        Map<String, Long> stats = Map.of(
            "totalUsers", adminService.getTotalUsers(),
            "totalApplications", adminService.getTotalApplications(),
            "totalChildren", adminService.getTotalChildren(),
            "pendingApplications", adminService.getPendingApplications()
        );
        return ResponseEntity.ok(stats);
    }
    
    // Audit Logs
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogService.getAllAuditLogs());
    }
    
    @GetMapping("/audit-logs/user/{userId}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(auditLogService.getAuditLogsByUser(userId));
    }
    
    @GetMapping("/audit-logs/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        return ResponseEntity.ok(auditLogService.getAuditLogsByEntity(entityType, entityId));
    }
}
