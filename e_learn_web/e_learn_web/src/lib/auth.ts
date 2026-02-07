// Authentication utility for token management

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Save authentication token to localStorage
 */
export function saveToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

/**
 * Get authentication token from localStorage
 */
export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
}

/**
 * Remove authentication token from localStorage
 */
export function clearToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}

/**
 * Save user data to localStorage
 */
export function saveUser(user: any): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}

/**
 * Get user data from localStorage
 */
export function getUser(): any | null {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }
    return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return getToken() !== null;
}

/**
 * Logout user - clear all auth data
 */
export function logout(): void {
    clearToken();
}
