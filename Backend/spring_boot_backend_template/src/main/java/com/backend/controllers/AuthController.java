package com.backend.controllers;

import com.backend.dto.*;
import com.backend.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse register(@Valid @RequestBody RegisterRequestDTO dto) {
        return authService.register(dto);
    }

    @PostMapping("/register/child-welfare")
    public ApiResponse registerChildWelfare(
            @Valid @RequestBody ChildWelfareRegisterRequestDTO dto) {
        return authService.registerChildWelfare(dto);
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @Valid @RequestBody LoginRequestDTO dto) {
        return authService.login(dto);
    }
}
