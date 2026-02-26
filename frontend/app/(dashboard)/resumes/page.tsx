'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data — replace with documentStore
const resumes = [
    { id: '1', title: 'Software Engineer Resume', updatedAt: '2026-02-22', atsScore: 85 },
    { id: '2', title: 'Product Manager Resume', updatedAt: '2026-02-15', atsScore: 78 },
];

export default function ResumesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Resumes</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All your saved resumes, ready to edit or download.</p>
                </div>
                <Link href="/resume-builder/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-xl font-bold">
                        <Plus className="h-4 w-4" /> Create New
                    </Button>
                </Link>
            </div>

            {resumes.length > 0 ? (
                <div className="space-y-3">
                    {resumes.map((resume) => (
                        <motion.div
                            key={resume.id}
                            whileHover={{ y: -1 }}
                            className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{resume.title}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                        <Clock className="h-3 w-3" />
                                        Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="font-bold text-slate-900 dark:text-white">{resume.atsScore}%</p>
                                    <p className="text-[10px] text-slate-400">ATS Score</p>
                                </div>
                                <Link href={`/resume-builder?id=${resume.id}`}>
                                    <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
                                        Edit <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No resumes yet. Build your first one!</p>
                    <Link href="/resume-builder/new">
                        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <Plus className="h-4 w-4" /> Build Resume
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
