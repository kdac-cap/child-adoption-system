package com.backend.entities;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionId;

    private Double amount;

    private String upiId;

    private String donorName;

    private LocalDateTime donatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

