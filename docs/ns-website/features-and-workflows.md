---
id: features-and-workflows
title: Features & Workflows
---

# Features & Workflows

Complete feature documentation and user flows for the NS Software Solutions website.

## Guest User Workflow (Public Access)

### A. Exploring the Project Catalog

The public `/projects` page is the core of the platform.

#### Dynamic Filtering

Filter 100+ projects by:
- **Domain:** Machine Learning, Python, PHP, Blockchain, Deep Learning
- **Price Tier:** Under ₹1000 / ₹1000–₹5000 / Above ₹5000
- **IEEE Certification:** Filter for IEEE-certified projects
- **Technology:** Filter by specific tech tags (React, Django, etc.)

#### Search Functionality

- Real-time search by project title, description, or keyword
- Case-insensitive matching across all project fields
- Instant results with no page reload

#### Project Details Page (`/projects/:slug`)

- Screenshot carousel with navigation and thumbnails
- Technology tags displayed as badges
- Full description and key features
- Pricing information with documentation availability badge
- IEEE certification badge if applicable
- WhatsApp and Email request buttons

### B. Submitting Project Inquiries

#### WhatsApp/Email Request Flow

1. User clicks **WhatsApp** or **Email** button on project card
2. Modal appears capturing:
   - Name (required, validated)
   - Email (required, email format validated)
   - Phone (optional, WhatsApp requests)
3. Two things happen simultaneously:
   - A `project_requests` record saved to database
   - User redirected to WhatsApp Web or email client with pre-filled message
4. **Rate Limiting:** 5 requests per minute per IP

#### Modal Features

- Form validation with error messages
- Loading state during submission
- Success toast notification
- Automatic WhatsApp deeplink generation with pre-filled message
- Mailto link for email requests

### C. Services Page (`/services`)

Six service categories offered:

| Service | Description |
|---------|-------------|
| Academic Projects | End-to-end project development for students |
| Research Paper Assistance | Help with research paper writing and publication |
| Plagiarism Check | Document plagiarism detection service |
| Multimedia | Video creation, presentations, animations |
| Workshops | Live training workshops for students and professionals |
| Business Solutions | Custom software solutions for businesses |

**Service Request Form:**
- Captures: Name, Email, Service Type, Message
- Rate limited: 3 requests per minute
- Saved to `service_requests` table
- Admin receives notification

**FAQ Accordion:**
- 8-12 FAQs per service category
- Collapsible sections with smooth animations
- SEO-structured data (schema.org/FAQPage)

### D. Blog System

#### Published Blog Posts

| Post | Path | Topics |
|------|------|--------|
| Project Ideas for CSE Students | `/blogs/project-ideas-for-cse-students` | Top 10 final year projects, domains, trends |
| How to Ace Your Viva | `/blogs/how-to-ace-your-viva` | Viva preparation, common questions, tips |
| Why Documentation Matters | `/blogs/why-documentation-matters` | Documentation importance, best practices |

**Blog Post Features:**
- Individual meta tags, Open Graph, Twitter cards
- Author and publish date display
- Time-to-read indicator
- Related posts suggestions
- SEO-structured data (schema.org/BlogPosting)
- Share on social media buttons

### E. City Landing Pages (`/final-year-projects/:city`)

Dynamic landing pages for local SEO:
- **Cities:** Hyderabad, Nandyal, Kurnool, Bangalore, Chennai (expandable)
- **Content:** City-specific project listings, local testimonials
- **SEO:** Local keywords targeting ("Final Year Projects in Hyderabad")
- **Schema:** Organization + LocalBusiness structured data

### F. Contact Form (`/contact`)

**Fields:**
- Name (required, text, max 100 chars)
- Email (required, email format)
- Message (required, textarea, min 10 chars)

**Features:**
- Form validation with real-time feedback
- Rate limiting: 3 submissions per minute
- Saved to `contact_messages` table
- Admin receives notification
- Success confirmation toast

## Authenticated User Workflow

### A. Registration & Login

#### Signup Process

1. User navigates to `/login`
2. Fills email and password
3. Supabase Auth handles credential validation
4. On success:
   - JWT tokens generated (access + refresh)
   - `profiles` table record auto-created via trigger
   - Tokens stored in `sessionStorage` for security
   - Redirect to `/user/dashboard`

#### Login Process

- Email/password validation
- JWT tokens refreshed on each request
- PKCE flow for secure token exchange
- Auto-refresh on token expiration (15 min access, 30 day refresh)

#### Security Features

- PKCE flow (Proof Key for Code Exchange)
- Secure token storage in sessionStorage (not localStorage)
- HttpOnly cookie not used (sessionStorage chosen for SPA)
- Auto-logout after 30 minutes of inactivity

### B. User Dashboard (`/user/dashboard`)

#### Dashboard Stats

- **Total Purchases:** Count of user's purchases
- **Active Requests:** Count of pending custom requests
- **Completed Projects:** Count of finished purchases
- **Last Login:** Timestamp of previous login

