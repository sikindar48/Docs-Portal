---
id: getting-started
title: Getting Started
---

# Getting Started with Exam Portal

This guide will help you set up the Exam Portal locally for development or review the cloud deployment architecture.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm
- A Firebase project with Admin SDK credentials
- Turso database instance and authentication token
- Git for cloning the repository
- Docker (optional, for containerization)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd exam-portal-ns
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit backend/.env with your credentials:
# - TURSO_CONNECTION_URL
# - TURSO_AUTH_TOKEN
# - FIREBASE_SERVICE_ACCOUNT_JSON (base64 encoded)
npm install
```

### 3. Configure Frontend

```bash
cd ../frontend
cp .env.example .env
# Edit frontend/.env with:
# - VITE_FIREBASE_CONFIG
# - VITE_API_URL (http://localhost:8082 for local development)
npm install
```

### 4. Start Development Servers

**Terminal 1 - Backend (Port 8082):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## Development Commands

```bash
# From root directory
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start backend only
npm run build           # Build for production
npm run preview         # Preview production build
```

## Project Structure

```
exam-portal-ns/
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── App.tsx      # Main component
│   └── package.json
├── backend/             # Express + Node.js API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation
│   │   ├── db/          # Database client
│   │   └── server.ts    # Express app
│   └── package.json
└── Documentation/       # Technical docs
```

## Environment Variables

### Backend (.env)

```env
PORT=8082
NODE_ENV=development

# Database
TURSO_CONNECTION_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token

# Firebase Admin SDK (base64 encoded JSON)
FIREBASE_SERVICE_ACCOUNT_JSON=eyJ...

# Optional
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8082
VITE_FIREBASE_CONFIG={"apiKey":"...","projectId":"..."}
VITE_APP_ENV=development
```

## Testing Your Setup

1. Open http://localhost:5173 in your browser
2. Sign in with test credentials from your Firebase project
3. Create a test exam from the admin dashboard
4. Take a test as a student
5. View results and analytics

## Next Steps

- Explore the [Architecture](/exam-portal/architecture) to understand system design
- Review [API Reference](/exam-portal/api-reference) for available endpoints
- Check [Security Guide](/exam-portal/security-and-exam-integrity) for security best practices
- Read [Deployment Guide](/exam-portal/deployment-guide) for production setup

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 8082
lsof -ti:8082 | xargs kill -9
```

### Database Connection Issues
- Verify TURSO_CONNECTION_URL is correct
- Check TURSO_AUTH_TOKEN is valid
- Test connection: `curl https://your-db.turso.io`

### Firebase Authentication Failed
- Verify FIREBASE_SERVICE_ACCOUNT_JSON is base64 encoded
- Check Firebase project is active
- Confirm service account has correct permissions

### Module Not Found Errors
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Support

For additional help, refer to:
- [Troubleshooting Guide](/exam-portal/troubleshooting)
- [API Reference](/exam-portal/api-reference)
- [Architecture Documentation](/exam-portal/architecture)
