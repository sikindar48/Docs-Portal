---
id: installation
title: Installation & Setup
---

# Installation & Setup

Complete step-by-step installation guide for NS Software Solutions website.

## System Requirements

### Operating System
- **macOS:** 10.15+ (Intel or Apple Silicon)
- **Linux:** Ubuntu 18.04+, CentOS 7+
- **Windows:** 10 or later (WSL2 recommended)

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.0+ | JavaScript runtime |
| npm | 9.0+ | Package manager |
| Git | 2.30+ | Version control |

### Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | Latest | ✅ Full |
| IE 11 | Any | ❌ Not supported |

## Step-by-Step Installation

### Step 1: Install Node.js and npm

#### On macOS (using Homebrew)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

#### On Ubuntu/Debian Linux

```bash
# Update package manager
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

#### On Windows

1. Download installer from [nodejs.org](https://nodejs.org)
2. Choose LTS (Long Term Support) version
3. Run installer and follow prompts
4. Open Command Prompt and verify:
   ```cmd
   node --version
   npm --version
   ```

### Step 2: Clone Repository

```bash
# Create a directory for projects
mkdir projects
cd projects

# Clone the repository
git clone https://github.com/nssoftwaresolutions/academixpro.git

# Navigate to project directory
cd academixpro
```

### Step 3: Install Dependencies

```bash
# Install all project dependencies
npm install

# This will:
# - Create node_modules folder
# - Download 50+ npm packages
# - Install Vite, React, Tailwind, etc.
# - May take 2-5 minutes

# Verify installation
npm list --depth=0
```

### Step 4: Create Environment File

```bash
# Copy example to .env
cp .env.example .env

# Open in editor and add your values
# On macOS:
nano .env

# On Linux:
nano .env

# On Windows Command Prompt:
notepad .env
```

#### Environment Variables Reference

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### Step 5: Configure Supabase

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up / Sign in
4. Create new project:
   - Project Name: "NS Software Solutions" (or your name)
   - Database Password: Strong password (save somewhere safe)
   - Region: Closest to your location
   - Click "Create new project"
5. Wait for project to initialize (2-3 minutes)

#### Get API Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** → paste into `VITE_SUPABASE_URL`
   - **anon public** → paste into `VITE_SUPABASE_ANON_KEY`
3. Save `.env` file

#### Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste migration SQL from `supabase/migrations/` folder
4. Click "Run" button
5. Repeat for all migration files

**Or use Supabase CLI:**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to Supabase project
supabase link --project-ref your-project-ref

# Run migrations
supabase migration up
```

### Step 6: Start Development Server

```bash
# Start development server
npm run dev

# You should see output like:
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

### Tailwind CSS

Tailwind is already configured. To customize:

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#YOUR_COLOR',
      },
    },
  },
}
```

### TypeScript

Configuration in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "strict": true,
    "module": "ESNext"
  }
}
```

### Vite Build Tool

Configuration in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
```

## Database Setup

### Tables to Create

Run in Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  role text DEFAULT 'user',
  is_online boolean DEFAULT false,
  last_active_at timestamptz,
  is_active boolean DEFAULT true,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL UNIQUE,
  description text NOT NULL,
  short_description text,
  full_description text,
  technologies text[] DEFAULT '{}',
  screenshots text[],
  price numeric(10,2),
  show_price boolean DEFAULT true,
  slug text UNIQUE,
  featured boolean DEFAULT false,
  ieee boolean DEFAULT false,
  documentation_addon boolean DEFAULT false,
  status text DEFAULT 'active',
  visibility text DEFAULT 'published',
  meta_description text,
  meta_keywords text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- (Additional tables as documented in Database Schema)
```

**Or use migration files:**
All table creation scripts are in `supabase/migrations/` folder.

### Enable Row Level Security

For each table:

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies (examples)
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- (More policies as documented)
```

### Create Indexes

For performance:

```sql
-- Profiles indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Projects indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);

-- (More indexes as documented in Database Schema)
```

## Production Build

### Build for Production

```bash
# Create optimized production build
npm run build

# This generates:
# - dist/ folder with optimized files
# - Minified JavaScript and CSS
# - Compressed assets
# - Ready for deployment
```

### Test Production Build Locally

```bash
# Build production files
npm run build

# Start local preview server
npm run preview

# Visit http://localhost:4173 to test
```

## Deployment Configuration

### Environment for Production

Create `.env.production`:

```env
VITE_SUPABASE_URL=https://prod-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key-here
VITE_APP_URL=https://www.nssoftwaresolutions.in
```

### Build Optimization

In `vite.config.ts`:

```typescript
build: {
  outDir: 'dist',
  minify: 'terser',
  sourcemap: false,  // Disable in production
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom'],
      },
    },
  },
}
```

## Docker Setup (Optional)

For containerized development:

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

Build and run:

```bash
# Build image
docker build -t academixpro .

# Run container
docker run -p 5173:5173 -e VITE_SUPABASE_URL=xxx academixpro
```

## Troubleshooting Installation

### Issue: npm command not found

**Solution:**
```bash
# Reinstall Node.js from nodejs.org
# Restart terminal/console
# Run: npm --version
```

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process using port (macOS/Linux)
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

### Issue: Cannot connect to Supabase

**Solution:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Check Supabase project is active
- Verify network connectivity
- Check browser console for error messages

### Issue: Module not found errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors on build

**Solution:**
```bash
# Check all TypeScript errors
npm run type-check

# Fix linting issues
npm run lint --fix
```

## Next Steps

1. **Verify Installation:**
   - Open [http://localhost:5173](http://localhost:5173)
   - Browse projects (should show database data)
   - Create test user account

2. **Read Documentation:**
   - [Quick Start Guide](/ns-website/quick-start)
   - [Architecture](/ns-website/architecture)
   - [Database Schema](/ns-website/database-schema)

3. **Customize Platform:**
   - Update branding (logo, colors)
   - Add your projects
   - Configure email settings
   - Set up analytics

4. **Deploy to Production:**
   - Follow [Deployment Guide](/ns-website/deployment)



---

## Navigation

<div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>

[← Quick Start](/docs/ns-website/quick-start) | [→ System Architecture](/docs/ns-website/architecture)

</div>