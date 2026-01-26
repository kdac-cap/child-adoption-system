package com.backend.entities;



import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationVisit{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private boolean readFlag = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    private User user;
}

