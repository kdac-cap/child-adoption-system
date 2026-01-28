package com.backend.dto;

import com.backend.entities.Gender;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChildRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be positive")
    @Max(value = 18, message = "Age cannot exceed 18")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 500, message = "Health report cannot exceed 500 characters")
    private String healthReport;

    @Size(max = 500, message = "Foster history cannot exceed 500 characters")
    private String fosterHistory;

    // Photo URL or path
    private String photo;
}
