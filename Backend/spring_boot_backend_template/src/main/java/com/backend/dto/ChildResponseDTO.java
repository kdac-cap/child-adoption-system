package com.backend.dto;

import com.backend.entities.ChildStatus;
import com.backend.entities.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ChildResponseDTO {

    private Long id;
    private String name;
    private Integer age;
    private Gender gender;
    private ChildStatus status;
    private String photo;
    private String description;
    private String healthReport;
    private String fosterHistory;
    private String addedBy;
    private LocalDateTime addedAt;
}
