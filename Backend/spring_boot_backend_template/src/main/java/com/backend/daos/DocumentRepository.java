package com.backend.daos;

import com.backend.entities.Document;
import com.backend.entities.Application;
import com.backend.entities.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    Document findByApplication(Application application);
    Optional<Document> findByApplicationId(Long applicationId);
    List<Document> findByParent(Parent parent);
    List<Document> findByParentId(Long parentId);
}
