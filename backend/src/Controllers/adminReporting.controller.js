const adminReportingService = require('../Services/adminReporting.service');
const sendResponse = require('../Utils/response');
const { logAuditEvent, getIpAddress, ACTION_TYPES } = require('../Utils/auditLog.helper');

/**
 * Admin Reporting Controller
 * Handles HTTP requests for reporting and analytics endpoints
 */

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate query parameters
 */
const validateQueryParams = (req) => {
    const errors = [];

    // Validate period
    if (req.query.period) {
        const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
        if (!validPeriods.includes(req.query.period)) {
            errors.push(`Invalid period. Must be one of: ${validPeriods.join(', ')}`);
        }
    }

    // Validate date range
    if (req.query.from && isNaN(Date.parse(req.query.from))) {
        errors.push('Invalid "from" date format. Use ISO date string (YYYY-MM-DD)');
    }
    if (req.query.to && isNaN(Date.parse(req.query.to))) {
        errors.push('Invalid "to" date format. Use ISO date string (YYYY-MM-DD)');
    }

    // Validate pagination
    if (req.query.page && (isNaN(req.query.page) || parseInt(req.query.page) < 1)) {
        errors.push('Invalid page number. Must be a positive integer');
    }
    if (req.query.limit && (isNaN(req.query.limit) || parseInt(req.query.limit) < 1 || parseInt(req.query.limit) > 100)) {
        errors.push('Invalid limit. Must be between 1 and 100');
    }

    return errors;
};

/**
 * Log report access for audit purposes
 */
const logReportAccess = (req, reportType) => {
    logAuditEvent({
        action: ACTION_TYPES.REPORT_ACCESSED,
        admin: req.user,
        targetType: 'REPORT',
        targetId: reportType,
        details: {
            period: req.query.period,
            from: req.query.from,
            to: req.query.to,
            page: req.query.page,
            limit: req.query.limit,
            format: req.query.format
        },
        ipAddress: getIpAddress(req)
    });
};

// ============================================================================
// PLATFORM-LEVEL REPORTS
// ============================================================================

/**
 * Get user growth report
 * @route GET /api/admin/reports/user-growth?period=monthly&from=2026-01-01&to=2026-12-31
 */
const getUserGrowth = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'user-growth');

        // Get report data
        const period = req.query.period || 'monthly';
        const from = req.query.from || null;
        const to = req.query.to || null;

        const reportData = await adminReportingService.getUserGrowthReport(period, from, to);

        return sendResponse(
            res,
            200,
            true,
            'User growth report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getUserGrowth controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve user growth report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get course completion report
 * @route GET /api/admin/reports/course-completion?from=2026-01-01&to=2026-12-31
 */
const getCourseCompletion = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'course-completion');

        // Get report data
        const from = req.query.from || null;
        const to = req.query.to || null;

        const reportData = await adminReportingService.getCourseCompletionReport(from, to);

        return sendResponse(
            res,
            200,
            true,
            'Course completion report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getCourseCompletion controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve course completion report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get quiz performance report
 * @route GET /api/admin/reports/quiz-performance?from=2026-01-01&to=2026-12-31
 */
const getQuizPerformance = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'quiz-performance');

        // Get report data
        const from = req.query.from || null;
        const to = req.query.to || null;

        const reportData = await adminReportingService.getQuizPerformanceReport(from, to);

        return sendResponse(
            res,
            200,
            true,
            reportData.available
                ? 'Quiz performance report retrieved successfully'
                : 'Quiz feature not yet available',
            reportData
        );
    } catch (error) {
        console.error('Error in getQuizPerformance controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve quiz performance report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get drop-off rate report
 * @route GET /api/admin/reports/dropoff-rate?from=2026-01-01&to=2026-12-31
 */
const getDropOffRate = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'dropoff-rate');

        // Get report data
        const from = req.query.from || null;
        const to = req.query.to || null;

        const reportData = await adminReportingService.getDropOffReport(from, to);

        return sendResponse(
            res,
            200,
            true,
            'Drop-off rate report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getDropOffRate controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve drop-off rate report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get popular categories report
 * @route GET /api/admin/reports/popular-categories?from=2026-01-01&to=2026-12-31
 */
const getPopularCategories = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'popular-categories');

        // Get report data
        const from = req.query.from || null;
        const to = req.query.to || null;

        const reportData = await adminReportingService.getPopularCategoriesReport(from, to);

        return sendResponse(
            res,
            200,
            true,
            'Popular categories report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getPopularCategories controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve popular categories report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get revenue report
 * @route GET /api/admin/reports/revenue?period=monthly&from=2026-01-01&to=2026-12-31
 */
const getRevenue = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'revenue');

        // Get report data
        const period = req.query.period || 'monthly';
        const from = req.query.from || null;
        const to = req.query.to || null;

        const reportData = await adminReportingService.getRevenueReport(period, from, to);

        return sendResponse(
            res,
            200,
            true,
            reportData.available
                ? 'Revenue report retrieved successfully'
                : 'Payment functionality not enabled',
            reportData
        );
    } catch (error) {
        console.error('Error in getRevenue controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve revenue report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

// ============================================================================
// DRILL-DOWN REPORTS
// ============================================================================

/**
 * Get instructor performance report
 * @route GET /api/admin/reports/instructors?page=1&limit=20&from=2026-01-01&to=2026-12-31
 */
const getInstructorPerformance = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'instructor-performance');

        // Get report data
        const from = req.query.from || null;
        const to = req.query.to || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const reportData = await adminReportingService.getInstructorPerformanceReport(from, to, page, limit);

        return sendResponse(
            res,
            200,
            true,
            'Instructor performance report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getInstructorPerformance controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve instructor performance report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get course performance report
 * @route GET /api/admin/reports/courses?page=1&limit=20&from=2026-01-01&to=2026-12-31
 */
const getCoursePerformance = async (req, res) => {
    try {
        // Validate parameters
        const validationErrors = validateQueryParams(req);
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, 'Validation failed', { errors: validationErrors });
        }

        // Log access
        logReportAccess(req, 'course-performance');

        // Get report data
        const from = req.query.from || null;
        const to = req.query.to || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const reportData = await adminReportingService.getCoursePerformanceReport(from, to, page, limit);

        return sendResponse(
            res,
            200,
            true,
            'Course performance report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getCoursePerformance controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve course performance report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get badge distribution report
 * @route GET /api/admin/reports/badges
 */
const getBadgeDistribution = async (req, res) => {
    try {
        // Log access
        logReportAccess(req, 'badge-distribution');

        // Get report data
        const reportData = await adminReportingService.getBadgeDistributionReport();

        return sendResponse(
            res,
            200,
            true,
            'Badge distribution report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getBadgeDistribution controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve badge distribution report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

/**
 * Get points distribution report
 * @route GET /api/admin/reports/points
 */
const getPointsDistribution = async (req, res) => {
    try {
        // Log access
        logReportAccess(req, 'points-distribution');

        // Get report data
        const reportData = await adminReportingService.getPointsDistributionReport();

        return sendResponse(
            res,
            200,
            true,
            'Points distribution report retrieved successfully',
            reportData
        );
    } catch (error) {
        console.error('Error in getPointsDistribution controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve points distribution report',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

module.exports = {
    getUserGrowth,
    getCourseCompletion,
    getQuizPerformance,
    getDropOffRate,
    getPopularCategories,
    getRevenue,
    getInstructorPerformance,
    getCoursePerformance,
    getBadgeDistribution,
    getPointsDistribution
};
