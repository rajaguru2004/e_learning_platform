const adminCourseService = require('../Services/adminCourse.service');
const sendResponse = require('../Utils/response');

/**
 * Admin Course Governance Controller
 * 
 * Request handlers for admin course governance endpoints:
 * - Course oversight (view, publish, archive, lock)
 * - Course approval workflow (approve, reject)
 * - Enrollment management (view, create, remove, extend, override payment)
 * 
 * @module adminCourse.controller
 */

// ============================================================================
// COURSE OVERSIGHT CONTROLLERS
// ============================================================================

/**
 * Get all courses with pagination, filtering, and search
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - status: Filter by status code
 * - instructor_id: Filter by instructor ID
 * - visibility: Filter by visibility code
 * - access_type: Filter by access type code
 * - search: Search by title
 * - sortBy: Sort field (created_at, title, enrollment_count)
 * - sortOrder: Sort order (asc/desc)
 * 
 * @route GET /api/admin/courses
 */
const getAllCourses = async (req, res) => {
    try {
        const {
            page,
            limit,
            status,
            instructor_id,
            visibility,
            access_type,
            search,
            sortBy,
            sortOrder,
        } = req.query;

        const result = await adminCourseService.getAllCourses({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            statusCode: status,
            instructorId: instructor_id,
            visibilityCode: visibility,
            accessCode: access_type,
            search,
            sortBy: sortBy || 'created_at',
            sortOrder: sortOrder || 'desc',
        });

        return sendResponse(res, 200, true, 'Courses retrieved successfully', result);
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        return sendResponse(res, 500, false, error.message);
    }
};

/**
 * Force publish or unpublish a course
 * 
 * Body: { publish: boolean }
 * 
 * @route PATCH /api/admin/courses/:id/publish
 */
const forcePublishCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { publish } = req.body;

        if (typeof publish !== 'boolean') {
            return sendResponse(res, 400, false, 'Field "publish" must be a boolean');
        }

        const updatedCourse = await adminCourseService.forcePublishCourse(
            id,
            publish,
            req.user,
            req
        );

        return sendResponse(
            res,
            200,
            true,
            `Course ${publish ? 'published' : 'unpublished'} successfully`,
            updatedCourse
        );
    } catch (error) {
        console.error('Error in forcePublishCourse:', error);
        const statusCode = error.message === 'Course not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Archive a course
 * 
 * @route PATCH /api/admin/courses/:id/archive
 */
const archiveCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const archivedCourse = await adminCourseService.archiveCourse(id, req.user, req);

        return sendResponse(res, 200, true, 'Course archived successfully', archivedCourse);
    } catch (error) {
        console.error('Error in archiveCourse:', error);
        const statusCode = error.message === 'Course not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Lock or unlock a course
 * 
 * Body: { is_locked: boolean }
 * 
 * @route PATCH /api/admin/courses/:id/lock
 */
const lockCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_locked } = req.body;

        if (typeof is_locked !== 'boolean') {
            return sendResponse(res, 400, false, 'Field "is_locked" must be a boolean');
        }

        const updatedCourse = await adminCourseService.lockCourse(id, is_locked, req.user, req);

        return sendResponse(
            res,
            200,
            true,
            `Course ${is_locked ? 'locked' : 'unlocked'} successfully`,
            updatedCourse
        );
    } catch (error) {
        console.error('Error in lockCourse:', error);
        const statusCode = error.message === 'Course not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

// ============================================================================
// APPROVAL WORKFLOW CONTROLLERS
// ============================================================================

/**
 * Approve a course for publishing
 * 
 * @route PATCH /api/admin/courses/:id/approve
 */
const approveCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const approvedCourse = await adminCourseService.approveCourse(id, req.user, req);

        return sendResponse(res, 200, true, 'Course approved successfully', approvedCourse);
    } catch (error) {
        console.error('Error in approveCourse:', error);
        const statusCode = error.message === 'Course not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Reject a course submission
 * 
 * Body: { review_note: string }
 * 
 * @route PATCH /api/admin/courses/:id/reject
 */
const rejectCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { review_note } = req.body;

        if (!review_note || review_note.trim().length === 0) {
            return sendResponse(res, 400, false, 'Field "review_note" is required');
        }

        const rejectedCourse = await adminCourseService.rejectCourse(
            id,
            review_note,
            req.user,
            req
        );

        return sendResponse(res, 200, true, 'Course rejected successfully', rejectedCourse);
    } catch (error) {
        console.error('Error in rejectCourse:', error);
        const statusCode = error.message === 'Course not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

// ============================================================================
// ENROLLMENT MANAGEMENT CONTROLLERS
// ============================================================================

/**
 * Get enrollments for a specific course
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - status: Filter by enrollment status code
 * - search: Search by user name/email
 * 
 * @route GET /api/admin/courses/:id/enrollments
 */
const getCourseEnrollments = async (req, res) => {
    try {
        const { id } = req.params;
        const { page, limit, status, search } = req.query;

        const result = await adminCourseService.getCourseEnrollments(id, {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            statusCode: status,
            search,
        });

        return sendResponse(res, 200, true, 'Enrollments retrieved successfully', result);
    } catch (error) {
        console.error('Error in getCourseEnrollments:', error);
        return sendResponse(res, 500, false, error.message);
    }
};

/**
 * Manually enroll a user in a course (admin override)
 * 
 * Body:
 * - user_id: string (required)
 * - access_duration_type: string (LIFETIME, FIXED_DAYS) (default: LIFETIME)
 * - duration_days: number (required if access_duration_type is FIXED_DAYS)
 * 
 * @route POST /api/admin/courses/:id/enroll
 */
const manuallyEnrollUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, access_duration_type, duration_days } = req.body;

        if (!user_id) {
            return sendResponse(res, 400, false, 'Field "user_id" is required');
        }

        const accessType = access_duration_type || 'LIFETIME';

        if (accessType === 'FIXED_DAYS' && !duration_days) {
            return sendResponse(
                res,
                400,
                false,
                'Field "duration_days" is required when access_duration_type is FIXED_DAYS'
            );
        }

        const enrollment = await adminCourseService.manuallyEnrollUser(
            id,
            user_id,
            accessType,
            duration_days,
            req.user,
            req
        );

        return sendResponse(res, 201, true, 'User enrolled successfully', enrollment);
    } catch (error) {
        console.error('Error in manuallyEnrollUser:', error);
        const statusCode =
            error.message.includes('not found') ? 404 :
                error.message.includes('already enrolled') ? 409 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Remove (soft delete) an enrollment
 * 
 * Body: { reason: string } (optional)
 * 
 * @route DELETE /api/admin/enrollments/:id
 */
const removeEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        const removedEnrollment = await adminCourseService.removeEnrollment(
            id,
            reason,
            req.user,
            req
        );

        return sendResponse(res, 200, true, 'Enrollment removed successfully', removedEnrollment);
    } catch (error) {
        console.error('Error in removeEnrollment:', error);
        const statusCode = error.message === 'Enrollment not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Extend enrollment access duration
 * 
 * Body: { extend_days: number }
 * 
 * @route PATCH /api/admin/enrollments/:id/extend
 */
const extendEnrollmentAccess = async (req, res) => {
    try {
        const { id } = req.params;
        const { extend_days } = req.body;

        if (!extend_days || isNaN(extend_days) || parseInt(extend_days) <= 0) {
            return sendResponse(
                res,
                400,
                false,
                'Field "extend_days" is required and must be a positive number'
            );
        }

        const extendedEnrollment = await adminCourseService.extendEnrollmentAccess(
            id,
            extend_days,
            req.user,
            req
        );

        return sendResponse(
            res,
            200,
            true,
            `Enrollment access extended by ${extend_days} days`,
            extendedEnrollment
        );
    } catch (error) {
        console.error('Error in extendEnrollmentAccess:', error);
        const statusCode = error.message === 'Enrollment not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

/**
 * Override payment status for an enrollment
 * Admin can mark payment as successful to grant access
 * 
 * @route PATCH /api/admin/enrollments/:id/override-payment
 */
const overrideEnrollmentPayment = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminCourseService.overrideEnrollmentPayment(id, req.user, req);

        return sendResponse(
            res,
            200,
            true,
            'Payment status overridden successfully',
            result
        );
    } catch (error) {
        console.error('Error in overrideEnrollmentPayment:', error);
        const statusCode = error.message === 'Enrollment not found' ? 404 : 400;
        return sendResponse(res, statusCode, false, error.message);
    }
};

module.exports = {
    // Course Oversight
    getAllCourses,
    forcePublishCourse,
    archiveCourse,
    lockCourse,
    // Approval Workflow
    approveCourse,
    rejectCourse,
    // Enrollment Management
    getCourseEnrollments,
    manuallyEnrollUser,
    removeEnrollment,
    extendEnrollmentAccess,
    overrideEnrollmentPayment,
};
