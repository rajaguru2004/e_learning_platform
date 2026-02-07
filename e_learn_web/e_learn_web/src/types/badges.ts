// Badge type definitions

export interface Badge {
    id: string;
    name: string;
    min_points: number;
    max_points: number | null;
    icon_url: string | null;
    description: string;
    level_order: number;
    is_active: boolean;
    created_at: string;
    users_assigned_count: number;
}

export interface Pagination {
    page: number;
    limit: number;
    total_pages: number;
    total_count: number;
}

export interface BadgesResponse {
    success: boolean;
    message: string;
    data: {
        badges: Badge[];
        pagination: Pagination;
    };
}

export interface CreateBadgeRequest {
    name: string;
    min_points: number;
    max_points: number | null;
    icon_url?: string;
    description: string;
}

export interface CreateBadgeResponse {
    success: boolean;
    message: string;
    data: {
        badge: Badge;
    };
}

export interface UpdateBadgeRequest {
    name?: string;
    min_points?: number;
    max_points?: number | null;
    description?: string;
}

export interface UpdateBadgeResponse {
    success: boolean;
    message: string;
    data: {
        badge: Badge;
    };
}

export interface UpdateBadgeIconRequest {
    icon_url: string;
}

export interface UpdateBadgeIconResponse {
    success: boolean;
    message: string;
    data: {
        badge: Badge;
    };
}

// Points Management Types

export interface PointsLogEntry {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    source_code: string;
    points: number;
    description: string;
    reference_id: string | null;
    reference_type: string;
    created_by: string;
    created_at: string;
}

export interface PointsLogResponse {
    success: boolean;
    message: string;
    data: {
        logs: PointsLogEntry[];
        pagination: Pagination;
    };
}

export interface GrantPointsRequest {
    user_id: string;
    points: number;
    reason: string;
}

export interface DeductPointsRequest {
    user_id: string;
    points: number;
    reason: string;
}

export interface PointsActionResponse {
    success: boolean;
    message: string;
    data: {
        log: PointsLogEntry;
        user: {
            id: string;
            total_points: number;
        };
    };
}

// Leaderboard Types

export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    name: string;
    email: string;
    total_points: number;
    badge: {
        name: string;
        icon_url: string | null;
        min_points: number;
        max_points: number | null;
    } | null;
}

export interface LeaderboardResponse {
    success: boolean;
    message: string;
    data: {
        leaderboard: LeaderboardEntry[];
        pagination: Pagination;
    };
}

// Course Review Types

export interface CourseReview {
    id: string;
    user_id: string;
    course_id: string;
    rating: number;
    review_text: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CourseReviewsResponse {
    success: boolean;
    message: string;
    data: {
        reviews: CourseReview[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}
