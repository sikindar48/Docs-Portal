---
id: security-and-exam-integrity
title: Security & Exam Integrity
---

# Security & Exam Integrity

## Overview

The Exam Portal implements enterprise-grade security measures to protect exam integrity, prevent cheating, and ensure data confidentiality. This document details all security controls, proctoring features, and compliance measures.

## Authentication Security

### Firebase Authentication

- **Primary Auth Provider**: Firebase Authentication with email/password and anonymous auth
- **JWT Tokens**: Firebase ID tokens validated on every API request via `Authorization: Bearer <token>`
- **Token Lifetime**: 1-hour tokens with automatic refresh
- **Guest Access**: Anonymous authentication for guest candidates, with `attempt_token` for all operations

### Authentication Flow

```
Student/Admin Login → Firebase Auth → ID Token → Backend Verification → Role Resolution
      │                     │                │              │                 │
      │                     │                │              │                 └──► Access Granted with Roles
      │                     │                │              │
      │                     │                │              └──► Token Signature Validation
      │                     │                │
      │                     └──► Firebase Project Validation
      │
Guest Candidate → Share Code → Anonymous Auth → Temporary Profile → Attempt Creation
```

### Security Features

- **Token Validation**: Backend validates Firebase project ID and token signature
- **Revocation Detection**: Tokens checked for revocation status
- **Session Management**: Client-side token refresh before expiry
- **Logout Clearing**: Local storage and state cleared on logout

## Authorization & Access Control

### Role-Based Access Control (RBAC)

Four distinct roles with granular permissions:

- **Super Admin**: Full system access, tenant management, billing
- **Client Admin**: Organization-level control, test creation, analytics
- **Student**: Limited to own exams and results
- **Guest**: Anonymous access via share code only

### Multi-Tenant Isolation

Every record includes `client_id` for complete data isolation:

```sql
-- Only users from same organization can access
SELECT * FROM tests
WHERE id = $testId
AND client_id = $userClientId
```

### BOLA/IDOR Prevention

#### Attempt Access Control

```typescript
// Example from attempts.ts route handler
if (!isSuper) {
  if (isClientAdmin) {
    const callerClientId = await getUserClientId(user.id);
    if (row.test_client_id !== callerClientId) {
      return res.status(403).json({ error: "Permission denied" });
    }
  } else {
    // Student / Guest
    if (row.student_id !== user.id) {
      return res.status(403).json({ error: "Permission denied" });
    }
    const isGuest = await isGuestStudent(row.student_id);
    if (isGuest) {
      const headerToken =
        req.headers["x-attempt-token"] || req.query.attempt_token;
      if (!headerToken || row.attempt_token !== headerToken) {
        return res
          .status(403)
          .json({ error: "Permission denied: Invalid attempt token" });
      }
    }
  }
}
```

#### Test Access Control

- **Published Tests**: Only accessible if `public_link_enabled = 1` or user belongs to tenant
- **Draft Tests**: Only accessible to client admins of the tenant
- **Scheduled Tests**: Time window enforcement at attempt creation
- **Guest Tests**: Requires valid share code and `allow_guests = 1`

#### IDOR Mitigation Patterns

1. **Always Verify Ownership**: Never trust client-provided IDs without validation
2. **Join-Based Verification**: Use SQL joins to verify relationships
3. **Middleware Protection**: Role-based middleware for admin endpoints
4. **Guest Token Requirement**: `attempt_token` required for all guest operations

## Exam Integrity

### Proctoring Features

**Event Types & Severity Scoring:**

| Event Type                 | Severity | Score | Evidence Required | Description                     |
| -------------------------- | -------- | ----- | ----------------- | ------------------------------- |
| `TAB_SWITCH`               | LOW      | 1     | No                | Candidate switched browser tabs |
| `WINDOW_BLUR`              | LOW      | 1     | No                | Browser window lost focus       |
| `FULLSCREEN_EXIT`          | MEDIUM   | 2     | No                | Fullscreen mode exited          |
| `NO_FACE`                  | MEDIUM   | 3     | Yes               | No face detected in camera      |
| `MULTIPLE_FACES`           | HIGH     | 5     | Yes               | Multiple faces detected         |
| `CAMERA_DISCONNECTED`      | HIGH     | 5     | Yes               | Camera disconnected during exam |
| `CAMERA_PERMISSION_DENIED` | HIGH     | 5     | No                | Camera permission denied        |

#### Implementation Details

**Client-Side Detection:**

```javascript
const proctoringEvents = {
  detectTabSwitch: () => {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        logProctoringEvent("TAB_SWITCH", { duration: 1 });
      }
    });
  },
  detectFullscreenExit: () => {
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        logProctoringEvent("FULLSCREEN_EXIT", {});
      }
    });
  },
  detectCameraEvents: async (videoElement) => {
    // TensorFlow.js face detection
    const faces = await faceDetection.detect(videoElement);
    if (faces.length === 0) {
      logProctoringEvent("NO_FACE", { evidence: captureFrame(videoElement) });
    } else if (faces.length > 1) {
      logProctoringEvent("MULTIPLE_FACES", {
        evidence: captureFrame(videoElement),
      });
    }
  },
};
```

**Server-Side Processing:**

- **Event Deduplication**: 30-second window for same event types
- **Risk Scoring**: Cumulative score with severity weights
- **Evidence Storage**: Base64 images → Firebase Storage with signed URLs (15-minute expiry)
- **Auto-Submit Logic**: 15+ risk score triggers auto-submission (3-strike system)
- **Feature Gating**: Basic events require `advanced_proctoring`, camera requires `camera_proctoring`

