package com.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Child child;

    @ManyToOne
    private User parent;

    private LocalDate visitDate;

    @Enumerated(EnumType.STRING)
    private VisitStatus status;

    private String remarks;
}
