"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth"; // <- preferred. If you don't have it, use the inline getToken below.

// Inline fallback (delete if using utils/auth):
// const getToken = () => {
//   if (typeof window === "undefined") return null;
//   return (
//     window.localStorage.getItem("auth_token") ||
//     window.sessionStorage.getItem("auth_token")
//   );
// };
// const isAuthenticated = () => !!getToken();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Guard: block render until we know auth state on the client
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Runs only on client
    if (!isAuthenticated()) {
      const to = encodeURIComponent(pathname || "/");
      router.replace(`/signin?next=${to}`);
      return;
    }
    setReady(true);
  }, [router, pathname]);

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  if (!ready) {
    // Skeleton while checking auth (prevents unauthenticated flash)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Ачааллаж байна…
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
