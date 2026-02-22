'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2, Loader2, ArrowRight, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/api-client';
import { message } from 'antd';

interface ResumeOptimizerProps {
    resumeId: string;
    originalData: any;
    onOptimize: (optimizedData: any) => void;
}

export function ResumeOptimizer({ resumeId, originalData, onOptimize }: ResumeOptimizerProps) {
    const [jd, setJd] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizedData, setOptimizedData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleOptimize = async () => {
        if (!jd.trim()) {
            message.error('Please paste a job description');
            return;
        }

        setIsOptimizing(true);
        try {
            const response = await api.post(`/resumes/${resumeId}/optimize`, { jobDescription: jd });
            setOptimizedData(response.data.optimizedData);
            message.success('Resume optimized successfully!');
        } catch (error) {
            console.error('Optimization failed:', error);
            message.error('Failed to optimize resume. Please try again.');
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleApply = () => {
        if (optimizedData) {
            onOptimize(optimizedData);
            message.success('Optimized changes applied to your resume!');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4">
            {!optimizedData ? (
                <Card className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Optimize for Job Description</h3>
                            <p className="text-muted-foreground">Paste the JD below and our AI will tailor your resume to match the requirements.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Textarea
                            placeholder="Paste the job description here..."
                            className="min-h-[300px] text-lg p-4 bg-slate-50/50"
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                        />
                        <Button
                            className="w-full h-14 text-lg font-bold"
                            onClick={handleOptimize}
                            disabled={isOptimizing || !jd.trim()}
                        >
                            {isOptimizing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Analyzing JD & Tailoring Resume...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Optimize My Resume
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-green-50 p-6 rounded-2xl border border-green-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-500 text-white">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-green-900">Optimization Complete</h3>
                                <p className="text-green-700">We've updated your summary and experience to better align with the role.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setOptimizedData(null)}>
                                Start Over
                            </Button>
                            <Button onClick={handleApply} className="bg-green-600 hover:bg-green-700">
                                Apply All Changes
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 space-y-4 bg-slate-50/50 border-slate-200 opacity-70">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Original Summary
                                </h4>
                            </div>
                            <p className="text-muted-foreground italic text-sm line-clamp-6">{originalData.summary}</p>
                        </Card>

                        <Card className="p-6 space-y-4 border-primary/20 bg-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2">
                                <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">AI ENHANCED</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-primary flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Optimized Summary
                                </h4>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(optimizedData.summary)}>
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                            <p className="text-slate-900 text-sm leading-relaxed">{optimizedData.summary}</p>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg">Key Improvements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {optimizedData.improvements?.map((imp: string, i: number) => (
                                <div key={i} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm text-slate-700">{imp}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
