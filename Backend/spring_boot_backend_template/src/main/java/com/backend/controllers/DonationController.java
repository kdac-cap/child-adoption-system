package com.backend.controllers;

import com.backend.dto.DonationRequestDTO;
import com.backend.entities.Donation;
import com.backend.services.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public Donation donate(@Valid @RequestBody DonationRequestDTO dto) {
        return donationService.createDonation(dto);
    }
}
