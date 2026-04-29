'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Brain,
  Settings,
  LogOut,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  Mail,
  GraduationCap,
  User,
  ChevronDown,
  Mic,
  TrendingUp,
  Globe,
  Linkedin,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';


type SubItem = { href: string; label: string };
type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: SubItem[];
  comingSoon?: boolean;
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/resumes',
    label: 'Resumes',
    icon: FileText,
    subItems: [
      { href: '/resumes', label: 'My Resumes' },
      { href: '/tailor', label: 'AI Tailor' },
    ],
  },
  {
    href: '/cover-letters',
    label: 'Cover Letters',
    icon: Mail,
    subItems: [
      { href: '/cover-letters', label: 'My Cover Letters' },
    ],
  },
  {
    href: '/sop',
    label: 'SOP & Scholarship',
    icon: GraduationCap,
    subItems: [
      { href: '/documents', label: 'My Documents' },
    ],
  },
  { href: '/bio-generator', label: 'Bio Generator', icon: User },
  { href: '/portfolio', label: 'Portfolio', icon: Globe },
  { href: '/linkedin-optimizer', label: 'LinkedIn Optimizer', icon: Linkedin },
  { href: '/interview-prep', label: 'Interview Prep', icon: Mic },
  {
    href: '/career-growth',
    label: 'Career Growth',
    icon: TrendingUp,
    comingSoon: true,
  },
  {
    href: '/ab-testing',
    label: 'A/B Testing',
    icon: Sparkles,
    comingSoon: true,
  },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  // Auto-open menus based on current path
  const defaultOpen = navItems
    .filter((item) => item.subItems?.some((sub) => pathname.startsWith(sub.href)))
    .map((item) => item.label);

  const [openMenus, setOpenMenus] = useState<string[]>(defaultOpen);

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
      {/* Branding & Top Toggle */}
      <div className="px-5 h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600 flex-shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">CareerAI</span>
              <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
                BETA
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${!sidebarOpen && 'mx-auto'}`}
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = !!(item.subItems && item.subItems.length > 0);
          const isMenuOpen = openMenus.includes(item.label);
          const isActive =
            pathname === item.href ||
            (item.subItems?.some((sub) => pathname === sub.href) ?? false);

          return (
            <div key={item.label}>
              {hasSubItems && sidebarOpen ? (
                // Expandable parent item
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-7 pl-3 border-l border-slate-100 dark:border-slate-800 mt-0.5 space-y-0.5 pb-1">
                      {item.subItems?.map((sub) => (
                        <Link key={sub.href} href={sub.href}>
                          <span
                            className={`block px-3 py-2 rounded-md text-xs transition-all cursor-pointer ${
                              pathname === sub.href
                                ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                            }`}
                          >
                            {sub.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : (
                // Simple nav item (or collapsed with icon only)
                item.comingSoon ? (
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-not-allowed ${
                      !sidebarOpen && 'justify-center'
                    } text-slate-400 opacity-60`}
                    title={!sidebarOpen ? `${item.label} (Coming Soon)` : undefined}
                  >
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                          Soon
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                        !sidebarOpen && 'justify-center'
                      } ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                      {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                  </Link>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom: User + Logout */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-3">
        {user && (
          <div
            className={`flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-teal-500 flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{user.name || 'User'}</p>
                <p className="text-[9px] text-slate-500 truncate uppercase tracking-tighter">{user.plan || 'Free'} Plan</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={async () => {
            try {
              await logout.mutateAsync();
            } finally {
              window.location.href = '/auth/login';
            }
          }}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-all w-full group ${
            !sidebarOpen && 'justify-center'
          }`}
        >
          <LogOut className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {sidebarOpen && <span className="text-xs font-bold">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}
