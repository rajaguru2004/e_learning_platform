const paymentService = require('../Services/payment.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Payment Controller
 * 
 * Handles HTTP requests for payment operations
 * 
 * @module payment.controller
 */

/**
 * Create a payment order for course enrollment
 * @route POST /api/learner/payments/create-order
 */
async function createPaymentOrder(req, res) {
    try {
        const { courseId, amount } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return errorResponse(res, 'Course ID is required', 400);
        }

        const orderDetails = await paymentService.createPaymentOrder(
            userId,
            courseId
        );

        return successResponse(
            res,
            orderDetails,
            'Payment order created successfully',
            201
        );
    } catch (error) {
        console.error('Error creating payment order:', error);
        return errorResponse(res, error.message, 400);
    }
}

/**
 * Verify payment and enroll user in course
 * @route POST /api/learner/payments/verify
 */
async function verifyPayment(req, res) {
    try {
        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            courseId,
        } = req.body;
        const userId = req.user.id;

        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !courseId) {
            return errorResponse(
                res,
                'Payment ID, Order ID, Signature, and Course ID are required',
                400
            );
        }

        const enrollmentDetails = await paymentService.verifyPaymentAndEnroll(
            userId,
            courseId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        );

        return successResponse(
            res,
            enrollmentDetails,
            'Payment verified and enrollment successful',
            200
        );
    } catch (error) {
        console.error('Error verifying payment:', error);
        return errorResponse(res, error.message, 400);
    }
}

module.exports = {
    createPaymentOrder,
    verifyPayment,
};
