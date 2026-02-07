const adminUserService = require('../Services/adminUser.service');
const sendResponse = require('../Utils/response');

/**
 * Admin User Management Controller
 * 
 * Request handlers for admin user management endpoints
 * 
 * @module adminUser.controller
 */

/**
 * Get all users with pagination, filtering, and search
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - role: Filter by role code
 * - status: Filter by status (active/inactive)
 * - search: Search by name or email
 * - sortBy: Sort field (created_at, name, email)
 * - sortOrder: Sort order (asc/desc)
 * 
 * @route GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
    try {
        const { page, limit, role, status, search, sortBy, sortOrder } = req.query;

        const result = await adminUserService.getAllUsers({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            role,
            status,
            search,
            sortBy: sortBy || 'created_at',
            sortOrder: sortOrder || 'desc',
        });

        return sendResponse(res, 200, true, 'Users retrieved successfully', result);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return sendResponse(res, 500, false, error.message);
    }
};

/**
 * Get user profile summary
 * 
 * @route GET /api/admin/users/:id
 */
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await adminUserService.getUserProfile(id);

        return sendResponse(res, 200, true, 'User profile retrieved successfully', profile);
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        const statusCode = error.message === 'User not found' ? 404 : 500;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Update user account status (activate/deactivate)
 * 
 * Body: { is_active: boolean }
 * 
 * @route PATCH /api/admin/users/:id/status
 */
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (typeof is_active !== 'boolean') {
            return sendResponse(res, 400, false, 'Field "is_active" must be a boolean');
        }

        const updatedUser = await adminUserService.updateUserStatus(
            id,
            is_active,
            req.user,
            req
        );

        return sendResponse(
            res,
            200,
            true,
            `User ${is_active ? 'activated' : 'deactivated'} successfully`,
            updatedUser
        );
    } catch (error) {
        console.error('Error in updateUserStatus:', error);
        const statusCode = error.message === 'User not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Force reset user password
 * 
 * @route POST /api/admin/users/:id/reset-password
 */
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminUserService.resetUserPassword(id, req.user, req);

        return sendResponse(res, 200, true, result.message, {
            tempPassword: result.tempPassword,
        });
    } catch (error) {
        console.error('Error in resetUserPassword:', error);
        const statusCode = error.message === 'User not found' ? 404 : 500;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Impersonate user
 * 
 * SECURITY SENSITIVE ENDPOINT
 * Generates a JWT token to act as another user
 * 
 * @route POST /api/admin/users/:id/impersonate
 */
const impersonateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminUserService.impersonateUser(id, req.user, req);

        return sendResponse(res, 200, true, 'Impersonation token generated successfully', result);
    } catch (error) {
        console.error('Error in impersonateUser:', error);
        const statusCode = error.message === 'Target user not found' ? 404 : 403;
        return sendResponse(res, statusCode, false, error.message);
    }
};

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUserStatus,
    resetUserPassword,
    impersonateUser,
};
