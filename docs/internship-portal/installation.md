---
id: installation
title: Installation Guide
---

# Installation Guide

Complete step-by-step installation instructions for the NS Internship Portal.

## System Requirements

| Component | Minimum Version | Notes |
|-----------|-----------------|-------|
| Node.js | 18.x | Recommended: 18.17.0+ |
| npm | 9.x | Recommended: 9.6.7+ |
| PostgreSQL | 14.x | Supabase provides this |
| Git | 2.30.x | For version control |

## Prerequisites

### 1. Supabase Setup

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Note your project URL and API keys from Settings → API
3. Create a new database in the SQL Editor

### 2. Email Service Setup

**Recommended: Resend (Free tier available)**

1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key from Settings → API Keys
3. Set up a verified sender email

### 3. Payment Gateway Setup (Optional for testing)

**Recommended: Razorpay**

1. Create an account at [https://razorpay.com](https://razorpay.com)
2. Get your test API keys from Dashboard → Settings → API Keys
3. Note: Use test mode keys during development

### 4. File Storage Setup (Optional for testing)

**Recommended: Cloudinary**

1. Create an account at [https://cloudinary.com](https://cloudinary.com)
2. Get your credentials from Dashboard → Overview
3. Configure CORS settings if using browser uploads

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/ns-software-solutions/internship-portal.git
cd internship-portal
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`:

- Next.js 14 with App Router
- React 18
- TypeScript 5
- Supabase client
- Razorpay SDK
- Nodemailer for email
- PDFKit for PDF generation
- Jitsi Meet SDK for webinars
- Playwright for E2E testing
- And more...

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example
cp .env.example .env

# Or create manually with nano/vim
nano .env
```

**Required variables:**

```env
# Application
NODE_ENV=development

# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT (REQUIRED - app will throw error if missing)
JWT_SECRET=your-super-secret-jwt-key

# Cron Secret (REQUIRED for cron endpoints)
CRON_SECRET=your-cron-secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email (OPTIONAL - but recommended)
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASS=re_your-api-key
EMAIL_FROM=onboarding@resend.dev

# Payment (OPTIONAL)
RAZORPAY_KEY_ID=rzp_test_your-key
RAZORPAY_KEY_SECRET=your-secret

# Cloudinary (OPTIONAL)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Contact Email (for contact form)
CONTACT_EMAIL=info.nssoftwaresolutions@gmail.com

# GST Rate (OPTIONAL - defaults to 0.18)
GST_RATE=0.18
```

### Step 4: Database Setup

**Option A: Using Supabase SQL Editor**

1. Open Supabase SQL Editor
2. Run migrations in order:

```sql
-- 1. Core tables
supabase/schema.sql
supabase/schema_extensions.sql

-- 2. Admin activity logs
supabase/migrations/create_admin_activity_logs.sql

-- 3. Rate limiting and soft delete
supabase/migrations/rate_limit_and_soft_delete.sql

-- 4. Invoices table
supabase/migrations/create_invoices_table.sql
supabase/migrations/alter_invoices_table.sql

-- 5. Internship resources
supabase/migrations/internship_resources.sql

-- 6. Jobs cache
supabase/migrations/20240320_jobs_cache.sql

-- 7. Constraints
supabase/migrations/add_cancelled_enrollment_status.sql
supabase/migrations/add_rejected_milestone_status.sql

-- 8. Performance indexes
supabase/migrations/add_performance_indexes.sql
supabase/migrations/add_milestone_rls_policies.sql
supabase/migrations/fix_rls_recent_admin_activity_site_settings.sql

-- 9. JWT refresh tokens
supabase/migrations/create_refresh_tokens.sql

-- 10. Email tracking
supabase/migrations/create_email_logs.sql

-- 11. Enhanced announcements
supabase/migrations/extend_announcements.sql

-- 12. Last login tracking
supabase/migrations/add_last_login.sql

-- 13. Milestone optimization
supabase/migrations/optimize_milestone_queries.sql

-- 14. Email queue
supabase/migrations/create_email_queue.sql

-- 15. Additional indexes
supabase/add_indexes_migration.sql

-- 16. Certificate templates
supabase/certificate_templates.sql

-- 17. GST migration
supabase/invoice_gst_migration.sql

-- 18. Safe migration
supabase/safe_migration.sql

-- 19. Newsletter subscribers
supabase/migrations/newsletter_subscribers.sql
```

**Option B: Using Supabase CLI**

```bash
# Install CLI globally
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 5: Enable Row Level Security (RLS)

RLS is enabled by default in the schema. Verify with:

```sql
SELECT relname, relrowsecurity
FROM pg_class
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE nspname = 'public'
AND relrowsecurity = true;
```

### Step 6: Set Up Vercel Cron (for production)

Create or update `vercel.json` with cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-emails",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/inactive-students",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/deadline-reminders",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/job-alerts",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### Step 7: Start the Application

**Development mode:**

```bash
npm run dev
```

The app will start at `http://localhost:3000`

**Production mode:**

```bash
npm run build
npm start
```

## Environment-Specific Configuration

### Development Environment

```env
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Staging Environment

```env
NODE_ENV=staging
NEXT_PUBLIC_BASE_URL=https://staging.internships.yourdomain.com
```

### Production Environment

```env
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://internships.yourdomain.com
```

## Troubleshooting

### Common Issues

**1. App throws "JWT_SECRET is missing"**

Solution: Ensure `JWT_SECRET` is set in `.env`

**2. Database connection failed**

Solution: Verify Supabase URL and keys are correct

**3. Email sending fails**

Solution: Check Resend API key and email configuration

**4. File uploads fail**

Solution: Verify Cloudinary credentials are set

**5. Google OAuth not working**

Solution: Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

### Getting Help

- Check logs: `npm run dev` shows detailed error messages
- Review [Troubleshooting](#) documentation
- Contact support: info.nssoftwaresolutions@gmail.com

## Next Steps

After installation:

1. [Configuration](#) - Fine-tune your setup
2. [Testing](#) - Verify everything works
3. [Deployment](#) - Go live
