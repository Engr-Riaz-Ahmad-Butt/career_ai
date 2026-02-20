# CareerForge Backend API

🚀 Complete Node.js + Express + PostgreSQL + Prisma + **Gemini AI** backend for CareerForge AI - Resume builder and career document generation platform.

## 📋 Features

- ✅ **Authentication**
  - Email/Password signup & login
  - Google OAuth integration
  - JWT-based authentication
  - Refresh token rotation
  - Secure password hashing with bcrypt

- ✅ **Resume Management**
  - CRUD operations for resumes
  - ATS score calculation
  - Resume templates
  - Export to PDF/DOCX
  - Resume duplication

- ✅ **🤖 AI-Powered Generation (NEW!)**
  - **Resume Generation** - Create from scratch with AI
  - **Resume Tailoring** - Optimize for specific jobs
  - **Resume Improvement** - AI suggestions for uploads
  - **ATS Analysis** - Calculate compatibility scores
  - **Cover Letters** - Multiple types supported
  - **Statement of Purpose** - For scholarships
  - **LinkedIn Bios** - Professional summaries
  - **Interview Prep** - AI-generated questions
  - **Communication Analysis** - Writing feedback
  - **Keyword Extraction** - From job descriptions

- ✅ **Security**
  - Helmet.js security headers
  - Rate limiting
  - CORS configuration
  - Input validation with Zod
  - SQL injection protection (Prisma ORM)

- ✅ **Developer Experience**
  - Full TypeScript support
  - Comprehensive API documentation
  - Postman collection included
  - Error handling middleware
  - Request logging

## 🏗️ Architecture
  
  The project follows the **Service-Controller Pattern** to ensure separation of concerns and maintainability:
  
  - **Controllers** (`src/controllers`): Handle HTTP requests, validation, and response formatting. They do *not* contain business logic.
  - **Services** (`src/services`): Contain all business logic, database interactions, and external API calls.
  - **Routes** (`src/routes`): Define API endpoints and map them to controllers.
  - **Middleware** (`src/middleware`): Handle cross-cutting concerns like authentication, error handling, and logging.
  
  ### Directory Structure
  
  ```
  src/
  ├── config/         # Environment and database configuration
  ├── controllers/    # Request handlers (input/output only)
  ├── middleware/     # Auth, Error, Validation middleware
  ├── routes/         # API route definitions
  ├── services/       # Business logic (Heavy lifting)
  ├── types/          # TypeScript type definitions
  ├── utils/          # Helper functions (JWT, Password, etc.)
  └── server.ts       # Application entry point
  ```
  
  ## 🧪 Testing
  
  The project uses **Jest** for automated testing.
  
  ### Running Tests
  
  ```bash
  # Run all tests
  npm test
  
  # Run tests in watch mode
  npm test -- --watch
  ```
  
  ### Test Structure
  
  - **Unit Tests**: Test individual services and utilities (using mocks).
  - **Integration Tests**: Test API endpoints and database interactions.
  
  ## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Google Gemini API
- **Authentication**: JWT + Google OAuth
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting
- **Dev Tools**: tsx (for development)

## 📦 Installation

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database running
- Google OAuth credentials (for social login)

### Step 1: Clone and Install

```bash
# Navigate to backend directory
cd careerforge-backend

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/careerforge?schema=public"

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini AI (REQUIRED for AI features)
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**🔑 Getting Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Copy and add to `.env`

See `docs/GEMINI_AI_INTEGRATION.md` for detailed AI setup.

### Step 3: Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### Step 4: Start Development Server

```bash
# Start server with hot reload
npm run dev
```

Server will start at: `http://localhost:5000`

## 🗄️ Database Schema

### User
- Authentication (email/password and Google OAuth)
- Profile information
- Subscription plan and credits
- Activity tracking

### Resume
- Personal information
- Experience, education, skills
- ATS scoring
- Version control

### Document
- Cover letters, SOPs, etc.
- Template-based generation
- Document metadata

### Job
- Job application tracker
- Status management
- Deadline tracking

### CreditUsage
- Track credit consumption
- Usage analytics

### RefreshToken
- Secure token storage
- Automatic expiry

## 🔐 Authentication Flow

### Email/Password Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### Email/Password Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Google OAuth

1. Get Google ID token on frontend
2. Send token to backend:

```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google_oauth_token_here"
}
```

### Token Refresh

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Using Access Token

