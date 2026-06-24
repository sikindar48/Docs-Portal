---
id: api-reference
title: API Reference
---

# API Reference

Complete REST API documentation for the NS Exam Portal.

## Overview

All endpoints require Firebase ID token authentication via `Authorization: Bearer <token>` header.

## Authentication

### JWT Token Requirements
- **Header**: `Authorization: Bearer <firebase_id_token>`
- **Token Source**: Firebase Authentication SDK
- **Expiry**: 1 hour (automatic refresh in client)
- **Guest Access**: Use `attempt_token` query parameter

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
  "logo_url": "https://logo.url/image.png"
}
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
  "status": "draft"
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
  "attempt_id": "attempt-uuid",
  "attempt_token": "token-for-guest-access",
  "test_details": {...}
}
```

#### Get Attempt
```
GET /api/attempts/{attemptId}
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
  "question_type": "multiple_choice",
  "options": ["2", "4", "6", "8"],
  "correct_answer": "4",
  "marks": 1,
  "difficulty": "easy"
}
```

#### Import Questions
```
POST /api/questions/import
```

**Body**: Form data with CSV file

### Analytics

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

## Error Handling

### Standard Error Response
```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "status": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

- **Default**: 100 requests/minute per IP
- **Strict**: 10 requests/minute for sensitive operations
- **Headers**: X-RateLimit-Remaining, X-RateLimit-Reset

## Pagination

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

## Next Steps

- [Authentication](/exam-portal/authentication)
- [Error Codes](/exam-portal/error-codes)
- [Architecture](/exam-portal/architecture)
