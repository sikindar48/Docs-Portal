---
id: security
title: Security & Compliance
---

# Security & Compliance

Security measures, best practices, and compliance documentation for the NS Internship Portal.

## Security Architecture

### Authentication & Authorization

| Control | Implementation | Status |
|---------|----------------|--------|
| **Password Hashing** | bcrypt, 10 rounds | ✅ |
| **Access Tokens** | JWT via jose, 15min expiry | ✅ |
| **Refresh Tokens** | SHA-256 hashed, DB-stored, rotated on use, revoked on logout | ✅ |
| **Token Rotation** | Automatic on each refresh, old tokens revoked | ✅ |
| **Cookie Security** | HttpOnly, SameSite=Strict, Secure in production | ✅ |
| **Role-Based Access Control** | 5 roles, 28 granular permissions | ✅ |
| **API Key Management** | CRON_SECRET header required for cron endpoints | ✅ |

### Data Protection

| Control | Implementation | Status |
|---------|----------------|--------|
| **SQL Injection Prevention** | Parameterized queries via Supabase | ✅ |
| **CSRF Protection** | SameSite cookies, CORS configured | ✅ |
| **XSS Prevention** | React escaping, no innerHTML usage | ✅ |
| **IDOR Prevention** | Ownership checks on milestones/enrollments | ✅ |
| **Data Encryption** | HTTPS/TLS in transit, PostgreSQL at rest | ✅ |
| **Rate Limiting** | Supabase-backed rate limiter (survives restarts) | ✅ |
| **Input Validation** | All endpoints, sanitization applied | ✅ |

### Infrastructure Security

| Control | Implementation | Status |
|---------|----------------|--------|
| **DDoS Protection** | Vercel Edge Network, automatic mitigation | ✅ |
| **Firewall** | Supabase IP whitelisting | ✅ |
| **WAF** | Vercel integrated Web Application Firewall | ✅ |
| **SSL/TLS** | HTTPS enforced, TLS 1.2+ | ✅ |
| **Certificate Management** | Let's Encrypt auto-renewal via Vercel | ✅ |
| **Network Isolation** | Private database, no public internet access | ✅ |

### Third-Party Security

| Service | Security Measures | Status |
|---------|-------------------|--------|
| **Razorpay** | HMAC-SHA256 signature verification | ✅ |
| **Cloudinary** | Signed URLs for secure resource access | ✅ |
| **Google OAuth** | State parameter, PKCE compliance | ✅ |
| **Resend SMTP** | TLS encryption, API key rotation | ✅ |

## OWASP Top 10:2025 Compliance

### A01:2025 - Broken Access Control

**Status:** ✅ Protected

- Row Level Security (RLS) enabled on all tables
- Ownership checks on user resources (enrollments, milestones, certificates)
- Permission system with 28 granular permissions
- Role-based access control with hierarchy

### A02:2025 - Cryptographic Failures

**Status:** ✅ Protected

- JWT tokens signed with strong secret
- Refresh tokens hashed with SHA-256
- Passwords hashed with bcrypt (10 rounds)
- HTTPS/TLS enforced in production
- Sensitive data not stored in plain text

### A03:2025 - Injection

**Status:** ✅ Protected

- Parameterized queries via Supabase client
- No raw SQL queries
- Input validation on all endpoints
- Template literals for safe string interpolation

### A04:2025 - Insecure Design

**Status:** ✅ Protected

- Security requirements in architecture
- Threat modeling completed
- Separation of concerns
- Principle of least privilege

### A05:2025 - Misconfiguration

**Status:** ✅ Protected

- Environment variables for all secrets
- No secrets in code
- RLS policies enabled
- Secure defaults in configuration

### A06:2025 - Vulnerable & Outdated Components

**Status:** ✅ Protected

- Regular dependency updates
- npm audit used for vulnerability scanning
- Automated dependabot updates
- Version pinning for stability

### A07:2025 - Authentication Failures

**Status:** ✅ Protected

- JWT with refresh token rotation
- 15-minute access token expiry
- Refresh token automatic rotation
- Revocation on logout
- Disposable email blocking

### A08:2025 - Software & Data Integrity Failures

**Status:** ✅ Protected

- HTTPS enforced (no man-in-the-middle)
- API signatures verified (Razorpay HMAC)
- Automatic security updates
- SBOM tracking

### A09:2025 - Logging & Monitoring Failures

**Status:** ✅ Protected

- Activity logging for admin actions
- Email send logging
- Error tracking (Sentry optional)
- Request logging in production

### A10:2025 - Request Forgeries

**Status:** ✅ Protected

- CORS properly configured
- SameSite cookies
- State parameter in OAuth
- No cross-origin resource sharing

## Permission Model

### 28 Granular Permissions

**Dashboard (4):**
- view_dashboard
- view_analytics
- view_audit_logs
- export_data

**Domains (4):**
- manage_domains
- create_domain
- edit_domain
- delete_domain

**Enrollments (3):**
- manage_enrollments
- approve_enrollment
- review_milestones

**Certificates (5):**
- manage_certificates
- issue_certificate
- revoke_certificate
- manage_templates
- edit_template

