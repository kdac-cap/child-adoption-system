package com.backend.daos;

import com.backend.entities.Document;
import com.backend.entities.Application;
import com.backend.entities.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    Document findByApplication(Application application);
    List<Document> findByParent(Parent parent);
}

