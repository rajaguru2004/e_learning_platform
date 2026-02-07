// TypeScript types for Admin Enrollments API Response

export interface EnrollmentUser {
    id: string;
    name: string;
    email: string;
}

export interface EnrollmentCourse {
    id: string;
    title: string;
}

export interface Enrollment {
    enrollment_id: string;
    user: EnrollmentUser;
    course: EnrollmentCourse;
    status: 'ENROLLED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
    progress_percent: number;
    enrolled_at: string;
    completed_at: string | null;
    expires_at: string | null;
    payment_status: 'SUCCESS' | 'PENDING' | 'FAILED' | null;
    payment_amount: string | null;
}

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}

export interface EnrollmentsData {
    enrollments: Enrollment[];
    pagination: Pagination;
}

export interface EnrollmentsResponse {
    success: boolean;
    message: string;
    data: EnrollmentsData;
}

export interface ManualEnrollRequest {
    user_id: string;
    access_duration_type: 'LIFETIME' | 'FIXED_DAYS';
    duration_days?: number;
}

export interface ManualEnrollResponse {
    success: boolean;
    message: string;
    data?: any;
}
