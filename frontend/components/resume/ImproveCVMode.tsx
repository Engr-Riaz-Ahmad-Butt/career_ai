'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertTriangle, Lightbulb, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardData } from './ManualBuilderWizard';

interface Suggestion {
    id: string;
    type: 'warn' | 'tip' | 'success';
    section: string;
    message: string;
    improved?: string;
}

interface ImproveCVModeProps {
    onComplete: (data: Partial<WizardData>, suggestions: Suggestion[]) => void;
    onCancel: () => void;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
    { id: 's1', type: 'tip', section: 'Experience', message: 'Bullet point is too vague', improved: 'Instead of "Worked on a team", try: "Collaborated with 6 engineers to deliver a customer-facing feature that reduced onboarding time by 40%."' },
    { id: 's2', type: 'warn', section: 'Summary', message: 'Summary is too generic — lacks specificity and impact.', improved: 'Consider adding quantifiable achievements and your unique value proposition.' },
    { id: 's3', type: 'warn', section: 'Experience', message: 'Missing quantifiable achievements in Experience section.' },
    { id: 's4', type: 'success', section: 'Skills', message: 'Skills section looks complete and well structured.' },
    { id: 's5', type: 'tip', section: 'Education', message: 'Consider adding relevant coursework or academic achievements if you\'re early in your career.' },
];

function SuggestionChip({ suggestion, onAccept, onDismiss }: { suggestion: Suggestion; onAccept: () => void; onDismiss: () => void }) {
    const [expanded, setExpanded] = useState(false);
    const icons = { warn: AlertTriangle, tip: Lightbulb, success: CheckCircle2 };
    const colors = {
        warn: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30',
        tip: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30',
        success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30',
    };
    const iconColors = { warn: 'text-amber-500', tip: 'text-blue-500', success: 'text-emerald-500' };
    const Icon = icons[suggestion.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className={`rounded-2xl border p-4 ${colors[suggestion.type]}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColors[suggestion.type]}`} />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">{suggestion.section}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{suggestion.message}</p>
                        {suggestion.improved && expanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-400 italic border border-slate-100 dark:border-slate-700"
                            >
                                {suggestion.improved}
                            </motion.div>
                        )}
                        {suggestion.improved && (
                            <button onClick={() => setExpanded(!expanded)} className="text-xs font-semibold text-blue-600 mt-1 hover:underline">
                                {expanded ? 'Hide suggestion' : 'See improved version'}
                            </button>
                        )}
                    </div>
                </div>
                {suggestion.type !== 'success' && (
                    <div className="flex gap-1 flex-shrink-0">
                        <button
                            onClick={onAccept}
                            className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 rounded-full flex items-center justify-center text-emerald-600 transition-colors"
                            title="Apply suggestion"
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={onDismiss}
                            className="w-7 h-7 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center text-slate-400 transition-colors"
                            title="Dismiss"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export function ImproveCVMode({ onComplete, onCancel }: ImproveCVModeProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [parsed, setParsed] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
    const [dismiss, setDismiss] = useState<string[]>([]);
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB'); return; }
        setFile(f);
        setError('');
    };

    const handleParse = async () => {
        if (!file) { setError('Please upload your CV first.'); return; }
        setLoading(true);
        setError('');
        try {
            await new Promise(r => setTimeout(r, 2500));
            setSuggestions(MOCK_SUGGESTIONS);
            setActiveSuggestions(MOCK_SUGGESTIONS.map(s => s.id));
            setParsed(true);
        } catch {
            setError('Failed to parse CV. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = (id: string) => {
        setActiveSuggestions(prev => prev.filter(s => s !== id));
        setDismiss(prev => [...prev, id]);
    };

    const handleAccept = (id: string) => {
        // In production: apply the improvement to the form data
        setActiveSuggestions(prev => prev.filter(s => s !== id));
    };

    const handleContinue = () => {
        const mockData: Partial<WizardData> = {
            contact: { fullName: 'Extracted Name', email: 'extracted@email.com', phone: '+1 000 000 0000', location: 'City, Country', linkedin: '', github: '', website: '' },
            summary: 'This summary was extracted from your uploaded CV. Please edit and improve it.',
            experience: [{
                id: Math.random().toString(36).substr(2, 9),
                company: 'Previous Employer',
                position: 'Your Role',
                location: '',
                startDate: 'Jan 2020',
                endDate: 'Present',
                description: 'Extracted from your CV. Please review and edit.',
                achievements: [],
            }],
            education: [],
            skills: { technical: ['Skill 1', 'Skill 2'], soft: [], tools: [], languages: [] },
            projects: [],
            certifications: [],
        };
        onComplete(mockData, suggestions.filter(s => activeSuggestions.includes(s.id)));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-start justify-center pt-10 px-4 pb-12">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Button variant="ghost" onClick={onCancel} className="text-slate-600">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Choose mode
                    </Button>
                    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">Improve My CV</h2>
                        <p className="text-xs text-slate-500">Upload → AI parses → Edit + AI suggestions</p>
                    </div>
                </div>

                {!parsed ? (
                    // Upload phase
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-950/50 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Upload Your Existing CV</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">AI will extract all your data, populate the editor, and give you targeted improvement suggestions.</p>
                        </div>

                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${file ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/10'
                                }`}
                        >
                            {file ? (
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    <p className="font-bold text-emerald-700 dark:text-emerald-400">{file.name}</p>
                                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload className="w-10 h-10 text-slate-300" />
                                    <div>
                                        <p className="font-bold text-slate-600 dark:text-slate-400">Drag & drop or click to upload</p>
                                        <p className="text-xs text-slate-400 mt-1">PDF or DOCX · Maximum 5MB</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} className="hidden" />

                        {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2">⚠ {error}</p>}

                        <Button
                            onClick={handleParse}
                            disabled={!file || loading}
                            className="w-full h-13 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl text-base shadow-lg py-3 disabled:opacity-40"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> AI is analyzing your CV…</span>
                            ) : (
                                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Extract & Analyze <ArrowRight className="w-4 h-4" /></span>
                            )}
                        </Button>
                    </motion.div>
                ) : (
                    // Suggestions phase
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white">CV Analyzed Successfully</h3>
                                    <p className="text-sm text-slate-500">Data extracted. Review AI suggestions below before continuing.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-3">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black text-slate-900 dark:text-white">AI Improvement Suggestions</h4>
                                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-semibold">
                                    {activeSuggestions.length} active
                                </span>
                            </div>
                            <AnimatePresence>
                                {suggestions
                                    .filter(s => activeSuggestions.includes(s.id))
                                    .map(s => (
                                        <SuggestionChip
                                            key={s.id}
                                            suggestion={s}
                                            onAccept={() => handleAccept(s.id)}
                                            onDismiss={() => handleDismiss(s.id)}
                                        />
                                    ))}
                            </AnimatePresence>
                            {activeSuggestions.length === 0 && (
                                <div className="text-center py-6 text-slate-400">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                                    <p className="font-semibold">All suggestions reviewed!</p>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleContinue}
                            className="w-full h-13 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl text-base shadow-lg py-3"
                        >
                            <span className="flex items-center gap-2">Continue to Editor <ArrowRight className="w-4 h-4" /></span>
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
