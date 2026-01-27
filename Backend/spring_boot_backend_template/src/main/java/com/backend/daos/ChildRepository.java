package com.backend.daos;

import com.backend.entities.Child;
import com.backend.entities.ChildStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChildRepository extends JpaRepository<Child, Long> {
    List<Child> findByStatus(ChildStatus status);
}

