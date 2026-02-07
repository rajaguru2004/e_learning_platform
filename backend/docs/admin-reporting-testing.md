# Admin Reporting & Analytics APIs - Testing Guide

## Quick Test Instructions

### 1. Start the Server
```bash
cd /home/suryaguru/StudioProjects/flutter_v_338/e_learning_platform/backend
npm run dev
```

### 2. Get Admin Token

First, login as an admin user:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

Copy the token from the response, then use it in subsequent requests.

---

## Test All 10 Endpoints

### Platform-Level Reports

#### 1. User Growth Report
```bash
# Daily user growth
curl -X GET "http://localhost:3000/api/admin/reports/user-growth?period=daily" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Monthly user growth with date range
curl -X GET "http://localhost:3000/api/admin/reports/user-growth?period=monthly&from=2026-01-01&to=2026-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User growth report retrieved successfully",
  "data": {
    "totalUsers": 150,
    "period": "monthly",
    "labels": ["2026-01", "2026-02"],
    "datasets": [
      {
        "label": "New Users",
        "data": [75, 75]
      },
      {
        "label": "Cumulative Growth",
        "data": [75, 150]
      }
    ]
  }
}
```

#### 2. Course Completion Report
```bash
curl -X GET "http://localhost:3000/api/admin/reports/course-completion" \
  -H "Authorization: Bearer YOUR_TOKEN"

# With date range
curl -X GET "http://localhost:3000/api/admin/reports/course-completion?from=2026-01-01&to=2026-06-30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Course completion report retrieved successfully",
  "data": {
    "totalEnrollments": 500,
    "completedEnrollments": 250,
    "startedEnrollments": 150,
    "enrolledEnrollments": 75,
    "droppedEnrollments": 25,
    "completionPercentage": 50.0,
    "byStatus": [...]
  }
}
```

#### 3. Quiz Performance Report (Placeholder)
```bash
curl -X GET "http://localhost:3000/api/admin/reports/quiz-performance" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Quiz feature not yet available",
  "data": {
    "available": false,
    "message": "Quiz functionality not yet implemented...",
    "plannedMetrics": {...}
  }
}
```

#### 4. Drop-off Rate Report
```bash
curl -X GET "http://localhost:3000/api/admin/reports/dropoff-rate" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Drop-off rate report retrieved successfully",
  "data": {
    "totalEnrollments": 500,
    "incompleteEnrollments": 225,
    "explicitlyDropped": 25,
    "dropOffPercentage": 45.0,
    "averageProgressBeforeDrop": 42.5,
    "breakdown": {
      "enrolled": 75,
      "started": 150
    }
  }
}
```

#### 5. Popular Categories Report
```bash
curl -X GET "http://localhost:3000/api/admin/reports/popular-categories" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Popular categories report retrieved successfully",
  "data": {
    "totalCategories": 5,
    "categories": [
      {
        "categoryId": "uuid-1",
        "categoryName": "Web Development",
        "totalCourses": 25,
        "totalEnrollments": 300,
        "completedEnrollments": 180,
        "completionRate": 60.0
      },
      ...
    ]
  }
}
```

