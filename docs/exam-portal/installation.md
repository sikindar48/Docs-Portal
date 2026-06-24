---
id: installation
title: Installation Guide
---

# Installation Guide

Detailed step-by-step instructions for installing and configuring the Exam Portal.

## System Requirements

### Minimum Requirements
- Node.js 18.x LTS or higher
- npm 9.x or higher (or yarn 3.x)
- 2GB RAM
- 500MB free disk space

### Recommended Requirements
- Node.js 22.x LTS
- npm 10.x
- 4GB+ RAM
- 2GB+ free disk space
- SSD storage for better performance

## Installation Steps

### Step 1: Clone Repository

```bash
git clone https://github.com/ns-software-solutions/exam-portal.git
cd exam-portal-ns
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (root level)
npm install

# Or install individually
cd frontend && npm install
cd ../backend && npm install
```

### Step 3: Configure Environment

**Backend Configuration:**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

**Frontend Configuration:**
```bash
cd ../frontend
cp .env.example .env
# Edit .env with API endpoint
```

### Step 4: Initialize Database

```bash
cd ../backend
npm run migrate:latest
npm run seed:data  # Optional: populate with sample data
```

### Step 5: Verify Installation

```bash
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev

# Visit http://localhost:5173
```

## Docker Installation

```dockerfile
# Build Docker image
docker build -t exam-portal:latest -f backend/Dockerfile .

# Run container
docker run -p 8082:8082 \
  -e TURSO_CONNECTION_URL="your_url" \
  -e TURSO_AUTH_TOKEN="your_token" \
  exam-portal:latest
```

## Production Setup

See [Deployment Guide](/exam-portal/deployment-guide) for production installation and configuration.
