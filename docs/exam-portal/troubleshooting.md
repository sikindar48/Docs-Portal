---
id: troubleshooting
title: Troubleshooting
---

# Troubleshooting Guide

Common issues and solutions for the Exam Portal.

## Installation Issues

### Node Modules Not Installing

**Problem**: `npm install` fails with dependency errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Use specific Node version
nvm use 22
npm install
```

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::8082`

**Solutions**:
```bash
# Find process using port
lsof -i :8082

# Kill process
kill -9 <PID>

# Or use different port
PORT=8083 npm run dev
```

### Firebase Authentication Failed

**Problem**: `Error: Firebase service account initialization failed`

**Solutions**:
- Verify `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable is set
- Ensure JSON is base64 encoded if required
- Check Firebase project is active
- Verify service account has correct IAM roles

```bash
# Decode and verify Firebase config
echo $FIREBASE_SERVICE_ACCOUNT_JSON | base64 -d | jq
```

## Database Issues

### Database Connection Timeout

**Problem**: `Error: Failed to connect to database`

**Solutions**:
```bash
# Verify connection string
echo $TURSO_CONNECTION_URL

# Test Turso connectivity
curl -I $TURSO_CONNECTION_URL

# Check auth token
echo $TURSO_AUTH_TOKEN | wc -c  # Should be 64+ characters

# Reconnect to Turso
turso db show exam-portal-prod
```

### Migration Failed

**Problem**: `Error: Migration script failed`

**Solutions**:
```bash
# Check migration status
turso db shell exam-portal-prod
.schema

# Manually run migration
turso db shell exam-portal-prod < migrations/001_init.sql

# View migration errors
turso db shell exam-portal-prod
.log on
```

### Database Lock

**Problem**: `Error: Database is locked`

**Solutions**:
```bash
# Check active connections
turso db shell exam-portal-prod
SELECT * FROM pragma_database_list;

# Restart application to close hanging connections
# Or increase connection timeout
```

## API Issues

### 401 Unauthorized

**Problem**: `Error: 401 Unauthorized`

**Solutions**:
- Verify token is present in `Authorization` header
- Check token hasn't expired (`exp` claim)
- Refresh token: `user.getIdToken(true)`
- Verify Firebase project matches token issuer

```bash
# Decode JWT to check claims
jwt_decode() {
  echo "$1" | cut -d '.' -f 2 | base64 -d | jq
}
jwt_decode "$TOKEN"
```

### 403 Forbidden

**Problem**: `Error: 403 Forbidden`

**Solutions**:
- Verify user has required role for endpoint
- Check organization access (BOLA/IDOR protection)
- Ensure request includes correct `client_id`
- Review user permissions in database

```sql
SELECT * FROM user_roles WHERE user_id = 'user-uuid';
```

### 404 Not Found

**Problem**: `Error: 404 Not Found`

**Solutions**:
- Verify resource ID is correct UUID
- Check resource exists in database
- Verify organization access
- Review API endpoint documentation

```sql
SELECT * FROM tests WHERE id = 'test-uuid';
```

### Rate Limited (429)

**Problem**: `Error: 429 Too Many Requests`

**Solutions**:
- Implement exponential backoff in client
- Check `X-RateLimit-Reset` header for reset time
- Upgrade to higher tier plan if needed
- Contact support for rate limit increase

```javascript
// Exponential backoff implementation
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 429) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }
}
```

## Frontend Issues

### Page Blank/White Screen

**Problem**: React app not rendering

**Solutions**:
- Check browser console for JavaScript errors
- Verify `VITE_API_URL` environment variable
- Clear browser cache and reload
- Check React DevTools for component errors

```bash
# Enable React Development Mode
VITE_DEBUG=true npm run dev
```

### CORS Error

**Problem**: `Error: Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
- Verify backend CORS_ORIGIN environment variable
- Check preflight OPTIONS request succeeds
- Verify credentials are sent with requests

```bash
# Test CORS preflight
curl -X OPTIONS https://api.nssoftwaresolutions.in/api/tests \
  -H "Origin: http://localhost:5173" \
  -v
```

### Login Not Working

**Problem**: Firebase authentication fails

**Solutions**:
- Verify `VITE_FIREBASE_CONFIG` is correct
- Check Firebase console for authentication method configuration
- Clear browser storage: `localStorage.clear()`
- Check network tab for auth requests

```javascript
// Debug Firebase auth
firebase.auth().onAuthStateChanged(user => {
  console.log('Auth state:', user);
});
```

### Exam Not Submitting

**Problem**: Student clicks submit but nothing happens

**Solutions**:
- Check network tab for failed API request
- Verify exam answers were saved
- Check browser console for JavaScript errors
- Try refreshing page and resubmitting

## Performance Issues

### Slow Page Load

**Problem**: Page takes >5 seconds to load

**Solutions**:
- Check network tab for slow API requests
- Monitor API response times
- Clear browser cache
- Check backend performance metrics in GCP

### High API Response Time

**Problem**: API endpoints respond slowly (>2s)

**Solutions**:
```bash
# Check database query performance
gcloud logging read "labels.component=api" --limit 20 --format=json | \
  jq '.[] | .jsonPayload.duration'

# Review slow query logs
gcloud sql operations list --instance=exam-portal

# Check Cloud Run CPU/Memory
gcloud run services describe exam-portal-backend \
  --region asia-south2
```

## Contact Support

For issues not covered here:
- Email: support@nssoftwaresolutions.in
- Documentation: https://docs.nssoftwaresolutions.in
- GitHub Issues: https://github.com/ns-software-solutions/exam-portal/issues

## Next Steps

- [Monitoring & Operations](/exam-portal/monitoring-and-operations)
- [Error Codes](/exam-portal/error-codes)
- [API Reference](/exam-portal/api-reference)
