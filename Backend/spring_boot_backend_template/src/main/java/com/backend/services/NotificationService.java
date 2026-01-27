package com.backend.services;

import com.backend.entities.*;
import com.backend.daos.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void notifyUser(User user, String message, NotificationType type, Long appId) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setType(type);
        n.setApplicationId(appId);
        notificationRepository.save(n);
    }

    public void notifyStaff(String message, Long appId) {
        // In real app: fetch STAFF users
        // simplified placeholder
    }

	public void save(Notification n) {
		notificationRepository.save(n);
		
	}
}
