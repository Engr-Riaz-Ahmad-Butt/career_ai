'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
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
  PanelLeftClose,
  PanelLeftOpen,
  Briefcase,
  TrendingUp,
  Globe,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/resume-builder',
    label: 'Resume Builder',
    icon: FileText,
    subItems: [
      { href: '/resume-builder/new', label: 'Build New Resume' },
      { href: '/resume-builder/tailor', label: 'Tailor Resume' },
      { href: '/resume-builder/my-resumes', label: 'My Resumes' },
    ]
  },
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
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev: string[]) =>
      prev.includes(label) ? prev.filter((item: string) => item !== label) : [...prev, label]
    );
  };

  return (
    <motion.div
      initial={{ width: sidebarOpen ? 256 : 80 }}
      animate={{ width: sidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 bottom-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-40 flex flex-col"
    >
      {/* Branding & Top Toggle - Aligned with Navbar */}
      <div className="px-5 h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {sidebarOpen && <span className="text-sm font-bold text-slate-900 dark:text-white">CareerAI</span>}
        </div>

        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${!sidebarOpen && 'mx-auto'}`}
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || item.subItems?.some(sub => pathname === sub.href);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isMenuOpen = openMenus.includes(item.label);

          return (
            <div key={item.label} className="space-y-1">
              {hasSubItems && sidebarOpen ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link href={item.href}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${isActive && !hasSubItems
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </motion.button>
                </Link>
              )}

              {hasSubItems && sidebarOpen && (
                <motion.div
                  initial={false}
                  animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-1 px-4 ml-4 border-l border-slate-100 dark:border-slate-800"
                >
                  {item.subItems?.map((sub) => (
                    <Link key={sub.href} href={sub.href}>
                      <button
                        className={`w-full text-left px-4 py-1.5 rounded-md text-xs transition-all ${pathname === sub.href
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        {sub.label}
                      </button>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Account & Sidebar Toggle */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 text-center">
        {user && (
          <div className={`flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 transition-all duration-300 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {user.name || 'User'}
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate opacity-70 uppercase tracking-tighter">
                  {user.plan || 'Free'} Account
                </p>
              </div>
            )}
          </div>
        )}

        <div className="w-full">
          <button
            onClick={async () => {
              await logout();
              window.location.href = '/auth/login';
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 group w-full ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="text-xs font-bold">Logout</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
