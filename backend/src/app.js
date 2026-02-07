const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sendResponse = require('./Utils/response');
const authRoutes = require('./Routes/auth.routes');
const adminRoutes = require('./Routes/adminDashboard.routes');
const adminUserRoutes = require('./Routes/adminUser.routes');
const adminRoleRoutes = require('./Routes/adminRole.routes');
const adminCourseRoutes = require('./Routes/adminCourse.routes');
const adminEnrollmentRoutes = require('./Routes/adminEnrollment.routes');
const adminGamificationRoutes = require('./Routes/adminGamification.routes');
const adminReportingRoutes = require('./Routes/adminReporting.routes');
const courseRoutes = require('./Routes/course.routes');
const reviewRoutes = require('./Routes/review.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/roles', adminRoleRoutes);
app.use('/api/admin/courses', adminCourseRoutes);
app.use('/api/admin/enrollments', adminEnrollmentRoutes);
app.use('/api/admin', adminGamificationRoutes);
app.use('/api/admin', adminReportingRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/courses', reviewRoutes);

// Health Check
app.get('/', (req, res) => {
    sendResponse(res, 200, true, 'Server is running', {
        timestamp: new Date().toISOString(),
    });
});

// 404 Handler
app.use((req, res, next) => {
    sendResponse(res, 404, false, 'Route not found');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    sendResponse(res, 500, false, 'Internal Server Error', {
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
