# Admin Reporting - Performance Optimization Guide

## Database Index Recommendations

To ensure optimal query performance for the reporting APIs, the following indexes are recommended. Most of these already exist in the schema, but verify and add any missing ones.

### Existing Indexes (Verified)

```prisma
// Users table
@@index([createdAt])  // ✓ For user growth reports
@@index([roleId])     // ✓ For instructor filtering  
@@index([isActive])   // ✓ For active user filtering

// Enrollments table
@@index([statusCode])           // ✓ For completion/dropoff reports
@@index([enrolledAt])          // ✓ For date filtering
@@index([courseId, statusCode]) // ✓ For course performance
@@index([userId])              // ✓ For user enrollments
@@index([courseId])            // ✓ For course enrollments

// Courses table
@@index([instructorId])  // ✓ For instructor performance
@@index([statusCode])    // ✓ For course filtering
@@index([isActive])      // ✓ For active courses
@@index([averageRating]) // ✓ For top courses

// Payments table
@@index([createdAt])  // ✓ For revenue reports
@@index([statusCode]) // ✓ For payment filtering
@@index([courseId])   // ✓ For course revenue

// PointsLedger table
@@index([userId])                   // ✓ For user points
@@index([createdAt])                // ✓ For time-based filtering
@@index([referenceId, referenceType]) // ✓ For course points
@@index([sourceCode])               // ✓ For source filtering

// CourseReview table
@@index([courseId])    // ✓ For rating aggregation
@@index([userId])      // ✓ For user reviews
@@index([isPublished]) // ✓ For published reviews
@@index([rating])      // ✓ For rating filtering
```

### Missing Indexes (Add if needed)

If your current schema is missing any of these, add them via migration:

```prisma
// In Course model, add if missing:
@@index([categoryId]) // For category-based reports

// In CourseProgress model, add if missing:
@@index([statusCode])       // For progress filtering
@@index([progressPercent])  // For progress-based queries
```

To add missing indexes:
```bash
# 1. Update schema.prisma with missing indexes
# 2. Generate migration
npx prisma migrate dev --name add_reporting_indexes

# 3. Apply migration
npx prisma migrate deploy
```

---

## Query Performance Tips

### 1. Use Prisma Aggregations
✅ **Good:** Use `aggregate()`, `groupBy()`, `count()`
```javascript
const total = await prisma.enrollment.count({ where: { statusCode: 'COMPLETED' } });
```

❌ **Bad:** Fetch all records and count in JS
```javascript
const enrollments = await prisma.enrollment.findMany();
const total = enrollments.filter(e => e.statusCode === 'COMPLETED').length;
```

### 2. Limit Selected Fields
✅ **Good:** Use `select` to fetch only needed fields
```javascript
select: { id: true, title: true, averageRating: true }
```

❌ **Bad:** Fetch entire records
```javascript
// Fetches all fields unnecessarily
```

### 3. Avoid N+1 Queries
✅ **Good:** Use `include` or batch queries with `Promise.all`
```javascript
const instructors = await prisma.user.findMany({
  include: { coursesCreated: true }
});
```

❌ **Bad:** Loop and query individually
```javascript
for (const instructor of instructors) {
  const courses = await prisma.course.findMany({ where: { instructorId: instructor.id } });
}
```

### 4. Use Connection Pooling
Already configured via Prisma, but verify your database URL includes pool settings:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10"
```

---

## Caching Strategy (Optional)

For heavy reports accessed frequently, implement Redis caching:

### Installation
```bash
npm install redis
```

### Implementation Example

```javascript
// utils/cache.helper.js
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

const getCachedReport = async (key) => {
  await connectRedis();
  const cached = await client.get(key);
  return cached ? JSON.parse(cached) : null;
};

const cacheReport = async (key, data, ttl = 60) => {
  await connectRedis();
  await client.setEx(key, ttl, JSON.stringify(data));
};

module.exports = { getCachedReport, cacheReport };
```

### Usage in Service

```javascript
// In adminReporting.service.js
const { getCachedReport, cacheReport } = require('../Utils/cache.helper');

const getUserGrowthReport = async (period, from, to) => {
  // Generate cache key
  const cacheKey = `report:user-growth:${period}:${from}:${to}`;
  
  // Check cache
  const cached = await getCachedReport(cacheKey);
  if (cached) {
    console.log('[CACHE HIT] User growth report');
    return cached;
  }
  
  // Compute report
  const reportData = await computeUserGrowthReport(period, from, to);
  
  // Cache result (60 seconds TTL)
  await cacheReport(cacheKey, reportData, 60);
  
  return reportData;
};
```

**Cache TTL Recommendations:**
- User Growth: 60-300 seconds
- Course Completion: 60 seconds
- Revenue: 30 seconds (more sensitive)
- Instructor Performance: 300 seconds (less frequent changes)

---

## Cron Job for Pre-computed Reports

For very large datasets (100k+ records), consider pre-computing daily snapshots.

### Cron Job Script

Create `scripts/computeDailyReports.js`:

```javascript
const { prisma } = require('../src/Prisma/client');
const adminReportingService = require('../src/Services/adminReporting.service');

