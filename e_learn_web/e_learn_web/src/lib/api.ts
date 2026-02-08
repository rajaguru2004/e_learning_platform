// API client utilities for e-learning platform

import { DashboardResponse } from '@/types/dashboard';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { UsersResponse } from '@/types/users';
import { RolesResponse, CreateRoleRequest, CreateRoleResponse } from '@/types/roles';
import { CoursesResponse, ApproveRejectResponse } from '@/types/courses';
import { EnrollmentsResponse, ManualEnrollRequest, ManualEnrollResponse } from '@/types/enrollments';
import {
    MyCoursesResponse,
    CreateCourseRequest,
    CreateCourseResponse,
    UpdateCourseRequest,
    UpdateCourseResponse,
    SubmitCourseResponse,
    DeleteCourseResponse
} from '@/types/instructor';
import {
    BadgesResponse,
    CreateBadgeRequest,
    CreateBadgeResponse,
    UpdateBadgeRequest,
    UpdateBadgeResponse,
    UpdateBadgeIconRequest,
    UpdateBadgeIconResponse,
    PointsLogResponse,
    GrantPointsRequest,
    DeductPointsRequest,
    PointsActionResponse,
    LeaderboardResponse,
    CourseReviewsResponse
} from '@/types/badges';
import {
    UserGrowthResponse,
    CourseCompletionResponse,
    QuizPerformanceResponse,
    DropoffRateResponse,
    PopularCategoriesResponse,
    RevenueResponse
} from '@/types/analytics';
import { getToken } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Creates headers with authentication token if available
 */
function getHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Login user with email and password
 * @param credentials - User login credentials
 * @returns Promise resolving to login response with user data and token
 * @throws Error if login fails
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.status} ${response.statusText}`);
    }

    const data: LoginResponse = await response.json();
    return data;
}

/**
 * Fetches admin dashboard statistics from the backend API
 * @returns Promise resolving to dashboard data
 * @throws Error if the API request fails
 */
export async function fetchDashboardData(): Promise<DashboardResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
    }

    const data: DashboardResponse = await response.json();
    return data;
}

/**
 * Fetches users from the backend API with pagination and filters
 * @param page - Page number (default: 1)
 * @param limit - Number of users per page (default: 10)
 * @param role - Filter by role code (optional)
 * @param status - Filter by status (optional)
 * @param search - Search query for name/email (optional)
 * @returns Promise resolving to users data with pagination
 * @throws Error if the API request fails
 */
export async function fetchUsers(
    page: number = 1,
    limit: number = 10,
    role?: string,
    status?: string,
    search?: string
): Promise<UsersResponse> {
    // Build query parameters
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (role && role !== 'all') {
        params.append('role', role);
    }

    if (status && status !== 'all') {
        params.append('status', status);
    }

    if (search) {
        params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/users?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }

    const data: UsersResponse = await response.json();
    return data;
}

/**
 * Fetches roles from the backend API
 * @returns Promise resolving to roles data
 * @throws Error if the API request fails
 */
export async function fetchRoles(): Promise<RolesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/roles`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.status} ${response.statusText}`);
    }

    const data: RolesResponse = await response.json();
    return data;
}

/**
 * Creates a new role with specified permissions
 * @param roleData - Role data including name and permissions
 * @returns Promise resolving to the created role
 * @throws Error if the API request fails
 */
export async function createRole(roleData: CreateRoleRequest): Promise<CreateRoleResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/roles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(roleData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create role: ${response.status} ${response.statusText}`);
    }

    const data: CreateRoleResponse = await response.json();
    return data;
}

/**
 * Fetches courses from the backend API with pagination and filters
 * @param page - Page number (default: 1)
 * @param limit - Number of courses per page (default: 10)
 * @param status - Filter by status (optional)
 * @param search - Search query for title (optional)
 * @returns Promise resolving to courses data with pagination
 * @throws Error if the API request fails
 */
export async function fetchCourses(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
): Promise<CoursesResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (status && status !== 'all') {
        params.append('status', status);
    }

    if (search) {
        params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/courses?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
    }

    const data: CoursesResponse = await response.json();
    return data;
}

/**
 * Approves a course
 * @param courseId - ID of the course to approve
 * @returns Promise resolving to approval response
 * @throws Error if the API request fails
 */
