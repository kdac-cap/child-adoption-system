package com.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildWelfareRegisterRequestDTO {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    // Child Welfare specific
    @NotBlank(message = "Department name is required")
    private String department_name;

    @NotBlank(message = "Employee ID is required")
    private String employee_id;

    @NotBlank(message = "Office location is required")
    private String office_location;
}
