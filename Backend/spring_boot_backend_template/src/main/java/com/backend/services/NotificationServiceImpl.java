package com.backend.services;

import com.backend.daos.NotificationRepository;
import com.backend.daos.UserRepository;
import com.backend.entities.Notification;
import com.backend.entities.NotificationType;
import com.backend.entities.User;
import com.backend.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public Notification createNotification(Long userId, String title, String message) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(NotificationType.INFO);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    @Override
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    @Override
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
