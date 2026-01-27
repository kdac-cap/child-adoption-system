# Child Adoption System - Frontend-Backend Integration

## Overview
This document outlines the integration between the React frontend and Spring Boot backend using Axios and JWT authentication.

## Architecture

### Frontend (React + Axios)
- **API Service**: Centralized HTTP client with interceptors
- **Authentication Context**: React context for auth state management
- **JWT Token Management**: Automatic token attachment and refresh
- **Error Handling**: Centralized error handling with user feedback

### Backend (Spring Boot + Spring Security)
- **JWT Authentication**: Token-based authentication
- **CORS Configuration**: Cross-origin resource sharing setup
- **Role-based Access Control**: Different access levels for users
- **RESTful APIs**: Standard REST endpoints

## Setup Instructions

### Backend Setup

1. **Database Configuration**
   ```properties
   # application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/adoption?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

2. **Start Backend Server**
   ```bash
   cd Backend/spring_boot_backend_template
   ./mvnw spring-boot:run
   ```
   Server runs on: `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

## Key Features Implemented

### 1. Axios HTTP Client
- **Base Configuration**: Centralized API base URL
- **Request Interceptors**: Automatic JWT token attachment
- **Response Interceptors**: Error handling and token refresh
- **Timeout Handling**: 10-second request timeout

### 2. JWT Authentication Flow
```
1. User Login → Backend validates → Returns JWT token
2. Token stored in localStorage
3. All subsequent requests include Authorization header
4. Token expiry redirects to login page
```

### 3. Role-Based Routing
- **PARENT**: Access to adoption applications and child browsing
- **STAFF**: Application review and document verification
- **ADMIN**: Final approval and system management
- **AGENCY**: Child management and applications

### 4. Error Handling
- **Network Errors**: Automatic retry mechanisms
- **Authentication Errors**: Redirect to login
- **Validation Errors**: User-friendly error messages
- **Server Errors**: Graceful degradation

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/register/child-welfare
```

### Children Management
```
GET    /api/children
POST   /api/children
GET    /api/children/{id}
PUT    /api/children/{id}
DELETE /api/children/{id}
```

### Applications
```
GET    /api/applications
POST   /api/applications
GET    /api/applications/{id}
PUT    /api/applications/{id}
DELETE /api/applications/{id}
```

### Documents
```
POST /api/applications/{id}/documents
GET  /api/applications/{id}/documents
PUT  /api/documents/{id}/verify
```

## Security Configuration

### CORS Settings
- Allowed Origins: `localhost:3000`, `localhost:5173`
- Allowed Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Credentials: Enabled for cookie/session support

### JWT Configuration
- **Secret Key**: Configurable in application.properties
- **Expiration**: 10 hours (36000000 ms)
- **Header Format**: `Authorization: Bearer <token>`

## Environment Configuration

### Development
```javascript
API_BASE_URL: 'http://localhost:8080/api'
FRONTEND_URL: 'http://localhost:5173'
```

### Production
```javascript
API_BASE_URL: '/api'
FRONTEND_URL: window.location.origin
```

## Usage Examples

### Making API Calls
```javascript
// Login
const response = await apiService.login({ email, password });

// Get children (authenticated)
const children = await apiService.getChildren();

// Create application
const application = await apiService.createApplication(data);
```

### Using Authentication Context
```javascript
const { user, login, logout, isAuthenticated } = useAuth();

// Check user role
if (user?.role === 'PARENT') {
  // Parent-specific logic
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration includes frontend URL
   - Check browser network tab for preflight requests

2. **Authentication Failures**
   - Verify JWT token format and expiration
   - Check backend security configuration

3. **Network Timeouts**
   - Increase timeout in axios configuration
   - Check backend server status

### Debug Tips
- Use browser DevTools Network tab
- Check backend console logs
- Verify database connectivity
- Test API endpoints with Postman

## Next Steps

1. **Add File Upload**: Implement document upload functionality
2. **Real-time Notifications**: WebSocket integration
3. **Caching**: Implement response caching
4. **Testing**: Add unit and integration tests
5. **Monitoring**: Add logging and error tracking