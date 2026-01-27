package com.backend.controllers;

import com.backend.entities.*;
import com.backend.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applications")
@RequiredArgsConstructor
public class AdminController {

    private final ApplicationService applicationService;

    /* =========================================================
       VIEW APPLICATIONS
    ========================================================= */

    // All applications pending admin approval
    @GetMapping("/pending")
    public List<Application> getPendingForAdmin() {
        return applicationService.getByStatus(
                ApplicationStatus.PENDING_ADMIN_APPROVAL
        );
    }

    // Get application by ID
    @GetMapping("/{id}")
    public Application getById(@PathVariable Long id) {
        return applicationService.getById(id);
    }

    /* =========================================================
       ADMIN DECISIONS
    ========================================================= */

    // Approve adoption
    @PutMapping("/{id}/approve")
    public Application approveApplication(
            @PathVariable Long id,
            @RequestParam(required = false) String message
    ) {
        return applicationService.updateStatus(
                id,
                ApplicationStatus.APPROVED,
                message
        );
    }

    // Reject adoption
    @PutMapping("/{id}/reject")
    public Application rejectApplication(
            @PathVariable Long id,
            @RequestParam String message
    ) {
        return applicationService.updateStatus(
                id,
                ApplicationStatus.REJECTED,
                message
        );
    }
}
