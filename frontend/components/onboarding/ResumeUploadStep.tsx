'use client';

import { motion } from 'framer-motion';
import { Upload, FilePlus, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/onboardingStore';
import { resumeApi } from '@/lib/api/endpoints/resume.api';

export function ResumeUploadStep() {
  const { setStep, setResumeId } = useOnboardingStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await resumeApi.upload(file);
      setResumeId(response.data.id);
      setIsSuccess(true);
      toast.success('Resume uploaded and parsed successfully!');
      setTimeout(() => setStep(2), 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartFromScratch = async () => {
    setIsUploading(true);
    try {
      const response = await resumeApi.create({
        title: 'My Resume',
        template: 'modern',
      });
      setResumeId(response.data.id);
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create resume');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Let&apos;s start with your resume
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Upload your existing resume and our AI will extract your experience, or start from scratch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Option */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center group transition-all hover:border-indigo-500"
        >
          {isSuccess ? (
             <div className="flex flex-col items-center animate-in zoom-in duration-300">
               <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Uploaded!</h3>
             </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-indigo-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Resume</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                PDF, DOCX supported. Our AI extracts everything for you.
              </p>
              <label className="w-full">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isUploading}>
                  Select File
                </Button>
              </label>
            </>
          )}
        </motion.div>

        {/* Scratch Option */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center group transition-all hover:border-slate-300 dark:hover:border-slate-600"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-slate-100 transition-colors">
            <FilePlus className="h-8 w-8 text-slate-600 dark:text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Start from Scratch</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            No resume? No problem. Fill in your details manually.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleStartFromScratch}
            disabled={isUploading}
          >
            Create New
          </Button>
        </motion.div>
      </div>

      <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Privacy Note:</strong> Your data is encrypted and used only to improve your job applications. We never share your personal info with third parties.
        </p>
      </div>
    </div>
  );
}
