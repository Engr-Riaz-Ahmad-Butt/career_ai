'use client';

import { motion } from 'framer-motion';
import { Search, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboardingStore';
import { aiApi } from '@/lib/api/endpoints/aiApi';

export function AtsScanStep() {
  const { setStep, resumeId, setAtsScore, setJobDescription } = useOnboardingStore();
  const [jd, setJd] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!jd || jd.length < 50) {
      toast.error('Please paste a job description (at least 50 characters)');
      return;
    }

    if (!resumeId) {
      toast.error('Resume not found. Please go back and upload one.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await aiApi.getAtsScore({
        resumeId,
        jobDescription: jd,
      });
      setScoreData(response.data);
      setAtsScore(response.data.score);
      setJobDescription(jd);
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to analyze job');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Step 2: See How You Rank
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Paste a job description you&apos;re interested in. Our AI will scan your resume against it just like a real ATS.
        </p>
      </div>

      {!scoreData ? (
        <div className="space-y-6">
          <div className="relative">
            <textarea
              className="w-full h-64 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-0 transition-all text-sm resize-none"
              placeholder="Paste the job description here... (e.g., responsibilities, requirements, qualifications)"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              disabled={isAnalyzing}
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm z-10">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                <p className="font-bold text-slate-900 dark:text-white animate-pulse">AI is scanning your resume...</p>
                <p className="text-xs text-slate-500 mt-2">Matching keywords, experience, and skills</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 text-slate-600 dark:text-slate-400 font-bold"
              onClick={() => setStep(1)}
              disabled={isAnalyzing}
            >
              Back
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jd}
            >
              {isAnalyzing ? 'Analyzing...' : 'Scan My Resume'}
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden"
        >
          <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800">
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg className="w-32 h-32">
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
                <motion.circle
                  className="text-indigo-600"
                  strokeWidth="8"
                  strokeDasharray={364.4}
                  initial={{ strokeDashoffset: 364.4 }}
                  animate={{ strokeDashoffset: 364.4 - (364.4 * scoreData.score) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{scoreData.score}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATS Score</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {scoreData.score >= 80 ? 'Impressive Match!' : scoreData.score >= 60 ? 'Solid Start' : 'Needs Optimization'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              {scoreData.summary}
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Matched Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {scoreData.matches?.slice(0, 10).map((m: string) => (
                  <span key={m} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full border border-emerald-100 dark:border-emerald-800">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {scoreData.missing?.slice(0, 10).map((m: string) => (
                  <span key={m} className="px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full border border-amber-100 dark:border-amber-800">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setScoreData(null)}>
              Try Another Job
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 font-bold"
              onClick={() => setStep(3)}
            >
              Next Step: Generate Fixes
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
