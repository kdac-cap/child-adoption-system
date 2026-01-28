package com.backend.controllers;

import com.backend.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class DashboardController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalChildren", adminService.getTotalChildren());
        stats.put("totalApplications", adminService.getTotalApplications());
        stats.put("totalUsers", adminService.getTotalUsers());
        stats.put("pendingApplications", adminService.getPendingApplications());
        stats.put("approvedApplications", adminService.getApprovedApplications());
        
        return ResponseEntity.ok(stats);
    }
}
