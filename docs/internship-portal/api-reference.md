---
id: api-reference
title: API Reference
---

# API Reference

Complete API documentation for the NS Internship Portal.

## Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000` |
| Production | `https://internships.nssoftwaresolutions.in` |

## Authentication

All protected routes require a JWT access token sent as:

- `auth-token` HttpOnly cookie (preferred)
- `Authorization: Bearer <token>` header (fallback)

**Access token expiry:** 15 minutes
**Refresh token expiry:** 30 days (auto-rotated, stored hashed in DB)

On 401, clients should call `POST /api/auth/refresh` to get a new access token silently.

## Auth Endpoints

### POST /api/auth/register

Register a new student account.

**Rate limit:** 3/min per IP

**Request:**

```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "SecurePass1",
  "phone": "9876543210",
  "college": "Example University"
}
```

- Password: min 8 chars, uppercase, lowercase, number
- Phone: required
- Disposable email domains blocked (mailinator, tempmail, etc.)

**Response (200):**

```json
{
  "success": true,
  "user": { "id": "uuid", "name": "...", "email": "...", "role": "student" },
  "token": "eyJ..."
}
```

Sets `auth-token` (15min) and `refresh-token` (30day) HttpOnly cookies.

### POST /api/auth/login

**Rate limit:** 5/min per IP.

**Request:** `{ "email": "...", "password": "..." }`

**Response (200):** Same as register. Sets both cookies.

### POST /api/auth/logout

Revokes the refresh token in DB and clears both cookies.

**Auth required:** Yes

### POST /api/auth/refresh

Exchange a valid refresh token for a new access + refresh token pair (rotation).

**Auth required:** `refresh-token` cookie

**Response (200):**

```json
{ "success": true, "user": { ... }, "token": "new_access_token" }
```

Sets new `auth-token` and `refresh-token` cookies. Old refresh token is revoked.

### GET /api/auth/me

Returns current user profile.

**Auth required:** Yes

### GET /api/auth/permissions

Returns permissions array for the current user.

**Auth required:** Yes

### GET /api/auth/google

Initiates Google OAuth 2.0 sign-in.

**Auth required:** No

### GET /api/auth/google/callback

Google OAuth callback.

**Auth required:** No (called by Google)

- Blocks disposable email domains
- Auto-populates `avatar_url` from Google profile picture on new accounts
- Redirects to `/dashboard` on success

## Profile Endpoints

### GET /api/profile

Returns full user profile including extended fields.

**Auth required:** Yes

### PUT /api/profile

**Auth required:** Yes. Email and role are immutable.

**Request:**

```json
{
  "name": "...",
  "phone": "...",
  "college": "...",
  "degree": "...",
  "branch": "...",
  "year_of_study": 3,
  "graduation_year": 2026,
  "birthday": "2002-05-15",
  "gender": "male",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "India",
  "linkedin_url": "https://linkedin.com/in/...",
  "github_url": "https://github.com/..."
}
```

### POST /api/profile/avatar

Upload a profile avatar to Cloudinary.

**Auth required:** Yes

**Request:** `multipart/form-data` with `file` field (image).

**Response (200):** `{ "avatarUrl": "https://res.cloudinary.com/..." }`

## Domains (Public)

### GET /api/domains

All active domains. No auth required.

### GET /api/domains/[slug]

Single domain by slug. No auth required.

## Enrollment Endpoints

### POST /api/enrollments/create

**Auth required:** Yes (student)

**Request:**

```json
{ "domainId": "uuid", "duration": 2, "couponCode": "SAVE20" }
```

`duration` must be 1, 2, or 3. `couponCode` optional.

**Response (200):** Enrollment object with amount, discount, payment status.

**Errors:** 400 (invalid duration), 404 (domain not found), 409 (active enrollment exists)

### GET /api/enrollments/my-enrollments

Returns all enrollments for the logged-in student.

**Auth required:** Yes

### POST /api/enrollments/verify-payment

Verify Razorpay payment (HMAC-SHA256 signature check).

**Auth required:** Yes

