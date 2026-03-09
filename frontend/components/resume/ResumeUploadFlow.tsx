'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useResumeUploadFlow } from '@/hooks/useResumeUploadFlow';
import type {
    ExtractedResumeExperience,
    ExtractedResumeProject,
    ResumeExtractedData,
} from '@/types/resumeExtraction.types';

interface ResumeUploadFlowProps {
    onComplete: (data: ResumeExtractedData) => void;
    onCancel: () => void;
}

export function ResumeUploadFlow({ onComplete, onCancel }: ResumeUploadFlowProps) {
    const {
        step,
        file,
        progress,
        error,
        extractedData,
        handleFileChange,
        handleUpload,
        resetToUploadStep,
    } = useResumeUploadFlow();

    return (
        <div className="max-w-4xl mx-auto py-8">
            <AnimatePresence mode="wait">
                {step === 'upload' && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Your CV</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                We'll extract your data and help you apply it to a new template.
                            </p>
                        </div>

                        <Card className="border-dashed border-2 p-12 flex flex-col items-center justify-center space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {file ? file.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-slate-500">PDF or DOCX (max. 10MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                id="cv-upload"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                            />
                            <Button
                                variant="outline"
                                onClick={() => document.getElementById('cv-upload')?.click()}
                            >
                                Select File
                            </Button>

                            {error && (
                                <div className="flex items-center gap-2 text-rose-500 text-sm mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                        </Card>

                        <div className="flex justify-between items-center">
                            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                            <Button
                                disabled={!file}
                                onClick={handleUpload}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Extract Data <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'extracting' && (
                    <motion.div
                        key="extracting"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center space-y-8 py-12"
                    >
                        <div className="relative">
                            <LoadingSpinner size="xl" variant="primary" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>

                        <div className="text-center space-y-4 w-full max-w-md">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI is extracting your data...</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                This usually takes a few seconds. We're identifying your experience, skills, and education.
                            </p>
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-indigo-600 font-medium">{progress}% Complete</p>
                        </div>
                    </motion.div>
                )}

                {step === 'review' && (
                    <motion.div
                        key="review"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Extracted Data</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    We've successfully extracted your info. You can edit it now or in the full builder.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                Extraction Success
                            </div>
                        </div>

                        <Card className="p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-[500px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                {/* Personal Info */}
                                <section className="space-y-3">
                                    <h3 className="font-semibold text-indigo-600 text-sm uppercase tracking-wider">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500">Name</p>
                                            <p className="text-sm font-medium">{extractedData?.personalInfo?.name || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500">Email</p>
                                            <p className="text-sm font-medium">{extractedData?.personalInfo?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Summary */}
                                <section className="space-y-3">
                                    <h3 className="font-semibold text-indigo-600 text-sm uppercase tracking-wider">Professional Summary</h3>
                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                        {extractedData?.summary || 'No summary extracted.'}
                                    </p>
                                </section>

                                {/* Experience */}
                                <section className="space-y-4">
                                    <h3 className="font-semibold text-indigo-600 text-sm uppercase tracking-wider">Experience</h3>
                                    {extractedData?.experience?.map((exp: ExtractedResumeExperience) => {
                                        const experienceKey = [exp.title, exp.company, exp.startDate, exp.endDate]
                                            .filter(Boolean)
                                            .join('-');

                                        return (
                                            <div key={experienceKey} className="border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1">
                                                <p className="font-bold text-slate-900 dark:text-white">{exp.title}</p>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                                                {exp.achievements && exp.achievements.length > 0 && (
                                                    <ul className="mt-2 space-y-1">
                                                        {exp.achievements.slice(0, 2).map((achievement) => (
                                                            <li key={achievement} className="text-xs text-slate-600 dark:text-slate-400 list-disc ml-4">{achievement}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </section>

                                {/* Skills */}
                                <section className="space-y-3">
                                    <h3 className="font-semibold text-indigo-600 text-sm uppercase tracking-wider">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {extractedData?.skills?.technical?.map((skill) => (
                                            <span key={`technical-${skill}`} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs border border-indigo-100 dark:border-indigo-800">
                                                {skill}
                                            </span>
                                        ))}
                                        {extractedData?.skills?.soft?.map((skill) => (
                                            <span key={`soft-${skill}`} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs border border-purple-100 dark:border-purple-800">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                {/* Projects */}
                                {extractedData?.projects && extractedData.projects.length > 0 && (
                                    <section className="space-y-3">
                                        <h3 className="font-semibold text-indigo-600 text-sm uppercase tracking-wider">Projects</h3>
                                        {extractedData.projects.map((project: ExtractedResumeProject) => {
                                            const projectKey = [project.name, project.description].filter(Boolean).join('-');

                                            return (
                                                <div key={projectKey} className="border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1">
                                                    <p className="font-bold text-slate-900 dark:text-white">{project.name}</p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">{project.description}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {project.technologies?.map((technology) => (
                                                            <span key={`${projectKey}-${technology}`} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                                                {technology}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </section>
                                )}
                            </div>
                        </Card>

                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Next: Choose a template and start editing.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={resetToUploadStep}>Re-upload</Button>
                                <Button
                                    onClick={() => {
                                        if (extractedData) {
                                            onComplete(extractedData);
                                        }
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    Continue to Template <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