export async function approveCourse(courseId: string): Promise<ApproveRejectResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}/approve`, {
        method: 'PATCH',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to approve course: ${response.status} ${response.statusText}`);
    }

    const data: ApproveRejectResponse = await response.json();
    return data;
}

/**
 * Rejects a course with review notes
 * @param courseId - ID of the course to reject
 * @param reviewNote - Mandatory review notes explaining the rejection
 * @returns Promise resolving to rejection response
 * @throws Error if the API request fails
 */
export async function rejectCourse(courseId: string, reviewNote: string): Promise<ApproveRejectResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}/reject`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ review_note: reviewNote }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to reject course: ${response.status} ${response.statusText}`);
    }

    const data: ApproveRejectResponse = await response.json();
    return data;
}

/**
 * Fetches enrollments for a specific course
 * @param courseId - ID of the course
 * @param page - Page number (default: 1)
 * @param limit - Number of enrollments per page (default: 10)
 * @returns Promise resolving to enrollments data with pagination
 * @throws Error if the API request fails
 */
export async function fetchCourseEnrollments(
    courseId: string,
    page: number = 1,
    limit: number = 10
): Promise<EnrollmentsResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}/enrollments?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch enrollments: ${response.status} ${response.statusText}`);
    }

    const data: EnrollmentsResponse = await response.json();
    return data;
}

/**
 * Manually enrolls a user to a course
 * @param courseId - ID of the course
 * @param enrollData - Enrollment data including user_id and access duration
 * @returns Promise resolving to enrollment response
 * @throws Error if the API request fails
 */
export async function manualEnrollUser(
    courseId: string,
    enrollData: ManualEnrollRequest
): Promise<ManualEnrollResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(enrollData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to enroll user: ${response.status} ${response.statusText}`);
    }

    const data: ManualEnrollResponse = await response.json();
    return data;
}

// ==================== INSTRUCTOR COURSE MANAGEMENT ====================

/**
 * Creates a new course (Instructor only)
 * @param courseData - Course creation data
 * @returns Promise resolving to created course data
 * @throws Error if the API request fails
 */
/**
 * Creates a new course (Instructor only)
 * - Supports file uploads for course videos via FormData
 * - Topics structure is passed as a JSON string
 * @param courseData - Course creation data
 * @returns Promise resolving to created course data
 * @throws Error if the API request fails
 */
export async function createCourse(courseData: CreateCourseRequest): Promise<CreateCourseResponse> {
    const formData = new FormData();

    // Append basic fields
    formData.append('title', courseData.title);
    formData.append('slug', courseData.slug);
    formData.append('description', courseData.description);
    formData.append('visibilityCode', courseData.visibilityCode);
    formData.append('accessCode', courseData.accessCode);
    formData.append('duration', courseData.duration.toString());

    if (courseData.price !== undefined) {
        formData.append('price', courseData.price.toString());
    }

    if (courseData.categoryId) {
        formData.append('categoryId', courseData.categoryId);
    }

    // Handle topics and video files
    if (courseData.topics && courseData.topics.length > 0) {
        // Clean topics for JSON payload (remove file objects)
        const cleanTopics = courseData.topics.map(topic => ({
            title: topic.title,
            description: topic.description,
            subtopics: topic.subtopics.map(sub => ({
                title: sub.title,
                description: sub.description,
                duration: sub.duration,
                questions: sub.questions
            }))
        }));

        formData.append('topics', JSON.stringify(cleanTopics));

        // Append video files with specific keys: videos_{topicIndex}_{subtopicIndex}
        courseData.topics.forEach((topic, topicIndex) => {
            topic.subtopics.forEach((subtopic, subtopicIndex) => {
                if (subtopic.videoFile) {
                    formData.append(`videos_${topicIndex}_${subtopicIndex}`, subtopic.videoFile);
                }
            });
        });
    }

    // Custom headers handling: Do NOT set Content-Type to application/json for FormData
    const headers: HeadersInit = {};
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/courses`, {
        method: 'POST',
        headers: headers, // Let browser set Content-Type with boundary
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create course: ${response.status} ${response.statusText}`);
    }

    const data: CreateCourseResponse = await response.json();
    return data;
}

/**
 * Fetches courses created by the logged-in instructor
 * @param page - Page number (default: 1)
 * @param limit - Number of courses per page (default: 10)
 * @returns Promise resolving to instructor's courses with pagination
 * @throws Error if the API request fails
 */