/**
 * Pre-compute and store daily report snapshots
 * Run this script daily at midnight via cron
 */
async function computeDailySnapshots() {
  console.log('[CRON] Starting daily report computation...');
  
  try {
    // Define reports to pre-compute
    const reports = [
      { type: 'user-growth', fn: () => adminReportingService.getUserGrowthReport('daily') },
      { type: 'course-completion', fn: () => adminReportingService.getCourseCompletionReport() },
      { type: 'revenue', fn: () => adminReportingService.getRevenueReport('monthly') },
    ];
    
    for (const report of reports) {
      console.log(`[CRON] Computing ${report.type}...`);
      const data = await report.fn();
      
      // Store in database (requires ReportSnapshot model)
      await prisma.reportSnapshot.create({
        data: {
          reportType: report.type,
          reportData: JSON.stringify(data),
          computedAt: new Date(),
        }
      });
      
      console.log(`[CRON] Saved ${report.type} snapshot`);
    }
    
    // Clean up old snapshots (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await prisma.reportSnapshot.deleteMany({
      where: { computedAt: { lt: thirtyDaysAgo } }
    });
    
    console.log('[CRON] Daily report computation completed successfully');
  } catch (error) {
    console.error('[CRON] Error computing daily reports:', error);
    // Send alert to monitoring system
  } finally {
    await prisma.$disconnect();
  }
}

// Run the job
computeDailySnapshots();
```

### Crontab Configuration

```bash
# Edit crontab
crontab -e

# Run daily at midnight
0 0 * * * cd /path/to/project && node scripts/computeDailyReports.js >> logs/cron.log 2>&1

# Alternative: Run every 6 hours
0 */6 * * * cd /path/to/project && node scripts/computeDailyReports.js >> logs/cron.log 2>&1
```

### ReportSnapshot Model (Optional)

If implementing cron job, add this model to `schema.prisma`:

```prisma
model ReportSnapshot {
  id          String   @id @default(uuid())
  reportType  String   @map("report_type") // 'user-growth', 'revenue', etc.
  reportData  Json     @map("report_data")  // Stored as JSON
  computedAt  DateTime @default(now()) @map("computed_at")
  
  @@index([reportType])
  @@index([computedAt])
  @@map("report_snapshots")
}
```

Then run migration:
```bash
npx prisma migrate dev --name add_report_snapshots
```

---

## Monitoring Query Performance

### Enable Prisma Query Logging

In development, enable query logging to identify slow queries:

```javascript
// src/Prisma/client.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

// Log slow queries (> 1 second)
prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    console.warn('⚠️  SLOW QUERY:', e.query);
    console.warn('   Duration:', e.duration, 'ms');
    console.warn('   Params:', e.params);
  }
});

module.exports = { prisma };
```

### Analyze Query Plans

For PostgreSQL, analyze query execution plans:

```sql
EXPLAIN ANALYZE 
SELECT * FROM enrollments 
WHERE status_code = 'COMPLETED' 
AND enrolled_at >= '2026-01-01';
```

Look for:
- Sequential scans → Add index
- High execution time → Optimize query

---

## Performance Benchmarks

Expected response times (with indexes):

| Report Type              | Expected Time | Threshold |
|-------------------------|---------------|-----------|
| User Growth             | < 500ms       | 1s        |
| Course Completion       | < 300ms       | 1s        |
| Drop-off Rate          | < 400ms       | 1s        |
| Popular Categories      | < 600ms       | 1.5s      |
| Revenue                 | < 400ms       | 1s        |
| Instructor Performance  | < 1s          | 2s        |
| Course Performance      | < 800ms       | 2s        |
| Badge Distribution      | < 200ms       | 500ms     |
| Points Distribution     | < 300ms       | 1s        |

If queries exceed thresholds consistently:
1. Check indexes are present
2. Analyze query plans
3. Consider caching
4. Implement pre-computation

---

## Load Testing

Use tools like Apache Bench or Artillery to test report endpoints:

```bash
# Install Artillery
npm install -g artillery

# Create test script (artillery-test.yml)
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'User Growth Report'
    flow:
      - get:
          url: '/api/admin/reports/user-growth?period=monthly'
          headers:
            Authorization: 'Bearer YOUR_ADMIN_TOKEN'

# Run test
artillery run artillery-test.yml
```

---

## Summary

✅ **Implemented:**
- All necessary indexes already exist in schema
- Efficient Prisma queries with aggregations
- Promise.all for parallel execution
- Field selection to minimize data transfer

🔧 **Optional Enhancements:**
- Redis caching (60s TTL recommended)
- Daily cron job for pre-computed snapshots
- Query performance monitoring
- Load testing

🎯 **Performance Goals:**
- All reports < 2 seconds
- No N+1 queries
- Minimal memory footprint
- Scalable to 100k+ records
