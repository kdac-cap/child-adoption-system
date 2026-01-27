package com.backend.daos;

import com.backend.entities.Document;
import com.backend.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByApplication(Application application);
}

