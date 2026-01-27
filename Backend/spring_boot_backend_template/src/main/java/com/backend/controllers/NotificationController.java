package com.backend.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.daos.NotificationRepository;
import com.backend.daos.NotificationVisitRepository;
import com.backend.entities.NotificationVisit;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class NotificationController {

    private final NotificationVisitRepository notificationVisitRepository;

    @GetMapping("/parent/{username}")
    @PreAuthorize("hasRole('PARENT')")
    public List<NotificationVisit> getParentNotifications(
            @PathVariable String username
    ) {
        return notificationVisitRepository.findByUserUsername(username);
    }
}

