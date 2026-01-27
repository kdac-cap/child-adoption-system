package com.backend.dto;

import com.backend.entities.MaritalStatus;
import com.backend.entities.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {

    private String fullName;
    private String username;
    private String password;
    private String email;
    private String phone;
    private UserRole role;
    
    // Parent fields
    private MaritalStatus maritalStatus;
    private String occupation;
    private String annualIncome;
    private String city;
    private String state;
    private String postalCode;
    
    // Staff fields
    private String agencyName;
    private String agencyLicense;
    private String designation;
    private String qualification;
    private String experience;
}
