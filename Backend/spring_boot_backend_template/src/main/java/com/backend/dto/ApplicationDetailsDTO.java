package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDetailsDTO {
    private Long applicationId;
    private String parentName;
    private String parentEmail;
    private String parentOccupation;
    private String parentIncome;
    private String childName;
    private Integer childAge;
    private String childGender;
    private String applicationStatus;
    private String documentStatus;
    private LocalDateTime submittedAt;
    private String staffMessage;
}
