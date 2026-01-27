package com.backend.services;

import com.backend.entities.*;
import java.util.List;

public interface AdminService {
    // User Management
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUserRole(Long userId, UserRole role);
    void deleteUser(Long id);
    
    // Application Management
    List<Application> getAllApplicationsForAdmin();
    Application approveApplication(Long applicationId, String message);
    Application rejectApplication(Long applicationId, String message);
    
    // Document Management
    List<Document> getAllDocumentsForAdmin();
    
    // Child Management
    List<Child> getAllChildrenForAdmin();
    
    // Welfare Review Approval
    Application approveWelfareReview(Long applicationId, String comments);
    Application requestWelfareReview(Long applicationId);
    
    // Statistics
    Long getTotalUsers();
    Long getTotalApplications();
    Long getTotalChildren();
    Long getPendingApplications();
}
