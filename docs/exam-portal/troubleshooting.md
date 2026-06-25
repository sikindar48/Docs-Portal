---
id: troubleshooting
title: Troubleshooting
---

# Troubleshooting Guide

Common issues and solutions for the Exam Portal.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Failures](#build-failures)
- [Database Problems](#database-problems)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Frontend Issues](#frontend-issues)
- [Performance Issues](#performance-issues)
- [Runtime Issues](#runtime-issues)
- [Getting Support](#getting-support)

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
lsof -i :8080
lsof -i :5173

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

## Build Failures

### TypeScript Compilation Errors

**Problem**: `npm run build` fails with TypeScript errors

**Solutions**:

```bash
# Check for type errors
npx tsc --noEmit

# Fix common issues
# 1. Missing type definitions
npm install --save-dev @types/node

# 2. Clear build cache
rm -rf dist/ .tsc-cache/
npm run build
```

### ESLint/Lint Errors

**Problem**: Linting fails before build

**Solutions**:

```bash
# Check lint errors
npm run lint

# Fix automatically where possible
npm run lint -- --fix

# Or disable for specific lines
// eslint-disable-next-line
const anyVariable = something;
```

### Frontend Build Size Too Large

**Problem**: Frontend bundle exceeds size limits

**Solutions**:

```bash
# Analyze bundle
npm run build
npm install -g source-map-explorer
source-map-explorer 'dist/**/*.js'

# Optimize:
# 1. Enable code splitting in vite.config.ts
# 2. Lazy load heavy components
# 3. Remove unused dependencies
```

## Database Problems

### Turso Connection Fails

**Problem**: "Cannot connect to Turso database" or "Connection timeout"

**Solutions**:

```bash
# 1. Verify connection string format
# Should be: libsql://namespace-org.turso.io

# 2. Check authentication token
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN

# 3. Test connection locally
curl -H "Authorization: Bearer TOKEN" \
  https://namespace-org.turso.io

# 4. Restart application after env changes
npm run dev
```

### Migration Fails or Hangs

**Problem**: Database migrations hang or fail during startup

**Solutions**:

```bash
# 1. Check logs for specific error
# Application logs should show migration step

# 2. If migrations hung:
# - Kill application
# - Check database status in Turso dashboard
# - Restart application

# 3. If specific column already exists:
# This is expected - migrations skip existing columns
# Check db.ts for ALTER TABLE IF NOT EXISTS

# 4. Manual migration recovery
turso db shell exam-portal
.tables
.schema tests
```

### Database Out of Sync

**Problem**: Schema doesn't match expected structure

**Solutions**:

```bash
# 1. Verify schema
turso db shell exam-portal
.schema

# 2. Check db.ts migrations
# Look for all CREATE TABLE and ALTER TABLE statements

# 3. If corrupted, restore from backup
# Contact Turso support for point-in-time restore
```

### Query Timeout or Slow Queries

**Problem**: Database queries take too long

**Solutions**:

```bash
# 1. Check indexes exist
turso db shell exam-portal
.indexes

# 2. Verify all strategic indexes are created
# See database-schema.md for index list

# 3. Optimize queries
# - Add pagination (LIMIT/OFFSET)
# - Filter early (WHERE clauses)
# - Use indexes for filters
```

## Authentication Issues

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

### Guest Authentication Fails

**Problem**: Guest user cannot access attempt

**Solutions**:

- Verify `attempt_token` is included in query parameter or header (`x-attempt-token`)
- Check token matches database record
- Verify attempt exists and belongs to guest
- Ensure anonymous auth enabled in Firebase Console

### CORS Errors

**Problem**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions**:

- Check CORS configuration in `server.ts`
- Verify frontend domain is in allowed origins
- Restart backend after CORS config changes

```bash
# Test CORS preflight
curl -X OPTIONS https://api.nssoftwaresolutions.in/api/tests \
  -H "Origin: http://localhost:5173" \
  -v
```

### Session Persistence Issues

**Problem**: User logged in but session lost on refresh

**Solutions**:

- Verify token storage in browser (localStorage `firebase:authUser:*`)
- Check Firebase SDK initialization configuration
- Clear browser cache and cookies
- Verify AuthContext provider setup

## API Issues

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
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }
}
```

### Score Not Calculating

**Problem**: Attempt score shows null or incorrect value

**Solutions**:

```sql
-- Verify submission completed
SELECT * FROM attempts WHERE id = 'attempt-uuid';

-- Check answers saved
SELECT COUNT(*) FROM attempt_answers WHERE attempt_id = 'attempt-uuid';

-- Verify correct answers stored
SELECT * FROM questions WHERE id = 'question-uuid';
```

## Frontend Issues

### Page Blank/White Screen

**Problem**: React app not rendering

**Solutions**:

- Check browser console for JavaScript errors
- Verify `VITE_API_URL` environment variable
- Clear browser cache and reload
- Check React DevTools for component errors

### Login Not Working

**Problem**: Firebase authentication fails

**Solutions**:

- Verify `VITE_FIREBASE_CONFIG` is correct
- Check Firebase console for authentication method configuration
- Clear browser storage: `localStorage.clear()`
- Check network tab for auth requests

```javascript
// Debug Firebase auth
firebase.auth().onAuthStateChanged((user) => {
  console.log("Auth state:", user);
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

# Check Cloud Run CPU/Memory
gcloud run services describe exam-portal-backend \
  --region asia-south2
```

## Runtime Issues

### Proctoring Events Not Logging

**Problem**: Proctoring events not stored

**Solutions**:

- Verify feature enabled (`isFeatureEnabled('advanced_proctoring')`)
- Check `proctoring_events` table exists
- Verify event structure matches expected format
- Check network requests in browser DevTools
- Verify permissions (student should have permission)

### High Memory Usage

**Problem**: Application uses excessive memory

**Solutions**:

```bash
# Monitor Cloud Run metrics
gcloud run services describe exam-portal-api --region asia-south2

# Add memory profiling
NODE_OPTIONS=--max-old-space-size=1024 npm run dev

# Optimize database queries (use pagination)
# Clear old audit_logs if table grows large
```

## Getting Support

### Debug Information to Collect

When reporting issues, include:

```bash
# System information
node --version
npm --version
git status

# Error logs
npm run dev 2>&1 | head -100

# Database status
turso db shell exam-portal
SELECT COUNT(*) FROM clients;

# Environment check
echo "API: $VITE_API_URL"
echo "Firebase Project: $VITE_FIREBASE_PROJECT_ID"

# Browser console errors
# Open DevTools > Console
# Screenshot of error messages

# Recent changes
git log --oneline -10
git diff HEAD~1
```

### Support Resources

- **Email**: info.nssoftwaresolutions@gmail.com
- **Documentation**: https://docs.nssoftwaresolutions.in
- **API Reference**: /exam-portal/api-reference
- **Error Codes**: /exam-portal/error-codes
- **Monitoring**: /exam-portal/monitoring-and-operations

## Next Steps

- [Monitoring & Operations](/exam-portal/monitoring-and-operations)
- [Error Codes](/exam-portal/error-codes)
- [API Reference](/exam-portal/api-reference)
