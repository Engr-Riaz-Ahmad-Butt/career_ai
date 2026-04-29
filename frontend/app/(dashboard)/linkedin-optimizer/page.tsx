'use client';

import { motion } from 'framer-motion';
import {
  Linkedin, Zap, Loader2, Copy, Check, Sparkles, User, Briefcase, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';
import { Button } from '@/components/ui/button';
import { useAI } from '@/hooks/use-ai';
import type { LinkedInOptimizeResult } from '@/types/ai.types';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 transition-colors">
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export default function LinkedInOptimizerPage() {
  const [profileText, setProfileText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [result, setResult] = useState<LinkedInOptimizeResult | null>(null);

  const { optimizeLinkedIn } = useAI();

  const handleOptimize = () => {
    if (!profileText.trim()) return toast.error('Please paste your LinkedIn profile text');
    optimizeLinkedIn.mutate(
      { profileText, targetRole, industry },
      {
        onSuccess: (data) => {
          setResult(data.data as LinkedInOptimizeResult);
          toast.success('Profile optimized!');
        },
        onError: (err: unknown) => {
          const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(message || 'Failed to optimize profile');
        },
      }
    );
  };

  return (
    <FeatureErrorBoundary featureName="LinkedIn Optimizer">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <Linkedin className="h-8 w-8 text-[#0A66C2]" />
              LinkedIn Optimizer
            </h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              Supercharge your LinkedIn profile to rank higher and attract recruiters.
              <span className="flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                <Zap className="h-3 w-3" /> 3 Credits
              </span>
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Paste Profile Text</label>
                  <p className="text-xs text-slate-500 mb-3">Copy everything from your LinkedIn profile (About, Experience, etc.) and paste it here.</p>
                  <textarea
                    value={profileText}
                    onChange={e => setProfileText(e.target.value)}
                    placeholder="E.g., Senior Software Engineer at Tech Corp. 10 years of experience building scalable web applications..."
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-slate-400" /> Target Role
                    </label>
                    <input
                      value={targetRole}
                      onChange={e => setTargetRole(e.target.value)}
                      placeholder="e.g. Product Manager"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" /> Industry
                    </label>
                    <input
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      placeholder="e.g. FinTech"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleOptimize}
                  disabled={optimizeLinkedIn.isPending || !profileText}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#0A66C2] to-indigo-600 hover:opacity-90 text-white shadow-lg shadow-indigo-500/25"
                >
                  {optimizeLinkedIn.isPending ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Optimizing Profile...</> : <><Sparkles className="h-5 w-5 mr-2" /> Optimize Now (3 Credits)</>}
                </Button>
              </div>
            </motion.div>

            {/* Output Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {result ? (
                <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 shadow-xl shadow-indigo-500/5 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                  {/* Headline */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Headline <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Highly Searched</span>
                      </h3>
                      <CopyButton text={result.headline} />
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                      {result.headline}
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">About (Summary)</h3>
                      <CopyButton text={result.summary} />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {result.summary}
                    </div>
                  </div>

                  {/* Experience */}
                  {result.experienceBullets?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Experience Improvements</h3>
                      <div className="space-y-4">
                        {result.experienceBullets.map((b, i) => (
                          <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                            <p className="text-xs text-rose-500 dark:text-rose-400 line-through opacity-70 mb-2">{b.original}</p>
                            <div className="flex items-start gap-3">
                              <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">{b.improved}</p>
                                <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg inline-block">💡 {b.reason}</p>
                              </div>
                              <CopyButton text={b.improved} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keywords & Tips */}
                  <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Keywords to Add</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords?.map((k: string, i: number) => (
                          <span key={i} className="text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-2.5 py-1 rounded-lg border border-teal-100 dark:border-teal-800/50">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Algorithm Tips</h3>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        {result.overallTips?.map((tip: string, i: number) => (
                          <li key={i} className="flex gap-2"><span className="text-indigo-500">•</span> {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <Linkedin className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-400 mb-2">Awaiting Profile Text</h3>
                  <p className="text-sm text-slate-500 max-w-sm">Paste your LinkedIn profile text on the left and click optimize to see your personalized improvements.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
