package com.backend.controllers;



import com.backend.dto.ChildRequestDTO;
import com.backend.dto.ChildResponseDTO;
import com.backend.entities.ChildStatus;
import com.backend.entities.Gender;
import com.backend.services.ChildService;
import com.backend.services.FileStorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/staff/children")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StaffChildController {

    private final ChildService childService;
    private final FileStorageService fileStorageService;

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

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ChildResponseDTO addChild(
            @RequestParam("name") String name,
            @RequestParam("age") Integer age,
            @RequestParam("gender") String gender,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "healthReport", required = false) String healthReport,
            @RequestParam(value = "fosterHistory", required = false) String fosterHistory,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            Authentication authentication
    ) {
        ChildRequestDTO request = new ChildRequestDTO();
        request.setName(name);
        request.setAge(age);
        request.setGender(Gender.valueOf(gender.toUpperCase()));
        request.setDescription(description);
        request.setHealthReport(healthReport);
        request.setFosterHistory(fosterHistory);
        
        if (photo != null && !photo.isEmpty()) {
            String photoPath = fileStorageService.storeFile(photo);
            request.setPhoto(photoPath);
        }
        
        return childService.addChild(request, authentication.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ChildResponseDTO updateChild(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("age") Integer age,
            @RequestParam("gender") String gender,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "healthReport", required = false) String healthReport,
            @RequestParam(value = "fosterHistory", required = false) String fosterHistory,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        ChildRequestDTO request = new ChildRequestDTO();
        request.setName(name);
        request.setAge(age);
        request.setGender(Gender.valueOf(gender.toUpperCase()));
        request.setDescription(description);
        request.setHealthReport(healthReport);
        request.setFosterHistory(fosterHistory);
        
        if (photo != null && !photo.isEmpty()) {
            String photoPath = fileStorageService.storeFile(photo);
            request.setPhoto(photoPath);
        }
        
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