### Question Security

- Question shuffling to prevent memorization
- Answer option randomization per question
- Answer encryption during storage
- Prevent question exporting

### Timer Enforcement

- **Test-Level Timer**: Overall exam duration in minutes
- **Section-Level Timer**: Optional per-section timers override test timer
- **Server-Side Validation**: Timer validation on submission
- **Auto-Submission**: Timer expiry, proctoring violations (15+ risk score), network disconnection

### Section Locking

- **Navigation Lock**: Prevents returning to completed sections
- **Server Enforcement**: Backend validates section progression
- **Timer Integration**: Section timer expiry auto-advances to next section

```typescript
// Section lock validation in attempt-answers.ts
const sectionCheck = await db.execute({
  sql: `SELECT ts.navigation_locked, ts.duration_minutes,
         (SELECT COUNT(*) FROM attempt_answers aa2 
          WHERE aa2.attempt_id = ? AND aa2.question_id IN 
          (SELECT tq.question_id FROM test_questions tq WHERE tq.section_id = ts.id)
         ) as answered_in_section
        FROM test_sections ts
        JOIN test_questions tq ON tq.section_id = ts.id
        WHERE tq.question_id = ?`,
  args: [attemptId, questionId],
});

if (sectionCheck.rows.length > 0) {
  const section = sectionCheck.rows[0];
  if (section.navigation_locked === 1 && section.answered_in_section > 0) {
    return res.status(403).json({ error: "Section navigation locked" });
  }
}
```

### Scoring Security

- **Server-Side Only**: All grading in `POST /api/rpc/submit-attempt`
- **Score Floored**: Scores cannot go below 0
- **Result Publication**: `result_status` controls visibility (`draft`/`published`)
- **Score Masking**: Hidden until `show_results_after_submission = 1` AND `result_status = 'published'`

## Rate Limiting & Abuse Prevention

```typescript
// Global limiter: 1000 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// Strict limiter: 100 requests per minute for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
```

**Protected Endpoints:**

- `/api/create-user` (user registration)
- `/api/attempts` (attempt creation)
- `/api/attempt-answers` (answer saving)
- `/api/proctoring/events` (proctoring events)
- `/api/rpc/submit-attempt` (exam submission)

## API Security

### Input Validation

- All inputs validated via Zod schemas before processing
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- CSRF token validation

### CORS & HTTPS

```typescript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://test.nssoftwaresolutions.in",
  "https://exam-portal-ns-*.run.app",
  "https://*.firebaseapp.com",
  "https://*.pages.dev",
];
```

### Security Headers

```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Cross-Origin-Opener-Policy: same-origin-allow-popups
Cross-Origin-Resource-Policy: cross-origin
```

## Data Protection

### Encryption

- **In Transit**: HTTPS/TLS 1.3
- **At Rest**: Database encryption at Turso layer
- **Storage**: Firebase Storage encryption for proctoring evidence

### Backup & Recovery

- Daily automated backups via Turso (30-day retention)
- Point-in-time recovery available
- Geographic replication

## Audit Logging

All authentication and important actions are logged:

```json
{
  "event_type": "exam_submitted",
  "user_id": "student-uuid",
  "attempt_id": "attempt-uuid",
  "resource_id": "test-uuid",
  "score": 85,
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T11:30:00Z"
}
```

## Security Limitations & Mitigations

### Known Limitations

#### 1. Client-Side Proctoring Trust

- **Limitation**: Proctoring events generated by client browser
- **Risk**: Malicious users could tamper with event detection
- **Mitigation**:
  - Server-side event validation where possible
  - Evidence requirement for high-severity events
  - Cumulative risk scoring with auto-submit thresholds
  - Regular proctoring review by administrators

#### 2. Camera Proctoring Reliability

- **Limitation**: Dependent on candidate's hardware and environment
- **Risk**: False positives/negatives in face detection
- **Mitigation**:
  - Multiple evidence capture for high-risk events
  - Human review capability for disputed events
  - Clear candidate guidelines and system requirements

#### 3. Network Dependency

- **Limitation**: Requires stable internet connection
- **Risk**: Disconnections could interrupt exams
- **Mitigation**:
  - Auto-save with debouncing (2-second intervals)
  - Grace period for temporary disconnections
  - Clear communication of network requirements

### Defense in Depth Strategy

- **Authentication**: Firebase JWT validation
- **Authorization**: Role-based access control
- **Tenant Isolation**: Database-level partitioning via `client_id`
- **Input Validation**: Zod schemas for all inputs
- **Output Encoding**: Proper JSON serialization

## Compliance & Standards

### Standards Compliance

- **OWASP Top 10**: All items addressed
- **Data Protection**: Personal data encrypted in transit and at rest
- **Audit Readiness**: Comprehensive action logging

### Best Practices for Users

**For Students:**

- Don't share exam links or share codes
- Don't take exams from public networks
- Enable camera for proctored exams
- Close browser after exam

**For Administrators:**

- Enable two-factor authentication
- Regularly review audit logs
- Update passwords regularly
- Monitor for suspicious activity

## Next Steps

- [Monitoring & Operations](/exam-portal/monitoring-and-operations)
- [API Reference](/exam-portal/api-reference)
- [Troubleshooting](/exam-portal/troubleshooting)
