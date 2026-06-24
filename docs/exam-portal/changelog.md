---
id: changelog
title: Changelog
---

# NS Exam Portal - Changelog

## Version 2.0.0 (Current Production) - June 2026

### Major Completed Features

#### 1. **Super Admin Platform Controls** ✅
- **Complete Client Management**: Full CRUD operations for client organizations
- **Subscription Administration**: Plan assignments, expiry management, status updates
- **Package Approval Workflow**: Pay Per Test package request/approval system
- **Platform Settings**: Maintenance mode, announcement banners, registration controls
- **Audit Dashboard**: Comprehensive action logging with filters and export
- **Security Controls**: Client suspension, password reset, access revocation

#### 2. **Subscription System** ✅
- **Four-Tier Subscription Model**: Free, Starter (₹1,999/mo), Growth (₹3,999/mo), Enterprise (custom)
- **Plan-Driven Limits**: Exams/month, candidates/exam, questions/exam with server-side enforcement
- **Feature Flags**: CSV import, XLSX export, analytics, branding, proctoring tied to plans
- **Subscription Requests**: Client upgrade requests with Super Admin approval workflow
- **Automatic Expiry**: Lazy expiry checking on Super Admin page loads
- **History Tracking**: Complete subscription change audit trail

#### 3. **Pay Per Test System** ✅
- **Package Catalog**: Base (₹99), Basic (₹199), Standard (₹399), Professional (₹499), Placement Drive (₹1,499)
- **Inventory Management**: Client package purchases with available/used tracking
- **Capacity Enforcement**: Hard limits on questions and candidates per package
- **Feature Locking**: Proctoring, branding, import/export features tied to packages
- **Read-Only Protection**: Tests become read-only when capacity exhausted
- **Custom Limits**: Super Admin can override package limits per purchase

#### 4. **Exam Engine Enhancements** ✅
- **Section-Based Testing**: Multiple sections with independent configuration
- **Section Timers**: Per-section countdown timers with auto-advance
- **Navigation Locking**: Prevent returning to completed sections
- **Option Shuffling**: Randomize answer choices per question
- **Question Shuffling**: Randomize question order within sections
- **Resume Capability**: Continue interrupted attempts with preserved state

#### 5. **Security Hardening** ✅
- **Guest Attempt Security**: `attempt_token` requirement for all guest operations
- **BOLA/IDOR Protection**: Comprehensive ownership verification across all endpoints
- **Rate Limiting**: Global (1000/15min) and strict (100/1min) tiers
- **Tenant Isolation**: Database-level partitioning with query filtering
- **Input Validation**: Zod schemas for all API inputs
- **CORS Configuration**: Restricted origins with Firebase compatibility

#### 6. **Proctoring System** ✅
- **Event Types**: TAB_SWITCH, WINDOW_BLUR, FULLSCREEN_EXIT, NO_FACE, MULTIPLE_FACES
- **Severity Scoring**: LOW (1), MEDIUM (2-3), HIGH (5) with cumulative risk
- **Evidence Capture**: Base64 image storage for camera events
- **Auto-Submit**: 3-strike system (15+ risk score) triggers automatic submission
- **Feature Gating**: Basic and camera proctoring tied to plans/packages
- **Deduplication**: 30-second window prevents event spam

#### 7. **Analytics & Reporting** ✅
- **Super Admin Dashboard**: Platform-wide metrics, subscription distribution, live activity
- **Client Admin Dashboard**: Tenant-specific analytics, performance metrics, top performers
- **XLSX Reports**: 3-sheet workbooks (Summary, Detailed Questions, Analytics)
- **Secure Downloads**: Signed URLs for guest report access
- **Performance Metrics**: Average scores, pass rates, time analysis
- **Live Monitoring**: Concurrent users, API latency, system health

#### 8. **Bulk Operations** ✅
- **CSV Question Import**: Two-stage validation with batch rollback
- **CSV Student Import**: Bulk student account creation
- **Question Versioning**: Edit tracking with version increments
- **Import Logging**: Complete audit trail of bulk operations
- **Error Handling**: Detailed validation errors with row-level feedback

#### 9. **UI/UX Improvements** ✅
- **Role-Based Layouts**: Different navigation and dashboards per role
- **Responsive Design**: Mobile-optimized interfaces
- **Dark/Light Theme**: System preference detection with toggle
- **Loading States**: Skeleton screens and progress indicators
- **Error Boundaries**: Graceful error handling with recovery options
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Technical Architecture Updates

#### Backend Architecture
- **Database Migration**: PostgreSQL → Turso (libSQL) for edge distribution
- **Containerization**: Docker multi-stage builds for GCP Cloud Run
- **TypeScript**: Full TypeScript implementation with strict mode
- **ESM Modules**: Modern JavaScript modules throughout
- **REST + RPC**: Hybrid API design for complex operations
- **Middleware Stack**: Comprehensive auth, validation, error handling

#### Frontend Architecture
- **Build Tool**: Vite with optimized production builds
- **Component Library**: shadcn/ui with Radix UI primitives
- **State Management**: React Context + local state
- **Code Splitting**: Route-based chunk optimization
- **Performance**: Bundle analysis and optimization
- **Testing**: Component testing with React Testing Library

#### Deployment Infrastructure
- **Frontend**: Cloudflare Pages with edge CDN
- **Backend**: GCP Cloud Run with auto-scaling
- **Database**: Turso with global distribution
- **CI/CD**: GCP Cloud Build automated pipelines
- **Monitoring**: Health checks, logs, performance metrics

## Version 1.0.0 (Initial Release) - 2024

### Foundation Features
- Basic multi-tenant architecture
- Simple test creation and management
- Student exam taking with timer
- Basic grading system
- Firebase authentication
- PostgreSQL database

### Limitations Addressed in v2.0
- No subscription management
- Limited security controls
- No proctoring features
- Basic UI with limited customization
- No bulk operations
- Limited reporting capabilities
- No Pay Per Test system
- Basic deployment on Vercel/Railway

## Roadmap

### Short Term (Next 3 Months)
- Email notification system
- Enhanced proctoring with AI detection
- Payment gateway integration
- Advanced analytics dashboard
- Mobile app development

### Medium Term (6-12 Months)
- Live proctoring with human oversight
- Coding assessment sandbox
- AI-powered question generation
- Integration with LMS systems
- Internationalization support

### Long Term (12+ Months)
- Blockchain-based certificate verification
- AR/VR assessment capabilities
- Predictive cheating detection
- Global deployment with regional compliance
- Enterprise-grade scalability

## Implementation Status

### Fully Implemented (11 features)
- Multi-tenant architecture ✅
- Subscription system (4-tier) ✅
- Pay Per Test system ✅
- Exam engine with timers ✅
- Proctoring with evidence ✅
- Analytics and reporting ✅
- Bulk operations (CSV) ✅
- Security hardening ✅
- Audit logging ✅
- Guest access ✅
- Section-based testing ✅

### Planned Features
- Email notifications
- Payment gateway integration
- Advanced server-side proctoring
- Coding sandbox
- LLM-assisted grading

---

*This changelog documents the evolution of the NS Exam Portal from initial concept to production-grade assessment platform. Regular updates will be made as new features are added and improvements are implemented.*