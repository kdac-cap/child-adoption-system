package com.backend.services;

import com.backend.daos.StaffRepository;
import com.backend.dto.StaffDetailsDTO;
import com.backend.entities.Staff;
import com.backend.entities.User;
import com.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StaffServiceImpl implements StaffService {
    
    @Autowired
    private StaffRepository staffRepository;
    
    @Override
    public List<StaffDetailsDTO> getAllStaffWithDetails() {
        return staffRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public StaffDetailsDTO getStaffDetailsById(Long staffId) {
        Staff staff = staffRepository.findById(staffId)
            .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));
        return convertToDTO(staff);
    }
    
    private StaffDetailsDTO convertToDTO(Staff staff) {
        User user = staff.getUser();
        StaffDetailsDTO dto = new StaffDetailsDTO();
        dto.setStaffId(staff.getId());
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().toString());
        dto.setAgencyName(staff.getAgencyName());
        dto.setAgencyLicense(staff.getAgencyLicense());
        dto.setDesignation(staff.getDesignation());
        dto.setQualification(staff.getQualification());
        dto.setExperience(staff.getExperience());
        return dto;
    }
}
