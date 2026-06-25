---
id: performance-optimization
title: Performance Optimization
---

# Performance Optimization

## Frontend Performance

### Code Splitting & Lazy Loading

**Implementation:**

```typescript
// routes/Router.tsx
import { lazy, Suspense } from 'react';

const SuperAdminDashboard = lazy(() => import('./pages/SuperAdmin/Dashboard'));
const ClientAdminDashboard = lazy(() => import('./pages/ClientAdmin/Dashboard'));
const StudentDashboard = lazy(() => import('./pages/Student/Dashboard'));
const TestEngine = lazy(() => import('./pages/Student/Engine'));

export function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/client-admin" element={<ClientAdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/exam" element={<TestEngine />} />
      </Routes>
    </Suspense>
  );
}
```

**Benefits:**

- ✅ Initial bundle reduced (~40% smaller)
- ✅ Only loaded routes downloaded on demand
- ✅ Faster Time to Interactive (TTI)

### Bundle Analysis

**Analyze current bundle:**

```bash
npm run build
npm install -g source-map-explorer
source-map-explorer 'frontend/dist/**/*.js'
```

**Expected breakdown:**

- React & React Router: ~150 KB
- shadcn/ui components: ~180 KB
- Tailwind CSS: ~50 KB (with PurgeCSS)
- App code: ~100 KB
- **Total**: ~480 KB (gzipped: ~120 KB)

**Optimization targets:**

```typescript
// Bad - imports entire library
import * as recharts from "recharts";

// Good - imports only needed components
import { BarChart, Bar, XAxis } from "recharts";

// Better - lazy load charts
const PerformanceChart = lazy(() => import("./charts/Performance"));
```

### Asset Optimization

- Image optimization and compression (WebP format)
- Minification of CSS/JS
- Gzip compression enabled
- Lazy loading for below-the-fold images

### Caching Strategy

- Service worker for offline support
- Browser cache for static assets (1 year TTL)
- API response caching with SWR/React Query

### Build Optimization

- Vite for fast HMR development
- Tree-shaking for unused code
- Route-based chunk splitting

### CSS Optimization (Tailwind Purging)

```javascript
// tailwind.config.ts
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  purge: {
    enabled: true,
    preserveHtmlElements: false,
  },
};
```

**Result**: Removes unused CSS (~50% reduction)

### JavaScript Performance

**Debouncing & Throttling:**

```typescript
// Answer auto-save with debounce (2 seconds)
const debouncedSave = useMemo(
  () =>
    debounce((answers) => {
      apiClient.saveAnswers(answers);
    }, 2000),
  [],
);

// Scroll performance with throttle
const throttledScroll = useMemo(
  () =>
    throttle(() => {
      updateVisibleQuestions();
    }, 100),
  [],
);
```

**React Performance Tips:**

```typescript
// 1. Use React.memo for expensive components
const QuestionCard = React.memo(({ question, onChange }) => {
  return <div>{question.text}</div>;
});

// 2. useCallback for event handlers
const handleAnswerChange = useCallback((answer) => {
  setAnswers(prev => ({ ...prev, answer }));
}, []);

// 3. useMemo for derived state
const score = useMemo(() => {
  return answers.reduce((sum, ans) => sum + getPoints(ans), 0);
}, [answers]);

// 4. Use key prop correctly in lists
{questions.map(q => (
  <QuestionCard key={q.id} question={q} />
))}
```

## Backend Performance

### Database Optimization

**Indexes:**

```sql
CREATE INDEX idx_profiles_client_id ON profiles(client_id);
CREATE INDEX idx_attempts_student_id ON attempts(student_id);
CREATE INDEX idx_attempts_test_id ON attempts(test_id);
CREATE INDEX idx_questions_client_id ON questions(client_id);
-- See database-schema.md for complete index list
```

**Query Optimization:**

- Eager loading for relationships
- Batch queries for multiple records
- Limit/offset pagination
- Select specific columns only

### API Response Optimization

**Pagination Implementation:**

