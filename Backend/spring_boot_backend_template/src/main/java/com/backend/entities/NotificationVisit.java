package com.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private boolean readFlag = false;

    private LocalDateTime createdAt;

    @ManyToOne
    private User user;

  
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
