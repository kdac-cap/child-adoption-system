package com.backend.controllers;

import com.backend.entities.*;
import com.backend.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ApplicationController {

//    private final ApplicationService applicationService;
//
//    /* =========================================================
//       COMMON / SHARED ENDPOINTS
//    ========================================================= */
//
//    // ADMIN / STAFF can see all applications
//    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
//    public List<Application> getAllApplications() {
//        return applicationService.getAll();
//    }
//
//    // Get single application
//    @GetMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','STAFF','PARENT')")
//    public Application getApplicationById(@PathVariable Long id) {
//        return applicationService.getById(id);
//    }
//
//    /* =========================================================
//       PARENT FLOW
//    ========================================================= */
//
//    // Parent applies for a child
//    @PostMapping
//    @PreAuthorize("hasRole('PARENT')")
//    public Application createApplication(
//            @RequestParam Long parentId,
//            @RequestParam Long childId
//    ) {
//        return applicationService.apply(parentId, childId);
//    }
//
//    // Parent views his own applications
//    @GetMapping("/parent/{parentId}")
//    @PreAuthorize("hasRole('PARENT')")
//    public List<Application> getParentApplications(@PathVariable Long parentId) {
//        return applicationService.getByParentId(parentId);
//    }
//
//    /* =========================================================
//       STAFF FLOW
//    ========================================================= */
//
//    // Staff sees pending applications
//    @GetMapping("/staff/pending")
//    @PreAuthorize("hasRole('STAFF')")
//    public List<Application> staffPendingApplications() {
//        return applicationService.getByStatus(
//                ApplicationStatus.PENDING_STAFF_APPROVAL
//        );
//    }
//
//    // Staff requests documents
//    @PutMapping("/{id}/request-documents")
//    @PreAuthorize("hasRole('STAFF')")
//    public Application requestDocuments(
//            @PathVariable Long id,
//            @RequestBody(required = false) String message
//    ) {
//        return applicationService.updateStatus(
//                id,
//                ApplicationStatus.DOCUMENTS_REQUESTED,
//                message
//        );
//    }
//
//    // Staff forwards to admin
//    @PutMapping("/{id}/forward-to-admin")
//    @PreAuthorize("hasRole('STAFF')")
//    public Application forwardToAdmin(@PathVariable Long id) {
//        return applicationService.updateStatus(
//                id,
//                ApplicationStatus.PENDING_ADMIN_APPROVAL,
//                "Verified by staff"
//        );
//    }
//
//    /* =========================================================
//       ADMIN FLOW
//    ========================================================= */
//
//    @GetMapping("/admin/pending")
//    @PreAuthorize("hasRole('ADMIN')")
//    public List<Application> adminPendingApplications() {
//        return applicationService.getByStatus(
//                ApplicationStatus.PENDING_ADMIN_APPROVAL
//        );
//    }
//
//    @PutMapping("/{id}/approve")
//    @PreAuthorize("hasRole('ADMIN')")
//    public Application approve(@PathVariable Long id) {
//        return applicationService.updateStatus(
//                id,
//                ApplicationStatus.APPROVED,
//                "Approved by admin"
//        );
//    }
//
//    @PutMapping("/{id}/reject")
//    @PreAuthorize("hasRole('ADMIN')")
//    public Application reject(
//            @PathVariable Long id,
//            @RequestBody(required = false) String reason
//    ) {
//        return applicationService.updateStatus(
//                id,
//                ApplicationStatus.REJECTED,
//                reason
//        );
//    }
}
