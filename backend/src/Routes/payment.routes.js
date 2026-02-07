const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/payment.controller');
const { verifyToken, requireRole } = require('../Middlewares/auth.middleware');

/**
 * Payment Routes
 * 
 * All routes for payment processing using Razorpay
 */

/**
 * @route   POST /api/learner/payments/create-order
 * @desc    Create a Razorpay payment order for course enrollment
 * @access  Private (Learner)
 */
router.post('/create-order',
    verifyToken,
    requireRole(['LEARNER']),
    paymentController.createPaymentOrder
);

/**
 * @route   POST /api/learner/payments/verify
 * @desc    Verify Razorpay payment and enroll user in course
 * @access  Private (Learner)
 */
router.post('/verify',
    verifyToken,
    requireRole(['LEARNER']),
    paymentController.verifyPayment
);

module.exports = router;
