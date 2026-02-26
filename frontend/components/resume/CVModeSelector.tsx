'use client';

import { motion } from 'framer-motion';
import { PencilRuler, Sparkles, Upload, MessageSquare, ChevronRight, Coins } from 'lucide-react';

export type CVMode = 'manual' | 'ai-generate' | 'improve-cv' | 'prompt-to-cv';

interface ModeCard {
    id: CVMode;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    usesCredits: boolean;
    badge?: string;
}

const MODES: ModeCard[] = [
    {
        id: 'manual',
        icon: PencilRuler,
        title: 'Build Manually',
        subtitle: 'Guided step-by-step wizard',
        description: 'Fill each section with a guided form wizard. Live preview updates as you type. Perfect for full control over every detail.',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
        usesCredits: false,
    },
    {
        id: 'ai-generate',
        icon: Sparkles,
        title: 'AI Generate',
        subtitle: 'From job description',
        description: 'Paste a job description and optionally upload your existing CV. AI tailors a complete, targeted resume for the role.',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-950/40',
        borderColor: 'border-purple-200 dark:border-purple-800',
        usesCredits: true,
        badge: 'Most Popular',
    },
    {
        id: 'improve-cv',
        icon: Upload,
        title: 'Improve My CV',
        subtitle: 'Upload & AI-enhance',
        description: 'Upload your current PDF or Word CV. AI extracts the data, populates the editor, and provides targeted improvement suggestions.',
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
        borderColor: 'border-cyan-200 dark:border-cyan-800',
        usesCredits: true,
    },
    {
        id: 'prompt-to-cv',
        icon: MessageSquare,
        title: 'Prompt to CV',
        subtitle: 'Describe yourself',
        description: 'Write about yourself in plain language. AI interprets your description and builds a complete structured CV instantly.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-950/40',
        borderColor: 'border-orange-200 dark:border-orange-800',
        usesCredits: true,
    },
];

interface CVModeSelectorProps {
    onSelect: (mode: CVMode) => void;
}

export function CVModeSelector({ onSelect }: CVModeSelectorProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-start justify-center pt-16 px-4 pb-16">
            <div className="w-full max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 border border-indigo-100 dark:border-indigo-800">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered CV Builder
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        How would you like to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600">
                            build your CV?
                        </span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Choose the approach that works best for you. All modes lead to the same powerful editor — you can always edit everything before downloading.
                    </p>
                </motion.div>

                {/* Mode Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MODES.map((mode, index) => {
                        const Icon = mode.icon;
                        return (
                            <motion.button
                                key={mode.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => onSelect(mode.id)}
                                className={`group relative text-left p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 ${mode.borderColor} hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
                            >
                                {/* Badge */}
                                {mode.badge && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {mode.badge}
                                    </div>
                                )}

                                {/* Background glow */}
                                <div className={`absolute inset-0 ${mode.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl ${mode.bgColor} ${mode.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{mode.title}</h3>
                                        <p className={`text-sm font-semibold ${mode.color} mb-3`}>{mode.subtitle}</p>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{mode.description}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        {mode.usesCredits ? (
                                            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
                                                <Coins className="w-3.5 h-3.5" />
                                                Uses AI Credits
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                ✓ Free
                                            </div>
                                        )}
                                        <div className={`flex items-center gap-1 ${mode.color} font-bold text-sm group-hover:gap-2 transition-all`}>
                                            Get Started <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-slate-400 dark:text-slate-600 text-sm mt-10"
                >
                    All methods allow full editing before download. Your data auto-saves every 30 seconds.
                </motion.p>
            </div>
        </div>
    );
}
