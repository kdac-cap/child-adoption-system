package com.backend.services;

import com.backend.dto.ParentDetailsDTO;
import com.backend.dto.ParentProfileDTO;
import java.util.List;

public interface ParentService {
    List<ParentDetailsDTO> getAllParentsWithDetails();
    ParentDetailsDTO getParentDetailsById(Long parentId);
    ParentDetailsDTO getParentDetailsByUserId(Long userId);
    ParentProfileDTO saveOrUpdateProfile(String username, ParentProfileDTO dto);
    ParentProfileDTO getProfile(String username);
}
