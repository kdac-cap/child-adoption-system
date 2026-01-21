package com.backend.controllers;

import com.backend.entities.Application;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ApplicationController {

    @GetMapping
    public List<Application> getAllApplications() {
        return new ArrayList<>();
    }

    @PostMapping
    public Application createApplication(@RequestBody Application application) {
        return application;
    }

    @PutMapping("/{id}")
    public Application updateApplication(@PathVariable Long id, @RequestBody Application application) {
        return application;
    }
}