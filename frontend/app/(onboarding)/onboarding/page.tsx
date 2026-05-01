'use client';

import { motion } from 'framer-motion';
import {
  FileText, Mail, MessageSquare, Linkedin, Layout, Briefcase, Loader2, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';

const goals = [
  {
    id: 'resume',
    icon: FileText,
    title: 'Build My Resume',
    description: 'Create or improve a professional resume with AI assistance',
    href: '/resume-builder',
    color: 'indigo',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'hover:border-indigo-500',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badge: 'Most Popular',
  },
  {
    id: 'cover-letter',
    icon: Mail,
    title: 'Write a Cover Letter',
    description: 'Generate tailored cover letters for any job in seconds',
    href: '/cover-letters',
    color: 'sky',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'hover:border-sky-500',
    iconColor: 'text-sky-600 dark:text-sky-400',
    badge: null,
  },
  {
    id: 'interview',
    icon: MessageSquare,
    title: 'Prep for Interviews',
    description: 'Practice with AI-generated questions for your target role',
    href: '/interview-prep',
    color: 'violet',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'hover:border-violet-500',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badge: null,
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    title: 'Optimize LinkedIn',
    description: 'Supercharge your profile to attract more recruiters',
    href: '/linkedin-optimizer',
    color: 'blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'hover:border-blue-500',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badge: null,
  },
  {
    id: 'portfolio',
    icon: Layout,
    title: 'Build My Portfolio',
    description: 'Create a stunning portfolio site to showcase your work',
    href: '/portfolio',
    color: 'teal',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'hover:border-teal-500',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badge: null,
  },
  {
    id: 'jobs',
    icon: Briefcase,
    title: 'Track Applications',
    description: 'Organize your job search with a visual Kanban tracker',
    href: '/jobs',
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'hover:border-amber-500',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badge: null,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleGoalSelect = async (goal: typeof goals[0]) => {
    if (loadingId) return;
    setLoadingId(goal.id);

    try {
      const { data } = await apiClient.put('/users/me', { onboardingComplete: true });
      if (data?.data?.user) setUser(data.data.user);
      toast.success('Welcome to CareerForge AI!');
      router.push(goal.href);
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
          <Zap className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">10 free credits in your account</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
          What would you like to do first?
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Pick a goal to get started. You can access all features anytime from the dashboard.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl"
      >
        {goals.map((goal, i) => {
          const Icon = goal.icon;
          const isLoading = loadingId === goal.id;
          const isDisabled = !!loadingId;

          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={isDisabled ? {} : { y: -4 }}
              onClick={() => handleGoalSelect(goal)}
              disabled={isDisabled}
              className={`relative text-left p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 ${goal.border} transition-all duration-200 shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {goal.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                  {goal.badge}
                </span>
              )}
              <div className={`w-14 h-14 rounded-2xl ${goal.bg} flex items-center justify-center mb-5`}>
                {isLoading ? (
                  <Loader2 className={`h-7 w-7 ${goal.iconColor} animate-spin`} />
                ) : (
                  <Icon className={`h-7 w-7 ${goal.iconColor}`} />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {goal.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {goal.description}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-sm text-slate-400 dark:text-slate-500"
      >
        Not sure? You can explore everything from the dashboard after setup.
      </motion.p>
    </div>
  );
}
