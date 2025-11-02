import type { User } from "@/types/api";
import { jwtDecode } from "jwt-decode";

export const AUTH_TOKEN_KEY = "auth_token";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? window.sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function clearAuth(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getUserFromToken<T extends User>(token?: string | null): T | null {
    const t = token ?? getToken();
    if (!t) return null;
    try {
        return jwtDecode<User>(t) as T;
    } catch {
        return null;
    }
}