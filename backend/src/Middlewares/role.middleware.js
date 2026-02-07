const sendResponse = require('../Utils/response');

/**
 * Role-Based Authorization Middleware
 * Factory function that creates middleware to restrict access based on user roles
 * 
 * @param {string[]} allowedRoles - Array of allowed role codes (e.g., ['ADMIN', 'INSTRUCTOR'])
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.get('/admin/dashboard', authenticate, requireRole(['ADMIN']), controller.getDashboard);
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Ensure user is authenticated (should be set by auth.middleware.js)
        if (!req.user) {
            return sendResponse(res, 401, false, 'Authentication required');
        }

        // Check if user's role is in the allowed roles list
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return sendResponse(
                res,
                403,
                false,
                'Access Denied. Insufficient permissions.'
            );
        }

        // User has required role, proceed to next middleware
        next();
    };
};

module.exports = requireRole;