#### Quick Actions

- Request Project (link to `/user/request-project`)
- View My Projects (link to `/user/my-projects`)
- Update Profile (link to `/user/profile`)

#### Recent Activity

- List of 5 most recent purchases/requests
- Status badge (Pending, In Progress, Completed)
- Links to detailed view

### C. My Projects (`/user/my-projects`)

#### Project Cards

Display all purchases linked to the user:

| Card Element | Details |
|--------------|---------|
| Title | Project name |
| Date | Purchase date formatted |
| Status | Pending / Confirmed / In Progress / Completed |
| Progress | Visual progress bar (0–100%) |
| Payment Status | Paid / Pending |
| Actions | Download (if complete), View Details |

#### Download Files

When admin marks purchase as complete:
- Source Code download link
- Documentation download link
- Demo video link
- Any custom files attached

#### Pagination

- 10 items per page
- Previous/Next navigation

### D. Request Project (`/user/request-project`)

#### Request Types

| Type | Purpose |
|------|---------|
| Purchase | Buy an existing project |
| Demo | Request a demo/trial |
| Customization | Customize an existing project |
| General Inquiry | General question about a project |

#### Form Fields

- **Project Selection:** Dropdown of 100+ projects
- **Request Type:** Select from 4 types above
- **Message:** Textarea for custom details (min 10 chars)
- **Attachment:** Optional file upload (PDFs, images)

#### Status Tracking

- **Pending:** Admin hasn't responded
- **Contacted:** Admin has reached out
- **Completed:** Project delivered

Admin responses visible inline with timestamps.

### E. Profile Management (`/user/profile`)

#### Profile Information

- **Name:** Editable text field
- **Email:** Display-only (set at signup)
- **Phone:** Editable, optional
- **College:** Editable, optional
- **Department:** Editable, optional

#### Security

- **Change Password:** Modal form with:
  - Current password (validated)
  - New password (min 8 chars, regex: uppercase + lowercase + number)
  - Confirm password (must match)
  - Save button with loading state

#### Session Management

- **Current Session:** IP address, device, browser, login time
- **Recent Sessions:** List of 5 last login sessions
- **Logout All Devices:** Single button to sign out everywhere
- **Activity Log:** Last 10 activities (page views, form submissions)

### F. Session Security Features

#### Auto-Logout After Inactivity

- 30-minute idle timeout
- Countdown modal warns user at 2 minutes remaining
- Click "Stay Logged In" to reset timer
- Redirect to `/login` if timeout occurs

#### Activity Tracking

- `useUserActivity` hook tracks:
  - Mouse movement
  - Keyboard input
  - Scroll events
  - Touch/click events
- Updates `profiles.last_active_at` every 2 minutes
- Sets `is_online = true` on activity
- Sets `is_online = false` on inactivity/logout

## Admin Workflow

Admins access CRM-style backend at `/admin` (role-based RBAC).

### A. Admin Dashboard (`/admin`)

#### Dashboard Stats

- **Total Projects:** Count of all projects
- **Service Requests:** Count of pending service requests
- **Contact Messages:** Count of unread contact messages
- **User Count:** Total registered users
- **Active Users:** Currently online user count

#### Recent Activity Feed

Color-coded status indicators:
- 🟢 Green: New project added
- 🔵 Blue: New user registered
- 🟠 Orange: New request received
- 🔴 Red: Issue/payment failed

#### Admin Notifications

- Bell icon in sidebar shows unread count
- Click to open notification panel
- Mark as read individually or all at once
- Notification types: New Request, Payment Completed, User Signup, Error Alert

### B. Project Management (`/admin/projects`)

#### CRUD Operations

**Create Project:**
- Modal form with all fields
- Screenshot upload with preview
- Auto-generate slug from title
- SEO fields (meta description, keywords)

**Edit Project:**
- Pre-populated form with current values
- Update any field
- Replace or add new screenshots
- Modify SEO metadata

**Delete Project:**
- Confirmation modal
- Soft delete (sets status to inactive)
- Cascade to related requests/purchases

**List Projects:**
- Table view with pagination (25/page)
- Filter by status (Active/Inactive/Draft/Published)
- Sort by date, title, price, featured
- Quick edit/delete actions

#### Project Fields

| Field | Type | Notes |
|-------|------|-------|
| Title | Text | Required, unique |
| Description | Textarea | Short description for cards |
| Short Description | Text | Subtitle for cards |
| Full Description | Rich Text | Detailed HTML content |
| Technologies | Multi-select | Tags like React, Django, etc |
| Screenshots | File Upload | Multiple files with preview |
| Price | Number | In INR, optional |
| Show Price | Toggle | Hide price if not set |
| Slug | Text | URL-friendly, auto-generated |
| Featured | Checkbox | Show badge on card |
| IEEE | Checkbox | IEEE certification badge |
| Documentation | Checkbox | Documentation addon available |
| Status | Select | active / inactive |
| Visibility | Select | published / draft |
| Meta Description | Text | SEO meta description |
| Meta Keywords | Tags | SEO keywords array |

