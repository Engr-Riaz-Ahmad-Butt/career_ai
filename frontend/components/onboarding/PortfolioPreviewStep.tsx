'use client';

import { motion } from 'framer-motion';
import { Layout, CheckCircle2, Loader2, Globe, Github, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboardingStore';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';

export function PortfolioPreviewStep() {
  const router = useRouter();
  const { reset } = useOnboardingStore();
  const { setUser } = useAuthStore();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      // Refresh user data in store
      const { data: userData } = await apiClient.put('/user/me', { onboardingComplete: true });
      if (userData.data && userData.data.user) {
        setUser(userData.data.user);
      }

      reset();
      toast.success('Welcome to CareerAI! Onboarding complete.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Step 4: Your New Portfolio
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We&apos;ve automatically generated a professional portfolio site for you.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          {/* Browser Header */}
          <div className="h-10 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex-1 max-w-sm mx-auto h-6 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 flex items-center px-3 gap-2">
              <Globe className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] text-slate-400">yourname.careerforge.ai</span>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-8 aspect-video flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <Layout className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 italic underline decoration-indigo-500">
               Your Future Portfolio Site
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              A high-performance, SEO-friendly site that showcases your skills, projects, and documents in one beautiful link.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-center">
                <Sparkles className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">AI Themes</p>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 text-center">
                <Github className="h-5 w-5 text-teal-600 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">Git Sync</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center max-w-lg">
              You&apos;re all set! You can customize your portfolio theme, domain, and sections from the dashboard anytime.
            </p>
            <div className="flex gap-4 w-full max-w-md">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 text-slate-600 dark:text-slate-400 font-bold"
                onClick={() => useOnboardingStore.getState().setStep(3)}
                disabled={isFinishing}
              >
                Back
              </Button>
              <Button
                className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-xl shadow-indigo-200 dark:shadow-none"
                onClick={handleFinish}
                disabled={isFinishing}
              >
                {isFinishing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
