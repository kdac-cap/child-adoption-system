package com.backend.daos;

import com.backend.entities.User;
import com.backend.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByRoleIn(List<UserRole> roles);
}
