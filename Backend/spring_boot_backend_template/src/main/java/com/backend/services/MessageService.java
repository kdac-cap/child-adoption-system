package com.backend.services;

import com.backend.daos.MessageRepository;
import com.backend.daos.UserRepository;
import com.backend.entities.Message;
import com.backend.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
}
