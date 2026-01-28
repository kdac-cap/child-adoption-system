package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.dto.ChildRequestDTO;
import com.backend.dto.ChildResponseDTO;
import com.backend.entities.Child;
import com.backend.entities.ChildStatus;
import com.backend.services.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/children")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class ChildController {

    private final ChildService childService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ChildResponseDTO> addChild(@RequestBody ChildRequestDTO dto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            System.out.println("Adding child: " + dto.getName() + " by user: " + username);
            ChildResponseDTO child = childService.addChild(dto, username);
            System.out.println("Child added successfully with ID: " + child.getId());
            return ResponseEntity.ok(child);
        } catch (Exception e) {
            System.err.println("Error adding child: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<ChildResponseDTO>> getAllChildren() {
        List<ChildResponseDTO> children = childService.getAllChildren();
        return ResponseEntity.ok(children);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ChildResponseDTO>> getChildrenByStatus(@PathVariable ChildStatus status) {
        List<ChildResponseDTO> children = childService.getChildrenByStatus(status);
        return ResponseEntity.ok(children);
    }

    @GetMapping("/{childId}")
    public ResponseEntity<ChildResponseDTO> getChildById(@PathVariable Long childId) {
        ChildResponseDTO child = childService.getChildById(childId);
        return ResponseEntity.ok(child);
    }

    @PutMapping("/{childId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ChildResponseDTO> updateChild(
            @PathVariable Long childId,
            @RequestBody ChildRequestDTO dto) {
        ChildResponseDTO child = childService.updateChild(childId, dto);
        return ResponseEntity.ok(child);
    }

    @DeleteMapping("/{childId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteChild(@PathVariable Long childId) {
        childService.deleteChild(childId);
        return ResponseEntity.ok(new ApiResponse("Child deleted successfully", true));
    }
}
