'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useOnboardingStore } from '@/store/onboardingStore';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const step = useOnboardingStore((state) => state.step);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">CareerAI</span>
          <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
            BETA
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Step {step} of 4
            </span>
            <span className="text-xs font-bold text-indigo-600">
              {Math.round((step / 4) * 100)}% Complete
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              className="h-full bg-gradient-to-r from-indigo-600 to-teal-500"
            />
          </div>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </main>

      <footer className="py-6 px-12 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Need help? <Link href="/support" className="text-indigo-600 hover:underline">Contact Support</Link>
        </p>
      </footer>
    </div>
  );
}
