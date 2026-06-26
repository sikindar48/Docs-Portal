---
id: quick-start
title: Quick Start
---

# Quick Start Guide

Get up and running with the NS Internship Portal in minutes.

## Prerequisites

- Node.js 18+ and npm
- Supabase account (for PostgreSQL database)
- Razorpay account (for payment processing - optional for testing)
- Resend SMTP account (for email sending - optional for testing)
- Cloudinary account (for file storage - optional for testing)

## Step 1: Clone the Repository

```bash
git clone https://github.com/ns-software-solutions/internship-portal.git
cd internship-portal
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required environment variables:**

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret (REQUIRED - app will not start without it)
JWT_SECRET=your-super-secret-jwt-key-generate-with-openssl-rand-base64-32

# Optional but recommended
NEXT_PUBLIC_BASE_URL=https://internships.yourdomain.com

# Email (optional - for production)
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASS=re_your-key

# Payment (optional - for production)
RAZORPAY_KEY_ID=rzp_your-key
RAZORPAY_KEY_SECRET=your-secret

# Storage (optional - for production)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Cron Job Secret (REQUIRED for cron endpoints)
CRON_SECRET=your-cron-secret-generate-with-openssl-rand-base64-32
```

## Step 4: Set Up the Database

1. Create a new database in Supabase
2. Run migrations in the following order:
   - `supabase/schema.sql` (core tables)
   - `supabase/schema_extensions.sql` (milestones, coupons, etc.)
   - All files in `supabase/migrations/` in chronological order
3. Enable Row Level Security (RLS) on tables

## Step 5: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 6: Test the Application

Use test credentials from `md/TEST_CREDENTIALS.md` to log in:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | superadmin@nss.dev | SuperAdmin@2026 |
| **Admin** | admin@nss.dev | Admin@2026 |
| **Student** | student@nss.dev | Student@2026 |

## Common Development Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run all tests
npm test

# Run specific test suite
npm run test:auth
npm run test:student
npm run test:admin
npm run test:api
```

## What's Next?

- Read [Installation](/internship-portal/installation) for detailed setup
- Read [Architecture](/internship-portal/architecture) to understand system design
- Read [API Reference](/internship-portal/api-reference) for integration
- Read [Database Schema](/internship-portal/database-schema) for data structure