### C. User Management (`/admin/user-manager`)

#### User List

Columns:
- Name
- Email
- Registration Date
- Last Login
- Online Status (🟢/🔴)
- Actions (View, Edit, Ban, Delete)

#### User Details

- Profile information
- Registration and last login timestamps
- Online/offline status
- Purchase history summary
- Request history summary
- Admin notes (editable)
- Session list with IP, browser, device

#### User Actions

- **Edit:** Update name, email, notes
- **Ban:** Disable user account (prevents login)
- **Delete:** Soft delete user (cascade to purchases)
- **View Sessions:** See all active and past sessions
- **View Activity:** See all user activities

#### Pagination

- 25 items per page
- Search by email or name
- Sort by registration date, last login

### D. Purchase Management (`/admin/purchases`)

#### Create Purchase

Modal form:
- **Select User:** Dropdown of registered users
- **Select Project:** Dropdown of projects
- **Amount:** Number field, INR
- **Initial Status:** pending/confirmed/in_progress/completed/cancelled

#### Edit Purchase

Update any field:
- Status dropdown
- Amount (numeric)
- Progress slider (0–100%)
- Payment status (pending/paid/failed)
- Admin notes (textarea)

#### Manage Files

**Attach File:**
- Filename (required)
- File URL or Google Drive link
- File type: Source Code / Documentation / Demo Video / Other
- Download link preview

**Delete File:**
- Confirmation modal
- Remove from purchase

#### Purchase List

Table columns:
- Project Name
- User Email
- Amount (₹)
- Status (badge)
- Payment Status (badge)
- Progress (%)
- Date
- Actions (Edit, Delete)

Pagination: 25 per page  
Filters: Status, Payment Status, Date Range

### E. Requests Management (`/admin/requests`)

Four tabs managing different request types:

#### Tab 1: Service Requests (from `/services`)

| Column | Details |
|--------|---------|
| Service Type | Selected service |
| Customer Name | Submitter name |
| Email | Contact email |
| Message | Request details |
| Status | pending / in_progress / responded / completed |
| Date | Submission date |

#### Tab 2: Project Requests (from project cards)

| Column | Details |
|--------|---------|
| Project Name | Requested project |
| Customer Name | Submitter name |
| Email | Contact email |
| Phone | Contact number |
| Request Type | whatsapp / email |
| Status | pending / in_progress / responded / completed |

#### Tab 3: Web Requests (from user `/user/request-project`)

| Column | Details |
|--------|---------|
| Project Name | Requested project |
| User Email | Logged-in user email |
| Request Type | Purchase / Demo / Customization / Inquiry |
| Message | Request details |
| Status | pending / in_progress / responded / completed |

#### Tab 4: Contact Messages (from `/contact`)

| Column | Details |
|--------|---------|
| Submitter Name | Contact name |
| Email | Contact email |
| Message | Inquiry message |
| Status | pending / in_progress / responded / completed |

#### Request Actions

For each request:
- **Update Status:** Change status with dropdown
- **Add Admin Notes:** Textarea for internal notes
- **Mark as Read:** Remove new badge
- **Delete:** Remove request record
- **Reply:** Send email response (optional feature)

### F. Admin Notifications

#### Notification Panel

Accessible via bell icon in sidebar:
- Unread count badge
- List of recent notifications
- Each notification shows:
  - Title (e.g., "New Service Request")
  - Message (brief description)
  - Type badge (info / warning / success / error)
  - Timestamp (e.g., "2 hours ago")
  - Mark as read button

#### Notification Types

| Type | Trigger |
|------|---------|
| New User | User signs up |
| New Request | Service/Project/Web/Contact request submitted |
| Purchase Created | Admin creates purchase for user |
| Purchase Completed | Admin marks purchase as completed |
| Payment Received | Payment marked as paid |
| Error | System error (optional) |

## Role-Based Access Control (RBAC)

### Roles

| Role | Access Level | Permissions |
|------|--------------|-------------|
| **Super Admin** | Full | All operations + user management |
| **Admin** | High | Project, purchase, request management |
| **User** | Medium | Dashboard, my projects, profile |
| **Guest** | Low | Browse, search, filter projects |

### Protected Routes

```
/user/*       → Only users (onlyUser)
/admin/*      → Only admins (onlyAdmin)
```

### Route Protection Logic

`ProtectedRoute` component checks:
1. Is user authenticated (JWT valid)?
2. Does `profiles.role` match required role?
3. If yes → render component
4. If no → redirect to `/login`



---

## Navigation

<div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>

[← Database Schema](/docs/ns-website/database-schema) | [Back to Overview](/docs/ns-website/overview)

</div>