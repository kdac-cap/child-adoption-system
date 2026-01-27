package com.backend.services;

import org.springframework.stereotype.Service;

import com.backend.daos.ChildRepository;
import com.backend.daos.NotificationRepository;
import com.backend.daos.UserRepository;
import com.backend.daos.VisitRepository;
import com.backend.daos.NotificationVisitRepository;
import com.backend.dto.VisitRequestDTO;
import com.backend.dto.VisitResponseDTO;
import com.backend.entities.Child;
import com.backend.entities.NotificationVisit;
import com.backend.entities.User;
import com.backend.entities.Visit;
import com.backend.exceptions.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class VisitServiceImpl implements VisitService {

    private final VisitRepository visitRepo;
    private final ChildRepository childRepo;
    private final UserRepository userRepo;
    private final NotificationVisitRepository notificationVisitRepo;
    private final AuditLogService auditLogService;

    @Override
    public VisitResponseDTO scheduleVisit(VisitRequestDTO dto) {

        Child child = childRepo.findById(dto.getChildId())
            .orElseThrow(() -> new ResourceNotFoundException("Child not found"));

        User parent = userRepo.findByUsername(dto.getParentUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        Visit visit = new Visit();
        visit.setChild(child);
        visit.setParent(parent);
        visit.setVisitDate(dto.getVisitDate());
        visit.setStatus(dto.getStatus());
        visit.setRemarks(dto.getRemarks());

        visitRepo.save(visit);

        // 🔔 Notify parent
        notificationVisitRepo.save(new NotificationVisit(
            null,
            "📅 Visit scheduled on " + dto.getVisitDate() + " for " + child.getName(),
            false,
            null,
            parent
        ));
        
        auditLogService.logAction(
            "VISIT_SCHEDULED",
            "Visit",
            visit.getId(),
            "Child Welfare Department",
            null,
            "Visit scheduled for " + child.getName() + " on " + dto.getVisitDate()
        );

        return new VisitResponseDTO(
            visit.getId(),
            child.getName(),
            parent.getUsername(),
            visit.getVisitDate(),
            visit.getStatus(),
            visit.getRemarks()
        );
    }

    @Override
    public void cancelVisit(Long visitId) {

        Visit visit = visitRepo.findById(visitId)
            .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

        notificationVisitRepo.save(new NotificationVisit(
            null,
            "❌ Visit cancelled for " + visit.getChild().getName(),
            false,
            null,
            visit.getParent()
        ));
        
        auditLogService.logAction(
            "VISIT_CANCELLED",
            "Visit",
            visitId,
            "Child Welfare Department",
            null,
            "Visit cancelled for " + visit.getChild().getName()
        );

        visitRepo.delete(visit);
    }
}
