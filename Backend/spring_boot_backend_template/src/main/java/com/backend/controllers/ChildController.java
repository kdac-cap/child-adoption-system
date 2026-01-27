package com.backend.controllers;

import com.backend.entities.Child;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/children")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ChildController {

    @GetMapping
    public List<Child> getAllChildren() {
        return new ArrayList<>();
    }

    @PostMapping
    public Child createChild(@RequestBody Child child) {
        return child;
    }

    @GetMapping("/{id}")
    public Child getChild(@PathVariable Long id) {
        return new Child();
    }
}