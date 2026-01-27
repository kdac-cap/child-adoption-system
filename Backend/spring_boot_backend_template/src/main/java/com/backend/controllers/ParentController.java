package com.backend.controllers;

import com.backend.dto.ParentDetailsDTO;
import com.backend.services.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/parents")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ParentController {
    
    @Autowired
    private ParentService parentService;
    
    @GetMapping
    public ResponseEntity<List<ParentDetailsDTO>> getAllParents() {
        return ResponseEntity.ok(parentService.getAllParentsWithDetails());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ParentDetailsDTO> getParentById(@PathVariable Long id) {
        return ResponseEntity.ok(parentService.getParentDetailsById(id));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ParentDetailsDTO> getParentByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(parentService.getParentDetailsByUserId(userId));
    }
}
