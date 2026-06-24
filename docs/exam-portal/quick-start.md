---
id: quick-start
title: Quick Start
---

# Quick Start

Get up and running with the Exam Portal in 5 minutes.

## TL;DR

```bash
# Clone and setup
git clone <repo> && cd exam-portal-ns

# Configure
cd backend && cp .env.example .env  # Edit with credentials
cd ../frontend && cp .env.example .env

# Install and start
npm install
npm run dev

# Visit http://localhost:5173
```

## Create Your First Exam

### 1. Login
- Navigate to `http://localhost:5173`
- Sign in with your Firebase account or test credentials

### 2. Create Question Bank
1. Go to Admin Dashboard
2. Navigate to "Question Banks"
3. Click "Create New" and add questions
4. Organize into folders

### 3. Create Exam
1. Go to "Exams"
2. Click "Create Exam"
3. Configure:
   - Exam name and description
   - Timer duration
   - Question count
   - Difficulty settings
   - Marking scheme

### 4. Add Questions to Exam
1. Select exam
2. Click "Add Questions"
3. Choose from question bank
4. Arrange question order

### 5. Publish Exam
1. Review exam settings
2. Click "Publish"
3. Share link with students

## Taking an Exam (Student View)

### Via Exam Link
1. Click exam share link
2. Enter details if required
3. Review instructions
4. Click "Start Exam"
5. Answer questions
6. Submit when complete

## View Results

### As Admin
- Dashboard → Analytics
- Filter by date, student, exam
- Export reports

### As Student
- My Tests → View Results
- Download detailed report (XLSX)
- Review answers

## Next Steps

- [Architecture Overview](/exam-portal/architecture)
- [API Reference](/exam-portal/api-reference)
- [Deployment Guide](/exam-portal/deployment-guide)
