package com.backend.services;

import com.backend.daos.*;
import com.backend.entities.*;
import com.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    @Override
    public User updateUserRole(Long userId, UserRole role) {
        User user = getUserById(userId);
        user.setRole(role);
        return userRepository.save(user);
    }
    
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    @Override
    public List<Application> getAllApplicationsForAdmin() {
        return applicationRepository.findAll();
    }
    
    @Override
    public Application approveApplication(Long applicationId, String message) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        application.setStatus(ApplicationStatus.APPROVED);
        application.setStaffMessage(message);
        Application saved = applicationRepository.save(application);
        
        notificationService.createNotification(
            application.getParent().getUser().getId(),
            "Application Approved",
            "Congratulations! Your adoption application has been approved. " + message
        );
        
        auditLogService.logAction(
            "APPLICATION_APPROVED",
            "Application",
            applicationId,
            "Admin",
            null,
            "Application #" + applicationId + " approved by admin. Message: " + message
        );
        
        return saved;
    }
    
    @Override
    public Application rejectApplication(Long applicationId, String message) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        application.setStatus(ApplicationStatus.REJECTED);
        application.setStaffMessage(message);
        Application saved = applicationRepository.save(application);
        
        notificationService.createNotification(
            application.getParent().getUser().getId(),
            "Application Rejected",
            "Your adoption application has been rejected. Reason: " + message
        );
        
        auditLogService.logAction(
            "APPLICATION_REJECTED",
            "Application",
            applicationId,
            "Admin",
            null,
            "Application #" + applicationId + " rejected. Reason: " + message
        );
        
        return saved;
    }
    
    @Override
    public List<Document> getAllDocumentsForAdmin() {
        return documentRepository.findAll();
    }
    
    @Override
    public List<Child> getAllChildrenForAdmin() {
        return childRepository.findAll();
    }
    
    @Override
    public Application approveWelfareReview(Long applicationId, String comments) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        application.setStatus(ApplicationStatus.WELFARE_APPROVED);
        application.setStaffMessage(comments);
        Application saved = applicationRepository.save(application);
        
        notificationService.createNotification(
            application.getParent().getUser().getId(),
            "Welfare Review Approved",
            "Your welfare review has been approved. Your application is now ready for final admin approval."
        );
        
        auditLogService.logAction(
            "WELFARE_REVIEW_APPROVED",
            "Application",
            applicationId,
            "Child Welfare Department",
            null,
            "Welfare review approved for application #" + applicationId + ". Comments: " + comments
        );
        
        return saved;
    }
    
    @Override
    public Application requestWelfareReview(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        application.setStatus(ApplicationStatus.WELFARE_VISIT_SCHEDULED);
        Application saved = applicationRepository.save(application);
        
        List<User> welfareUsers = userRepository.findByRole(UserRole.CHILD_WELFARE);
        for (User welfare : welfareUsers) {
            notificationService.createNotification(
                welfare.getId(),
                "Welfare Review Requested",
                "Admin has requested welfare review for application #" + applicationId + ". Please schedule a home visit."
            );
        }
        
        auditLogService.logAction(
            "WELFARE_REVIEW_REQUESTED",
            "Application",
            applicationId,
            "Admin",
            null,
            "Welfare review requested for application #" + applicationId
        );
        
        return saved;
    }
    
    @Override
    public Long getTotalUsers() {
        return userRepository.count();
    }
    
    @Override
    public Long getTotalApplications() {
        return applicationRepository.count();
    }
    
    @Override
    public Long getTotalChildren() {
        return childRepository.count();
    }
    
    @Override
    public Long getPendingApplications() {
        return (long) applicationRepository.findByStatus(ApplicationStatus.PENDING_STAFF_APPROVAL).size();
    }
    
    @Override
    public Long getApprovedApplications() {
        return (long) applicationRepository.findByStatus(ApplicationStatus.APPROVED).size();
    }
}
