"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_TOKEN_KEY, getToken, getUserFromToken } from "@/lib/auth";
import { User } from "@/types/api";

type AuthContextType = {
    user: User | null;
    token: string | null;
    setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const t = getToken();
        if (t) {
            setToken(t);
            setUser(getUserFromToken(t));
        }
    }, []);

    const handleSetToken = (t: string | null) => {
        if (t) {
            window.localStorage.setItem(AUTH_TOKEN_KEY, t);
            setUser(getUserFromToken(t));
            setToken(t);
        } else {
            window.localStorage.removeItem(AUTH_TOKEN_KEY);
            setUser(null);
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, setToken: handleSetToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
