const express = require('express');
const adminRoleController = require('../Controllers/adminRole.controller');
const verifyToken = require('../Middlewares/auth.middleware');
const requireRole = require('../Middlewares/role.middleware');

const router = express.Router();

// Apply authentication and authorization to all routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

/**
 * Role Management Routes
 */

// GET /api/admin/roles - List all roles
router.get('/', adminRoleController.getAllRoles);

// POST /api/admin/roles - Create new role with permissions
router.post('/', adminRoleController.createRole);

// PATCH /api/admin/roles/:id/permissions - Update role permissions
router.patch('/:id/permissions', adminRoleController.updateRolePermissions);

// POST /api/admin/roles/:id/clone - Clone role
router.post('/:id/clone', adminRoleController.cloneRole);

// DELETE /api/admin/roles/:id - Delete role (soft delete)
router.delete('/:id', adminRoleController.deleteRole);

module.exports = router;
