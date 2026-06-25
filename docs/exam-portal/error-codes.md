---
id: error-codes
title: Error Codes
---

# Error Codes

Comprehensive reference for all error codes returned by the Exam Portal API.

## HTTP Status Codes

| Status | Category     | Meaning                              |
| ------ | ------------ | ------------------------------------ |
| 200    | Success      | Request succeeded                    |
| 201    | Success      | Resource created                     |
| 204    | Success      | No content                           |
| 400    | Client Error | Bad request/validation error         |
| 401    | Client Error | Unauthorized (invalid/missing token) |
| 403    | Client Error | Forbidden (insufficient permissions) |
| 404    | Client Error | Resource not found                   |
| 409    | Client Error | Conflict (resource already exists)   |
| 429    | Client Error | Rate limited                         |
| 500    | Server Error | Internal server error                |
| 503    | Server Error | Service unavailable                  |

## Error Response Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "status": 400,
  "details": {
    "field": "additional_context"
  }
}
```

## Authentication Errors (401)

### MISSING_AUTH_TOKEN

```json
{
  "error": "Missing authentication token",
  "code": "MISSING_AUTH_TOKEN",
  "status": 401
}
```

**Cause**: Request missing `Authorization: Bearer` header

**Solution**: Add Firebase ID token to request header

### INVALID_TOKEN

```json
{
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN",
  "status": 401
}
```

**Cause**: Token is malformed, expired, or from wrong Firebase project

**Solution**: Get fresh token from Firebase Authentication

### TOKEN_VERIFICATION_FAILED

```json
{
  "error": "Token verification failed",
  "code": "TOKEN_VERIFICATION_FAILED",
  "status": 401
}
```

**Cause**: Token signature validation failed

**Solution**: Ensure token is from correct Firebase project

### TOKEN_EXPIRED

```json
{
  "error": "ID token has expired",
  "code": "TOKEN_EXPIRED",
  "status": 401
}
```

**Solution**: Refresh token with `getIdToken(true)` or `firebase.auth().currentUser.getIdToken(true)`

## Authorization Errors (403)

### FORBIDDEN

```json
{
  "error": "Permission denied",
  "code": "FORBIDDEN",
  "status": 403
}
```

**Cause**: User lacks required role for operation

**Solution**: Verify user role (Super Admin, Client Admin, Student)

### BOLA_VIOLATION

```json
{
  "error": "Attempting to access other organization's data",
  "code": "BOLA_VIOLATION",
  "status": 403
}
```

**Cause**: Attempting to access resource from different tenant

**Solution**: Verify client_id matches user's organization

### IDOR_VIOLATION

```json
{
  "error": "Direct object reference without authorization",
  "code": "IDOR_VIOLATION",
  "status": 403
}
```

**Cause**: Direct object reference without ownership validation

**Solution**: System prevented unauthorized access — use your own resources only

### TENANT_MISMATCH

```json
{
  "error": "Permission denied: Tenant mismatch",
  "code": "TENANT_MISMATCH",
  "status": 403
}
```

**Solution**: Access only your organization's resources

### INSUFFICIENT_PRIVILEGES

```json
{
  "error": "Insufficient privileges for this operation",
  "code": "INSUFFICIENT_PRIVILEGES",
  "status": 403
}
```

**Solution**: Use appropriate user role (e.g., Super Admin for client management)

### ATTEMPT_TOKEN_INVALID

```json
{
  "error": "Permission denied: Invalid attempt token",
  "code": "ATTEMPT_TOKEN_INVALID",
  "status": 403
}
```

**Cause**: Guest attempt missing or incorrect `attempt_token`

**Solution**: Include correct `attempt_token` in query or header for guest operations

### ATTEMPT_NOT_OWNER

```json
{
  "error": "You do not own this attempt",
  "code": "ATTEMPT_NOT_OWNER",
  "status": 403
}
```

**Cause**: Student accessing another student's attempt

**Solution**: Only access your own attempts

### SECTION_LOCKED

```json
{
  "error": "Section navigation locked",
  "code": "SECTION_LOCKED",
  "status": 403
}
```

**Cause**: Attempting to return to a completed section with navigation locked

**Solution**: Cannot edit answers in locked sections

## Validation Errors (400)

### VALIDATION_ERROR

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "status": 400,
  "details": [
    {
      "field": "test_name",
      "message": "Test name is required"
    },
    {
      "field": "timer",
      "message": "Timer must be positive integer"
    }
  ]
}
```

**Cause**: Invalid or missing required fields

**Solution**: Check field requirements and data types

### INVALID_EMAIL

```json
{
  "error": "Email format is invalid",
  "code": "INVALID_EMAIL",
  "status": 400
}
```

**Solution**: Provide valid email address

### INVALID_UUID

```json
{
  "error": "ID format is not valid UUID",
  "code": "INVALID_UUID",
  "status": 400
}
```

**Solution**: Use valid UUID format

### MISSING_FIELD

```json
{
  "error": "Required field is missing",
  "code": "MISSING_FIELD",
  "status": 400
}
```

