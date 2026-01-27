package com.backend.services;

import com.backend.dto.StaffDetailsDTO;
import java.util.List;

public interface StaffService {
    List<StaffDetailsDTO> getAllStaffWithDetails();
    StaffDetailsDTO getStaffDetailsById(Long staffId);
}
