---
id: database-schema
title: Database Schema
---

# Database Schema

Complete reference for the Exam Portal database structure powered by Turso (libSQL).

## Overview

The database implements a multi-tenant schema with support for comprehensive exam lifecycle management, subscription billing, and audit tracking.

## Core Tables

### Clients
Organization/tenant management
```sql
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  logo_url TEXT,
  active_status INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Profiles
User account information
```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  client_id TEXT REFERENCES clients(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Tests
Exam definitions
```sql
CREATE TABLE tests (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  test_name TEXT NOT NULL,
  timer INTEGER,
  shuffle INTEGER DEFAULT 0,
  allow_review INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Questions
Question bank
```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options TEXT,
  correct_answer TEXT,
  marks INTEGER DEFAULT 1,
  difficulty TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Attempts
Student exam attempts
```sql
CREATE TABLE attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES profiles(id),
  test_id TEXT NOT NULL REFERENCES tests(id),
  score REAL,
  total_marks REAL,
  started_at TEXT,
  submitted_at TEXT,
  status TEXT DEFAULT 'in_progress',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Attempt Answers
Student answers tracking
```sql
CREATE TABLE attempt_answers (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES attempts(id),
  question_id TEXT NOT NULL REFERENCES questions(id),
  student_answer TEXT,
  is_correct INTEGER,
  marks_obtained REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Subscription & Billing

### Subscription Plans
```sql
CREATE TABLE subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  monthly_price REAL,
  features TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Client Subscriptions
```sql
CREATE TABLE client_subscriptions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Audit & Compliance

### Audit Logs
```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  changes TEXT,
  ip_address TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

Important indexes for performance:
```sql
CREATE INDEX idx_profiles_client_id ON profiles(client_id);
CREATE INDEX idx_tests_client_id ON tests(client_id);
CREATE INDEX idx_questions_client_id ON questions(client_id);
CREATE INDEX idx_attempts_student_id ON attempts(student_id);
CREATE INDEX idx_attempts_test_id ON attempts(test_id);
CREATE INDEX idx_attempt_answers_attempt_id ON attempt_answers(attempt_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Relationships

Key entity relationships:
- **Client → Profiles**: One-to-many (organizations have multiple users)
- **Client → Tests**: One-to-many (organizations create multiple exams)
- **Test → Attempts**: One-to-many (exams can have multiple student attempts)
- **Attempt → Attempt Answers**: One-to-many (attempts contain multiple answers)
- **Client → Subscriptions**: One-to-many (subscription management)

## Multi-Tenancy Strategy

All main tables include `client_id` field ensuring:
- Complete data isolation between organizations
- Row-level security enforcement
- BOLA/IDOR protection
- Efficient multi-tenant queries

## Backup & Recovery

- Turso provides automatic daily backups
- Point-in-time recovery available
- Database replication across regions
- See [Monitoring & Operations](/exam-portal/monitoring-and-operations) for details

## Next Steps

- [API Reference](/exam-portal/api-reference)
- [Architecture](/exam-portal/architecture)
- [Security Guide](/exam-portal/security-and-exam-integrity)
