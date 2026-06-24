---
id: features-and-workflows
title: Features & Workflows
---

# Features & Workflows

## Core Features

### Multi-Role System

#### Super Admin
- Tenant management
- Billing administration
- Global settings
- Audit log access
- Security configuration

#### Client Admin
- Question bank management
- Exam creation and configuration
- Student roster management
- Analytics and reporting
- Subscription management

#### Student
- Take exams
- View results
- Download reports
- Review answers
- Track progress

#### Guest Student
- Anonymous exam access
- No account required
- Access via share code
- Limited features

### Exam Management

**Exam Types:**
- Standard exams with mixed question types
- Sectioned exams with time limits per section
- Timed assessments
- Open-ended assignments

**Question Types:**
- Multiple choice (single answer)
- Multiple select (multiple answers)
- Fill in the blank
- Essay/paragraph
- Matching pairs

**Exam Features:**
- Question shuffling
- Option shuffling
- Negative marking
- Review mode
- Partial marking
- Adaptive difficulty

### Proctoring

**Monitoring Options:**
- Camera-based proctoring
- Screen recording
- Continuous photo capture
- Tab switching detection
- Copy-paste prevention

**Event Tracking:**
```
- camera_active/inactive
- tab_switch
- copy_paste_attempt
- keyboard_blur
- mouse_movement
```

### Subscription & Billing

**Plan Types:**
- Starter: Limited exams and students
- Professional: Increased limits
- Enterprise: Custom limits
- Pay Per Test: As-you-go pricing

**Billing Features:**
- Monthly recurring charges
- Pay-per-test credits
- Usage tracking
- Invoice generation
- Payment history

## User Workflows

### Student Exam Flow

```
1. Receive exam link
   ↓
2. Enter student details
   ↓
3. Review exam instructions
   ↓
4. Start exam
   ↓
5. Answer questions
   ↓
6. Submit exam
   ↓
7. View results
   ↓
8. Download report
```

### Admin Exam Creation Flow

```
1. Login to admin dashboard
   ↓
2. Navigate to exams
   ↓
3. Click "Create New Exam"
   ↓
4. Configure exam settings
   ↓
5. Add questions from bank
   ↓
6. Set question order
   ↓
7. Configure scoring
   ↓
8. Publish exam
   ↓
9. Share with students
```

### Question Import Flow

```
1. Prepare CSV/Excel file
   ↓
2. Navigate to question import
   ↓
3. Upload file
   ↓
4. Map columns
   ↓
5. Review validation
   ↓
6. Confirm import
   ↓
7. Questions added to bank
```

## Advanced Features

### Conditional Logic
- Show questions based on previous answers
- Branching exam paths
- Adaptive test difficulty

### Analytics & Reporting
- Student performance analytics
- Question difficulty analysis
- Time-per-question metrics
- Comparative analytics
- Custom report generation

### Integration Points
- REST API for custom integrations
- Webhook support for events
- SSO/SAML integration
- LMS integration

## Next Steps

- [API Reference](/exam-portal/api-reference)
- [Security & Integrity](/exam-portal/security-and-exam-integrity)
- [Monitoring](/exam-portal/monitoring-and-operations)
