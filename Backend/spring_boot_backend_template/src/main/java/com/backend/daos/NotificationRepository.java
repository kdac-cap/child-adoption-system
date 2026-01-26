package com.backend.daos;

import com.backend.entities.NotificationVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository
        extends JpaRepository<NotificationVisit, Long> {

    List<NotificationVisit> findByUserUsername(String username);
}
