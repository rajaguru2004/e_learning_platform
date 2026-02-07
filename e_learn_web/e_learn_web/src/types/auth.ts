// TypeScript types for Authentication

export interface Role {
    id: string;
    code: string;
    name: string;
    description: string;
    isSystemRole: boolean;
    isActive: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    role: Role;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}
