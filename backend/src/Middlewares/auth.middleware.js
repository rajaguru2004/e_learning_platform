const jwt = require('jsonwebtoken');
const sendResponse = require('../Utils/response');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return sendResponse(res, 401, false, 'Access Denied. No token provided.');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return sendResponse(res, 400, false, 'Invalid Token');
    }
};

module.exports = verifyToken;
