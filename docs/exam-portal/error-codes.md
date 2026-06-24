---
id: error-codes
title: Error Codes
---

# Error Codes

Comprehensive reference for all error codes returned by the Exam Portal API.

## HTTP Status Codes

| Status | Category | Meaning |
|--------|----------|---------|
| 200 | Success | Request succeeded |
| 201 | Success | Resource created |
| 204 | Success | No content |
| 400 | Client Error | Bad request/validation error |
| 401 | Client Error | Unauthorized (invalid/missing token) |
| 403 | Client Error | Forbidden (insufficient permissions) |
| 404 | Client Error | Resource not found |
| 409 | Client Error | Conflict (resource already exists) |
| 429 | Client Error | Rate limited |
| 500 | Server Error | Internal server error |
| 503 | Server Error | Service unavailable |

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

## Common Error Codes

### Authentication Errors

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `UNAUTHORIZED` | 401 | Missing or invalid token | Ensure Authorization header is present with valid token |
| `TOKEN_EXPIRED` | 401 | ID token has expired | Refresh token with `getIdToken(true)` |
| `INVALID_TOKEN` | 401 | Token is malformed or tampered | Re-authenticate user |

### Authorization Errors

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `FORBIDDEN` | 403 | Insufficient permissions | Check user role and organization access |
| `BOLA_VIOLATION` | 403 | Attempting to access other organization's data | Access only your organization's resources |
| `IDOR_VIOLATION` | 403 | Direct object reference without authorization | System prevented unauthorized access |

### Validation Errors

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `VALIDATION_ERROR` | 400 | Input validation failed | Check request payload matches schema |
| `INVALID_EMAIL` | 400 | Email format is invalid | Provide valid email address |
| `INVALID_UUID` | 400 | ID format is not valid UUID | Use valid UUID format |
| `MISSING_FIELD` | 400 | Required field is missing | Include all required fields in request |

### Resource Errors

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `NOT_FOUND` | 404 | Resource does not exist | Verify resource ID is correct |
| `ALREADY_EXISTS` | 409 | Resource already exists | Use different identifier or update existing |
| `RESOURCE_DELETED` | 410 | Resource has been deleted | Cannot access deleted resources |

### Rate Limiting

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `RATE_LIMITED` | 429 | Too many requests | Wait before making next request |
| `QUOTA_EXCEEDED` | 429 | Monthly quota exceeded | Upgrade plan or wait for renewal |

### Server Errors

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `SERVER_ERROR` | 500 | Internal server error | Contact support if persists |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable | Retry after a few moments |
| `DATABASE_ERROR` | 500 | Database connection failed | Try request again |

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
