---
id: quick-start
title: Quick Start Guide
---

# Quick Start Guide

Get up and running with NS Software Solutions website in minutes.

## Prerequisites

- **Node.js:** v18+ (check with `node --version`)
- **npm:** v9+ (check with `npm --version`)
- **Git:** Latest version
- **Supabase account:** [supabase.com](https://supabase.com)
- **Netlify account** (for deployment): [netlify.com](https://netlify.com)

## Project Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/nssoftwaresolutions/academixpro.git
cd academixpro
```

### 2. Install Dependencies

```bash
npm install
```

This installs 50+ dependencies including React, Vite, TypeScript, Tailwind CSS, and Supabase.

### 3. Set Up Environment Variables

Copy the example file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=http://localhost:5173
```

**How to get these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Copy URL and Anon Key from Settings → API

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**What you should see:**
- Homepage with hero section
- Navigation bar with links
- Project catalog on home page
- No errors in console

## Testing the Platform

### As a Guest User

1. **Browse Projects**
   - Click "Explore Projects" on homepage
   - Use filters (Domain, Price, Technology)
   - Click on a project card to view details

2. **Submit Inquiry**
   - On project details, click "WhatsApp" or "Email"
   - Fill name, email, phone
   - Confirm and you'll be redirected

3. **View Services**
   - Navigate to Services page
   - View FAQ accordion
   - Fill and submit service request form

4. **Read Blog**
   - Click Blog in navigation
   - Read any of the 3 published posts

### As a Registered User

1. **Sign Up**
   - Click "Login" in top-right
   - Choose "Sign Up" option
   - Enter email and password
   - Email confirmation required (check spam folder)

2. **View Dashboard**
   - After login, redirected to `/user/dashboard`
   - See stats (0 purchases, etc.)
   - Click quick action buttons

3. **Request Custom Project**
   - Go to "Request Project"
   - Select a project
   - Choose request type (Purchase, Demo, etc.)
   - Write custom message
   - Submit

4. **View Profile**
   - Click "Profile" in sidebar
   - View/edit name and contact info
   - Check session activity

### As an Admin User

To access admin panel, you need admin role in database.

**Set Admin Role (One-Time Setup):**

1. Go to Supabase Dashboard → SQL Editor
2. Run:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```
3. Sign out and sign in again
4. Navigate to `/admin`

**Admin Features to Test:**

- **Dashboard:** View stats and recent activity
- **Projects:** Create/edit/delete projects, upload screenshots
- **Purchases:** Create purchase for user + attach files
- **Requests:** View and respond to all request types
- **Users:** See all registered users and their activity

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Format code (if configured)
npm run format

# Type check
npm run type-check
```

## Project Structure

```
academixpro/
├── src/
│   ├── components/      # React components (UI, pages, layouts)
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React Context (AuthContext)
│   ├── lib/            # Utilities (auth, validation, API)
│   ├── config/         # Constants and configuration
│   ├── integrations/   # Supabase client setup
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── public/             # Static assets (images, favicon, etc)
├── Doc/               # Project documentation
├── .env.example       # Environment variables template
├── vite.config.ts    # Vite configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

## Troubleshooting

### Issue: "Cannot find module 'supabase'"

**Solution:** Run `npm install` again

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "VITE_SUPABASE_URL is not defined"

**Solution:** Ensure `.env` file exists with proper variables

```bash
# Check if .env exists
cat .env

# If not, create it from template
cp .env.example .env

# Edit .env with your Supabase credentials
```

### Issue: Cannot sign up / "Email already exists"

**Solution:** Supabase might have rate limiting or the email is already used

- Use a different email address
- Check Supabase dashboard for the user
- Clear browser cookies and try again

### Issue: Admin panel shows "Unauthorized"

**Solution:** Your user role is not set to 'admin'

- Run the SQL command above to set admin role
- Sign out completely and sign in again
- Check `profiles` table to verify role = 'admin'

### Issue: Screenshots not showing on projects

**Solution:** Supabase Storage URL might be wrong

- Check Supabase Storage bucket configuration
- Verify bucket policies allow public read access
- Re-upload screenshot and verify URL format

### Issue: Project not building - TypeScript errors

**Solution:** Fix type errors before building

```bash
# Check all TypeScript errors
npm run type-check

# Fix common issues
npm run lint --fix
```

## Next Steps

After getting the basics working:

1. **Read Full Documentation**
   - [Architecture Guide](/ns-website/architecture)
   - [Database Schema](/ns-website/database-schema)
   - [API Reference](/ns-website/api-reference)

2. **Customize for Your Use**
   - Update company logo and colors
   - Modify project domains (if needed)
   - Configure email templates
   - Add your contact information

3. **Deploy to Production**
   - Follow [Deployment Guide](/ns-website/deployment)
   - Set up custom domain
   - Configure DNS and SSL
   - Set up monitoring and analytics

4. **Add More Features**
   - Modify feature set based on your needs
   - Add new pages or sections
   - Integrate with external services
   - Implement custom workflows

## Support & Resources

- **Documentation:** [https://docs.nssoftwaresolutions.in](https://docs.nssoftwaresolutions.in)
- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **React Docs:** [https://react.dev](https://react.dev)
- **Tailwind CSS:** [https://tailwindcss.com](https://tailwindcss.com)

---

## Navigation

<div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>

[← Back to Overview](/docs/ns-website/overview) | [→ Installation Guide](/docs/ns-website/installation)

</div>

