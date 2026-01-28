package com.backend.controllers;

import com.backend.dto.ApiResponse;
import com.backend.entities.Message;
import com.backend.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @PostMapping("/send")
    public ResponseEntity<ApiResponse> sendMessage(@RequestBody Map<String, Object> request) {
        Long senderId = Long.valueOf(request.get("senderId").toString());
        Long receiverId = Long.valueOf(request.get("receiverId").toString());
        String content = request.get("content").toString();
        
        Message message = messageService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(new ApiResponse(true, "Message sent", message));
    }
    
    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        List<Message> messages = messageService.getConversation(userId1, userId2);
        return ResponseEntity.ok(messages);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {
        messageService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse("Message marked as read", true));
    }
    
    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable Long userId) {
        List<Message> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/recent-conversations/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getRecentConversations(@PathVariable Long userId) {
        List<Map<String, Object>> conversations = messageService.getRecentConversations(userId);
        return ResponseEntity.ok(conversations);
    }
    
    @GetMapping("/all-conversations/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getAllConversations(@PathVariable Long userId) {
        List<Map<String, Object>> conversations = messageService.getAllConversations(userId);
        return ResponseEntity.ok(conversations);
    }
}
