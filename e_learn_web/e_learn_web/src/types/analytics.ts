// Analytics API response types

// ==================== USER GROWTH REPORT ====================

export interface UserGrowthDataset {
    label: string;
    data: number[];
}

export interface UserGrowthData {
    totalUsers: number;
    period: 'monthly' | 'weekly';
    labels: string[];
    datasets: UserGrowthDataset[];
}

export interface UserGrowthResponse {
    success: boolean;
    message: string;
    data: UserGrowthData;
}

// ==================== COURSE COMPLETION REPORT ====================

export interface CompletionByStatus {
    status: string;
    count: number;
    percentage: number;
}

export interface CourseCompletionData {
    totalEnrollments: number;
    completedEnrollments: number;
    startedEnrollments: number;
    enrolledEnrollments: number;
    droppedEnrollments: number;
    completionPercentage: number;
    byStatus: CompletionByStatus[];
}

export interface CourseCompletionResponse {
    success: boolean;
    message: string;
    data: CourseCompletionData;
}

// ==================== QUIZ PERFORMANCE REPORT ====================

export interface QuizPlannedMetrics {
    totalQuizzesAttempted: number;
    averageScore: number;
    averageAttemptsPerQuiz: number;
    passRate: number;
}

export interface QuizPerformanceData {
    available: boolean;
    message?: string;
    plannedMetrics?: QuizPlannedMetrics;
}

export interface QuizPerformanceResponse {
    success: boolean;
    message: string;
    data: QuizPerformanceData;
}

// ==================== DROP-OFF RATE REPORT ====================

export interface DropoffBreakdown {
    enrolled: number;
    started: number;
}

export interface DropoffRateData {
    totalEnrollments: number;
    incompleteEnrollments: number;
    explicitlyDropped: number;
    dropOffPercentage: number;
    averageProgressBeforeDrop: number;
    breakdown: DropoffBreakdown;
}

export interface DropoffRateResponse {
    success: boolean;
    message: string;
    data: DropoffRateData;
}

// ==================== POPULAR CATEGORIES REPORT ====================

export interface CategoryData {
    categoryId: string;
    categoryName: string;
    totalCourses: number;
    totalEnrollments: number;
    completedEnrollments: number;
    completionRate: number;
}

export interface PopularCategoriesData {
    totalCategories: number;
    categories: CategoryData[];
}

export interface PopularCategoriesResponse {
    success: boolean;
    message: string;
    data: PopularCategoriesData;
}

// ==================== REVENUE REPORT ====================

export interface RevenueDataset {
    label: string;
    data: number[];
}

export interface RevenueData {
    available: boolean;
    totalRevenue: number;
    successfulPayments: number;
    failedPayments: number;
    period: 'monthly' | 'weekly';
    labels: string[];
    datasets: RevenueDataset[];
}

export interface RevenueResponse {
    success: boolean;
    message: string;
    data: RevenueData;
}
