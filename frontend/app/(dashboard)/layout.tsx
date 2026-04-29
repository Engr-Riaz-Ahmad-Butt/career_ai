'use client';

import { FeatureErrorBoundary } from "@/components/errors/FeatureErrorBoundary";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sidebarOpen = useUIStore((state) => state.sidebarOpen);
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user && !user.onboardingComplete) {
            router.replace('/onboarding');
        }
    }, [isLoading, isAuthenticated, user, router]);

    // Show a blank screen while loading or if redirecting to onboarding
    if (isLoading || (isAuthenticated && user && !user.onboardingComplete)) {
        return <div className="min-h-screen bg-white dark:bg-slate-950" />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <AppSidebar />
            <div
                className="flex flex-col min-h-screen transition-all duration-300"
                style={{
                    paddingLeft: sidebarOpen ? '256px' : '80px',
                }}
            >
                <AppNavbar />
                <main className="flex-1 pt-16 p-6">
                    <FeatureErrorBoundary featureName="This page">
                        {children}
                    </FeatureErrorBoundary>
                </main>
            </div>
        </div>
    );
}