export async function fetchMyCourses(
    page: number = 1,
    limit: number = 10
): Promise<MyCoursesResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/courses/my?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch my courses: ${response.status} ${response.statusText}`);
    }

    const data: MyCoursesResponse = await response.json();
    return data;
}

/**
 * Updates an existing course (Instructor only)
 * @param courseId - ID of the course to update
 * @param courseData - Course update data
 * @returns Promise resolving to updated course data
 * @throws Error if the API request fails
 */
export async function updateCourse(
    courseId: string,
    courseData: UpdateCourseRequest
): Promise<UpdateCourseResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(courseData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update course: ${response.status} ${response.statusText}`);
    }

    const data: UpdateCourseResponse = await response.json();
    return data;
}

/**
 * Submits a course for review (Instructor only)
 * @param courseId - ID of the course to submit
 * @returns Promise resolving to submission response
 * @throws Error if the API request fails
 */
export async function submitCourseForReview(courseId: string): Promise<SubmitCourseResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}/submit`, {
        method: 'POST',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to submit course: ${response.status} ${response.statusText}`);
    }

    const data: SubmitCourseResponse = await response.json();
    return data;
}

/**
 * Deletes a course (Instructor only)
 * @param courseId - ID of the course to delete
 * @returns Promise resolving to deletion response
 * @throws Error if the API request fails
 */
export async function deleteCourse(courseId: string): Promise<DeleteCourseResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete course: ${response.status} ${response.statusText}`);
    }

    const data: DeleteCourseResponse = await response.json();
    return data;
}

// ==================== BADGE MANAGEMENT ====================

/**
 * Fetches all badges from the backend API with pagination
 * @param page - Page number (default: 1)
 * @param limit - Number of badges per page (default: 10)
 * @returns Promise resolving to badges data with pagination
 * @throws Error if the API request fails
 */
export async function fetchBadges(
    page: number = 1,
    limit: number = 10
): Promise<BadgesResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/badges?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch badges: ${response.status} ${response.statusText}`);
    }

    const data: BadgesResponse = await response.json();
    return data;
}

/**
 * Creates a new badge
 * @param badgeData - Badge creation data
 * @returns Promise resolving to created badge data
 * @throws Error if the API request fails
 */
export async function createBadge(badgeData: CreateBadgeRequest): Promise<CreateBadgeResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/badges`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(badgeData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create badge: ${response.status} ${response.statusText}`);
    }

    const data: CreateBadgeResponse = await response.json();
    return data;
}

/**
 * Updates an existing badge
 * @param badgeId - ID of the badge to update
 * @param badgeData - Badge update data
 * @returns Promise resolving to updated badge data
 * @throws Error if the API request fails
 */
export async function updateBadge(
    badgeId: string,
    badgeData: UpdateBadgeRequest
): Promise<UpdateBadgeResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/badges/${badgeId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(badgeData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update badge: ${response.status} ${response.statusText}`);
    }

    const data: UpdateBadgeResponse = await response.json();
    return data;
}

/**
 * Updates a badge's icon
 * @param badgeId - ID of the badge to update
 * @param iconData - Icon update data
 * @returns Promise resolving to updated badge data
 * @throws Error if the API request fails
 */
export async function updateBadgeIcon(
    badgeId: string,
    iconData: UpdateBadgeIconRequest
): Promise<UpdateBadgeIconResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/badges/${badgeId}/icon`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(iconData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update badge icon: ${response.status} ${response.statusText}`);
    }

    const data: UpdateBadgeIconResponse = await response.json();
    return data;
}

// ==================== POINTS MANAGEMENT ====================

/**
 * Fetches points log from the backend API with pagination
 * @param page - Page number (default: 1)
 * @param limit - Number of log entries per page (default: 10)
 * @returns Promise resolving to points log data with pagination
 * @throws Error if the API request fails
 */
export async function fetchPointsLog(
    page: number = 1,
    limit: number = 10
): Promise<PointsLogResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/points?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch points log: ${response.status} ${response.statusText}`);
    }

    const data: PointsLogResponse = await response.json();
    return data;
}

/**
 * Grants points to a user
 * @param grantData - Data for granting points (user_id, points, reason)
 * @returns Promise resolving to points action response
 * @throws Error if the API request fails
 */
export async function grantPoints(grantData: GrantPointsRequest): Promise<PointsActionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/points/grant`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(grantData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to grant points: ${response.status} ${response.statusText}`);
    }

    const data: PointsActionResponse = await response.json();
    return data;
}

