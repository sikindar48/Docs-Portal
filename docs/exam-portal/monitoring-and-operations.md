---
id: monitoring-and-operations
title: Monitoring & Operations
---

# Monitoring & Operations

## Monitoring Infrastructure

### GCP Cloud Monitoring

**Dashboard Metrics**:
- API response times
- Error rates
- Database query performance
- Server CPU/Memory usage
- Request throughput

### Logging

**GCP Cloud Logging**:
- Application logs (all API calls)
- Error traces and stack traces
- Audit logs (authentication, authorization)
- System logs

**Log Levels**:
- `DEBUG`: Detailed diagnostic information
- `INFO`: General operational events
- `WARN`: Warning conditions
- `ERROR`: Error conditions
- `FATAL`: Critical failures

**Access Logs**:
```bash
# View recent error logs
gcloud logging read "severity=ERROR" --limit 50

# Search for specific request
gcloud logging read "textPayload~'request-id-123'" --limit 10
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

### Uptime Monitoring
- Uptime Robot for external monitoring
- Alert on >5 consecutive failures
- SMS/email notifications

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

### Alert Configuration
Managed in GCP Cloud Monitoring console with escalation policies.

## Incident Response

### Incident Severity Levels

| Level | Impact | Response Time | Resolution Target |
|-------|--------|----------------|--------------------|
| Critical | All users affected | 5 minutes | 1 hour |
| High | Some users affected | 15 minutes | 4 hours |
| Medium | Feature degraded | 1 hour | 8 hours |
| Low | Minor issue | 24 hours | Next business day |

### Incident Response Procedure

1. **Detect**: Automated alerts trigger
2. **Acknowledge**: On-call engineer confirms
3. **Assess**: Determine impact and severity
4. **Mitigate**: Implement temporary fix
5. **Resolve**: Apply permanent solution
6. **Document**: Post-incident review

### Runbooks

**Database Connection Failure**:
1. Check database status in Turso console
2. Verify firewall rules
3. Check auth token validity
4. Restart application if needed

**High CPU Usage**:
1. Check active queries in Cloud Profiler
2. Identify heavy operations
3. Increase CPU allocation if needed
4. Optimize slow queries

**Storage Issues**:
1. Check Firebase Storage quota
2. Clean up old proctoring images
3. Implement retention policy
4. Archive old data

## Backup & Recovery

### Backup Strategy

**Database Backups**:
- Automatic daily backups via Turso
- 30-day retention policy
- Point-in-time recovery available
- Geographic redundancy

**Application Backups**:
- Git repository as source of truth
- Deployment artifacts in GCP Artifact Registry
- Docker images with version tags

### Restore Procedures

**Database Restore**:
```bash
# List available backups
turso db list-backups my-db

# Restore from specific backup
turso db restore-backup my-db backup-id
```

**Application Rollback**:
```bash
# View deployment history
gcloud run revisions list --service=exam-portal-backend

# Rollback to previous version
gcloud run services update-traffic exam-portal-backend --to-revisions=PREVIOUS=100
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

## Performance Tuning

### Database Optimization
```sql
-- Analyze query performance
EXPLAIN QUERY PLAN
SELECT * FROM attempts 
WHERE student_id = ? AND created_at > ?;

-- Rebuild indexes if fragmented
REINDEX idx_attempts_student_id;
```

### Server Optimization
- Monitor and adjust Cloud Run memory allocation
- Review slow query logs
- Implement caching where appropriate
- Load test before major changes

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
- **Database**: <1 hour
- **Application**: <30 minutes
- **Full Service**: <2 hours

### Recovery Point Objective (RPO)
- **Database**: <1 hour (last backup)
- **Application Code**: Real-time (Git)

### DR Testing
- Quarterly: Database restore drill
- Quarterly: Application failover test
- Documentation updated after each drill

## Next Steps

- [Performance Optimization](/exam-portal/performance-optimization)
- [Security & Integrity](/exam-portal/security-and-exam-integrity)
- [Deployment Guide](/exam-portal/deployment-guide)
