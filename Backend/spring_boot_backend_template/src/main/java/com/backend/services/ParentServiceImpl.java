package com.backend.services;

import com.backend.daos.ParentRepository;
import com.backend.daos.UserRepository;
import com.backend.dto.ParentDetailsDTO;
import com.backend.dto.ParentProfileDTO;
import com.backend.entities.Parent;
import com.backend.entities.User;
import com.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParentServiceImpl implements ParentService {
    
    @Autowired
    private ParentRepository parentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public List<ParentDetailsDTO> getAllParentsWithDetails() {
        return parentRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public ParentDetailsDTO getParentDetailsById(Long parentId) {
        Parent parent = parentRepository.findById(parentId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
        return convertToDTO(parent);
    }
    
    @Override
    public ParentDetailsDTO getParentDetailsByUserId(Long userId) {
        Parent parent = parentRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent not found for user"));
        return convertToDTO(parent);
    }
    
    @Override
    public ParentProfileDTO saveOrUpdateProfile(String username, ParentProfileDTO dto) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Parent parent = parentRepository.findByUser(user)
            .orElseGet(() -> {
                Parent newParent = new Parent();
                newParent.setUser(user);
                return newParent;
            });
        
        parent.setOccupation(dto.getOccupation());
        parent.setAnnualIncome(dto.getAnnualIncome());
        parent.setCity(dto.getCity());
        parent.setState(dto.getState());
        parent.setPostalCode(dto.getPostalCode());
        
        parentRepository.save(parent);
        return dto;
    }
    
    @Override
    public ParentProfileDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Parent parent = parentRepository.findByUser(user)
            .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found"));
        
        ParentProfileDTO dto = new ParentProfileDTO();
        dto.setOccupation(parent.getOccupation());
        dto.setAnnualIncome(parent.getAnnualIncome());
        dto.setCity(parent.getCity());
        dto.setState(parent.getState());
        dto.setPostalCode(parent.getPostalCode());
        return dto;
    }
    
    private ParentDetailsDTO convertToDTO(Parent parent) {
        User user = parent.getUser();
        ParentDetailsDTO dto = new ParentDetailsDTO();
        dto.setParentId(parent.getId());
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setMaritalStatus(parent.getMaritalStatus() != null ? parent.getMaritalStatus().toString() : null);
        dto.setOccupation(parent.getOccupation());
        dto.setAnnualIncome(parent.getAnnualIncome());
        dto.setCity(parent.getCity());
        dto.setState(parent.getState());
        dto.setPostalCode(parent.getPostalCode());
        dto.setAddress(String.format("%s, %s - %s", 
            parent.getCity() != null ? parent.getCity() : "",
            parent.getState() != null ? parent.getState() : "",
            parent.getPostalCode() != null ? parent.getPostalCode() : ""));
        return dto;
    }
}
