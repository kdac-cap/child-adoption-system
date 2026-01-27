package com.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "child_welfare_visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChildWelfareVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ---------------- CHILD INFO ---------------- */
    @Column(name = "child_name", nullable = false)
    private String childName;

    /* ---------------- PARENT ---------------- */
    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private User parent;

    /* ---------------- WELFARE OFFICER ---------------- */
    @ManyToOne
    @JoinColumn(name = "officer_id", nullable = false)
    private User welfareOfficer; 
    // role = STAFF / AGENCY

    /* ---------------- VISIT DETAILS ---------------- */
    @Column(name = "visit_date")
    private LocalDate visitDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "visit_status")
    private VisitStatus visitStatus;

    @Column(length = 500)
    private String remarks;

    /* ---------------- AUDIT ---------------- */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}