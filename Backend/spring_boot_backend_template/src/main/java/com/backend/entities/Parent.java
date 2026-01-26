package com.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "parents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Parent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status")
    private MaritalStatus maritalStatus;
    
    private String occupation;
    
    @Column(name = "annual_income")
    private String annualIncome;
    
    private String city;
    
    private String state;
    
    @Column(name = "postal_code")
    private String postalCode;
}