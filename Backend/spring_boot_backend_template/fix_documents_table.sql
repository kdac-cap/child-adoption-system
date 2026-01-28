-- Drop existing documents table
DROP TABLE IF EXISTS documents;

-- Recreate with LONGTEXT columns
CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT NOT NULL,
    application_id BIGINT,
    parent_username VARCHAR(100) NOT NULL,
    identity_proof LONGTEXT,
    address_proof LONGTEXT,
    age_proof LONGTEXT,
    income_proof LONGTEXT,
    marriage_proof LONGTEXT,
    medical_certificate LONGTEXT,
    police_verification LONGTEXT,
    police_clearance LONGTEXT,
    photographs LONGTEXT,
    status VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP,
    staff_verified_at TIMESTAMP,
    admin_approved_at TIMESTAMP,
    admin_comments TEXT,
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    FOREIGN KEY (application_id) REFERENCES applications(id)
);
