const { prisma } = require('../Prisma/client');
const { logAuditEvent, getIpAddress, ACTION_TYPES } = require('../Utils/auditLog.helper');

/**
 * Admin Role Management Service
 * 
 * Business logic for role and permission management
 * - List roles
 * - Create roles with permissions
 * - Update role permissions
 * - Clone roles
 * - Delete roles (with restrictions)
 * 
 * @module adminRole.service
 */

/**
 * Get all roles with permission count
 * 
 * @returns {Promise<Array>} List of roles with metadata
 */
const getAllRoles = async () => {
    const roles = await prisma.role.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: {
                    rolePermissions: true,
                },
            },
        },
    });

    return roles.map(role => ({
        id: role.id,
        name: role.name,
        code: role.code,
        isSystemRole: role.isSystemRole,
        isActive: role.isActive,
        permissionsCount: role._count.rolePermissions,
        createdAt: role.createdAt,
    }));
};

/**
 * Create new role with permissions
 * 
 * @param {Object} roleData - Role creation data
 * @param {string} roleData.name - Role name
 * @param {Array<string>} roleData.permissions - Array of permission codes
 * @param {Object} admin - Admin user creating the role
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Created role
 */
const createRole = async ({ name, permissions }, admin, req = null) => {
    // Validate role name uniqueness
    const existingRole = await prisma.role.findFirst({
        where: {
            OR: [
                { name },
                { code: name.toUpperCase().replace(/\s+/g, '_') },
            ],
        },
    });

    if (existingRole) {
        throw new Error('A role with this name already exists');
    }

    // Validate all permission codes exist
    const permissionRecords = await prisma.permission.findMany({
        where: {
            code: { in: permissions },
        },
    });

    if (permissionRecords.length !== permissions.length) {
        const foundCodes = permissionRecords.map(p => p.code);
        const invalidCodes = permissions.filter(code => !foundCodes.includes(code));
        throw new Error(`Invalid permission codes: ${invalidCodes.join(', ')}`);
    }

    // Generate role code from name
    const roleCode = name.toUpperCase().replace(/\s+/g, '_');

    // Use transaction to create role and permissions
    const role = await prisma.$transaction(async (tx) => {
        // Create role
        const newRole = await tx.role.create({
            data: {
                name,
                code: roleCode,
                isSystemRole: false,
            },
        });

        // Create role-permission mappings
        await tx.rolePermission.createMany({
            data: permissionRecords.map(permission => ({
                roleId: newRole.id,
                permissionId: permission.id,
            })),
        });

        // Fetch role with permissions
        return tx.role.findUnique({
            where: { id: newRole.id },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.ROLE_CREATED,
        admin,
        targetType: 'ROLE',
        targetId: role.id,
        details: {
            role_name: role.name,
            role_code: role.code,
            permissions: permissions,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return {
        id: role.id,
        name: role.name,
        code: role.code,
        isSystemRole: role.isSystemRole,
        permissions: role.rolePermissions.map(rp => ({
            code: rp.permission.code,
            module: rp.permission.module,
            description: rp.permission.description,
        })),
        createdAt: role.createdAt,
    };
};

/**
 * Update role permissions (replace all)
 * 
 * @param {string} roleId - Role ID to update
 * @param {Array<string>} permissions - New permission codes
 * @param {Object} admin - Admin user performing update
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Updated role
 */
const updateRolePermissions = async (roleId, permissions, admin, req = null) => {
    const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: {
            rolePermissions: {
                include: {
                    permission: true,
                },
            },
        },
    });

    if (!role) {
        throw new Error('Role not found');
    }

    if (role.isSystemRole) {
        throw new Error('Cannot modify system role permissions');
    }

    // Validate all permission codes exist
    const permissionRecords = await prisma.permission.findMany({
        where: {
            code: { in: permissions },
        },
    });

    if (permissionRecords.length !== permissions.length) {
        const foundCodes = permissionRecords.map(p => p.code);
        const invalidCodes = permissions.filter(code => !foundCodes.includes(code));
        throw new Error(`Invalid permission codes: ${invalidCodes.join(', ')}`);
    }

    // Store old permissions for audit log
    const oldPermissions = role.rolePermissions.map(rp => rp.permission.code);

    // Use transaction to replace permissions
    const updatedRole = await prisma.$transaction(async (tx) => {
        // Delete existing permissions
        await tx.rolePermission.deleteMany({
            where: { roleId },
        });

        // Create new permissions
        await tx.rolePermission.createMany({
            data: permissionRecords.map(permission => ({
                roleId: roleId,
                permissionId: permission.id,
            })),
        });

        // Fetch updated role with permissions
        return tx.role.findUnique({
            where: { id: roleId },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.PERMISSIONS_UPDATED,
        admin,
        targetType: 'ROLE',
        targetId: roleId,
        details: {
            role_name: role.name,
            old_permissions: oldPermissions,
            new_permissions: permissions,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return {
        id: updatedRole.id,
        name: updatedRole.name,
        code: updatedRole.code,
        isSystemRole: updatedRole.isSystemRole,
        permissions: updatedRole.rolePermissions.map(rp => ({
            code: rp.permission.code,
            module: rp.permission.module,
            description: rp.permission.description,
        })),
    };
};

/**
 * Clone role with all permissions
 * 
 * @param {string} sourceRoleId - Role ID to clone
 * @param {string} newName - Name for the cloned role
 * @param {Object} admin - Admin user performing clone
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Cloned role
 */
const cloneRole = async (sourceRoleId, newName, admin, req = null) => {
    const sourceRole = await prisma.role.findUnique({
        where: { id: sourceRoleId },
        include: {
            rolePermissions: {
                include: {
                    permission: true,
                },
            },
        },
    });

    if (!sourceRole) {
        throw new Error('Source role not found');
    }

    // Check if new name already exists
    const existingRole = await prisma.role.findFirst({
        where: {
            OR: [
                { name: newName },
                { code: newName.toUpperCase().replace(/\s+/g, '_') },
            ],
        },
    });

    if (existingRole) {
        throw new Error('A role with this name already exists');
    }

    // Generate code from new name
    const newCode = newName.toUpperCase().replace(/\s+/g, '_');

    // Use transaction to clone role
    const clonedRole = await prisma.$transaction(async (tx) => {
        // Create new role
        const newRole = await tx.role.create({
            data: {
                name: newName,
                code: newCode,
                description: sourceRole.description ? `Cloned from ${sourceRole.name}` : null,
                isSystemRole: false, // Cloned roles are never system roles
            },
        });

        // Copy permissions
        if (sourceRole.rolePermissions.length > 0) {
            await tx.rolePermission.createMany({
                data: sourceRole.rolePermissions.map(rp => ({
                    roleId: newRole.id,
                    permissionId: rp.permissionId,
                })),
            });
        }

        // Fetch cloned role with permissions
        return tx.role.findUnique({
            where: { id: newRole.id },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.ROLE_CLONED,
        admin,
        targetType: 'ROLE',
        targetId: clonedRole.id,
        details: {
            source_role_id: sourceRoleId,
            source_role_name: sourceRole.name,
            new_role_name: clonedRole.name,
            permissions_count: clonedRole.rolePermissions.length,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return {
        id: clonedRole.id,
        name: clonedRole.name,
        code: clonedRole.code,
        isSystemRole: clonedRole.isSystemRole,
        permissions: clonedRole.rolePermissions.map(rp => ({
            code: rp.permission.code,
            module: rp.permission.module,
            description: rp.permission.description,
        })),
        createdAt: clonedRole.createdAt,
    };
};

/**
 * Delete role (soft delete)
 * 
 * @param {string} roleId - Role ID to delete
 * @param {Object} admin - Admin user performing deletion
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Success message
 */
const deleteRole = async (roleId, admin, req = null) => {
    const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: {
            _count: {
                select: {
                    users: true,
                },
            },
        },
    });

    if (!role) {
        throw new Error('Role not found');
    }

    if (role.isSystemRole) {
        throw new Error('Cannot delete system role');
    }

    // Check if role is assigned to any users
    if (role._count.users > 0) {
        throw new Error(`Cannot delete role assigned to ${role._count.users} user(s)`);
    }

    // Soft delete (set is_active to false)
    await prisma.role.update({
        where: { id: roleId },
        data: { isActive: false },
    });

    // Log audit event
    await logAuditEvent({
        action: ACTION_TYPES.ROLE_DELETED,
        admin,
        targetType: 'ROLE',
        targetId: roleId,
        details: {
            role_name: role.name,
            role_code: role.code,
            soft_delete: true,
        },
        ipAddress: req ? getIpAddress(req) : null,
    });

    return {
        message: `Role '${role.name}' deleted successfully`,
    };
};

module.exports = {
    getAllRoles,
    createRole,
    updateRolePermissions,
    cloneRole,
    deleteRole,
};
