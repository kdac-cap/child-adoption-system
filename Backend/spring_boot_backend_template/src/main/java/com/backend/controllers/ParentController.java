package com.backend.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.entities.Application;
import com.backend.services.ApplicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/parent")
@PreAuthorize("hasRole('PARENT')")
@RequiredArgsConstructor
public class ParentController {

    private final ApplicationService applicationService;

    @PostMapping("/applications")
    public Application apply(@RequestParam Long parentId,
                             @RequestParam Long childId) {
        return applicationService.apply(parentId, childId);
    }
}

