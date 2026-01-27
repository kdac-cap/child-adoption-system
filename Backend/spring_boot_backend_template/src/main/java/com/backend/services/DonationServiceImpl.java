package com.backend.services;

import com.backend.daos.DonationRepository;
import com.backend.dto.DonationRequestDTO;
import com.backend.entities.Donation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;

    @Override
    public Donation createDonation(DonationRequestDTO dto) {

        Donation donation = new Donation();
        donation.setAmount(dto.getAmount());
        donation.setUpiId(dto.getUpiId());
        donation.setDonorName(dto.getDonorName());

        return donationRepository.save(donation);
    }
}
