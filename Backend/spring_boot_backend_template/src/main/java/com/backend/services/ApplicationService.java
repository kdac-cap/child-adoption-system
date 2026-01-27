package com.backend.services;

import com.backend.entities.Application;
import com.backend.entities.ApplicationStatus;
import java.util.List;

public interface ApplicationService {
    Application createApplication(Long parentId, Long childId);
    Application getApplicationById(Long id);
    List<Application> getApplicationsByParentId(Long parentId);
    List<Application> getAllApplications();
    List<Application> getApplicationsByStatus(ApplicationStatus status);
    Application updateApplicationStatus(Long id, ApplicationStatus status, String message);
    void deleteApplication(Long id);
}
