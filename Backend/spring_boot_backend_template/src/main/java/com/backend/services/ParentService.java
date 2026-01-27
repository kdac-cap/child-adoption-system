package com.backend.services;

import com.backend.dto.ParentProfileDTO;
import com.backend.entities.Parent;
import com.backend.entities.User;
import com.backend.entities.MaritalStatus;
import com.backend.daos.ParentRepository;
import com.backend.daos.UserRepository;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParentService {

    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    /**
     * Create or Update Parent Profile
     */
    public ParentProfileDTO saveOrUpdateProfile(
            String username,
            ParentProfileDTO dto
    ) {

        // 1️⃣ Fetch logged-in user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2️⃣ Fetch existing parent OR create new
        Parent parent = parentRepository.findByUser(user)
                .orElse(new Parent());

        // 3️⃣ Map DTO → Parent entity
        parent.setAnnualIncome(dto.getAnnualIncome());
        parent.setCity(dto.getCity());
        parent.setState(dto.getState());
        parent.setPostalCode(dto.getPostalCode());
        parent.setOccupation(dto.getOccupation());

        if (dto.getMaritalStatus() != null) {
            parent.setMaritalStatus(
                    MaritalStatus.valueOf(dto.getMaritalStatus())
            );
        }

        // 4️⃣ Attach user (foreign key)
        parent.setUser(user);

        // 5️⃣ Save parent profile
        Parent savedParent = parentRepository.save(parent);

        // 6️⃣ Return response DTO
        return modelMapper.map(savedParent, ParentProfileDTO.class);
    }

    /**
     * Get logged-in Parent Profile
     */
    public ParentProfileDTO getProfile(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Parent parent = parentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Parent profile not found"));

        return modelMapper.map(parent, ParentProfileDTO.class);
    }
}
