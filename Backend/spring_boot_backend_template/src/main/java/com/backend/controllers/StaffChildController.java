package com.backend.controllers;

import com.backend.dto.ChildRequestDTO;
import com.backend.dto.ChildResponseDTO;
import com.backend.entities.ChildStatus;
import com.backend.services.ChildService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff/children")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StaffChildController {

    private final ChildService childService;

    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public List<ChildResponseDTO> getAllChildren() {
        return childService.getAllChildren();
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('STAFF')")
    public List<ChildResponseDTO> getByStatus(@PathVariable ChildStatus status) {
        return childService.getChildrenByStatus(status);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STAFF')")
    public ChildResponseDTO addChild(
            @Valid @ModelAttribute ChildRequestDTO request,
            Authentication authentication
    ) {
        return childService.addChild(request, authentication.getName());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STAFF')")
    public ChildResponseDTO updateChild(
            @PathVariable Long id,
            @Valid @ModelAttribute ChildRequestDTO request
    ) {
        return childService.updateChild(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public void deleteChild(@PathVariable Long id) {
        childService.deleteChild(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ChildResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestParam ChildStatus status
    ) {
        return childService.updateStatus(id, status);
    }
}