**Request:** `{ "enrollmentId": "uuid", "paymentId": "pay_xxx", "orderId": "order_xxx", "signature": "..." }`

### POST /api/enrollments/[id]/submit

Submit final project.

**Auth required:** Yes (enrolled student)

**Request:** `{ "submissionEmail": "ravi@example.com" }`

### POST /api/enrollments/[id]/cancel

Cancel an active or pending enrollment.

**Auth required:** Yes (enrolled student)

## Milestone Endpoints

### GET /api/milestones?enrollmentId=[id]

Get all milestones for an enrollment.

**Auth required:** Yes

### POST /api/milestones/[id]/submit

Submit or resubmit a milestone.

**Auth required:** Yes (enrolled student)

**Request:** `{ "submissionNotes": "Completed the login module..." }` (min 10 chars)

**Sequential rules:**
- Only `pending` or `rejected` milestones can be submitted
- Previous milestone must be `reviewed` (approved) to unlock this one
- `rejected` / `submitted` previous = next stays locked

## Coupon Endpoints

### POST /api/coupons/validate

**Auth required:** Yes

**Request:** `{ "code": "SAVE20", "domainId": "uuid", "amount": 700 }`

**Response:** `{ "valid": true, "discount": 140, "coupon": { ... } }`

## Certificate Endpoints

### GET /api/certificates/my-certificates

**Auth required:** Yes

### GET /api/certificates/verify/[certificateId]

Public. No auth required.

Certificate ID format: `CERT-YY-XXXXXX` (e.g., `CERT-26-P9L2M4`)

**Response (200):**

```json
{
  "valid": true,
  "certificate": {
    "certificateId": "CERT-26-P9L2M4",
    "studentName": "...",
    "domainName": "...",
    "duration": 3,
    "issueDate": "...",
    "expiryAt": null
  }
}
```

**Errors:**
- 404 — not found or revoked
- 410 — expired (`expiry_at` set and past)

## Invoice Endpoints

### GET /api/invoices/my-invoices

**Auth required:** Yes. Query params: `limit`, `offset`.

### GET /api/invoices/[id]/download-simple

Download invoice as PDF.

**Auth required:** Yes (invoice owner)

## Announcement Endpoints

### GET /api/announcements

Returns active announcements for the current user.

**Auth required:** Yes

### POST /api/announcements/[id]/read

Mark an announcement as read.

**Auth required:** Yes

### GET /api/announcements/unread-count

Returns count of unread announcements.

**Auth required:** Yes

## Notification Endpoints

### GET /api/notifications

Unified feed: unread announcements + enrollment changes + milestone reviews. Max 20, sorted newest first.

**Auth required:** Yes

### POST /api/notifications

Mark announcement as read. **Request:** `{ "announcementId": "uuid" }`

**Auth required:** Yes

## Job Endpoints

### GET /api/jobs

**Auth required:** Yes. At least one of `keyword` or `location` required.

**Query params:** `keyword`, `location`, `suggestions=1&q=...` (for autocomplete)

### GET /api/jobs/saved

Returns saved jobs for the current user.

**Auth required:** Yes

### POST /api/jobs/saved

Save a job.

**Request:** `{ "jobId": "uuid" }`

**Auth required:** Yes

### DELETE /api/jobs/saved

Unsave a job.

**Request:** `{ "jobId": "uuid" }`

**Auth required:** Yes

## Resource Endpoints

### GET /api/resources/[enrollmentId]

Get learning resources for an enrollment, grouped by week.

**Auth required:** Yes

## Lead Endpoints

### POST /api/leads

Submit a chatbot lead. No auth required. Rate limited.

**Request:**

```json
{
  "name": "Rahul Sharma",
  "domain": "Web Development",
  "duration": "2 months",
  "phone": "8941709328"
}
```

**Response (200):** `{ "success": true, "message": "Lead captured successfully" }`

On success: saves to `leads` table + sends counselor notification email.

### POST /api/newsletter/subscribe

Subscribe an email to the newsletter. No auth required.

**Request:** `{ "email": "user@example.com" }`

