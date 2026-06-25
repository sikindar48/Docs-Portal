---
id: monitoring-and-operations
title: Monitoring & Operations
---

# Monitoring & Operations

## Monitoring Infrastructure

### GCP Cloud Monitoring

**Dashboard Metrics:**

- API response times (p50, p95, p99)
- Error rates
- Database query performance
- Server CPU/Memory usage
- Request throughput

### Logging

**GCP Cloud Logging:**

- Application logs (all API calls with structured JSON)
- Error traces and stack traces
- Audit logs (authentication, authorization)
- System logs

**Log Levels:**

- `DEBUG`: Detailed diagnostic information
- `INFO`: General operational events
- `WARN`: Warning conditions
- `ERROR`: Error conditions
- `FATAL`: Critical failures

**View Logs:**

```bash
# View recent error logs
gcloud logging read "severity=ERROR" --limit 50

# Search for specific request
gcloud logging read "textPayload~'request-id-123'" --limit 10

# Filter by service
gcloud logging read "resource.service_name=exam-portal-api" \
  --limit 100 --sort-by ~timestamp
```

## Health Checks

### Backend Health Endpoint

```
GET /health
```

**Response**:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "checks": {
    "database": "connected",
    "firebase": "healthy",
    "cache": "operational"
  }
}
```

### API Info Endpoint

```
GET /
```

**Response**:

```json
{
  "name": "NS Exam Portal Backend API",
  "version": "1.0.0",
  "status": "healthy"
}
```

### Database Health Verification

```bash
# Using CLI
turso db list
turso db shell exam-portal
SELECT 1;
```

### Frontend Health

```bash
# Check domain DNS
nslookup test.nssoftwaresolutions.in

# Check SSL certificate
openssl s_client -connect test.nssoftwaresolutions.in:443

# Test accessibility
curl -I https://test.nssoftwaresolutions.in
```

### Automated Health Monitoring

```bash
# Create health check policy
gcloud compute health-checks create https exam-portal-health \
  --request-path=/health \
  --port=8080 \
  --check-interval=30s \
  --timeout=10s

# Verify health check
gcloud compute health-checks describe exam-portal-health
```

### Uptime Monitoring

- Uptime Robot for external monitoring
- Alert on >5 consecutive failures
- SMS/email notifications

## Logging Strategy

### Application Logging

```typescript
// structured JSON logging in backend
console.log(
  JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "INFO",
    service: "exam-portal-api",
    message: "Test created",
    userId: user.id,
    testId: test.id,
    clientId: test.client_id,
    duration_ms: performance.now() - startTime,
    correlationId: req.headers["x-correlation-id"],
  }),
);
```

### Log Levels

```typescript
// CRITICAL - System down
console.error(
  JSON.stringify({ level: "CRITICAL", message: "Database connection failed" }),
);
// ERROR - Operation failed
console.error(
  JSON.stringify({ level: "ERROR", message: "Grading failed", testId }),
);
// WARN - Potential issue
console.warn(
  JSON.stringify({
    level: "WARN",
    message: "High response time",
    duration_ms: 1200,
  }),
);
// INFO - Normal operation
console.log(
  JSON.stringify({ level: "INFO", message: "Attempt created", attemptId }),
);
// DEBUG - Diagnostic info
console.debug(
  JSON.stringify({ level: "DEBUG", message: "Query executed", sql }),
);
```

### Log Aggregation

```bash
# View application logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50 --format json

# Filter by service
gcloud logging read "resource.service_name=exam-portal-api" --limit 100 --sort-by ~timestamp

# Search for errors
gcloud logging read "severity=ERROR" --limit 50

