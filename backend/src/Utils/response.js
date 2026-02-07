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

module.exports = sendResponse;
