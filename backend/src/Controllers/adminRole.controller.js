const adminRoleService = require('../Services/adminRole.service');
const sendResponse = require('../Utils/response');

/**
 * Admin Role Management Controller
 * 
 * Request handlers for role and permission management
 * 
 * @module adminRole.controller
 */

/**
 * Get all roles
 * 
 * @route GET /api/admin/roles
 */
const getAllRoles = async (req, res) => {
    try {
        const roles = await adminRoleService.getAllRoles();

        return sendResponse(res, 200, true, 'Roles retrieved successfully', { roles });
    } catch (error) {
        console.error('Error in getAllRoles:', error);
        return sendResponse(res, 500, false, error.message);
    }
};

/**
 * Create new role with permissions
 * 
 * Body: { name: string, permissions: string[] }
 * 
 * @route POST /api/admin/roles
 */
const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name || !permissions || !Array.isArray(permissions)) {
            return sendResponse(res, 400, false, 'Name and permissions array are required');
        }

        if (permissions.length === 0) {
            return sendResponse(res, 400, false, 'At least one permission is required');
        }

        const role = await adminRoleService.createRole({ name, permissions }, req.user, req);

        return sendResponse(res, 201, true, 'Role created successfully', role);
    } catch (error) {
        console.error('Error in createRole:', error);
        return sendResponse(res, 400, false, error.message);
    }
};

/**
 * Update role permissions (replace all)
 * 
 * Body: { permissions: string[] }
 * 
 * @route PATCH /api/admin/roles/:id/permissions
 */
const updateRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        if (!permissions || !Array.isArray(permissions)) {
            return sendResponse(res, 400, false, 'Permissions array is required');
        }

        if (permissions.length === 0) {
            return sendResponse(res, 400, false, 'At least one permission is required');
        }

        const role = await adminRoleService.updateRolePermissions(id, permissions, req.user, req);

        return sendResponse(res, 200, true, 'Role permissions updated successfully', role);
    } catch (error) {
        console.error('Error in updateRolePermissions:', error);
        const statusCode = error.message === 'Role not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Clone role
 * 
 * Body: { name: string }
 * 
 * @route POST /api/admin/roles/:id/clone
 */
const cloneRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return sendResponse(res, 400, false, 'New role name is required');
        }

        const role = await adminRoleService.cloneRole(id, name, req.user, req);

        return sendResponse(res, 201, true, 'Role cloned successfully', role);
    } catch (error) {
        console.error('Error in cloneRole:', error);
        const statusCode = error.message === 'Source role not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Delete role (soft delete)
 * 
 * @route DELETE /api/admin/roles/:id
 */
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminRoleService.deleteRole(id, req.user, req);

        return sendResponse(res, 200, true, result.message);
    } catch (error) {
        console.error('Error in deleteRole:', error);
        const statusCode = error.message === 'Role not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

module.exports = {
    getAllRoles,
    createRole,
    updateRolePermissions,
    cloneRole,
    deleteRole,
};
