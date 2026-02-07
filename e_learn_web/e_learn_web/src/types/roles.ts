// TypeScript types for Admin Roles API

export interface Role {
    id: string;
    name: string;
    code: string;
    isSystemRole: boolean;
    isActive: boolean;
    permissionsCount: number;
    createdAt: string;
}

export interface RolesData {
    roles: Role[];
}

export interface RolesResponse {
    success: boolean;
    message: string;
    data: RolesData;
}

export interface CreateRoleRequest {
    name: string;
    permissions: string[];
}

export interface CreateRoleResponse {
    success: boolean;
    message: string;
    data: {
        role: Role;
    };
}