# Create log-based alert
gcloud logging sinks create error-alert ERROR_SINK_DESTINATION --log-filter='severity=ERROR'
```

### Audit Logging

All important actions are logged to the `audit_logs` table:

```typescript
async function createAuditLog(userId, action, entityType, entityId, metadata) {
  await db.execute({
    sql: "INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [
      randomUUID(),
      userId,
      action,
      entityType,
      entityId,
      JSON.stringify(metadata),
      new Date().toISOString(),
    ],
  });
}
```

### Log Retention

Old logs can be archived to Cloud Storage:

```bash
gcloud logging sinks create long-term-storage \
  storage.googleapis.com/exam-portal-logs \
  --log-filter='timestamp>="2024-01-01T00:00:00Z"'
```

## Alerts & Notifications

### Critical Alerts

- **Error Rate >1%**: Immediate page-on-call
- **API Response >5s**: Page on-call within 5 min
- **Database Down**: Immediate page on-call
- **Storage Full**: Email alert

### Warning Alerts

- **Error Rate >0.5%**: Slack notification
- **API Response >2s**: Slack notification
- **High CPU Usage >80%**: Slack notification

### Create Alerts via CLI

```bash
# High error rate alert
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 1%" \
  --condition-threshold-value=0.01

# High latency alert
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Latency" \
  --condition-display-name="P95 latency > 500ms" \
  --condition-threshold-value=500
```

## Incident Response

### Incident Severity Levels

| Level    | Impact              | Response Time | Resolution Target |
| -------- | ------------------- | ------------- | ----------------- |
| Critical | All users affected  | 5 minutes     | 1 hour            |
| High     | Some users affected | 15 minutes    | 4 hours           |
| Medium   | Feature degraded    | 1 hour        | 8 hours           |
| Low      | Minor issue         | 24 hours      | Next business day |

### Incident Response Checklist

**Immediate Actions (0-5 min):**

- [ ] Acknowledge incident
- [ ] Assign incident commander
- [ ] Open communication channel
- [ ] Assess severity
- [ ] Notify stakeholders

**Investigation (5-30 min):**

- [ ] Check application logs
- [ ] Check database status
- [ ] Check infrastructure metrics
- [ ] Verify monitoring alerts
- [ ] Identify root cause

**Mitigation (30-120 min):**

- [ ] Apply temporary fix if needed
- [ ] Implement permanent fix
- [ ] Deploy changes
- [ ] Verify resolution
- [ ] Monitor metrics

**Post-Incident (1-24 hours):**

- [ ] Conduct postmortem
- [ ] Document lessons learned
- [ ] Create follow-up tasks
- [ ] Communicate resolution
- [ ] Archive incident logs

### Common Incidents & Runbooks

#### Database Connection Failure

**Symptoms**: All API requests failing with 500 errors

**Investigation:**

```bash
# Check Turso status
turso db shell exam-portal
SELECT 1;

# Check credentials
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN
```

**Recovery:**

```bash
# 1. Restart service
gcloud run services update exam-portal-api --no-gen2

# 2. If still failing, rollback to previous version
gcloud run deploy exam-portal-api \
  --image gcr.io/project/exam-portal-api:previous-version

# 3. Contact Turso support if issue persists
```

#### High CPU/Memory Usage

**Symptoms**: Slow response times, Cloud Run kills with OOM

**Investigation:**

```bash
# Check memory metrics
gcloud run services describe exam-portal-api --region asia-south2

# Analyze logs for memory spikes
gcloud logging read "resource.service_name=exam-portal-api AND memory_mb > 400"
```

**Recovery:**

```bash
# Increase memory or CPU allocation
gcloud run services update exam-portal-api --memory 512Mi --cpu 2

# Rollback if recent change caused issue
gcloud run services update-traffic exam-portal-api \
  --to-revisions PREVIOUS=100
```

## Backup & Recovery

### Backup Strategy

**Database Backups:**

- Automatic daily backups via Turso
- 30-day retention policy
- Point-in-time recovery available
- Geographic redundancy

**Application Backups:**

- Git repository as source of truth
- Deployment artifacts in GCP Artifact Registry
- Docker images with version tags

### Restore Procedures

**Database Restore:**

```bash
# List available backups
turso db backup list exam-portal

