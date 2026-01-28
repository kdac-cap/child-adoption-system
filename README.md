# 🏠 Child Adoption Management System

A robust full-stack solution designed to digitize and simplify the adoption process, ensuring transparency between parents, agencies, and welfare departments.

**🌐 Live Demo:** [https://child-adoption-portal-system.netlify.app/](https://child-adoption-portal-system.netlify.app/)

---

## 📖 Project Overview

This platform manages the end-to-end lifecycle of child adoption. It replaces fragmented manual paperwork with a centralized, secure digital workflow. The system ensures that every child finds a loving home through a verified, step-by-step legal process.

### 🔑 Core Pillars

* **Security:** JWT-based authentication with BCrypt encryption and Role-Based Access Control (RBAC).
* **Transparency:** Real-time status tracking for prospective parents.
* **Compliance:** Integrated workflow for Child Welfare Department home visits and legal reporting.
* **Efficiency:** Automated document verification and staff review pipelines.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18, Vite, Bootstrap 5, Axios, Recharts |
| **Backend** | Java 21, Spring Boot 3.x, Spring Security, Maven |
| **Database** | MySQL 8.x, Hibernate (JPA) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Documentation** | Swagger / OpenAPI |

---

## 👥 User Roles & Features

### 👨‍👩‍👧 For Parents

* **Discovery:** Browse profiles of children available for adoption.
* **Application:** Submit digital adoption requests for specific profiles.
* **Vault:** Securely upload and manage sensitive legal documents.
* **Tracker:** Monitor application progress through a live, 8-step timeline.

### 🛡️ For Staff & Admin

* **Inventory:** Manage child records, update profiles, and track availability.
* **Vetting:** Review incoming applications and verify parent documentation.
* **Logistics:** (Admin) Orchestrate the system, manage users, and schedule home visits.
* **Insights:** View comprehensive analytics on adoption success rates.

### 🏛️ For Welfare Department

* **Assessments:** Access lists of scheduled home visits assigned to the department.
* **Reporting:** Submit digital assessment reports and final recommendations.
* **Verification:** Finalize welfare checks required for legal court approval.

---

## 🔄 The Adoption Pipeline

The system enforces a strict logical flow to ensure no legal steps are skipped:

1. **Application:** Parent submits interest.
2. **Document Phase:** Staff requests and verifies legal paperwork.
3. **Welfare Phase:** Admin schedules a home visit; Welfare Officer conducts and approves the visit.
4. **Finalization:** Admin grants final approval and the child is marked as "Adopted."

---

## ⚙️ Installation & Setup

### Prerequisites

* Java 21+
* Node.js 18+
* MySQL 8.x

### Backend Setup

1. Configure your MySQL credentials in `src/main/resources/application.properties`.
2. Run `./mvnw spring-boot:run`.
3. Access API documentation at `http://localhost:8080/swagger-ui/index.html`.

### Frontend Setup

1. Navigate to the `frontend` folder.
2. Run `npm install` to grab dependencies.
3. Run `npm run dev` to launch the React development server.

---

## 🚀 Roadmap & Future Enhancements

* [ ] **AI Matching:** Algorithm to suggest matches based on parent preferences and child needs.
* [ ] **In-App Communication:** Real-time chat/messaging between parents and agency staff.
* [ ] **Email/SMS Alerts:** Automated notifications for status changes.
* [ ] **Video Integration:** Built-in video calling for virtual preliminary interviews.

---

**Developed with ❤️ to help every child find a home.**

Would you like me to also provide a **sample JSON structure** for the API responses to include in your technical documentation?