**Solution**: Include all required fields in request

### INVALID_TEST_CONFIGURATION

```json
{
  "error": "Invalid test configuration",
  "code": "INVALID_TEST_CONFIGURATION",
  "status": 400,
  "details": {
    "reason": "Timer cannot be less than 5 minutes"
  }
}
```

**Solution**: Verify timer, limits, and configuration values

### INVALID_QUESTION_TYPE

```json
{
  "error": "Invalid question type",
  "code": "INVALID_QUESTION_TYPE",
  "status": 400
}
```

**Cause**: Question type not in (mcq, true_false, multi_select, fill_blank, subjective, coding)

**Solution**: Use supported question type

### CSV_IMPORT_VALIDATION_ERROR

```json
{
  "error": "CSV import validation failed",
  "code": "CSV_IMPORT_VALIDATION_ERROR",
  "status": 400,
  "details": {
    "line": 5,
    "error": "Missing required column: correct_answer",
    "row_data": "What is 2+2?,mcq,3,4,5,6,,1,easy"
  }
}
```

**Solution**: Verify CSV has headers: question_text, question_type, option_a, option_b, correct_answer, marks

### CAMERA_PERMISSION_DENIED

```json
{
  "error": "Camera permission denied",
  "code": "CAMERA_PERMISSION_DENIED",
  "status": 400,
  "details": {
    "event_type": "CAMERA_PERMISSION_DENIED",
    "message": "Browser denied camera access"
  }
}
```

**Solution**: Grant camera permission in browser settings

### CAMERA_NOT_AVAILABLE

```json
{
  "error": "Camera device not available",
  "code": "CAMERA_NOT_AVAILABLE",
  "status": 400
}
```

**Solution**: Check camera device availability

### PROCTORING_NOT_ENABLED

```json
{
  "error": "Proctoring is not enabled for this test",
  "code": "PROCTORING_NOT_ENABLED",
  "status": 400
}
```

**Solution**: Test must have proctoring feature enabled

## Resource Errors (404)

### NOT_FOUND

```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "status": 404,
  "details": {
    "resource_type": "Test",
    "resource_id": "invalid-uuid"
  }
}
```

**Solution**: Verify resource ID is correct

### CLIENT_NOT_FOUND

```json
{
  "error": "Client organization not found",
  "code": "CLIENT_NOT_FOUND",
  "status": 404
}
```

**Solution**: Verify client ID

### TEST_NOT_FOUND

```json
{
  "error": "Test not found",
  "code": "TEST_NOT_FOUND",
  "status": 404
}
```

**Solution**: Verify test ID or share code

### QUESTION_NOT_FOUND

```json
{
  "error": "Question not found",
  "code": "QUESTION_NOT_FOUND",
  "status": 404
}
```

**Solution**: Verify question ID

### ATTEMPT_NOT_FOUND

```json
{
  "error": "Attempt not found",
  "code": "ATTEMPT_NOT_FOUND",
  "status": 404
}
```

**Solution**: Verify attempt ID

### INVALID_SHARE_CODE

```json
{
  "error": "Invalid share code",
  "code": "INVALID_SHARE_CODE",
  "status": 404
}
```

**Solution**: Verify share code and try again

### RESOURCE_DELETED

```json
{
  "error": "Resource has been deleted",
  "code": "RESOURCE_DELETED",
  "status": 410
}
```

**Solution**: Cannot access deleted resources

## Subscription & Billing Errors (400 / 409)

### SUBSCRIPTION_EXPIRED

```json
{
  "error": "Client subscription has expired",
  "code": "SUBSCRIPTION_EXPIRED",
  "status": 400
}
```

**Solution**: Contact Super Admin to renew subscription

### QUOTA_EXCEEDED

```json
{
  "error": "Quota exceeded: Monthly exam limit reached",
  "code": "QUOTA_EXCEEDED",
  "status": 400,
  "details": {
    "limit": 3,
    "current_usage": 3,
    "resource": "exams_per_month"
  }
}
```

**Solution**: Upgrade subscription or use Pay Per Test packages

### INSUFFICIENT_PACKAGE_CAPACITY

```json
{
  "error": "Insufficient package capacity",
  "code": "INSUFFICIENT_PACKAGE_CAPACITY",
  "status": 400,
  "details": {
    "limit": 50,
    "requested": 75,
    "resource": "questions"
  }
}
```

**Solution**: Select higher capacity package or upgrade

### PACKAGE_ALREADY_USED

```json
{
  "error": "Package has already been used",
  "code": "PACKAGE_ALREADY_USED",
  "status": 409
}
```

**Solution**: Purchase new package for new test

## Exam Engine Errors (400 / 403 / 409)

### TEST_NOT_PUBLISHED

```json
{
  "error": "Test is not published",
  "code": "TEST_NOT_PUBLISHED",
  "status": 400
}
```

**Solution**: Client Admin must publish test first

### TEST_NOT_ACTIVE

```json
{
  "error": "Test is not currently active",
  "code": "TEST_NOT_ACTIVE",
  "status": 400
}
```