**Response (200):** `{ "success": true }` or `{ "success": true, "alreadySubscribed": true }`

### POST /api/contact

Submit a contact form message. No auth required.

**Request:**

```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "subject": "Query about internship",
  "message": "..."
}
```

**Response (200):** `{ "success": true, "message": "Message sent successfully!" }`

## Admin Endpoints

### GET /api/admin/analytics

**Roles:** admin, super_admin, project_admin, reviewer

**Query:** `?type=platform` or `?type=domains`

Results are cached in-memory (60s TTL).

### GET /api/admin/analytics/engagement

**Roles:** admin, super_admin, project_admin, reviewer

Returns 6 engagement stat tiles: total students, active enrollments, milestone submissions, completion rate, avg completion time, revenue.

### GET /api/admin/analytics/conversion

**Roles:** admin, super_admin, project_admin, reviewer

Returns conversion funnel data: visitors → signups → enrollments → completions.

### GET /api/admin/activity-logs

**Roles:** admin, super_admin

**Query params:** `page`, `limit`, `admin_id`, `action_type`, `entity_type`, `search`, `date_from`, `date_to`

### GET/POST /api/admin/announcements

### GET/PUT/DELETE /api/admin/announcements/[id]

**POST Request:**

```json
{
  "title": "...",
  "content": "...",
  "type": "info|warning|success|error",
  "category": "general|offer|jobs|maintenance|notification",
  "target_audience": "all|registered|enrolled|active|inactive|unenrolled|students|specific_domains",
  "target_domains": ["uuid1", "uuid2"],
  "priority": 1,
  "status": "draft|scheduled|active|inactive",
  "is_active": true,
  "scheduled_for": "2026-04-15T10:00:00",
  "expires_at": "2026-05-15T23:59:59",
  "delivery_channels": {
    "dashboard": true,
    "email": false,
    "banner": false,
    "popup": false
  },
  "send_email": false
}
```

### GET/POST /api/admin/certificate-templates

### PUT /api/admin/certificate-templates/[id]

**Permission:** manage_templates / edit_template

### GET /api/admin/certificates

**Permission:** manage_certificates

### GET/POST /api/admin/coupons

### GET/PUT/DELETE /api/admin/coupons/[id]

### GET/POST /api/admin/domains

### GET/PUT/DELETE /api/admin/domains/[id]

### GET /api/admin/enrollments

**Query params:** `page`, `limit`, `status`, `search`

### GET/PUT /api/admin/enrollments/[id]

### POST /api/admin/enrollments/[id]/approve

Approves enrollment, marks as completed, issues certificate.

### POST /api/admin/enrollments/[id]/repair-milestones

Repairs milestone data integrity for an enrollment.

### POST /api/admin/export

**Permission:** export_data

**Request:** `{ "entity": "users|enrollments|certificates|domains", "filters": {} }`

**Response:** CSV file download.

### GET /api/admin/invoices

### POST /api/admin/invoices/[id]/send

Send invoice to student via email.

### GET/DELETE /api/admin/jobs

### POST /api/admin/jobs/fetch-all

Fetch jobs from all sources (SerpAPI + all RSS feeds).

### POST /api/admin/jobs/fetch-rss

Fetch jobs from RSS feeds only.

### POST /api/admin/jobs/refresh

Refresh job listings for a specific query.

**Request:** `{ "query": "frontend developer" }`

### GET /api/admin/leads

**Roles:** admin, super_admin

**Query params:** `page`, `limit`, `domain`, `status`, `search`, `date_from`, `date_to`

### POST /api/admin/leads/[id]/convert

Convert a lead to a user account.

### PATCH /api/admin/leads/[id]

Update lead details.

### DELETE /api/admin/leads/[id]

Delete a lead.

### POST /api/admin/milestones/[id]/review

**Permission:** review_milestones

**Request:**

```json
{ "remarks": "Good work. Please add error handling.", "action": "approve" }
```

`action`: `"approve"` (default) or `"reject"`.

### POST /api/admin/milestones/[id]/force-status

