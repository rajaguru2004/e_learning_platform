const Razorpay = require('razorpay');
const crypto = require('crypto');
const { prisma } = require('../Prisma/client');

/**
 * Payment Service
 * 
 * Handles payment operations using Razorpay
 * 
 * @module payment.service
 */

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay payment order
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {Object} Order details with orderId, amount, currency
 */
async function createPaymentOrder(userId, courseId) {
    try {
        // Fetch course details
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                price: true,
                statusCode: true,
                isActive: true,
            },
        });

        if (!course) {
            throw new Error('Course not found');
        }

        if (!course.isActive || course.statusCode !== 'PUBLISHED') {
            throw new Error('Course is not available for enrollment');
        }

        if (!course.price || course.price <= 0) {
            throw new Error('This course is free and does not require payment');
        }

        // Check if user is already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingEnrollment) {
            throw new Error('You are already enrolled in this course');
        }

        // Convert price to paise (Razorpay uses smallest currency unit)
        const amountInPaise = Math.round(parseFloat(course.price) * 100);

        // Create Razorpay order
        // Receipt must be max 40 characters - using timestamp for uniqueness
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
                userId,
                courseId,
                courseTitle: course.title,
            },
        });

        // Save payment record with PENDING status
        const payment = await prisma.payment.create({
            data: {
                userId,
                courseId,
                amount: course.price,
                currency: 'INR',
                statusCode: 'PENDING',
                paymentGateway: 'RAZORPAY',
                transactionId: razorpayOrder.id,
                metadata: {
                    razorpayOrderId: razorpayOrder.id,
                    receipt: razorpayOrder.receipt,
                },
            },
        });

        return {
            orderId: razorpayOrder.id,
            amount: course.price.toString(),
            currency: 'INR',
            paymentId: payment.id,
        };
    } catch (error) {
        console.error('Error creating payment order:', error);
        throw error;
    }
}

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} True if signature is valid
 */
function verifyPaymentSignature(orderId, paymentId, signature) {
    try {
        const text = `${orderId}|${paymentId}`;
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        return generatedSignature === signature;
    } catch (error) {
        console.error('Error verifying payment signature:', error);
        return false;
    }
}

/**
 * Verify payment and enroll user in course
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpaySignature - Razorpay signature
 * @returns {Object} Enrollment details
 */
async function verifyPaymentAndEnroll(
    userId,
    courseId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
) {
    try {
        // Verify signature
        const isValidSignature = verifyPaymentSignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValidSignature) {
            throw new Error('Invalid payment signature');
        }

        // Find the payment record
        const payment = await prisma.payment.findUnique({
            where: { transactionId: razorpayOrderId },
        });

        if (!payment) {
            throw new Error('Payment record not found');
        }

        if (payment.statusCode === 'SUCCESS') {
            throw new Error('Payment has already been verified');
        }

        // Start transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Update payment status
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    statusCode: 'SUCCESS',
                    paymentMethod: 'RAZORPAY',
                    metadata: {
                        ...payment.metadata,
                        razorpayPaymentId,
                        razorpaySignature,
                        verifiedAt: new Date().toISOString(),
                    },
                },
            });

            // Create enrollment
            const enrollment = await tx.enrollment.create({
                data: {
                    userId,
                    courseId,
                    statusCode: 'ENROLLED',
                },
            });

            // Update course enrollment count
            await tx.course.update({
                where: { id: courseId },
                data: {
                    enrollmentCount: {
                        increment: 1,
                    },
                },
            });

            // Award points for enrollment (optional gamification)
            await tx.pointsLedger.create({
                data: {
                    userId,
                    sourceCode: 'COURSE_ENROLLMENT',
                    points: 50, // Award 50 points for enrollment
                    description: 'Course enrollment bonus',
                    referenceId: courseId,
                    referenceType: 'COURSE',
                },
            });

            return enrollment;
        });

        return {
            enrollmentId: result.id,
            courseId: result.courseId,
            paymentId: payment.id,
            status: 'completed',
        };
    } catch (error) {
        // If verification fails, mark payment as failed
        if (razorpayOrderId) {
            await prisma.payment.updateMany({
                where: { transactionId: razorpayOrderId },
                data: {
                    statusCode: 'FAILED',
                    failureReason: error.message,
                },
            });
        }

        console.error('Error verifying payment:', error);
        throw error;
    }
}

module.exports = {
    createPaymentOrder,
    verifyPaymentSignature,
    verifyPaymentAndEnroll,
};
