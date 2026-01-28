package com.backend.services;

import com.backend.daos.ApplicationRepository;
import com.backend.daos.ChildRepository;
import com.backend.daos.ParentRepository;
import com.backend.entities.Application;
import com.backend.entities.ApplicationStatus;
import com.backend.entities.Child;
import com.backend.entities.Parent;
import com.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private ParentRepository parentRepository;
    
    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Override
    public Application createApplication(Long parentId, Long childId) {
        Parent parent = parentRepository.findById(parentId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
        Child child = childRepository.findById(childId)
            .orElseThrow(() -> new ResourceNotFoundException("Child not found"));
        
        Application application = new Application();
        application.setParent(parent);
        application.setChild(child);
        application.setParentUsername(parent.getUser().getUsername());
        application.setParentName(parent.getUser().getFullName());
        application.setChildName(child.getName());
        application.setStatus(ApplicationStatus.PENDING_STAFF_APPROVAL);
        application.setSubmittedAt(LocalDateTime.now());
        
        Application saved = applicationRepository.save(application);
        
        notificationService.createNotification(
            parent.getUser().getId(),
            "Application Submitted",
            "Your adoption application for " + child.getName() + " has been submitted successfully."
        );
        
        return saved;
    }
    
    @Override
    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }
    
    @Override
    public List<Application> getApplicationsByParentId(Long parentId) {
        return applicationRepository.findByParentId(parentId);
    }
    
    @Override
    public List<Application> getApplicationsByParent(Long parentId) {
        return applicationRepository.findByParentId(parentId);
    }
    
    @Override
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
    
    @Override
    public List<Application> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status);
    }
    
    @Override
    public Application updateApplicationStatus(Long id, ApplicationStatus status, String message) {
        Application application = getApplicationById(id);
        application.setStatus(status);
        application.setStaffMessage(message);
        
        Application updated = applicationRepository.save(application);
        
        notificationService.createNotification(
            application.getParent().getUser().getId(),
            "Application Status Updated",
            "Your application status has been updated to: " + status
        );
        
        return updated;
    }
    
    @Override
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
    
    @Override
    public Application approveApplication(Long id, String message) {
        return updateApplicationStatus(id, ApplicationStatus.APPROVED, message);
    }
    
    @Override
    public Application rejectApplication(Long id, String message) {
        return updateApplicationStatus(id, ApplicationStatus.REJECTED, message);
    }
    
    @Override
    public Application requestDocuments(Long id, String message) {
        Application application = getApplicationById(id);
        application.setStatus(ApplicationStatus.DOCUMENTS_REQUESTED);
        application.setStaffMessage(message);
        
        Application updated = applicationRepository.save(application);
        
        notificationService.createNotification(
            application.getParent().getUser().getId(),
            "Documents Requested",
            "Staff has requested documents for your adoption application. Please submit the required documents. Message: " + message
        );
        
        return updated;
    }
}
