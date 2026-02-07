// API client utilities for e-learning platform

import { DashboardResponse } from '@/types/dashboard';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { UsersResponse } from '@/types/users';
import { RolesResponse, CreateRoleRequest, CreateRoleResponse } from '@/types/roles';
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

