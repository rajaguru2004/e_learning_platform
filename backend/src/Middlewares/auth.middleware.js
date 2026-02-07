const jwt = require('jsonwebtoken');
const { errorResponse } = require('../Utils/response');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return errorResponse(res, 'Access Denied', 401);
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid Token', 400);
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return errorResponse(res, 'Access Denied: Insufficient Permissions', 403);
        }
        next();
    };
};

const optionalVerifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return next();
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
    } catch (error) {
        // If token is invalid, we just proceed as guest
        console.error('Invalid token in optional auth:', error.message);
    }
    next();
};

module.exports = {
    verifyToken,
    requireRole,
    optionalVerifyToken
};
