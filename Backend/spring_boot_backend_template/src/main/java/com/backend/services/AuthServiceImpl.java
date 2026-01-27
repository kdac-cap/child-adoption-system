package com.backend.services;

import com.backend.daos.UserRepository;
import com.backend.daos.ParentRepository;
import com.backend.dto.*;
import com.backend.entities.*;
import com.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final ParentRepository parentRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @Override
    public ApiResponse register(RegisterRequestDTO dto) {

        if (userRepo.existsByUsername(dto.getUsername()))
            return new ApiResponse("Username already exists", false);
            
        if (userRepo.existsByEmail(dto.getEmail()))
            return new ApiResponse("Email already exists", false);

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());

        User savedUser = userRepo.save(user);
        
        // Create Parent profile if role is PARENT
        if (dto.getRole() == UserRole.PARENT) {
            Parent parent = new Parent();
            parent.setUser(savedUser);
            parentRepo.save(parent);
        }
        
        return new ApiResponse("Successfully registered as " + dto.getRole(), true);
    }

    @Override
    public ApiResponse registerChildWelfare(
            ChildWelfareRegisterRequestDTO dto) {

        if (userRepo.existsByUsername(dto.getUsername()))
            return new ApiResponse("Username already exists", false);
            
        if (userRepo.existsByEmail(dto.getEmail()))
            return new ApiResponse("Email already exists", false);

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(UserRole.CHILD_WELFARE);

        userRepo.save(user);
        return new ApiResponse("Successfully registered as CHILD_WELFARE", true);
    }

    @Override
    public Map<String, Object> login(LoginRequestDTO dto) {
        // Simple: use email as username for authentication
        String loginField = dto.getEmail() != null ? dto.getEmail() : dto.getUsername();
        
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginField, dto.getPassword()));

        String token = jwtUtil.createToken(auth);
        User user = userRepo.findByEmail(loginField).orElse(userRepo.findByUsername(loginField).orElseThrow());

        return Map.of(
                "token", token,
                "user", Map.of(
                    "username", user.getUsername(),
                    "role", user.getRole(),
                    "userId", user.getId(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName()
                )
        );
    }
}
