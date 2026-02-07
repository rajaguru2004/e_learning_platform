/**
 * Standardized API Response
 * @param {object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {boolean} success - Success flag
 * @param {string} message - Response message
 * @param {object} data - Response data (optional)
 */
const sendResponse = (res, status, success, message, data = null) => {
    const response = {
        success,
        message,
    };

    if (data) {
        response.data = data;
    }

    return res.status(status).json(response);
};

const successResponse = (res, data, message = 'Success', status = 200) => {
    return sendResponse(res, status, true, message, data);
};

const errorResponse = (res, message = 'Error', status = 500) => {
    return sendResponse(res, status, false, message);
};

module.exports = sendResponse;
module.exports.successResponse = successResponse;
module.exports.errorResponse = errorResponse;