#### 6. Revenue Report
```bash
# Monthly revenue
curl -X GET "http://localhost:3000/api/admin/reports/revenue?period=monthly" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Yearly revenue with date range
curl -X GET "http://localhost:3000/api/admin/reports/revenue?period=yearly&from=2025-01-01&to=2026-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (if payments enabled):**
```json
{
  "success": true,
  "message": "Revenue report retrieved successfully",
  "data": {
    "available": true,
    "totalRevenue": 45000.00,
    "successfulPayments": 450,
    "failedPayments": 25,
    "period": "monthly",
    "labels": ["2026-01", "2026-02"],
    "datasets": [
      {
        "label": "Revenue",
        "data": [22000.00, 23000.00]
      }
    ]
  }
}
```

**Expected Response (if payments disabled):**
```json
{
  "success": true,
  "message": "Payment functionality not enabled",
  "data": {
    "available": false,
    "message": "Payment functionality is not enabled on this platform."
  }
}
```

---

### Drill-Down Reports

#### 7. Instructor Performance Report
```bash
# First page, 10 items
curl -X GET "http://localhost:3000/api/admin/reports/instructors?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# With date filtering
curl -X GET "http://localhost:3000/api/admin/reports/instructors?page=1&limit=10&from=2026-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Instructor performance report retrieved successfully",
  "data": {
    "totalInstructors": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "instructors": [
      {
        "instructorId": "uuid-1",
        "instructorName": "John Doe",
        "instructorEmail": "john@example.com",
        "totalCourses": 12,
        "totalEnrollments": 350,
        "completedEnrollments": 245,
        "completionRate": 70.0,
        "averageCourseRating": 4.5,
        "revenueGenerated": 15000.00
      },
      ...
    ]
  }
}
```

#### 8. Course Performance Report
```bash
curl -X GET "http://localhost:3000/api/admin/reports/courses?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Course performance report retrieved successfully",
  "data": {
    "totalCourses": 75,
    "page": 1,
    "limit": 20,
    "totalPages": 4,
    "courses": [
      {
        "courseId": "uuid-1",
        "courseTitle": "Advanced JavaScript",
        "instructorName": "John Doe",
        "totalEnrollments": 150,
        "completedEnrollments": 105,
        "droppedEnrollments": 10,
        "completionRate": 70.0,
        "dropOffRate": 30.0,
        "averageRating": 4.5,
        "totalReviews": 85,
        "totalPointsEarned": 15000
      },
      ...
    ]
  }
}
```

#### 9. Badge Distribution Report
```bash
curl -X GET "http://localhost:3000/api/admin/reports/badges" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Badge distribution report retrieved successfully",
  "data": {
    "totalUsers": 150,
    "usersWithPoints": 120,
    "usersWithoutPoints": 30,
    "badgeDistribution": [
      {
        "badgeId": "uuid-1",
        "badgeName": "Bronze",
        "levelOrder": 1,
        "minPoints": 0,
        "maxPoints": 100,
        "userCount": 50,
        "percentageOfTotalUsers": 33.33,
        "iconUrl": "https://example.com/bronze.png"
      },
      ...
    ]
  }
}
```

#### 10. Points Distribution Report
```bash
curl -X GET "http://localhost:3000/api/admin/reports/points" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Points distribution report retrieved successfully",
  "data": {
    "totalPointsAwarded": 125000,
    "totalUsersWithPoints": 120,
    "averagePointsPerUser": 1041.67,
    "topUsers": [
      {
        "rank": 1,
        "userId": "uuid-1",
        "userName": "Alice Johnson",
        "userEmail": "alice@example.com",
        "totalPoints": 5000
      },
      ...
    ],
    "distributionByRange": [
      {
        "range": "0-100",
        "badgeName": "Bronze",
        "userCount": 50
      },
      ...
    ]
  }
}
```

---

## Validation Tests

### 1. Test Invalid Period
```bash
curl -X GET "http://localhost:3000/api/admin/reports/user-growth?period=invalid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:** 400 Bad Request with validation error

### 2. Test Invalid Date Format
```bash
curl -X GET "http://localhost:3000/api/admin/reports/course-completion?from=not-a-date" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:** 400 Bad Request with validation error

### 3. Test Invalid Pagination
```bash
curl -X GET "http://localhost:3000/api/admin/reports/instructors?page=-1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:** 400 Bad Request with validation error

### 4. Test Without Authentication
```bash
curl -X GET "http://localhost:3000/api/admin/reports/user-growth"
```

**Expected:** 401 Unauthorized

### 5. Test With Non-Admin Token
```bash
# First login as learner
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@example.com",
    "password": "learner123"
  }'

# Then try to access report
curl -X GET "http://localhost:3000/api/admin/reports/user-growth" \
  -H "Authorization: Bearer LEARNER_TOKEN"
```

**Expected:** 403 Forbidden

---

## Check Audit Logs

After making requests, check server console for audit log entries:

```
🔒 [AUDIT LOG] {
  "timestamp": "2026-02-07T12:15:30.000Z",
  "action": "REPORT_ACCESSED",
  "admin": {
    "id": "admin-uuid",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  "target": {
    "type": "REPORT",
    "id": "user-growth"
  },
  "details": {
    "period": "monthly",
    "from": "2026-01-01",
    "to": "2026-12-31"
  },
  "ipAddress": "127.0.0.1"
}
```

---

## Performance Monitoring

### 1. Check Query Execution Time

Look for console output showing query duration. Reports should complete in:
- < 500ms for simple aggregations (badges, points)
- < 1s for time-based reports (user growth, revenue)
- < 2s for complex drill-downs (instructor/course performance)

### 2. Enable Prisma Query Logging

Temporarily enable query logging to verify no N+1 queries:

```javascript
// In src/Prisma/client.js
const prisma = new PrismaClient({
  log: ['query']
});
```

Then check console for query output during report generation.

---

## CSV Export Testing

### Test CSV Export (Future Enhancement)

If CSV export is implemented in controllers:

```bash
curl -X GET "http://localhost:3000/api/admin/reports/user-growth?period=monthly&format=csv" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o user-growth.csv
```

Expected: CSV file downloaded

---

## Success Criteria

✅ All 10 endpoints return 200 OK with valid data  
✅ Validation errors return 400 with error messages  
✅ Authentication check works (401 without token)  
✅ Authorization check works (403 for non-admins)  
✅ Date range filtering works correctly  
✅ Period grouping (daily/weekly/monthly) is accurate  
✅ Pagination returns correct pages  
✅ Audit logs are created for all accesses  
✅ Response times are under threshold  
✅ No console errors during execution  

---

## Next Steps

1. **Update Postman Collection**: Add all 10 endpoints to the existing Postman collection
2. **Add Integration Tests**: Write automated tests using Jest/Supertest
3. **Performance Testing**: Use Artillery or Apache Bench to load test endpoints
4. **Documentation**: Update API documentation with report endpoint details
