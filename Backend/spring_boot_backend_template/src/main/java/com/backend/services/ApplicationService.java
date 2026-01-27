package com.backend.services;

import com.backend.daos.*;
import com.backend.entities.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;
    private final NotificationService notificationService;

    /* =========================================================
       CREATE APPLICATION (PARENT)
    ========================================================= */
    public Application apply(Long parentId, Long childId) {

        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));

        if (child.getStatus() != ChildStatus.AVAILABLE) {
            throw new RuntimeException("Child not available for adoption");
        }

        // Lock child
        child.setStatus(ChildStatus.IN_APPLICATION);
        childRepository.save(child);

        Application application = new Application();
        application.setParent(parent);
        application.setChild(child);
        application.setParentUsername(parent.getUser().getUsername());
        application.setParentName(parent.getUser().getFullName());
        application.setChildName(child.getName());
        application.setStatus(ApplicationStatus.PENDING_STAFF_APPROVAL);

        Application saved = applicationRepository.save(application);

        // Notify staff
        notificationService.notifyStaff(
                "New adoption application submitted",
                saved.getId()
        );

        return saved;
    }

    /* =========================================================
       READ OPERATIONS
    ========================================================= */
    public List<Application> getAll() {
        return applicationRepository.findAll();
    }

    public Application getById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public List<Application> getByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status);
    }

    public List<Application> getByParentId(Long parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        return applicationRepository.findByParent(parent);
    }

    /* =========================================================
       STATUS UPDATES (STAFF / ADMIN)
    ========================================================= */
    public Application updateStatus(Long id, ApplicationStatus newStatus, String message) {

        // 1️⃣ fetch application
        Application app = getById(id);

        // 2️⃣ check if status transition is valid
        if (!isValidTransition(app.getStatus(), newStatus)) {
            throw new RuntimeException("Invalid status transition");
        }

        // 3️⃣ update application status and staff message
        app.setStatus(newStatus);
        app.setStaffMessage(message);

        // 4️⃣ create notification
        NotificationType type = mapStatusToNotificationType(newStatus);
        notificationService.notifyUser(
                app.getParent().getUser(),
                message != null ? message : "Application status updated: " + newStatus,
                type,
                app.getId()
        );

        // 5️⃣ save application
        return applicationRepository.save(app);
    }

    /* =========================================================
       HELPER METHODS
    ========================================================= */
    private boolean isValidTransition(ApplicationStatus current, ApplicationStatus next) {
        // allow any forward movement, for example
        return current.ordinal() < next.ordinal();
    }


    private NotificationType mapStatusToNotificationType(ApplicationStatus status) {
        return switch (status) {
            case DOCUMENTS_REQUESTED -> NotificationType.INFO;       // parent needs to provide docs
            case STAFF_VERIFIED,
                 PENDING_ADMIN_APPROVAL -> NotificationType.SUCCESS;  // staff approved / forwarded
            case REJECTED -> NotificationType.ERROR;                  // application rejected
            default -> NotificationType.INFO;                          // generic updates
        };
    }
}
