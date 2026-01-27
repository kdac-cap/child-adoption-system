package com.backend.controllers;

import com.backend.dto.StaffDetailsDTO;
import com.backend.services.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StaffController {
    
    @Autowired
    private StaffService staffService;
    
    @GetMapping
    public ResponseEntity<List<StaffDetailsDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaffWithDetails());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StaffDetailsDTO> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffDetailsById(id));
    }
}
