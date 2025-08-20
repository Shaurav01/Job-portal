# Job Portal Backend API

A comprehensive Node.js + Express + MongoDB backend API for a job portal application.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **User Management**: Job seekers and employers with detailed profiles
- **Job Management**: CRUD operations for job postings
- **Application System**: Job application tracking and management
- **File Uploads**: Resume and avatar upload functionality
- **Search & Filtering**: Advanced job and user search capabilities
- **Role-based Access**: Different permissions for job seekers and employers

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express-validator
- **Security**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing enabled

## 📁 Project Structure

```
backend/
├── config/          # Database and configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware functions
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── utils/           # Utility functions
├── uploads/         # File upload directory
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── env.example      # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/job-portal
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   MAX_FILE_SIZE=5242880
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password (placeholder)

### User Routes
- `GET /api/users/:id` - Get public user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/saved-jobs` - Get saved jobs
- `POST /api/users/save-job/:jobId` - Save/unsave a job
- `GET /api/users/search` - Search for users (employers only)

### Job Routes
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/categories` - Get job categories
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job (employers only)
- `PUT /api/jobs/:id` - Update job (owner only)
- `DELETE /api/jobs/:id` - Delete job (owner only)
- `GET /api/jobs/employer/my-jobs` - Get employer's jobs

### Application Routes
- `POST /api/applications/:jobId` - Apply to a job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get job applications (employer)
- `PUT /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Withdraw application
- `GET /api/applications/stats` - Get application statistics

### Upload Routes
- `POST /api/uploads/resume` - Upload resume
- `POST /api/uploads/avatar` - Upload avatar
- `GET /api/uploads/:filename` - Get file info
- `DELETE /api/uploads/:filename` - Delete file

## 🔐 Authentication & Authorization

### JWT Token
- Tokens are sent in the Authorization header: `Bearer <token>`
- Token expiration: 30 days (configurable)

### Role-based Access Control
- **Job Seekers**: Can apply to jobs, manage profile, upload resume
- **Employers**: Can post jobs, manage applications, view candidates
- **Admin**: Full access to all endpoints (future implementation)

## 📊 Database Models

### User Model
- Basic info: name, email, password, role, phone
- Job Seeker Profile: skills, experience, education, resume
- Employer Profile: company info, industry, contact details
- Saved and applied jobs tracking

### Job Model
- Job details: title, description, requirements, salary
- Company information and location
- Application tracking and statistics
- Search indexing for fast queries

### Application Model
- Application details and status tracking
- Cover letter and resume references
- Interview scheduling and feedback
- Status workflow: pending → reviewed → shortlisted/rejected/hired

## 🔍 Search & Filtering

### Job Search
- Text search across title, description, requirements
- Filter by location, type, category, experience level
- Salary range filtering
- Remote work options
- Pagination support

### User Search (Employers)
- Search candidates by skills and location
- Filter by experience and availability
- Text search across profiles

## 📁 File Upload

### Supported Formats
- **Resumes**: PDF, DOC, DOCX, TXT
- **Avatars**: JPEG, JPG, PNG, GIF
- **Max Size**: 5MB (configurable)

### Security Features
- File type validation
- Size limits
- Secure file naming
- User ownership verification

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token validation
- Role-based access control
- Input validation and sanitization
- CORS configuration
- File upload security

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Performance

- Database indexing for fast queries
- Pagination for large datasets
- Efficient MongoDB queries with aggregation
- File serving optimization

## 🚀 Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set strong JWT secret
- Configure CORS origins

### Production Considerations
- Use PM2 or similar process manager
- Set up reverse proxy (Nginx)
- Enable HTTPS
- Configure logging
- Set up monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 API Versioning

Current version: v1.0.0
- All endpoints are prefixed with `/api/`
- Future versions will use `/api/v2/` format

## 📊 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // when applicable
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "errors": [ ... ] // validation errors
}
```
