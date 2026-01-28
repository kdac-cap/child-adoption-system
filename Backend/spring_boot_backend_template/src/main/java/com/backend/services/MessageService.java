package com.backend.services;

import com.backend.daos.MessageRepository;
import com.backend.daos.UserRepository;
import com.backend.entities.Message;
import com.backend.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
            .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setIsRead(false);
        
        return messageRepository.save(message);
    }
    
    public List<Message> getConversation(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1)
            .orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(userId2)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.findConversation(user1, user2);
    }
    
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    public List<Message> getUnreadMessages(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.findUnreadMessages(user);
    }
    
    public List<Map<String, Object>> getRecentConversations(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<User> chatUsers = messageRepository.findChatUsers(user);
        
        return chatUsers.stream()
            .map(chatUser -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", chatUser.getId());
                userMap.put("username", chatUser.getUsername());
                userMap.put("fullName", chatUser.getFullName());
                userMap.put("role", chatUser.getRole().toString());
                return userMap;
            })
            .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getAllConversations(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get users who have messaged this user
        List<User> chatUsers = messageRepository.findChatUsers(user);
        
        // For staff, also include all parents even if they haven't messaged yet
        if (user.getRole() == com.backend.entities.UserRole.STAFF || user.getRole() == com.backend.entities.UserRole.ADMIN) {
            List<User> allParents = userRepository.findByRole(com.backend.entities.UserRole.PARENT);
            chatUsers.addAll(allParents.stream()
                .filter(parent -> chatUsers.stream().noneMatch(existing -> existing.getId().equals(parent.getId())))
                .collect(Collectors.toList()));
        }
        
        return chatUsers.stream()
            .map(chatUser -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", chatUser.getId());
                userMap.put("username", chatUser.getUsername());
                userMap.put("fullName", chatUser.getFullName());
                userMap.put("role", chatUser.getRole().toString());
                return userMap;
            })
            .collect(Collectors.toList());
    }
}
