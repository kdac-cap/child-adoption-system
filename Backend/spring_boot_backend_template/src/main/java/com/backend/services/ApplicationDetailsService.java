package com.backend.services;

import com.backend.daos.ApplicationRepository;
import com.backend.daos.DocumentRepository;
import com.backend.dto.ApplicationDetailsDTO;
import com.backend.entities.Application;
import com.backend.entities.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApplicationDetailsService {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    public List<ApplicationDetailsDTO> getAllApplicationsWithDetails() {
        return applicationRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    private ApplicationDetailsDTO convertToDTO(Application app) {
        ApplicationDetailsDTO dto = new ApplicationDetailsDTO();
        dto.setApplicationId(app.getId());
        dto.setParentName(app.getParentName());
        dto.setParentEmail(app.getParent().getUser().getEmail());
        dto.setParentOccupation(app.getParent().getOccupation());
        dto.setParentIncome(app.getParent().getAnnualIncome());
        dto.setChildName(app.getChildName());
        dto.setChildAge(app.getChild().getAge());
        dto.setChildGender(app.getChild().getGender().toString());
        dto.setApplicationStatus(app.getStatus().toString());
        
        Document doc = documentRepository.findByApplicationId(app.getId()).orElse(null);
        dto.setDocumentStatus(doc != null ? doc.getStatus().toString() : "NOT_SUBMITTED");
        
        dto.setSubmittedAt(app.getSubmittedAt());
        dto.setStaffMessage(app.getStaffMessage());
        return dto;
    }
}