**Solution**: Wait for test to be activated by admin

### OUTSIDE_SCHEDULED_WINDOW

```json
{
  "error": "Test is outside scheduled time window",
  "code": "OUTSIDE_SCHEDULED_WINDOW",
  "status": 400,
  "details": {
    "scheduled_start": "2026-06-25T10:00:00Z",
    "scheduled_end": "2026-06-25T12:00:00Z",
    "current_time": "2026-06-26T10:00:00Z"
  }
}
```

**Solution**: Wait for scheduled start or contact admin

### GUEST_ACCESS_NOT_ALLOWED

```json
{
  "error": "Guest access is not allowed for this test",
  "code": "GUEST_ACCESS_NOT_ALLOWED",
  "status": 403
}
```

**Solution**: Use registered student account or ask admin to enable guest access

### ATTEMPT_LIMIT_EXCEEDED

```json
{
  "error": "Attempt limit exceeded",
  "code": "ATTEMPT_LIMIT_EXCEEDED",
  "status": 400,
  "details": {
    "allowed_attempts": 1,
    "current_attempts": 1
  }
}
```

**Solution**: Cannot take more attempts unless admin changes limit

### CANDIDATE_CAPACITY_REACHED

```json
{
  "error": "Candidate capacity reached for this test",
  "code": "CANDIDATE_CAPACITY_REACHED",
  "status": 403
}
```

**Solution**: Purchase package with higher capacity

### TEST_READ_ONLY

```json
{
  "error": "Test is read-only",
  "code": "TEST_READ_ONLY",
  "status": 400
}
```

**Solution**: Cannot modify test configuration when read-only

### DUPLICATE_ANSWER_SUBMISSION

```json
{
  "error": "Attempt has already been submitted",
  "code": "DUPLICATE_ANSWER_SUBMISSION",
  "status": 409
}
```

**Solution**: Cannot resubmit. View results or start new attempt

### ALREADY_EXISTS

```json
{
  "error": "Resource already exists",
  "code": "ALREADY_EXISTS",
  "status": 409
}
```

**Solution**: Use different identifier or update existing

### STATE_CONFLICT

```json
{
  "error": "Resource state conflict",
  "code": "STATE_CONFLICT",
  "status": 409,
  "details": {
    "expected_state": "draft",
    "actual_state": "published"
  }
}
```

**Solution**: Change resource state first or different operation

## Rate Limiting Errors (429)

### RATE_LIMITED

```json
{
  "error": "Too many requests, please try again later",
  "code": "RATE_LIMITED",
  "status": 429,
  "details": {
    "retry_after": 60,
    "limit": 100,
    "window": "1 minute"
  }
}
```

**Cause**: Exceeded API rate limit

**Solution**: Wait before retrying (see `Retry-After` header or `retry_after` value)

### QUOTA_EXCEEDED

```json
{
  "error": "Monthly quota exceeded",
  "code": "QUOTA_EXCEEDED",
  "status": 429
}
```

**Solution**: Upgrade plan or wait for renewal

## Server Errors (500)

### SERVER_ERROR

```json
{
  "error": "Internal server error",
  "code": "SERVER_ERROR",
  "status": 500
}
```

**Solution**: Contact support if persists

### DATABASE_ERROR

```json
{
  "error": "Database operation failed",
  "code": "DATABASE_ERROR",
  "status": 500
}
```

**Cause**: Database query or connection failed

**Solution**: Retry request; if persists, contact support

### SERVICE_UNAVAILABLE

```json
{
  "error": "Service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE",
  "status": 503,
  "details": {
    "reason": "maintenance_mode",
    "message": "Platform is under maintenance"
  }
}
```

**Solution**: Wait for maintenance to complete

## Error Handling Best Practices

### Retry with Exponential Backoff

```javascript
async function apiCallWithRetry(endpoint, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, options);

      if (response.status === 429) {
        const retryAfter =
          response.headers.get("Retry-After") || Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (response.status >= 500) {
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          );
          continue;
        }
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000),
      );
    }
  }
}
```

### Error Classification

```javascript
function classifyError(response) {
  const { status, code } = response;

  if (status === 401) return "AUTHENTICATION_ERROR";
  if (status === 403) return "AUTHORIZATION_ERROR";
  if (status === 400) return "VALIDATION_ERROR";
  if (status === 429) return "RATE_LIMIT_ERROR";
  if (status >= 500) return "SERVER_ERROR";

  return "UNKNOWN_ERROR";
}
```

## Debugging Tips

### Check Error Details

```bash
# Enable verbose logging
curl -v -X GET https://api.nssoftwaresolutions.in/api/tests \
  -H "Authorization: Bearer $TOKEN"
```

### Monitor Headers

Response headers often contain additional information:

```
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705320000
X-Request-Id: req-12345
```

### Review Logs

Access application logs in GCP Cloud Logging with request IDs for detailed error traces.

## Next Steps

- [API Reference](/exam-portal/api-reference)
- [Authentication](/exam-portal/authentication)
- [Troubleshooting](/exam-portal/troubleshooting)
