'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

export default function NewCoverLetterPage() {
    return (
        <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
            <Link href="/cover-letters">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-500 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Back to Cover Letters
                </Button>
            </Link>

            <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 mx-auto">
                    <Mail className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Generate Cover Letter</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Paste a job description and let AI write a tailored cover letter in seconds.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-400 font-medium">Cover Letter Generator</p>
                <p className="text-slate-400 text-sm mt-1">Coming soon — full AI-powered generation flow.</p>
            </div>
        </div>
    );
}