/**
 * Deducts points from a user
 * @param deductData - Data for deducting points (user_id, points, reason)
 * @returns Promise resolving to points action response
 * @throws Error if the API request fails
 */
export async function deductPoints(deductData: DeductPointsRequest): Promise<PointsActionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/points/deduct`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(deductData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to deduct points: ${response.status} ${response.statusText}`);
    }

    const data: PointsActionResponse = await response.json();
    return data;
}

// ==================== LEADERBOARD ====================

/**
 * Fetches leaderboard from the backend API with pagination
 * @param page - Page number (default: 1)
 * @param limit - Number of entries per page (default: 10)
 * @returns Promise resolving to leaderboard data with pagination
 * @throws Error if the API request fails
 */
export async function fetchLeaderboard(
    page: number = 1,
    limit: number = 10
): Promise<LeaderboardResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/leaderboard?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
    }

    const data: LeaderboardResponse = await response.json();
    return data;
}

// ==================== COURSE REVIEWS ====================

/**
 * Fetches reviews for a specific course
 * @param courseId - ID of the course
 * @param page - Page number (default: 1)
 * @param limit - Number of reviews per page (default: 10)
 * @param sortBy - Field to sort by (default: 'createdAt')
 * @param sortOrder - Sort order 'asc' or 'desc' (default: 'desc')
 * @returns Promise resolving to course reviews with pagination
 * @throws Error if the API request fails
 */
export async function fetchCourseReviews(
    courseId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
): Promise<CourseReviewsResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
    });

    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/reviews?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch course reviews: ${response.status} ${response.statusText}`);
    }

    const data: CourseReviewsResponse = await response.json();
    return data;
}

// ==================== ANALYTICS REPORTS ====================

/**
 * Fetches user growth report from the backend API
 * @param period - 'monthly' or 'weekly' time period
 * @returns Promise resolving to user growth data
 * @throws Error if the API request fails
 */
export async function fetchUserGrowthReport(period: 'monthly' | 'weekly' = 'monthly'): Promise<UserGrowthResponse> {
    const params = new URLSearchParams({
        period,
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/reports/user-growth?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user growth report: ${response.status} ${response.statusText}`);
    }

    const data: UserGrowthResponse = await response.json();
    return data;
}

/**
 * Fetches course completion report from the backend API
 * @returns Promise resolving to course completion data
 * @throws Error if the API request fails
 */
export async function fetchCourseCompletionReport(): Promise<CourseCompletionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reports/course-completion`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch course completion report: ${response.status} ${response.statusText}`);
    }

    const data: CourseCompletionResponse = await response.json();
    return data;
}

/**
 * Fetches quiz performance report from the backend API
 * @returns Promise resolving to quiz performance data
 * @throws Error if the API request fails
 */
export async function fetchQuizPerformanceReport(): Promise<QuizPerformanceResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reports/quiz-performance`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch quiz performance report: ${response.status} ${response.statusText}`);
    }

    const data: QuizPerformanceResponse = await response.json();
    return data;
}

/**
 * Fetches drop-off rate report from the backend API
 * @returns Promise resolving to drop-off rate data
 * @throws Error if the API request fails
 */
export async function fetchDropoffRateReport(): Promise<DropoffRateResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reports/dropoff-rate`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch drop-off rate report: ${response.status} ${response.statusText}`);
    }

    const data: DropoffRateResponse = await response.json();
    return data;
}

/**
 * Fetches popular categories report from the backend API
 * @returns Promise resolving to popular categories data
 * @throws Error if the API request fails
 */
export async function fetchPopularCategoriesReport(): Promise<PopularCategoriesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reports/popular-categories`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch popular categories report: ${response.status} ${response.statusText}`);
    }

    const data: PopularCategoriesResponse = await response.json();
    return data;
}

/**
 * Fetches revenue report from the backend API
 * @param period - 'monthly' or 'weekly' time period
 * @returns Promise resolving to revenue data
 * @throws Error if the API request fails
 */
export async function fetchRevenueReport(period: 'monthly' | 'weekly' = 'monthly'): Promise<RevenueResponse> {
    const params = new URLSearchParams({
        period,
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/reports/revenue?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch revenue report: ${response.status} ${response.statusText}`);
    }

    const data: RevenueResponse = await response.json();
    return data;
}


