package com.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "agencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Agency {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "agency_name", nullable = false)
    private String agencyName;
    
    @Column(name = "license_number", unique = true, nullable = false)
    private String licenseNumber;
    
    private String address;
}