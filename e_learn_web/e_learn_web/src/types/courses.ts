// TypeScript types for Admin Courses API Response

export interface CourseInstructor {
    id: string;
    name: string;
    email: string;
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    instructor: CourseInstructor;
    status: 'DRAFT' | 'PUBLISHED' | 'UNDER_REVIEW' | 'ARCHIVED';
    visibility: 'EVERYONE' | 'SIGNED_IN' | 'PRIVATE';
    access_type: 'OPEN' | 'PAYMENT' | 'INVITATION';
    price: string;
    total_enrollments: number;
    average_rating: string;
    is_locked: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}

export interface CoursesData {
    courses: Course[];
    pagination: Pagination;
}

export interface CoursesResponse {
    success: boolean;
    message: string;
    data: CoursesData;
}

export interface ApproveRejectResponse {
    success: boolean;
    message: string;
    data?: any;
}
