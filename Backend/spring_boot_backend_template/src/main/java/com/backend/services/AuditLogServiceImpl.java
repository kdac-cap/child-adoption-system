package com.backend.services;

import com.backend.daos.AuditLogRepository;
import com.backend.entities.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AuditLogServiceImpl implements AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Override
    public void logAction(String action, String entityType, Long entityId, String performedBy, Long userId, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setPerformedBy(performedBy);
        log.setUserId(userId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        log.setStatus("SUCCESS");
        auditLogRepository.save(log);
    }
    
    @Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc();
    }
    
    @Override
    public List<AuditLog> getAuditLogsByUser(Long userId) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }
    
    @Override
    public List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId);
    }
    
    @Override
    public List<AuditLog> getRecentAuditLogs(int limit) {
        return auditLogRepository.findTop100ByOrderByTimestampDesc();
    }
}
