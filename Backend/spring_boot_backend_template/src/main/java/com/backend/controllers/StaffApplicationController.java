package com.backend.controllers;

import com.backend.entities.*;
import com.backend.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/applications")
@RequiredArgsConstructor
public class StaffApplicationController {

    private final ApplicationService applicationService;

    /* =========================================================
       VIEW APPLICATIONS
    ========================================================= */

    // All applications pending staff review
    @GetMapping("/pending")
    public List<Application> getPendingForStaff() {
        return applicationService.getByStatus(
                ApplicationStatus.PENDING_STAFF_APPROVAL
        );
    }

    // Get application by ID
    @GetMapping("/{id}")
    public Application getById(@PathVariable Long id) {
        return applicationService.getById(id);
    }

    /* =========================================================
       STAFF ACTIONS
    ========================================================= */

    // Request documents from parent
    @PutMapping("/{id}/request-documents")
    public Application requestDocuments(
            @PathVariable Long id,
            @RequestParam String message
    ) {
        return applicationService.updateStatus(
                id,
                ApplicationStatus.DOCUMENTS_REQUESTED,
                message
        );
    }

    // Mark documents submitted & verified
    @PutMapping("/{id}/verify")
    public Application verifyApplication(
            @PathVariable Long id,
            @RequestParam(required = false) String message
    ) {
        return applicationService.updateStatus(
                id,
                ApplicationStatus.STAFF_VERIFIED,
                message
        );
    }

    // Forward application to admin
    @PutMapping("/{id}/forward-to-admin")
    public Application forwardToAdmin(
            @PathVariable Long id,
            @RequestParam(required = false) String message
    ) {
        return applicationService.updateStatus(
                id,
                ApplicationStatus.PENDING_ADMIN_APPROVAL,
                message
        );
    }

    // Send back to parent (rework needed)
    @PutMapping("/{id}/send-back")
    public Application sendBackToParent(
            @PathVariable Long id,
            @RequestParam String message
    ) {
        return applicationService.updateStatus(
                id,
                ApplicationStatus.DOCUMENTS_REQUESTED,
                message
        );
    }
}
