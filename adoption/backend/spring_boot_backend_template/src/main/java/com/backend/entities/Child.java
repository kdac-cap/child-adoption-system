package com.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "children")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Child {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer age;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChildStatus status;
    
    private String photo;
    
    @Column(name = "health_report", columnDefinition = "TEXT")
    private String healthReport;
    
    @Column(name = "foster_history", columnDefinition = "TEXT")
    private String fosterHistory;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "added_by")
    private String addedBy;
    
    @Column(name = "added_at")
    private LocalDateTime addedAt;
    
    @PrePersist
    protected void onCreate() {
        if (addedAt == null) {
            addedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ChildStatus.AVAILABLE;
        }
    }
}