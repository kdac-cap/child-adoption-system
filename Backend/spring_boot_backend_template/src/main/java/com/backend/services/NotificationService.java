package com.backend.services;

import com.backend.entities.Notification;
import java.util.List;

public interface NotificationService {
    Notification createNotification(Long userId, String title, String message);
    List<Notification> getNotificationsByUserId(Long userId);
    List<Notification> getUnreadNotifications(Long userId);
    Notification markAsRead(Long id);
    void deleteNotification(Long id);
}
