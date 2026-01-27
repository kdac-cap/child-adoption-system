package com.backend.dto;

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
}