# Restore from specific backup
turso db restore-backup exam-portal backup-id
```

**Application Rollback:**

```bash
# View deployment history
gcloud run revisions list --service=exam-portal-backend

# Rollback to previous version
gcloud run services update-traffic exam-portal-backend --to-revisions=PREVIOUS=100
```

### Data Integrity Checks

```sql
-- Check for orphaned records
SELECT * FROM attempts WHERE test_id NOT IN (SELECT id FROM tests);
SELECT * FROM test_questions WHERE test_id NOT IN (SELECT id FROM tests);

-- Verify counts match
SELECT COUNT(*) as total_attempts,
       COUNT(DISTINCT student_id) as unique_students,
       COUNT(DISTINCT test_id) as unique_tests
FROM attempts;
```

## Maintenance Windows

### Scheduled Maintenance

- Weekly: Database optimization (Sunday 2 AM UTC)
- Monthly: Security patches (First Saturday of month)
- Quarterly: Major system updates

### Notifications

- Email alerts 48 hours before
- In-app notifications 24 hours before
- Status page updates

### Zero-Downtime Deployment

```bash
# 1. Deploy new version to new service
gcloud run deploy exam-portal-api-v2 \
  --image gcr.io/project/exam-portal-api:new-version

# 2. Test new version
curl https://exam-portal-api-v2-xxx.run.app/health

# 3. Switch traffic (instantaneous)
gcloud run services update-traffic exam-portal-api \
  --to-revisions LATEST=100

# 4. Keep old version for quick rollback
gcloud run revisions list --service=exam-portal-api
```

## Performance Tuning

### Database Optimization

```sql
-- Analyze query performance
EXPLAIN QUERY PLAN
SELECT * FROM attempts WHERE student_id = ? AND created_at > ?;

-- Rebuild indexes if fragmented
REINDEX idx_attempts_student_id;
```

### Server Optimization

- Monitor and adjust Cloud Run memory allocation
- Review slow query logs
- Implement caching where appropriate
- Load test before major changes

## Metrics & Dashboards

### Key Metrics

**Application Metrics:**

- Request Count: `/api/*/`
- Request Latency: p50, p95, p99
- Error Rate: (500 errors) / total requests
- Success Rate: (2xx responses) / total requests

**Business Metrics:**

- Active Clients: COUNT(DISTINCT client_id) WHERE active_status=1
- Total Tests: COUNT(\*) FROM tests WHERE status='published'
- Total Attempts: COUNT(\*) FROM attempts WHERE status='submitted'
- Avg Score: AVG(score) FROM attempts

**Infrastructure Metrics:**

- CPU Usage: < 70%
- Memory Usage: < 80%
- Disk Usage: < 85%

### GCP Dashboard Setup

```bash
# Create custom dashboard
gcloud monitoring dashboards create --config-from-file dashboard.yaml
```

## Compliance & Audit

### Audit Trail

- All admin actions logged
- Authentication events tracked
- Data access monitoring
- Change logs maintained

### Compliance Reports

- Monthly: Access logs audit
- Quarterly: Security assessment
- Annually: SOC 2 audit preparation

## Disaster Recovery Plan

### Recovery Time Objective (RTO)

- **Database**: < 1 hour
- **Application**: < 30 minutes
- **Full Service**: < 2 hours

### Recovery Point Objective (RPO)

- **Database**: < 1 hour (last backup)
- **Application Code**: Real-time (Git)

### DR Testing

- Quarterly: Database restore drill
- Quarterly: Application failover test
- Documentation updated after each drill

## Contact Information

**Support:**

- Email: info.nssoftwaresolutions@gmail.com
- Documentation: docs.nssoftwaresolutions.in

## Next Steps

- [Performance Optimization](/exam-portal/performance-optimization)
- [Security & Integrity](/exam-portal/security-and-exam-integrity)
- [Deployment Guide](/exam-portal/deployment-guide)
