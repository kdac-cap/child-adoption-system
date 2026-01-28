package com.backend.services;

import com.backend.daos.UserRepository;
import com.backend.daos.ParentRepository;
import com.backend.daos.StaffRepository;
import com.backend.dto.*;
import com.backend.entities.*;
import com.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final ParentRepository parentRepo;
    private final StaffRepository staffRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @Override
    public ApiResponse register(RegisterRequestDTO dto) {
        log.info("Registration attempt for username: {}", dto.getUsername());
        
        try {
            if (userRepo.existsByUsername(dto.getUsername())) {
                log.warn("Username already exists: {}", dto.getUsername());
                return new ApiResponse("Username already exists", false);
            }
                
            if (userRepo.existsByEmail(dto.getEmail())) {
                log.warn("Email already exists: {}", dto.getEmail());
                return new ApiResponse("Email already exists", false);
            }

            User user = new User();
            user.setFullName(dto.getFullName());
            user.setUsername(dto.getUsername());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setEmail(dto.getEmail());
            user.setPhone(dto.getPhone());
            user.setRole(dto.getRole());

            User savedUser = userRepo.save(user);
            log.info("User saved with ID: {}", savedUser.getId());
            
            // Create Parent profile if role is PARENT
            if (dto.getRole() == UserRole.PARENT) {
                Parent parent = new Parent();
                parent.setUser(savedUser);
                parent.setMaritalStatus(dto.getMaritalStatus());
                parent.setOccupation(dto.getOccupation());
                parent.setAnnualIncome(dto.getAnnualIncome());
                parent.setCity(dto.getCity());
                parent.setState(dto.getState());
                parent.setPostalCode(dto.getPostalCode());
                parentRepo.save(parent);
                log.info("Parent profile created for user: {}", savedUser.getUsername());
            }
            
            // Create Staff profile if role is STAFF or CHILD_WELFARE
            if (dto.getRole() == UserRole.STAFF || dto.getRole() == UserRole.CHILD_WELFARE) {
                Staff staff = new Staff();
                staff.setUser(savedUser);
                staff.setAgencyName(dto.getAgencyName() != null ? dto.getAgencyName() : "Default Agency");
                staff.setAgencyLicense(dto.getAgencyLicense() != null ? dto.getAgencyLicense() : "LIC-" + System.currentTimeMillis());
                staff.setDesignation(dto.getDesignation());
                staff.setQualification(dto.getQualification());
                staff.setExperience(dto.getExperience());
                staffRepo.save(staff);
                log.info("Staff profile created for user: {}", savedUser.getUsername());
            }
            
            log.info("Registration successful for user: {}", savedUser.getUsername());
            return new ApiResponse("Successfully registered as " + dto.getRole(), true);
        } catch (Exception e) {
            log.error("Registration failed for username: {}", dto.getUsername(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse registerChildWelfare(
            ChildWelfareRegisterRequestDTO dto) {
        log.info("Child Welfare registration attempt for username: {}", dto.getUsername());
        
        try {
            if (userRepo.existsByUsername(dto.getUsername())) {
                log.warn("Username already exists: {}", dto.getUsername());
                return new ApiResponse("Username already exists", false);
            }
                
            if (userRepo.existsByEmail(dto.getEmail())) {
                log.warn("Email already exists: {}", dto.getEmail());
                return new ApiResponse("Email already exists", false);
            }

            User user = new User();
            user.setFullName(dto.getFullName());
            user.setUsername(dto.getUsername());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setEmail(dto.getEmail());
            user.setPhone(dto.getPhone());
            user.setRole(UserRole.CHILD_WELFARE);

            userRepo.save(user);
            log.info("Child Welfare registration successful for user: {}", user.getUsername());
            return new ApiResponse("Successfully registered as CHILD_WELFARE", true);
        } catch (Exception e) {
            log.error("Child Welfare registration failed for username: {}", dto.getUsername(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> login(LoginRequestDTO dto) {
        // Simple: use email as username for authentication
        String loginField = dto.getEmail() != null ? dto.getEmail() : dto.getUsername();
        
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginField, dto.getPassword()));

        String token = jwtUtil.createToken(auth);
        User user = userRepo.findByEmail(loginField).orElse(userRepo.findByUsername(loginField).orElseThrow());

        // Get parent or staff ID if applicable
        Long parentId = null;
        Long staffId = null;
        
        if (user.getRole() == UserRole.PARENT) {
            parentId = parentRepo.findByUserId(user.getId())
                .map(Parent::getId)
                .orElse(null);
        } else if (user.getRole() == UserRole.STAFF) {
            staffId = staffRepo.findByUserId(user.getId())
                .map(Staff::getId)
                .orElse(null);
        }

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("role", user.getRole());
        userMap.put("email", user.getEmail());
        userMap.put("fullName", user.getFullName());
        if (parentId != null) userMap.put("parentId", parentId);
        if (staffId != null) userMap.put("staffId", staffId);

        return Map.of(
                "token", token,
                "user", userMap
        );
    }
}
