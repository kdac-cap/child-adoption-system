package com.backend.dto;

import com.backend.entities.VisitStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class VisitRequestDTO {

    @NotNull
    private Long childId;

    @NotBlank
    private String parentUsername;

    @NotNull
    @Future(message = "Visit date must be future")
    private LocalDate visitDate;

    @NotNull
    private VisitStatus status;

    private String remarks;
}
