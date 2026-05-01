'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">CareerForge AI</span>
          <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
            BETA
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        {children}
      </main>

      <footer className="py-6 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400">
          Need help?{' '}
          <Link href="/support" className="text-indigo-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </footer>
    </div>
  );
}
