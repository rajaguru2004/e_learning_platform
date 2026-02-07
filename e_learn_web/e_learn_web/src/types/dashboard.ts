// TypeScript types for Admin Dashboard API Response

export interface UserStats {
    total: number;
    active: number;
    inactive: number;
    byRole: {
        admin: number;
        instructor: number;
        learner: number;
        others: any[];
    };
}

export interface CourseStats {
    total: number;
    byStatus: {
        draft: number;
        published: number;
        archived: number;
    };
}

export interface EnrollmentStats {
    total: number;
    byStatus: {
        enrolled: number;
        started: number;
        completed: number;
        dropped: number;
        active: number;
    };
}

export interface ProgressStats {
    inProgress: number;
    avgCompletionPercent: number;
}

export interface BadgeLevel {
    badgeName: string;
    levelOrder: number;
    userCount: number;
}

export interface PointsStats {
    totalPoints: number;
    thisMonthPoints: number;
    byBadgeLevel: BadgeLevel[];
}

export interface TopCourse {
    id: string;
    title: string;
    rating: number;
    reviewCount: number;
    instructorName: string;
}

export interface RatingStats {
    avgPlatformRating: number;
    totalReviews: number;
    topCourses: TopCourse[];
}

export interface RevenueStats {
    totalRevenue: number;
    thisMonthRevenue: number;
    successfulPayments: number;
    failedPayments: number;
}

export interface DashboardData {
    users: UserStats;
    courses: CourseStats;
    enrollments: EnrollmentStats;
    progress: ProgressStats;
    points: PointsStats;
    ratings: RatingStats;
    revenue: RevenueStats;
}

export interface DashboardResponse {
    success: boolean;
    message: string;
    data: DashboardData;
}
