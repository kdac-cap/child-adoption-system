package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildWelfareRegisterRequestDTO {

    private String fullName;
    private String username;
    private String password;
    private String email;
    private String phone;

    // 🔥 Child Welfare specific
    private String department_name;
    private String employee_id;
    private String office_location;
}
