package com.backend.controllers;

import com.backend.dto.*;
import com.backend.entities.User;
import com.backend.security.JwtUtil;
import com.backend.services.AuthService;
import com.backend.daos.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequestDTO dto) {
        log.info("Registration request received for username: {}", dto.getUsername());
        try {
            ApiResponse response = authService.register(dto);
            if (response.isSuccess()) {
                log.info("Registration successful for username: {}", dto.getUsername());
                return ResponseEntity.ok(response);
            } else {
                log.warn("Registration failed for username: {} - {}", dto.getUsername(), response.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            log.error("Registration error for username: {}", dto.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Registration failed: " + e.getMessage(), false));
        }
    }

    @PostMapping("/register/child-welfare")
    public ResponseEntity<ApiResponse> registerChildWelfare(
            @RequestBody ChildWelfareRegisterRequestDTO dto) {
        log.info("Child Welfare registration request received for username: {}", dto.getUsername());
        try {
            ApiResponse response = authService.registerChildWelfare(dto);
            if (response.isSuccess()) {
                log.info("Child Welfare registration successful for username: {}", dto.getUsername());
                return ResponseEntity.ok(response);
            } else {
                log.warn("Child Welfare registration failed for username: {} - {}", dto.getUsername(), response.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            log.error("Child Welfare registration error for username: {}", dto.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Registration failed: " + e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        log.info("Login request received for username: {}", dto.getUsername());
        try {
            Map<String, Object> response = authService.login(dto);
            log.info("Login successful for username: {}", dto.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for username: {}", dto.getUsername(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        log.info("Logout request received");
        return ResponseEntity.ok(new ApiResponse("Logged out successfully", true));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        log.info("Get current user request for: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole().toString());
        
        return ResponseEntity.ok(response);
    }
}