```typescript
// routes/attempts.ts
export async function getAttempts(req: Request, res: Response) {
  const page = Math.max(1, parseInt(req.query.page || "1"));
  const limit = Math.min(100, parseInt(req.query.limit || "20"));
  const offset = (page - 1) * limit;

  // Use Promise.all for parallel queries
  const [totalRows, dataRows] = await Promise.all([
    db.execute(`SELECT COUNT(*) as total FROM attempts`),
    db.execute({
      sql: `SELECT * FROM attempts ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [limit, offset],
    }),
  ]);

  const total = totalRows.rows[0].total;
  return res.json({
    data: dataRows.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
```

### N+1 Query Problem — BAD Pattern

```typescript
// ❌ This causes N+1 queries (slow)
const tests = await db.execute(`SELECT * FROM tests`);
for (const test of tests.rows) {
  const sections = await db.execute({
    sql: `SELECT * FROM test_sections WHERE test_id = ?`,
    args: [test.id],
  });
  test.sections = sections.rows;
}
```

**Solution — Use JOINs:**

```typescript
// ✅ Single query (fast)
const { rows } = await db.execute(`
  SELECT t.*, ts.*
  FROM tests t
  LEFT JOIN test_sections ts ON t.id = ts.test_id
  ORDER BY t.id, ts.position
`);

// Group results in code
const testsMap = new Map();
rows.forEach((row) => {
  if (!testsMap.has(row.test_id)) {
    testsMap.set(row.test_id, { ...row, sections: [] });
  }
  if (row.section_id) {
    testsMap.get(row.test_id).sections.push({
      /* section */
    });
  }
});
```

### Batch Operations

**Bulk Insert Optimization:**

```typescript
// ❌ Slow - Multiple inserts
for (const question of questions) {
  await db.execute({
    sql: `INSERT INTO questions (...) VALUES (...)`,
    args: [/* values */]
  });
}

// ✅ Fast - Batch insert with single query
const values = questions.map(q => [...]).flat();
const placeholders = questions.map(() => '(?,?,?,?)').join(',');
await db.execute({
  sql: `INSERT INTO questions (...) VALUES ${placeholders}`,
  args: values
});
```

### Caching Strategy

- Response caching for immutable data
- CDN caching on Cloudflare
- HTTP cache headers: `Cache-Control: public, max-age=3600`

### Connection Pooling

- Turso client manages connection pooling automatically
- Single client instance reused for all queries
- No manual connection management needed

## Monitoring & Profiling

### Key Performance Indicators

| Metric              | Target   | Notes                  |
| ------------------- | -------- | ---------------------- |
| API Response Time   | `<200ms` | Track p95              |
| Page Load Time      | `<2s`    | Track FCP, LCP         |
| Time to Interactive | `<3.5s`  | Track TTI              |
| Database Query      | `<50ms`  | Track p95              |
| Error Rate          | `<0.1%`  | Track as % of requests |

### Performance Monitoring

- GCP Cloud Monitoring for backend
- Core Web Vitals tracking (FCP, LCP, CLS, TTFB)
- Sentry for error tracking
- Web Vitals API for frontend metrics

## Scaling Considerations

### Horizontal Scaling

- Stateless backend for easy replication
- Load balancing on Cloud Run
- Database connection pooling
- CDN cache distribution

### Vertical Scaling

- Increase Cloud Run memory/CPU
- Database query optimization
- Connection pooling tuning
- Resource allocation

### Data Archival

Old records should be periodically archived to maintain performance:

```sql
-- Archive attempts older than 1 year
DELETE FROM attempts
WHERE submitted_at < date('now', '-1 year')
AND status = 'submitted'
LIMIT 10000;

-- Archive audit logs older than 90 days
DELETE FROM audit_logs
WHERE created_at < date('now', '-90 days')
LIMIT 5000;
```

### Database Scaling

- Query optimization first
- Index strategy refinement
- Read replicas for reporting (via Turso)
- Archiving old data

## Load Testing (k6)

```bash
# Run load test
k6 run backend/loadtest.js

# Expected results
# Should handle 100 concurrent users
# Response times < 500ms
# Error rate < 1%
```

## Performance Monitoring

### Web Vitals Tracking

```typescript
// src/main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### GCP Monitoring

```bash
# View metrics in GCP Console
gcloud run services update exam-portal-api \
  --update-env-vars LOG_LEVEL=INFO

# Create custom performance alerts
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="API High Latency" \
  --condition-display-name="Response time > 500ms"
```

### Profiling

```bash
# Node.js built-in profiler
node --prof backend/dist/server.js
# Visit /api/tests, then stop with Ctrl+C

# Process results
node --prof-process isolate-*.log > profile.txt
```

## Performance Checklist

### Frontend

- [ ] Code splitting implemented
- [ ] Images optimized (WebP, lazy loading)
- [ ] CSS/JS minified (Tailwind PurgeCSS)
- [ ] Bundle < 150 KB gzipped
- [ ] Lighthouse score >90
- [ ] Debounced input handlers
- [ ] React.memo for expensive components

### Backend

- [ ] Database indexes configured
- [ ] Queries profiled and optimized
- [ ] N+1 query patterns eliminated
- [ ] Pagination on list endpoints
- [ ] Batch operations for bulk data
- [ ] Response time `<200ms` p95
- [ ] Rate limiting active
- [ ] Error rate `<0.1%`

### Infrastructure

- [ ] CDN configured (Cloudflare)
- [ ] Caching headers set correctly
- [ ] Monitoring dashboards active
- [ ] Alerts configured
- [ ] Auto-scaling enabled
- [ ] Load balancing verified

## Next Steps

- [Monitoring & Operations](/exam-portal/monitoring-and-operations)
- [Architecture](/exam-portal/architecture)
- [Deployment Guide](/exam-portal/deployment-guide)