```http
GET /api/auth/me
Authorization: Bearer your_access_token
```

## 📝 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login with email | Public |
| POST | `/api/auth/google` | Google OAuth login | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | Logout user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Resumes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/resumes` | Create resume | Private |
| GET | `/api/resumes` | Get all resumes | Private |
| GET | `/api/resumes/:id` | Get resume by ID | Private |
| PUT | `/api/resumes/:id` | Update resume | Private |
| DELETE | `/api/resumes/:id` | Delete resume | Private |
| POST | `/api/resumes/:id/duplicate` | Duplicate resume | Private |
| GET | `/api/resumes/:id/export` | Export resume | Private |

### AI Features (🤖 NEW!)

| Method | Endpoint | Description | Credits |
|--------|----------|-------------|---------|
| POST | `/api/ai/generate-resume` | Generate resume with AI | 2 |
| POST | `/api/ai/tailor-resume` | Optimize for job | 2 |
| POST | `/api/ai/improve-resume` | Get AI suggestions | 1 |
| POST | `/api/ai/analyze-ats` | Calculate ATS score | Free |
| POST | `/api/ai/generate-cover-letter` | Generate cover letter | 1 |
| POST | `/api/ai/generate-sop` | Generate SOP | 2 |
| POST | `/api/ai/generate-linkedin-bio` | LinkedIn bio | 1 |
| POST | `/api/ai/interview-prep` | Interview questions | 1 |
| POST | `/api/ai/analyze-communication` | Writing analysis | 1 |
| POST | `/api/ai/extract-keywords` | Extract from JD | Free |
| GET | `/api/ai/credits` | Get remaining credits | - |

## 📚 Documentation

- **API Documentation**: See `docs/API.md` for complete API reference
- **AI Integration**: See `docs/GEMINI_AI_INTEGRATION.md` for AI setup and usage
- **Postman Collection**: Import `docs/CareerForge-API.postman_collection.json`
- **Database Schema**: See `prisma/schema.prisma`

## 🧪 Testing with Postman

1. Import the Postman collection from `docs/CareerForge-API.postman_collection.json`
2. Set the `baseUrl` variable to `http://localhost:5000`
3. Run the "Signup" or "Login" request
4. Tokens will be automatically saved to collection variables
5. All authenticated requests will use the saved token

## 🔒 Security Best Practices

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Rate Limiting
- 100 requests per 15 minutes per IP
- Applies to all `/api/*` routes

### CORS Configuration
- Only frontend URL is allowed
- Credentials enabled for cookie-based auth

## 🏗️ Project Structure

```
careerforge-backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   └── resume.controller.ts
│   ├── routes/             # Route definitions
│   │   ├── auth.routes.ts
│   │   └── resume.routes.ts
│   ├── middleware/         # Custom middleware
│   │   ├── auth.ts
│   │   └── error.ts
│   ├── config/             # Configuration
│   │   └── database.ts
│   ├── utils/              # Utility functions
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── validation.ts
│   └── server.ts           # Main server file
├── prisma/
│   └── schema.prisma       # Database schema
├── docs/
│   ├── API.md              # API documentation
│   └── CareerForge-API.postman_collection.json
├── .env.example            # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Deployment

### Build for Production

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables (Production)

```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
JWT_SECRET=strong_random_secret
JWT_REFRESH_SECRET=strong_random_refresh_secret
FRONTEND_URL=https://yourfrontend.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📊 Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# View database in browser
npm run prisma:studio
```

### JWT Token Issues

- Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- Check token expiry times in `.env`
- Verify Authorization header format: `Bearer <token>`

### Google OAuth Issues

1. Check Google Console credentials
2. Verify redirect URIs are configured
3. Ensure `GOOGLE_CLIENT_ID` matches frontend

## 📈 Next Steps

1. **Add Document Generation**
   - Cover letter generation
   - SOP generation
   - LinkedIn bio generation

2. **Add Job Tracker**
   - Application status tracking
   - Interview scheduling
   - Offer management

3. **Add AI Features**
   - ATS score calculation
   - Resume tailoring
   - Keyword extraction

4. **Add Payment Integration**
   - Stripe integration
   - Subscription management
   - Credit purchase

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- **Documentation**: `docs/API.md`
- **Email**: support@careerforge.ai
- **GitHub**: https://github.com/careerforge/backend

---

Built with ❤️ using Node.js + Express + PostgreSQL + Prisma
