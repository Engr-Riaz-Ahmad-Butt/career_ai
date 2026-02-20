'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Library,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Globe,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resume-builder', label: 'Resume Builder', icon: FileText },
  { href: '/tailor', label: 'AI Tailor', icon: Sparkles },
  { href: '/jobs', label: 'Job Tracker', icon: Briefcase },
  { href: '/skill-gap', label: 'Skill Gap', icon: TrendingUp },
  { href: '/career-growth', label: 'Career Growth', icon: BarChart3 },
  { href: '/ab-testing', label: 'A/B Testing', icon: Sparkles },
  { href: '/visa-scholarship', label: 'Visa & Scholarship', icon: Globe },
  { href: '/documents', label: 'Documents', icon: Library },
  { href: '/analyze', label: 'Analyze', icon: BarChart3 },
  { href: '/interview-prep', label: 'Interview Prep', icon: Brain },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <motion.div
      initial={{ width: sidebarOpen ? 256 : 80 }}
      animate={{ width: sidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 bottom-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-40 flex flex-col pt-20"
    >
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.button
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </motion.button>
            </Link>
          );
        })}
      </div>

      {/* User & Logout */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
        {sidebarOpen && user && (
          <div className="px-2 py-2">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
