package com.backend.daos;

import com.backend.entities.Parent;
import com.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    Optional<Parent> findByUser(User user);
    Optional<Parent> findByUserUsername(String username);
}
