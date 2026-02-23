'use client';

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";
import { useUIStore } from "@/store/uiStore";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sidebarOpen = useUIStore((state) => state.sidebarOpen);

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
                    {children}
                </main>
            </div>
        </div>
    );
}
