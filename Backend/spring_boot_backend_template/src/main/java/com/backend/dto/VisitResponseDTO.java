package com.backend.dto;

import com.backend.entities.VisitStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class VisitResponseDTO {
    private Long id;
    private String childName;
    private String parentUsername;
    private LocalDate visitDate;
    private VisitStatus status;
    private String remarks;
}
