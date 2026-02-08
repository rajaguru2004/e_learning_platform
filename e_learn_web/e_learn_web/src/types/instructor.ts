// TypeScript types for Instructor Course Management

export interface InstructorInfo {
    id: string;
    name: string;
    email: string;
}

export interface InstructorCourse {
    id: string;
    title: string;
    slug: string;
    description: string;
    instructorId: string;
    categoryId: string | null;
    statusCode: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
    visibilityCode: 'EVERYONE' | 'SIGNED_IN' | 'PRIVATE';
    accessCode: 'OPEN' | 'PAYMENT' | 'INVITATION';
    thumbnailUrl: string | null;
    price: string;
    discountedPrice: string | null;
    duration: number;
    enrollmentCount: number;
    averageRating: string;
    totalReviews: number;
    isActive: boolean;
    reviewNote: string | null;
    reviewedBy: string | null;
    reviewedAt: string | null;
    isLocked: boolean;
    createdAt: string;
    updatedAt: string;
    instructor: InstructorInfo;
    reviewer: InstructorInfo | null;
}

export interface Question {
    questionText: string;
    questionTypeId: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    options: string[];
    correctAnswer: string;
    points: number;
    orderIndex: number;
}

export interface Subtopic {
    title: string;
    description: string;
    duration: number;
    videoFile?: File | null; // For form state handling
    questions?: Question[];
}

export interface Topic {
    title: string;
    description: string;
    subtopics: Subtopic[];
}

export interface CreateCourseRequest {
    title: string;
    slug: string;
    description: string;
    visibilityCode: 'EVERYONE' | 'SIGNED_IN' | 'PRIVATE';
    accessCode: 'OPEN' | 'PAYMENT' | 'INVITATION';
    price?: number;
    duration: number;
    categoryId?: string;
    topics?: Topic[];
}

export interface UpdateCourseRequest {
    title?: string;
    slug?: string;
    description?: string;
    visibilityCode?: 'EVERYONE' | 'SIGNED_IN' | 'PRIVATE';
    accessCode?: 'OPEN' | 'PAYMENT' | 'INVITATION';
    price?: number;
    duration?: number;
    categoryId?: string;
}

export interface MyCoursesData {
    courses: InstructorCourse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface MyCoursesResponse {
    success: boolean;
    message: string;
    data: MyCoursesData;
}

export interface CreateCourseResponse {
    success: boolean;
    message: string;
    data: InstructorCourse;
}

export interface UpdateCourseResponse {
    success: boolean;
    message: string;
    data: InstructorCourse;
}

export interface SubmitCourseResponse {
    success: boolean;
    message: string;
    data: InstructorCourse;
}

export interface DeleteCourseResponse {
    success: boolean;
    message: string;
}
