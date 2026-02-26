'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Sparkles } from 'lucide-react';

export default function BioGeneratorPage() {
    return (
        <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
            <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 mx-auto">
                    <User className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Bio Generator</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Generate a professional bio tailored for LinkedIn, Twitter/X, portfolio sites, and more.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4">
                <Sparkles className="h-10 w-10 text-orange-400 mx-auto" />
                <p className="text-slate-400 font-medium">Bio Generator</p>
                <p className="text-slate-400 text-sm">Coming soon — AI-powered professional bio generation.</p>
                <Link href="/dashboard">
                    <Button variant="outline" className="mt-2">Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
