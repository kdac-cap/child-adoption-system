package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    @JsonIgnoreProperties({"documents", "applications", "user"})
    private Parent parent;
    
    @ManyToOne
    @JoinColumn(name = "application_id")
    @JsonIgnoreProperties({"parent", "child", "documents"})
    private Application application;
    
    @Column(name = "parent_username", nullable = false)
    private String parentUsername;
    
    @Column(name = "identity_proof", columnDefinition = "LONGTEXT")
    private String identityProof;
    
    @Column(name = "address_proof", columnDefinition = "LONGTEXT")
    private String addressProof;
    
    @Column(name = "age_proof", columnDefinition = "LONGTEXT")
    private String ageProof;
    
    @Column(name = "income_proof", columnDefinition = "LONGTEXT")
    private String incomeProof;
    
    @Column(name = "marriage_proof", columnDefinition = "LONGTEXT")
    private String marriageProof;
    
    @Column(name = "medical_certificate", columnDefinition = "LONGTEXT")
    private String medicalCertificate;
    
    @Column(name = "police_verification", columnDefinition = "LONGTEXT")
    private String policeVerification;
    
    @Column(name = "police_clearance", columnDefinition = "LONGTEXT")
    private String policeClearance;
    
    @Column(columnDefinition = "LONGTEXT")
    private String photographs;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "staff_verified_at")
    private LocalDateTime staffVerifiedAt;
    
    @Column(name = "admin_approved_at")
    private LocalDateTime adminApprovedAt;
    
    @Column(name = "admin_comments", columnDefinition = "TEXT")
    private String adminComments;
    
    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = DocumentStatus.PENDING;
        }
    }
}