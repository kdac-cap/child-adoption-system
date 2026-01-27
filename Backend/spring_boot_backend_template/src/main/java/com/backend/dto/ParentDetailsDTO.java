package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParentDetailsDTO {
    private Long parentId;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String maritalStatus;
    private String occupation;
    private String annualIncome;
    private String city;
    private String state;
    private String postalCode;
    private String address;
}
