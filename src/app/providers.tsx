"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SnackbarProvider } from "@/context/SnackContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SidebarProvider>
                    <SnackbarProvider>{children}</SnackbarProvider>
                </SidebarProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
