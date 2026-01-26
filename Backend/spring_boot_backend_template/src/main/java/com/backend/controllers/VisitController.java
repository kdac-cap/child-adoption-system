package com.backend.controllers;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.VisitRequestDTO;
import com.backend.dto.VisitResponseDTO;
import com.backend.services.VisitService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/welfare/visits")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHILD_WELFARE')")
public class VisitController {

    private final VisitService visitService;

    @PostMapping
    public VisitResponseDTO scheduleVisit(
            @Valid @RequestBody VisitRequestDTO dto) {
        return visitService.scheduleVisit(dto);
    }

    @DeleteMapping("/{id}")
    public void cancelVisit(@PathVariable Long id) {
        visitService.cancelVisit(id);
    }
}
