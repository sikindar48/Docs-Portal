---
id: api-reference
title: API Reference
---

# API Reference

Complete REST API documentation for the NS Exam Portal.

## Overview

All endpoints require Firebase ID token authentication via `Authorization: Bearer <token>` header, except for public endpoints.

## Authentication

### JWT Token Requirements

- **Header**: `Authorization: Bearer <firebase_id_token>`
- **Token Source**: Firebase Authentication SDK
- **Expiry**: 1 hour (automatic refresh in client)
- **Guest Access**: Use `attempt_token` query parameter for guest operations

### Guest Access Pattern

```
GET /api/attempts/:attemptId?attempt_token=<token>
Headers: Authorization: Bearer <guest_firebase_token>
```

### Example Request

```bash
curl -X GET https://api.nssoftwaresolutions.in/api/tests \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Core Endpoints

### Clients Management

#### List All Clients

```
GET /api/clients
```

**Auth**: Super Admin only

**Response**:

```json
{
  "clients": [
    {
      "id": "client-uuid",
      "name": "Organization Name",
      "address": "123 Main St",
      "logo_url": "https://...",
      "active_status": 1,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Create Client

```
POST /api/clients
```

**Body**:

```json
{
  "name": "New Organization",
  "address": "Street Address",
  "logo_url": "https://logo.url/image.png",
  "plan_id": "starter"
}
```

#### Update Client

```
PUT /api/clients/:clientId
```

### Tests Management

#### List Tests

```
GET /api/tests?client_id={id}&status=published
```

**Query Parameters**:

- `client_id` (required for admins)
- `status`: draft, published, archived
- `folder_id`: filter by folder
- `share_code`: public lookup

#### Get Test Details

```
GET /api/tests/{testId}
```

#### Create Test

```
POST /api/tests
```

**Body**:

```json
{
  "test_name": "Math Exam",
  "timer": 60,
  "shuffle": 1,
  "allow_review": 1,
  "negative_marking": 0,
  "folder_id": "folder-uuid",
  "allow_guests": true,
  "show_results_after_submission": true
}
```

#### Update Test

```
PUT /api/tests/{testId}
```

#### Publish Test

```
POST /api/tests/{testId}/publish
```

#### Delete Test

```
DELETE /api/tests/{testId}
```

#### Clone Test

```
POST /api/rpc/clone-test
```

**Auth**: Client Admin only

**Body**:

```json
{
  "test_id": "original-test-uuid"
}
```

**Response**: `201 Created` with cloned test (draft status, new share code)

### Attempts

#### Start Attempt

```
POST /api/attempts
```

**Body**:

```json
{
  "test_id": "test-uuid",
  "student_id": "student-uuid"
}
```

**Response**:

```json
{
  "id": "attempt-uuid",
  "student_id": "student-uuid",
  "test_id": "test-uuid",
  "status": "in_progress",
  "attempt_token": "secure-token-for-guests"
}
```

#### Get Attempt

```
GET /api/attempts/{attemptId}
```

**Query Parameters**: `attempt_token` (required for guest access)

#### List Attempts

```
GET /api/attempts?student_id={studentId}
```

### Answers Management

#### Save/Update Answers (Auto-Save)

```
POST /api/attempt-answers
```

**Auth**: Student (own attempt) or Guest (with attempt_token)

**Body** (supports batch array):

```json
[
  {
    "attempt_id": "attempt-uuid",
    "question_id": "question-uuid",
    "selected_option": "B",
    "marked_for_review": false
  }
]
```

#### Get Saved Answers

```
GET /api/attempt-answers/{attemptId}?attempt_token={token}
```

### Submission & Grading

#### Submit Attempt for Grading

```
POST /api/rpc/submit-attempt
```

**Body**:

```json
{
  "attempt_id": "attempt-uuid",
  "time_taken": 3600
}
```

**Response**:

```json
{
  "score": 85,
  "total_marks": 100,
  "time_taken": 3600,
  "status": "submitted"
}
```

#### Submit Answer

```
POST /api/attempts/{attemptId}/answers
```

**Body**:

```json
{
  "question_id": "question-uuid",
  "student_answer": "option_a"
}
```

#### Submit Attempt

```
POST /api/attempts/{attemptId}/submit
```

**Response**:

```json
{
  "status": "submitted",
  "score": 85,
  "total_marks": 100,
  "submitted_at": "2024-01-15T11:30:00Z"
}
```

#### Download Report

```
GET /api/attempts/{attemptId}/report?attempt_token={token}
```

**Response**: XLSX file download (3-sheet workbook)

### Questions

#### Get Questions

```
GET /api/questions?folder_id={id}&client_id={id}
```

#### Create Question

```
POST /api/questions
```

**Body**:

```json
{
  "question_text": "What is 2+2?",
  "question_type": "mcq",
  "option_a": "3",
  "option_b": "4",
  "option_c": "5",
  "option_d": "6",
  "correct_answer": "B",
  "marks": 1,
  "difficulty": "easy"
}
```

#### Import Questions

```
POST /api/questions/import
```

**Body**: Form data with CSV file

**CSV Format**:

```
question_text,question_type,option_a,option_b,option_c,option_d,correct_answer,marks,difficulty
"What is 2+2?",mcq,"3","4","5","6","B",1,easy
```

#### Rollback Import

```
DELETE /api/questions?import_batch_id={batchId}
```

### Proctoring Events

#### Log Proctoring Event

```
POST /api/proctoring/events
```

**Body**:

```json
{
  "attempt_id": "attempt-uuid",
  "test_id": "test-uuid",
  "event_type": "TAB_SWITCH",
  "evidence": "base64-encoded-image"
}
```

**Event Types**:
| Event Type | Severity | Score | Evidence Required |
|---|---|---|---|
| `TAB_SWITCH` | LOW | 1 | No |
| `WINDOW_BLUR` | LOW | 1 | No |
| `FULLSCREEN_EXIT` | MEDIUM | 2 | No |
| `NO_FACE` | MEDIUM | 3 | Yes |
| `MULTIPLE_FACES` | HIGH | 5 | Yes |
| `CAMERA_DISCONNECTED` | HIGH | 5 | Yes |
| `CAMERA_PERMISSION_DENIED` | HIGH | 5 | No |

#### List Proctoring Events

```
GET /api/proctoring/events?attempt_id={id}&page=1&limit=20
```

### Subscriptions Management

#### List Client Subscriptions

```
GET /api/superadmin/subscriptions
```

**Auth**: Super Admin only

#### Update Client Subscription

```
PUT /api/superadmin/subscriptions/{clientId}
```

**Body**:

```json
{
  "plan_id": "growth",
  "expiry_date": "2027-06-24"
}
```

#### List Subscription Requests

```
GET /api/subscription-requests
```

#### Approve Subscription Request

```
PUT /api/subscription-requests/{requestId}/approve
```

### Packages (Pay Per Test)

#### Request Package

```
POST /api/packages/request
```

#### List Package Requests

```
GET /api/packages/requests
```

**Auth**: Super Admin only

#### Approve Package Request

```
PUT /api/packages/requests/{requestId}/approve
```

#### List Available Packages

```
GET /api/packages/available
```

### Analytics

#### Get Dashboard Statistics

```
GET /api/stats
```

**Response**: Role-specific metrics (Super Admin vs Client Admin)

#### Get Admin Dashboard

```
GET /api/stats/dashboard
```

#### Get Test Analytics

```
GET /api/analytics/tests/{testId}
```

**Response**:

```json
{
  "total_attempts": 150,
  "completed": 148,
  "average_score": 72.5,
  "difficulty_analysis": {...}
}
```

#### Get Student Analytics

```
GET /api/analytics/students/{studentId}
```

### Audit Logging

#### List Audit Logs

```
GET /api/superadmin/audit-logs?page=1&limit=50
```

**Auth**: Super Admin only

**Query Parameters**:

- `page`: Pagination page number
- `limit`: Results per page
- `user_id`: Filter by user
- `action`: Filter by action type
- `entity_type`: Filter by entity type
- `start_date` / `end_date`: Date range filter

### Settings & Configuration

#### Get Platform Settings

```
GET /api/settings
```

#### Update Platform Settings

```
PUT /api/settings
```

**Auth**: Super Admin only

**Body**:

```json
{
  "maintenance_mode": false,
  "announcement_banner": "Platform under maintenance",
  "registration_enabled": true
}
```

### User Management

#### Create User

```
POST /api/create-user
```

**Auth**: Client Admin or Super Admin

**Body**:

```json
{
  "email": "student@example.com",
  "password": "temporary-password",
  "name": "Student Name",
  "role": "student",
  "client_id": "client-uuid"
}
```

**Note**: Creates Firebase Auth account + profile + role in Turso

### Profiles

#### Get Profiles

```
GET /api/profiles?client_id={id}
```

#### Update Profile

```
PUT /api/profiles/{profileId}
```

## Permissions Matrix

| Endpoint                     | Super Admin | Client Admin | Student   | Guest         |
| ---------------------------- | ----------- | ------------ | --------- | ------------- |
| GET /api/clients             | ✅          | ❌           | ❌        | ❌            |
| POST /api/clients            | ✅          | ❌           | ❌        | ❌            |
| PUT /api/clients/:id         | ✅          | ❌           | ❌        | ❌            |
| GET /api/tests               | ✅ Tenant   | ✅ Tenant    | ✅ Tenant | ✅ Share Code |
| POST /api/tests              | ❌          | ✅ Tenant    | ❌        | ❌            |
| PUT /api/tests/:id           | ❌          | ✅ Tenant    | ❌        | ❌            |
| POST /api/rpc/clone-test     | ❌          | ✅ Tenant    | ❌        | ❌            |
| POST /api/attempts           | ✅          | ✅ Tenant    | ✅ Own    | ✅ Token      |
| GET /api/attempts            | ✅          | ✅ Tenant    | ✅ Own    | ✅ Token      |
| POST /api/attempt-answers    | ✅          | ❌           | ✅ Own    | ✅ Token      |
| GET /api/attempt-answers     | ✅          | ❌           | ✅ Own    | ✅ Token      |
| POST /api/rpc/submit-attempt | ✅          | ❌           | ✅ Own    | ✅ Token      |
| GET /api/attempts/:id/report | ✅          | ✅ Tenant    | ✅ Own    | ✅ Token      |
| POST /api/proctoring/events  | ✅          | ❌           | ✅ Own    | ✅ Token      |
| GET /api/superadmin/\*       | ✅          | ❌           | ❌        | ❌            |
| GET /api/settings            | ✅          | ❌           | ❌        | ❌            |
| PUT /api/settings            | ✅          | ❌           | ❌        | ❌            |
| POST /api/questions          | ❌          | ✅ Tenant    | ❌        | ❌            |
| POST /api/questions/import   | ❌          | ✅ Tenant    | ❌        | ❌            |
| GET /api/stats               | ✅          | ✅ Tenant    | ❌        | ❌            |
| GET /api/create-user         | ✅          | ✅ Tenant    | ❌        | ❌            |

## Rate Limiting

### Global Rate Limiter

- **Limit**: 1000 requests per 15 minutes
- **Response**: `429 Too Many Requests`

### Strict Rate Limiter (Sensitive Endpoints)

- **Limit**: 100 requests per minute
- **Endpoints**:
  - `/api/create-user`
  - `/api/attempts`
  - `/api/attempt-answers`
  - `/api/proctoring/events`
  - `/api/rpc/submit-attempt`

## Common Response Patterns

### Success Response

```json
{
  "data": {
    /* resource or array */
  },
  "message": "Operation successful"
}
```

### Standard Error Response

```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "status": 400
}
```

### Pagination Response

```
GET /api/tests?page=1&limit=20
```

**Response**:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "pages": 13
  }
}
```

### Common Error Codes

| Code               | Status | Description              |
| ------------------ | ------ | ------------------------ |
| `UNAUTHORIZED`     | 401    | Invalid or missing token |
| `FORBIDDEN`        | 403    | Insufficient permissions |
| `NOT_FOUND`        | 404    | Resource not found       |
| `VALIDATION_ERROR` | 400    | Invalid input data       |
| `CONFLICT`         | 409    | Resource already exists  |
| `RATE_LIMITED`     | 429    | Too many requests        |
| `SERVER_ERROR`     | 500    | Internal server error    |

## Health Checks

#### Backend Health

```
GET /health
```

**Auth**: None (public)

**Response**:

```json
{
  "status": "ok"
}
```

#### API Info

```
GET /
```

**Auth**: None (public)

**Response**:

```json
{
  "name": "NS Exam Portal Backend API",
  "version": "1.0.0",
  "status": "healthy"
}
```

## Response Headers

Response headers often contain additional information:

```
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705320000
X-Request-Id: req-12345
```

## Next Steps

- [Authentication](/exam-portal/authentication)
- [Error Codes](/exam-portal/error-codes)
- [Architecture](/exam-portal/architecture)
