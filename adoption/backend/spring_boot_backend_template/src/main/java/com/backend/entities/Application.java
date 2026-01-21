package com.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;
    
    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;
    
    @Column(name = "parent_username", nullable = false)
    private String parentUsername;
    
    @Column(name = "parent_name", nullable = false)
    private String parentName;
    
    @Column(name = "child_name", nullable = false)
    private String childName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "staff_message", columnDefinition = "TEXT")
    private String staffMessage;
    
    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ApplicationStatus.PENDING_STAFF_APPROVAL;
        }
    }
}