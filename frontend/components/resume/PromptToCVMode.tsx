'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, ArrowRight, ArrowLeft, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WizardData } from './ManualBuilderWizard';

interface PromptToCVModeProps {
    onComplete: (data: Partial<WizardData>) => void;
    onCancel: () => void;
}

const EXAMPLE_PROMPTS = [
    "I am a software engineer with 5 years of experience in React and Node.js. I worked at a fintech startup for 3 years and then at a logistics company. I'm looking for a senior frontend role at a product-focused company.",
    "I'm a marketing manager with 8 years of experience at FMCG companies. I've led campaigns generating over $5M revenue, managed teams of 12, and specialize in digital marketing and brand strategy.",
    "Recent Computer Science graduate from MIT with internships at Google and Amazon. Proficient in Python, machine learning, and distributed systems. Seeking a data engineering role.",
];

function generateMockCV(prompt: string, jd: string): Partial<WizardData> {
    // In production: call AI backend. For now: structured mock extraction.
    const nameMatcher = prompt.match(/I(?:'m| am) (?:a |an )?([A-Z][a-z]+ [A-Z][a-z]+)/);
    return {
        contact: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
        summary: `${prompt.slice(0, 300)}${prompt.length > 300 ? '...' : ''}`,
        experience: [{
            id: Math.random().toString(36).substr(2, 9),
            company: 'Previous Company',
            position: 'Professional Role',
            location: '',
            startDate: '',
            endDate: 'Present',
            description: 'Extracted from your description — please edit to add specific details.',
            achievements: [],
        }],
        education: [],
        skills: { technical: [], soft: [], tools: [], languages: [] },
        projects: [],
        certifications: [],
    };
}

export function PromptToCVMode({ onComplete, onCancel }: PromptToCVModeProps) {
    const [prompt, setPrompt] = useState('');
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim() || prompt.trim().length < 30) {
            setError('Please write at least a sentence or two about yourself.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // Simulate AI processing (in production: call /api/ai/prompt-to-cv)
            await new Promise(r => setTimeout(r, 2500));
            const result = generateMockCV(prompt, jd);
            onComplete(result);
        } catch (e) {
            setError('AI generation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-start justify-center pt-12 px-4 pb-12">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/50 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-5">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Prompt to CV</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Describe yourself in plain language — experience, skills, goals. AI will build your full CV automatically.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="p-8 space-y-6">
                        {/* Main prompt area */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-orange-500" />
                                Tell us about yourself *
                            </Label>
                            <Textarea
                                value={prompt}
                                onChange={e => {
                                    setPrompt(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder={`Example:\n"I am a software engineer with 5 years of experience in React and Node.js. I worked at a fintech startup and a logistics company. I want a CV for a senior frontend role at a product-focused company."`}
                                className="min-h-[200px] rounded-2xl resize-none border-slate-200 dark:border-slate-700 focus:border-orange-400 dark:focus:border-orange-600 text-base leading-relaxed p-5"
                            />
                            {error && (
                                <p className="text-sm text-red-500 flex items-center gap-1.5">
                                    <span>⚠</span> {error}
                                </p>
                            )}
                            <div className="flex justify-between items-center">
                                <span className={`text-xs ${prompt.length < 30 ? 'text-slate-400' : 'text-emerald-600'}`}>
                                    {prompt.length}/50+ characters recommended
                                </span>
                                {prompt.length > 0 && (
                                    <button onClick={() => setPrompt('')} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Clear</button>
                                )}
                            </div>
                        </div>

                        {/* Example prompts */}
                        {prompt.length === 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Example prompts:</p>
                                <div className="space-y-2">
                                    {EXAMPLE_PROMPTS.map((ex, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPrompt(ex)}
                                            className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-200 border border-slate-100 dark:border-slate-700 transition-all"
                                        >
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">"{ex}"</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Optional JD */}
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                Job Description (optional)
                            </Label>
                            <Textarea
                                value={jd}
                                onChange={e => setJd(e.target.value)}
                                placeholder="Paste the job description to tailor your CV to this specific role..."
                                className="min-h-[100px] rounded-2xl resize-none border-slate-200 dark:border-slate-700 text-sm"
                            />
                        </div>

                        {/* CTA */}
                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" onClick={onCancel} className="rounded-xl">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={loading || prompt.trim().length < 10}
                                className="flex-1 h-13 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl text-base shadow-lg disabled:opacity-40 py-3"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" /> Generating your CV…
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" /> Generate My CV <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </div>

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2 py-2">
                                <div className="flex justify-center gap-1">
                                    {['Analyzing your prompt…', 'Extracting experience…', 'Structuring CV data…', 'Almost done…'].map((msg, i) => (
                                        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.6 }} className="sr-only" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 animate-pulse">AI is building your CV. This takes about 5–10 seconds…</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
