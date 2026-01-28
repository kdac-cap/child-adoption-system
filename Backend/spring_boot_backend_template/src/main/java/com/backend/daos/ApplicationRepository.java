package com.backend.daos;

import com.backend.entities.Application;
import com.backend.entities.ApplicationStatus;
import com.backend.entities.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByParent(Parent parent);
    List<Application> findByParentId(Long parentId);
    List<Application> findByStatus(ApplicationStatus status);
    long countByStatus(ApplicationStatus status);
}
