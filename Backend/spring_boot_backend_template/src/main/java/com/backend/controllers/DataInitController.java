package com.backend.controllers;

import com.backend.daos.*;
import com.backend.entities.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/init")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DataInitController {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/sample-data")
    public ResponseEntity<Map<String, Object>> initializeSampleData() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Create Admin User
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                admin.setEmail("admin@adoption.com");
                admin.setPhone("1234567890");
                admin.setRole(UserRole.ADMIN);
                userRepository.save(admin);
            }

            // Create Parent User
            if (!userRepository.existsByUsername("parent1")) {
                User parentUser = new User();
                parentUser.setUsername("parent1");
                parentUser.setPassword(passwordEncoder.encode("parent123"));
                parentUser.setFullName("John Doe");
                parentUser.setEmail("john@example.com");
                parentUser.setPhone("9876543210");
                parentUser.setRole(UserRole.PARENT);
                User savedParentUser = userRepository.save(parentUser);

                Parent parent = new Parent();
                parent.setUser(savedParentUser);
                parent.setMaritalStatus(MaritalStatus.MARRIED);
                parent.setOccupation("Software Engineer");
                parent.setAnnualIncome("100000");
                parent.setCity("Mumbai");
                parent.setState("Maharashtra");
                parent.setPostalCode("400001");
                parentRepository.save(parent);
            }

            // Create Staff User
            if (!userRepository.existsByUsername("staff1")) {
                User staffUser = new User();
                staffUser.setUsername("staff1");
                staffUser.setPassword(passwordEncoder.encode("staff123"));
                staffUser.setFullName("Staff Member");
                staffUser.setEmail("staff@adoption.com");
                staffUser.setPhone("5555555555");
                staffUser.setRole(UserRole.STAFF);
                userRepository.save(staffUser);
            }

            // Create Sample Children
            if (childRepository.count() == 0) {
                Child child1 = new Child();
                child1.setName("Emma");
                child1.setAge(5);
                child1.setGender(Gender.FEMALE);
                child1.setStatus(ChildStatus.AVAILABLE);
                child1.setHealthReport("Healthy");
                child1.setDescription("A cheerful 5-year-old girl");
                child1.setAddedBy("admin");
                childRepository.save(child1);

                Child child2 = new Child();
                child2.setName("Liam");
                child2.setAge(7);
                child2.setGender(Gender.MALE);
                child2.setStatus(ChildStatus.AVAILABLE);
                child2.setHealthReport("Healthy");
                child2.setDescription("An energetic 7-year-old boy");
                child2.setAddedBy("admin");
                childRepository.save(child2);

                Child child3 = new Child();
                child3.setName("Sophia");
                child3.setAge(3);
                child3.setGender(Gender.FEMALE);
                child3.setStatus(ChildStatus.ADOPTED);
                child3.setHealthReport("Healthy");
                child3.setDescription("A sweet 3-year-old girl");
                child3.setAddedBy("admin");
                childRepository.save(child3);
            }

            // Create Sample Application
            if (applicationRepository.count() == 0) {
                Parent parent = parentRepository.findAll().stream().findFirst().orElse(null);
                Child child = childRepository.findAll().stream().findFirst().orElse(null);
                
                if (parent != null && child != null) {
                    Application app = new Application();
                    app.setParent(parent);
                    app.setChild(child);
                    app.setParentUsername(parent.getUser().getUsername());
                    app.setParentName(parent.getUser().getFullName());
                    app.setChildName(child.getName());
                    app.setStatus(ApplicationStatus.PENDING_STAFF_APPROVAL);
                    app.setSubmittedAt(LocalDateTime.now());
                    applicationRepository.save(app);
                }
            }

            response.put("success", true);
            response.put("message", "Sample data initialized successfully");
            response.put("users", userRepository.count());
            response.put("children", childRepository.count());
            response.put("applications", applicationRepository.count());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkData() {
        Map<String, Object> response = new HashMap<>();
        response.put("users", userRepository.count());
        response.put("children", childRepository.count());
        response.put("applications", applicationRepository.count());
        response.put("parents", parentRepository.count());
        return ResponseEntity.ok(response);
    }
}
