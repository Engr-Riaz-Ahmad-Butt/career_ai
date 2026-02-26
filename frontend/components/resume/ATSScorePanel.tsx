'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, X, AlertTriangle, CheckCircle, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ATSScorePanelProps {
    score: number;
    missingKeywords?: string[];
    weakSections?: string[];
    onDownload: () => void;
    onFixWithAI?: () => void;
    onClose?: () => void;
}

function CircularProgress({ score }: { score: number }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative w-36 h-36 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
                <motion.circle
                    cx="60" cy="60" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-4xl font-black"
                    style={{ color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                >
                    {score}
                </motion.span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ATS Score</span>
            </div>
        </div>
    );
}

export function ATSScorePanel({
    score,
    missingKeywords = [],
    weakSections = [],
    onDownload,
    onFixWithAI,
    onClose,
}: ATSScorePanelProps) {
    const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Needs Work' : 'Poor';
    const labelColor = score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
    const labelBg = score >= 75 ? 'bg-emerald-50 dark:bg-emerald-950/40' : score >= 50 ? 'bg-amber-50 dark:bg-amber-950/40' : 'bg-red-50 dark:bg-red-950/40';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-md w-full mx-auto"
        >
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 relative">
                {onClose && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
                <CircularProgress score={score} />
                <div className="text-center mt-4">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${labelBg} ${labelColor}`}>
                        {label}
                    </span>
                    <p className="text-slate-400 text-sm mt-2">
                        {score >= 75
                            ? 'Great job! Your CV is ATS-optimized.'
                            : score >= 50
                                ? 'Some improvements will boost visibility.'
                                : 'Your CV needs significant ATS optimization.'}
                    </p>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
                {missingKeywords.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-amber-500" />
                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Missing Keywords</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {missingKeywords.map((kw) => (
                                <span key={kw} className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-800">
                                    + {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {weakSections.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Weak Sections</h4>
                        </div>
                        <div className="space-y-2">
                            {weakSections.map((section) => (
                                <div key={section} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900">
                                    <span className="text-sm text-red-700 dark:text-red-400 font-medium">{section}</span>
                                    <ChevronRight className="w-4 h-4 text-red-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {score >= 75 && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                            Your CV is well-optimized for ATS systems. You're ready to apply!
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                    {score < 75 && onFixWithAI && (
                        <Button
                            onClick={onFixWithAI}
                            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-base shadow-lg"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Fix with AI
                        </Button>
                    )}
                    <Button
                        onClick={onDownload}
                        variant={score >= 75 ? 'default' : 'outline'}
                        className={`w-full h-12 rounded-2xl font-bold text-base ${score >= 75 ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
