'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Plus, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data — replace with real API
const coverLetters = [
    { id: '1', title: 'Google Cover Letter', updatedAt: '2026-02-21' },
    { id: '2', title: 'Amazon Application', updatedAt: '2026-02-18' },
];

export default function CoverLettersPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Cover Letters</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All your AI-generated cover letters in one place.</p>
                </div>
                <Link href="/cover-letters/new">
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white gap-2 rounded-xl font-bold">
                        <Plus className="h-4 w-4" /> Create New
                    </Button>
                </Link>
            </div>

            {/* List */}
            {coverLetters.length > 0 ? (
                <div className="space-y-3">
                    {coverLetters.map((cl) => (
                        <motion.div
                            key={cl.id}
                            whileHover={{ y: -1 }}
                            className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{cl.title}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                        <Clock className="h-3 w-3" />
                                        Updated {new Date(cl.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <Link href={`/cover-letters/${cl.id}`}>
                                <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
                                    Open <ArrowRight className="h-3 w-3" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No cover letters yet.</p>
                    <Link href="/cover-letters/new">
                        <Button className="mt-4 bg-sky-600 hover:bg-sky-700 text-white gap-2">
                            <Plus className="h-4 w-4" /> Generate your first
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
