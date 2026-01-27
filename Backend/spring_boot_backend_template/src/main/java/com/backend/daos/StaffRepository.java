package com.backend.daos;

import com.backend.entities.Staff;
import com.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByUser(User user);
    Optional<Staff> findByUserId(Long userId);
}
