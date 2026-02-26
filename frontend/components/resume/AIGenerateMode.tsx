'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, ArrowLeft, ArrowRight, Loader2, FileText, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { WizardData } from './ManualBuilderWizard';

interface AIGenerateModeProps {
    onComplete: (data: Partial<WizardData>) => void;
    onCancel: () => void;
}

type PathType = null | 'has-cv' | 'no-cv';

const REQUIRED_FIELDS = [
    { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Smith', required: true },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com', required: true },
    { key: 'phone', label: 'Phone', type: 'text', placeholder: '+1 555 000 0000', required: true },
    { key: 'currentTitle', label: 'Current / Last Job Title', type: 'text', placeholder: 'Senior Software Engineer', required: true },
    { key: 'keySkills', label: 'Key Skills (comma-separated)', type: 'text', placeholder: 'React, Python, AWS...', required: true },
    { key: 'yearsExperience', label: 'Years of Experience', type: 'number', placeholder: '5', required: true },
    { key: 'highestEducation', label: 'Highest Education', type: 'text', placeholder: 'B.Sc. Computer Science, MIT', required: true },
    { key: 'achievements', label: 'Notable Achievements (optional)', type: 'textarea', placeholder: 'Led a team that shipped X, Increased revenue by Y...', required: false },
];

export function AIGenerateMode({ onComplete, onCancel }: AIGenerateModeProps) {
    const [path, setPath] = useState<PathType>(null);
    const [file, setFile] = useState<File | null>(null);
    const [jd, setJd] = useState('');
    const [minimalFields, setMinimalFields] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB'); return; }
        setFile(f);
        setError('');
    };

    const updateField = (key: string, value: string) =>
        setMinimalFields(prev => ({ ...prev, [key]: value }));

    const handleGenerate = async () => {
        if (!jd.trim()) { setError('Please paste a job description.'); return; }
        if (path === 'has-cv' && !file) { setError('Please upload your existing CV.'); return; }
        if (path === 'no-cv') {
            const missing = REQUIRED_FIELDS.filter(f => f.required && !minimalFields[f.key]);
            if (missing.length > 0) { setError(`Please fill: ${missing.map(f => f.label).join(', ')}`); return; }
        }
        setError('');
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 3000)); // Simulate AI
            const mockData: Partial<WizardData> = {
                contact: {
                    fullName: minimalFields.fullName || '',
                    email: minimalFields.email || '',
                    phone: minimalFields.phone || '',
                    location: '',
                    linkedin: '',
                    github: '',
                    website: '',
                },
                summary: `Experienced ${minimalFields.currentTitle || 'professional'} with ${minimalFields.yearsExperience || ''} years of expertise in ${minimalFields.keySkills || ''}. Tailored for this specific role based on the provided job description.`,
                experience: [{
                    id: Math.random().toString(36).substr(2, 9),
                    company: 'Most Recent Employer',
                    position: minimalFields.currentTitle || 'Professional',
                    location: '',
                    startDate: '',
                    endDate: 'Present',
                    description: 'Generated from your profile — please edit to add specific details.',
                    achievements: minimalFields.achievements ? [minimalFields.achievements] : [],
                }],
                education: [{
                    id: Math.random().toString(36).substr(2, 9),
                    school: '',
                    degree: minimalFields.highestEducation || '',
                    field: '',
                    gpa: '',
                    startDate: '',
                    endDate: '',
                }],
                skills: {
                    technical: (minimalFields.keySkills || '').split(',').map(s => s.trim()).filter(Boolean),
                    soft: [],
                    tools: [],
                    languages: [],
                },
                projects: [],
                certifications: [],
            };
            onComplete(mockData);
        } catch {
            setError('AI generation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Choose path
    if (!path) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-start justify-center pt-12 px-4 pb-12">
                <div className="w-full max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-5">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">AI Generate from JD</h1>
                        <p className="text-slate-500 dark:text-slate-400">Do you have an existing CV we can use as a starting point?</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            onClick={() => setPath('has-cv')}
                            className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 hover:border-purple-400 hover:shadow-xl transition-all text-left"
                        >
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950/50 rounded-2xl flex items-center justify-center text-purple-600 mb-5 group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Yes, I have a CV</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Upload your PDF or Word file. AI extracts your info and tailors it to the job description.</p>
                            <div className="mt-5 flex items-center gap-2 text-purple-600 font-bold text-sm">
                                Upload & Tailor <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            onClick={() => setPath('no-cv')}
                            className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-xl transition-all text-left"
                        >
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
                                <User className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No, start fresh with AI</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Fill a short form with the essentials. AI generates a complete tailored CV from minimal input.</p>
                            <div className="mt-5 flex items-center gap-2 text-indigo-600 font-bold text-sm">
                                Quick Form <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.button>
                    </div>

                    <div className="text-center mt-6">
                        <Button variant="ghost" onClick={onCancel} className="text-slate-500">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Choose a different mode
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: The form
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-start justify-center pt-10 px-4 pb-12">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <Button variant="ghost" onClick={() => setPath(null)} className="text-slate-600">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {path === 'has-cv' ? 'Upload CV + Job Description' : 'Quick Info + Job Description'}
                    </h2>
                </div>

                <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
                    <div className="p-8 space-y-6">
                        {/* Upload or form */}
                        {path === 'has-cv' ? (
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Upload your CV *
                                </Label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${file ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-700 hover:border-purple-400'}`}
                                >
                                    {file ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                            <p className="font-semibold text-emerald-700 dark:text-emerald-400">{file.name}</p>
                                            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB — click to change</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-slate-300" />
                                            <p className="font-semibold text-slate-500">Click to upload PDF or DOCX</p>
                                            <p className="text-xs text-slate-400">Maximum 5MB</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} className="hidden" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                    Fill the essentials below. AI will generate a full CV — you'll be able to edit everything afterwards.
                                </p>
                                {REQUIRED_FIELDS.map(field => (
                                    <div key={field.key} className="space-y-1.5">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            {field.label} {field.required ? '*' : ''}
                                        </Label>
                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                value={minimalFields[field.key] || ''}
                                                onChange={e => updateField(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="rounded-xl resize-none min-h-[80px]"
                                            />
                                        ) : (
                                            <Input
                                                type={field.type}
                                                value={minimalFields[field.key] || ''}
                                                onChange={e => updateField(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="h-10 rounded-xl"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Job Description */}
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-500" />
                                Paste the Job Description *
                            </Label>
                            <Textarea
                                value={jd}
                                onChange={e => { setJd(e.target.value); if (error) setError(''); }}
                                placeholder="Paste the full job description here. AI will tailor your CV to match the requirements and keywords..."
                                className="min-h-[140px] rounded-2xl resize-none text-sm"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2">⚠ {error}</p>
                        )}

                        <Button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full h-13 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-base shadow-lg py-3"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> AI is generating your tailored CV…</span>
                            ) : (
                                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Generate Tailored CV <ArrowRight className="w-4 h-4" /></span>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
