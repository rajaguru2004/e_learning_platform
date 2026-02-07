const adminDashboardService = require('../Services/adminDashboard.service');
const sendResponse = require('../Utils/response');

/**
 * Admin Dashboard Controller
 * Handles HTTP requests for admin dashboard analytics
 */

/**
 * Get dashboard data
 * Returns comprehensive platform analytics for admin users
 * 
 * @route GET /api/admin/dashboard
 * @access Private (Admin only)
 */
const getDashboardData = async (req, res) => {
    try {
        // Log dashboard access for audit purposes
        console.log(`[ADMIN DASHBOARD ACCESS] User: ${req.user.id} | Email: ${req.user.email} | Time: ${new Date().toISOString()}`);

        // Fetch dashboard data from service layer
        const dashboardData = await adminDashboardService.getDashboardData();

        return sendResponse(
            res,
            200,
            true,
            'Dashboard data retrieved successfully',
            dashboardData
        );
    } catch (error) {
        console.error('Error in getDashboardData controller:', error);
        return sendResponse(
            res,
            500,
            false,
            'Failed to retrieve dashboard data',
            process.env.NODE_ENV === 'development' ? { error: error.message } : null
        );
    }
};

module.exports = {
    getDashboardData
};
