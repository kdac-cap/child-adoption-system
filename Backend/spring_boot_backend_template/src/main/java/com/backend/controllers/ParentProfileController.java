package com.backend.controllers;

import com.backend.dto.ParentProfileDTO;
import com.backend.entities.Parent;
import com.backend.services.ParentService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parent/profile")
@RequiredArgsConstructor
public class ParentProfileController {

    private final ParentService parentService;
    @PostMapping
    public ParentProfileDTO saveProfile(
            @RequestBody ParentProfileDTO dto,
            Authentication authentication
    ) {
        String userId = authentication.getName(); // comes from JWT subject
        return parentService.saveOrUpdateProfile(userId, dto);
    }


    @GetMapping
    public ParentProfileDTO getProfile(Authentication authentication) {
        String userId = authentication.getName();
        return parentService.getProfile(userId);
    }

}
