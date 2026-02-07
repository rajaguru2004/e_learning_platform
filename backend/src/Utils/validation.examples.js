/**
 * Validation Schemas using Joi
 * 
 * This module provides reusable validation schemas for admin API endpoints.
 * These can be used as middleware or inline validation.
 * 
 * @module validation.examples
 */

const Joi = require('joi');

/**
 * User Status Update Validation
 */
const userStatusSchema = Joi.object({
    is_active: Joi.boolean().required(),
});

/**
 * Role Creation Validation
 */
const createRoleSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    permissions: Joi.array()
        .items(Joi.string().uppercase())
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one permission is required',
        }),
});

/**
 * Permission Update Validation
 */
const updatePermissionsSchema = Joi.object({
    permissions: Joi.array()
        .items(Joi.string().uppercase())
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one permission is required',
        }),
});

/**
 * Clone Role Validation
 */
const cloneRoleSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
});

/**
 * User Query Params Validation
 */
const userQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    role: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    search: Joi.string().min(2).optional(),
    sortBy: Joi.string().valid('created_at', 'name', 'email').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * UUID Validation Helper
 */
const uuidSchema = Joi.string().uuid().required();

/**
 * Validation Middleware Factory
 * 
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Where to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 * 
 * @example
 * router.post('/roles', validate(createRoleSchema, 'body'), controller.createRole);
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        // Replace request data with validated/sanitized data
        req[source] = value;
        next();
    };
};

module.exports = {
    userStatusSchema,
    createRoleSchema,
    updatePermissionsSchema,
    cloneRoleSchema,
    userQuerySchema,
    uuidSchema,
    validate,
};
