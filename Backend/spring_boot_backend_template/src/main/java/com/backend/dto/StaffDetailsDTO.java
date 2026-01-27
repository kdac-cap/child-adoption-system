package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffDetailsDTO {
    private Long staffId;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String agencyName;
    private String agencyLicense;
    private String designation;
    private String qualification;
    private String experience;
}
