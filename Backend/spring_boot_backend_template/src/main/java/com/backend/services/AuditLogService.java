package com.backend.services;

import com.backend.entities.AuditLog;
import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogService {
    void logAction(String action, String entityType, Long entityId, String performedBy, Long userId, String details);
    List<AuditLog> getAllAuditLogs();
    List<AuditLog> getAuditLogsByUser(Long userId);
    List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId);
    List<AuditLog> getRecentAuditLogs(int limit);
}
