# 🚀 Quick Start Guide - CareerForge Backend

Get up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js 20+ installed
- PostgreSQL database running
- Terminal/Command prompt

## 📦 Step 1: Extract & Install

```bash
# Extract the archive
tar -xzf careerforge-backend.tar.gz
cd careerforge-backend

# Install dependencies
npm install
```

## 🗄️ Step 2: Setup PostgreSQL Database

### Option A: Local PostgreSQL

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE careerforge;

# Exit
\q
```

### Option B: Docker PostgreSQL

```bash
docker run --name careerforge-db \
  -e POSTGRES_DB=careerforge \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:16
```

## ⚙️ Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

**Minimum required configuration:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/careerforge?schema=public"
JWT_SECRET=mysecretkey123
JWT_REFRESH_SECRET=myrefreshkey456
FRONTEND_URL=http://localhost:3000
```

**For Google OAuth (optional):**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add to `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## 🔨 Step 4: Setup Database Schema

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

## 🎯 Step 5: Start Server

```bash
# Development mode (with hot reload)
npm run dev
```

You should see:

```
🚀 CareerForge API Server
━━━━━━━━━━━━━━━━━━━━━━━━
📡 Port: 5000
🌍 Environment: development
🔗 Health: http://localhost:5000/health
📚 API: http://localhost:5000/api
━━━━━━━━━━━━━━━━━━━━━━━━
```

## ✅ Step 6: Test API

### Using cURL

```bash
# Check health
curl http://localhost:5000/health

# Create account
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

### Using Postman

1. Open Postman
2. Import collection: `docs/CareerForge-API.postman_collection.json`
3. Set `baseUrl` variable to `http://localhost:5000`
4. Run "Signup" request
5. Token will auto-save, ready to use other endpoints!

## 🎉 You're Done!

Your backend is now running at `http://localhost:5000`

## 📚 Next Steps

1. **Read API docs**: `docs/API.md`
2. **View database**: `npm run prisma:studio`
3. **Connect frontend**: Update frontend `.env` to point to `http://localhost:5000`

## 🐛 Troubleshooting

### Error: Database connection failed

```bash
# Check PostgreSQL is running
pg_isready

# Or for Docker
docker ps | grep postgres
```

### Error: Port 5000 already in use

Change port in `.env`:

```env
PORT=3001
```

### Error: Prisma client not generated

```bash
npm run prisma:generate
```

### View detailed logs

```bash
# Set to development mode
NODE_ENV=development npm run dev
```

## 🔥 Common Tasks

```bash
# View database in browser
npm run prisma:studio

# Reset database (CAREFUL - deletes all data)
npm run prisma:migrate reset

# Build for production
npm run build

# Start production server
npm start
```

## 📞 Need Help?

- Check `README.md` for full documentation
- Read `docs/API.md` for endpoint details
- Use Postman collection for testing

---

**Happy Coding! 🚀**
