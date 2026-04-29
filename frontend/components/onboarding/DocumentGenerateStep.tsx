'use client';

import { motion } from 'framer-motion';
import { Mail, UserCircle, Loader2, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboardingStore';
import { aiApi } from '@/lib/api/endpoints/ai.api';

export function DocumentGenerateStep() {
  const { setStep, resumeId, jobDescription, setGeneratedDocument } = useOnboardingStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [type, setType] = useState<'COVER_LETTER' | 'LINKEDIN_BIO' | null>(null);

  const handleGenerate = async (docType: 'COVER_LETTER' | 'LINKEDIN_BIO') => {
    if (!resumeId) {
      toast.error('Resume not found. Please go back.');
      return;
    }

    setIsGenerating(true);
    setType(docType);
    try {
      let response;
      if (docType === 'COVER_LETTER') {
        response = await aiApi.generateCoverLetter({
          resumeId,
          jobDescription: jobDescription || '',
          type: 'job_application',
        });
      } else {
        response = await aiApi.generateBio({
          resumeId,
          bioType: 'linkedin',
        });
      }

      setResult(response.data.content);
      setGeneratedDocument(response.data.id, docType);
      toast.success(`${docType === 'COVER_LETTER' ? 'Cover Letter' : 'LinkedIn Bio'} generated!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Step 3: Instant AI Generation
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Pick one document to generate instantly using your resume data.
        </p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cover Letter Option */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center group transition-all hover:border-sky-500"
          >
            <div className="w-20 h-20 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center mb-6 group-hover:bg-sky-100 transition-colors">
              {isGenerating && type === 'COVER_LETTER' ? (
                <Loader2 className="h-10 w-10 text-sky-600 animate-spin" />
              ) : (
                <Mail className="h-10 w-10 text-sky-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Cover Letter</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Tailored specifically to the job description you just pasted.
            </p>
            <Button
              className="w-full h-12 bg-sky-600 hover:bg-sky-700 font-bold"
              onClick={() => handleGenerate('COVER_LETTER')}
              disabled={isGenerating}
            >
              Generate Now
            </Button>
          </motion.div>

          {/* LinkedIn Bio Option */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center group transition-all hover:border-indigo-500"
          >
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
              {isGenerating && type === 'LINKEDIN_BIO' ? (
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              ) : (
                <UserCircle className="h-10 w-10 text-indigo-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">LinkedIn Bio</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              A high-impact summary for your profile, optimized for hiring managers.
            </p>
            <Button
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold"
              onClick={() => handleGenerate('LINKEDIN_BIO')}
              disabled={isGenerating}
            >
              Generate Now
            </Button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden"
        >
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Wand2 className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Generated {type === 'COVER_LETTER' ? 'Cover Letter' : 'LinkedIn Bio'}
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
              AI Powered
            </span>
          </div>
          <div className="p-8">
            <div className="w-full bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 font-serif text-slate-800 dark:text-slate-200 whitespace-pre-wrap text-sm leading-relaxed max-h-[400px] overflow-y-auto">
              {result}
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setResult(null)}>
              Change Selection
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 font-bold"
              onClick={() => setStep(4)}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {isGenerating && (
        <div className="fixed inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center max-w-sm text-center">
            <div className="relative mb-6">
              <Sparkles className="h-12 w-12 text-indigo-600 animate-pulse" />
              <Loader2 className="h-16 w-16 text-indigo-100 dark:text-indigo-900/30 animate-spin absolute -top-2 -left-2" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Generating...</h4>
            <p className="text-sm text-slate-500">Our AI is crafting a high-impact document based on your unique experience.</p>
          </div>
        </div>
      )}
    </div>
  );
}
