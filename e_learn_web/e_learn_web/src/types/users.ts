// TypeScript types for Admin Users API Response

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    roleCode: string;
    status: 'active' | 'inactive';
    created_at: string;
}

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}

export interface UsersData {
    users: User[];
    pagination: Pagination;
}

export interface UsersResponse {
    success: boolean;
    message: string;
    data: UsersData;
}
