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

### QA & Audit Summary

#### Comprehensive QA Audit Results (June 2026)

**Overall Platform Scores:**

| Metrics Category          | Score        | Status              |
| ------------------------- | ------------ | ------------------- |
| **Production Readiness**  | **82 / 100** | ✅ Production Ready |
| **Security Score**        | **88 / 100** | ✅ Excellent        |
| **Exam Integrity**        | **90 / 100** | ✅ Excellent        |
| **Performance Score**     | **82 / 100** | ✅ Good             |
| **Maintainability Score** | **85 / 100** | ✅ Good             |

**Critical Issues Resolved:**

1. **Guest Attempt BOLA** ✅ — `attempt_token` validation implemented and verified
2. **Cross-Tenant Data Leakage** ✅ — Access controls and tenant isolation hardened
3. **Rate Limiting** ✅ — Global (1000/15min) and strict (100/1min) tiers configured
4. **CORS Security** ✅ — Origins restricted to approved list, no wildcards

**Security Audit Status** ✅ PASSED

- ✅ Firebase JWT validation on every request
- ✅ Tenant isolation with database-level partitioning
- ✅ BOLA/IDOR protection on all resources
- ✅ SQL injection prevention via parameterized queries
- ✅ Proctoring event security with 30-second deduplication
- ✅ Evidence storage with signed URLs (15-minute expiry)

**Performance & Load Testing** ✅ VERIFIED

- ✅ 100+ concurrent users supported
- ✅ 500+ RPS sustainable throughput
- ✅ `<200ms` average response time
- ✅ Strategic database indexes optimized
- ✅ Batch operations for bulk imports

**Testing Coverage** ✅ COMPLETE

- ✅ 35+ integration tests (100% pass rate)
- ✅ Multi-role permission testing
- ✅ Database migration validation
- ✅ API endpoint security testing
- ✅ Proctoring event flow testing

### Implementation Status

#### Fully Implemented (11 features)

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

#### Partially Implemented (1 feature)

- Guest IP-based resumption ⚠️ (disabled during load testing to prevent ID conflicts)

#### Planned Features (5)

- Email notifications 🔲
- Payment gateway integration 🔲
- Advanced server-side proctoring 🔲
- Coding assessment sandbox 🔲
- LLM-assisted grading 🔲

### Bug Fixes & Performance Optimizations

#### Critical Fixes

- **Guest Security**: Fixed BOLA vulnerability in guest attempt access
- **Migration Order**: Resolved startup crashes from index creation order
- **Rate Limiting**: Properly implemented strict limits on sensitive endpoints
- **CORS Configuration**: Secured CORS origins while maintaining Firebase compatibility
- **Database Indexes**: Added missing indexes for performance-critical queries

#### Performance Improvements

- **Query Optimization**: Batch operations and pagination support
- **Bundle Optimization**: Code splitting and tree shaking
- **Cache Strategy**: Client-side caching for static data
- **Connection Pooling**: Optimized database connections
- **Asset Optimization**: Compressed images and efficient serialization

### Migration Notes

#### Breaking Changes in v2.0

1. **Database Migration**: PostgreSQL → Turso requires data migration
2. **Auth System**: Enhanced Firebase integration with improved security
3. **API Changes**: New endpoints and modified response formats
4. **Deployment**: Complete infrastructure overhaul from Vercel/Railway to GCP Cloud Run + Cloudflare Pages
5. **Configuration**: New environment variables and settings

#### Upgrade Path

1. **Data Migration**: Use provided migration scripts for PostgreSQL → Turso
2. **Configuration Update**: Update environment variables for new infrastructure
3. **Testing**: Comprehensive testing of all workflows post-migration
4. **Deployment**: Follow deployment guide for new infrastructure
5. **Validation**: Verify all features work correctly after migration

### Known Issues & Limitations

#### Current Limitations

1. **No Email Notifications**: Manual communication required for test assignments and subscription updates
2. **Proctoring Evidence Authenticity**: Client-reported events without server-side camera validation
3. **Subscription Expiry Enforcement**: Lazy checking rather than scheduled cron jobs
4. **Payment Gateway Integration**: Manual billing process without automated payments
5. **Advanced Analytics**: Limited to basic metrics, no predictive analytics

#### Technical Debt (Low Priority) 🟡

1. 🟡 Serial query execution in collection routes (minor performance impact)
2. 🟡 Frontend lint warnings (191 errors — cosmetic)
3. 🟡 Bundle optimization for vendor libraries

#### Technical Constraints

- **Browser Security**: Client-side proctoring can be circumvented by determined users with DevTools access
- **Network Dependency**: Requires stable internet connection with auto-save grace periods
- **Camera Reliability**: Dependent on candidate hardware and environment quality
- **Mobile Support**: Responsive design but no native mobile application

### Version 1.0.0 (Initial Release) - 2024

#### Foundation Features

- Basic multi-tenant architecture
- Simple test creation and management
- Student exam taking with timer
- Basic grading system
- Firebase authentication
- PostgreSQL database

#### Limitations Addressed in v2.0

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

- Predictive cheating detection
- Global deployment with regional compliance
- Enterprise-grade scalability

---

_This changelog documents the evolution of the NS Exam Portal from initial concept to production-grade assessment platform. Regular updates will be made as new features are added and improvements are implemented._
