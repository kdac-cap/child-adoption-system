# Child Adoption System

A complete full-stack application for managing child adoption processes with user registration, authentication, and password reset functionality.

## 🚀 Quick Start

### Prerequisites
- Java 21+
- MySQL 8.0+
- Node.js 18+
- npm or yarn

### 1. Database Setup
```bash
# Start MySQL and create database
mysql -u root -p
CREATE DATABASE adoption;
```

### 2. Configure Email (Optional)
Edit `Backend/spring_boot_backend_template/src/main/resources/application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 3. Run Application
```bash
# Make startup script executable
chmod +x start.sh

# Start both backend and frontend
./start.sh
```

## 🔧 Manual Setup

### Backend
```bash
cd Backend/spring_boot_backend_template
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📱 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Test Integration**: http://localhost:5173/test
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 🧪 Testing the System

1. Visit http://localhost:5173/test
2. Click "Test Register" - Creates a user in database
3. Click "Test Login" - Authenticates with JWT token
4. Click "Test Forgot Password" - Sends reset email

## ✅ Features Implemented

### ✅ User Registration & Database Storage
- User data stored in MySQL `adoption` database
- Password encryption with BCrypt
- SQL queries visible in console (`spring.jpa.show-sql=true`)
- Auto-creates database tables

### ✅ Login System
- Email-based authentication
- JWT token generation
- Role-based access (PARENT, ADMIN, STAFF, AGENCY)
- Secure session management

### ✅ Password Reset via Email
- Forgot password functionality
- Secure token generation (30-min expiry)
- Email integration with reset links
- Token validation and password update

## 📊 Database Tables

The system automatically creates these tables:
- `users` - User accounts and profiles
- `password_reset_tokens` - Password reset tokens

## 🔐 Security Features

- Password encryption (BCrypt)
- JWT authentication
- CORS configuration
- SQL injection prevention
- XSS protection

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

## 📧 Email Configuration

For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password
3. Update `application.properties` with credentials

For testing without email, check console logs for reset tokens.

## 🐛 Troubleshooting

### Login Issues
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify user exists in database

### Email Issues
- Configure email credentials
- Check spam folder
- Use console logs for testing

### Port Conflicts
- Backend: Change `server.port` in `application.properties`
- Frontend: Change port in `vite.config.js`

## 📁 Project Structure

```
adoption/
├── Backend/spring_boot_backend_template/    # Spring Boot API
├── frontend/                               # React Frontend
├── start.sh                               # Startup script
├── EMAIL_SETUP.md                         # Email configuration guide
└── README.md                              # This file
```

## 🎯 Next Steps

1. Configure email credentials for password reset
2. Test complete registration → login → password reset flow
3. Customize UI/UX as needed
4. Add additional features (document upload, etc.)

## 📞 Support

If you encounter issues:
1. Check MySQL connection
2. Verify Java/Node.js versions
3. Review console logs for errors
4. Ensure all dependencies are installed