Directly set a milestone status.

**Roles:** admin, super_admin

**Request:**

```json
{ "status": "reviewed", "remarks": "Status corrected by admin" }
```

### GET /api/admin/resources

### POST /api/admin/resources

### GET/PUT/DELETE /api/admin/resources/[id]

### POST /api/admin/resources/upload

Upload a resource file to Cloudinary.

**Request:** `multipart/form-data` with `file` and `resource_type` fields.

### POST /api/admin/resources/sign

Generate a signed Cloudinary URL.

### GET /api/admin/roles

### GET/PUT /api/admin/roles/[role]

**Roles:** super_admin only

### GET/POST /api/admin/settings

**Allowed keys:** `siteName`, `siteEmail`, `sitePhone`, `siteAddress`, `maintenanceMode`, `maxEnrollmentsPerStudent`

### GET /api/admin/students

Returns all students (simplified list).

### GET /api/admin/submissions

### POST /api/admin/submissions/[id]/approve

### POST /api/admin/submissions/[id]/reject

### GET /api/admin/submissions/milestones

Returns pending / reviewed / rejected milestone submissions.

### GET /api/admin/users

**Roles:** super_admin only

**Query params:** `page`, `limit`, `search`, `role`

### POST /api/admin/users

Create a new admin/reviewer user.

### GET/PUT/DELETE /api/admin/users/[id]

### PUT /api/admin/users/[id]/role

Update user role.

**Roles:** super_admin only

### GET /api/admin/users-list

Returns simplified user list (id, name, email, role).

### GET /api/admin/email-stats

Returns email usage stats.

### GET /api/admin/email-queue

**Roles:** admin, super_admin

**Query params:** `status`, `templateType`, `startDate`, `endDate`, `page`, `limit`

### POST /api/admin/email-queue/retry

Retry a failed email.

**Request:** `{ "emailId": "uuid" }`

### POST /api/admin/email-queue/cancel

Cancel a pending email.

**Request:** `{ "emailId": "uuid" }`

### POST /api/admin/test-email

Send a test email.

**Request:**

```json
{
  "template": "enrollment|certificate|submission|password_reset|milestone_approved|milestone_rejected|announcement|deadline_reminder|offer_letter|job_alert|welcome|inactive_student"
}
```

### POST /api/admin/fix-google-avatars

Batch utility: converts all Google OAuth avatar URLs to use the `/api/proxy-image` proxy.

## Cron Endpoints

All cron endpoints are protected by `Authorization: Bearer <CRON_SECRET>` header.

### GET /api/cron/process-emails

**Schedule:** Daily at 6am UTC

Processes the `email_queue` table.

### GET /api/cron/inactive-students

**Schedule:** Daily at 9am UTC

Sends re-engagement emails to inactive students.

### GET /api/cron/deadline-reminders

**Schedule:** Daily at 8am UTC

Sends deadline reminder emails.

**Response:** `{ "ok": true, "sent": 3, "skipped": 1 }`

### GET /api/cron/job-alerts

**Schedule:** Monday at 9am UTC

Sends weekly domain-matched job digest.

## Email Tracking

### GET /api/email/track?id=\<emailQueueId\>

Email open tracking pixel.

## Error Format

```json
{ "error": "Description of what went wrong" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / invalid input |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 410 | Gone (e.g. expired certificate) |
| 429 | Rate limited |
| 500 | Server error |

## Request/Response Examples

### cURL Example - Login

```bash
curl -X POST https://internships.nssoftwaresolutions.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@nss.dev", "password": "Student@2026"}' \
  -c cookies.txt
```

### JavaScript Example - Create Enrollment

```javascript
const response = await fetch('https://internships.nssoftwaresolutions.in/api/enrollments/create', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    domainId: 'uuid-here',
    duration: 2,
    couponCode: 'SAVE20',
  }),
});

const data = await response.json();
console.log(data);
```

### Python Example - Get Domains

```python
import requests

response = requests.get(
    'https://internships.nssoftwaresolutions.in/api/domains'
)
domains = response.json()
print(domains)
```