**Coupons (4):**
- manage_coupons
- create_coupon
- edit_coupon
- delete_coupon

**Announcements (3):**
- manage_announcements
- create_announcement
- edit_announcement

**IAM (3):**
- manage_users
- manage_roles
- manage_permissions

## Security Best Practices

### For Developers

1. **Never commit secrets** — Use `.env` files, never commit `.env`
2. **Validate all inputs** — Even if client-side validation exists
3. **Use parameterized queries** — Always use Supabase client methods
4. **Check permissions** — Even for simple operations
5. **Log important actions** — Admin operations, payment verification, etc.
6. **Use HTTPS** — Always in production
7. **Update dependencies** — Run `npm audit` regularly
8. **Review dependencies** — Before adding new ones

### For Operations

1. **Rotate secrets** — Every 90 days recommended
2. **Monitor activity** — Check admin_activity_logs regularly
3. **Backup data** — Daily automated backups via Supabase
4. **Update software** — Apply security patches immediately
5. **Monitor logs** — Set up alerts for errors and anomalies
6. **Test disaster recovery** — Monthly backup restoration tests
7. **Access control** — Principle of least privilege
8. **Audit trails** — Keep for at least 1 year

### For Users

1. **Use strong passwords** — 8+ chars, mixed case, numbers
2. **Enable OAuth** — When available for convenience
3. **Don't share credentials** — Each user gets unique login
4. **Review certificates** — Verify on public verification page
5. **Report issues** — Security vulnerabilities to info@nssoftwaresolutions.in

## Vulnerability Disclosure

### Reporting Security Issues

**Do not** open public issues for security vulnerabilities.

Instead:
1. Email: **security@nssoftwaresolutions.in**
2. Include description, steps to reproduce, impact
3. Allow 48 hours for acknowledgment
4. Receive update on fix timeline
5. Coordinated disclosure once patched

## Compliance Standards

### Data Protection

- **GDPR:** Right to deletion, data portability implemented
- **Privacy Policy:** Available at `/privacy`
- **Terms of Service:** Available at `/terms`

### Financial

- **PCI DSS:** Razorpay handles payment processing
- **Tax Compliance:** GST calculation (18% India standard)

### Audit & Logging

- **Activity Logs:** 28 action types, IP + user agent logged
- **Email Logs:** Send status, open tracking, error logging
- **Retention:** Activity logs kept for 1 year, email logs for 90 days

## Incident Response

### Response Plan

1. **Detection** — Alerts triggered, manual investigation
2. **Containment** — Isolate affected systems
3. **Investigation** — Root cause analysis
4. **Remediation** — Fix vulnerability
5. **Recovery** — Restore normal operations
6. **Post-Incident** — Review and improve

### Incident Categories

| Category | Response Time | Escalation |
|----------|---------------|------------|
| Critical (data breach) | 1 hour | Immediate |
| High (service down) | 2 hours | ASAP |
| Medium (feature broken) | 4 hours | Next business day |
| Low (minor issue) | 1 day | When convenient |

## Testing & Validation

### Security Testing

- **OWASP Top 10** testing
- **Dependency scanning** with npm audit
- **Code review** for security issues
- **Penetration testing** (external annual)

### Automated Testing

```bash
# Check for vulnerabilities
npm audit

# Update audit database
npm audit fix

# Check dependencies
npm outdated
```

## Environment Security

### Production Environment

```bash
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://internships.nssoftwaresolutions.in
```

**Security checks:**
- No debug logging
- Error details hidden from users
- HTTPS enforced
- CORS restricted to known origins

### Development Environment

```bash
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Security checks:**
- No production credentials
- Use test data only
- Never connect to production database

## Secrets Management

### Environment Variables

Never commit these to version control:

- `JWT_SECRET` — Application JWT signing key
- `SUPABASE_SERVICE_ROLE_KEY` — Database admin key
- `CRON_SECRET` — Cron job authorization
- `RAZORPAY_KEY_SECRET` — Payment gateway secret
- `CLOUDINARY_API_SECRET` — File storage secret
- `GOOGLE_CLIENT_SECRET` — OAuth secret
- `EMAIL_PASS` — SMTP password

### Rotation Schedule

- **JWT_SECRET:** Every 90 days
- **API Keys:** Every 180 days
- **Passwords:** Every 90 days
- **Tokens:** Automatic (refresh tokens)

## Security Checklist

- [ ] All environment variables configured
- [ ] HTTPS enabled in production
- [ ] Rate limiting tested
- [ ] Authentication flows tested
- [ ] Authorization checks verified
- [ ] Sensitive data encrypted
- [ ] Logs configured
- [ ] Backups scheduled
- [ ] Disaster recovery tested
- [ ] Security audit completed
- [ ] Dependencies updated
- [ ] Secrets rotated
- [ ] Incident response plan documented
- [ ] Team trained on security policies

## Security Resources

- [OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [HTTPS Everywhere](https://https.cern.ch/display/https/HTTPS+Everywhere)

## Contact

For security questions or to report vulnerabilities:

- **Email:** security@nssoftwaresolutions.in
- **Response Time:** Within 48 hours
- **Disclosure Policy:** Coordinated disclosure
