package com.backend.services;

import com.backend.dto.DonationRequestDTO;
import com.backend.entities.Donation;

public interface DonationService {
    Donation createDonation(DonationRequestDTO dto);
}
