package com.backend.controllers;

import com.backend.daos.UserRepository;
import com.backend.entities.User;
import com.backend.entities.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/chat-users/{userId}")
    public ResponseEntity<List<User>> getChatUsers(@PathVariable Long userId) {
        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<User> users;
        
        if (currentUser.getRole() == UserRole.PARENT) {
            users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.STAFF || u.getRole() == UserRole.ADMIN)
                .collect(Collectors.toList());
        } else if (currentUser.getRole() == UserRole.STAFF || currentUser.getRole() == UserRole.ADMIN) {
            users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.PARENT)
                .collect(Collectors.toList());
        } else {
            users = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
}
