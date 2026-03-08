'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { TemplateSelector } from '@/components/resume/template-selector';
import { TemplateRenderer } from '@/components/resume/template-renderer';
import { useDocumentStore } from '@/store/documentStore';
import { resumeTemplates } from '@/lib/resume-templates';
import { ResumeData, ResumeTemplate, CVMode } from '@/types';
import {
    Plus,
    Trash2,
    Zap,
    Download,
    Undo2,
    Redo2,
    ChevronDown,
    MoreVertical,
    FileText,
    X,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ResumeOptimizer } from '@/components/resume/ResumeOptimizer';
import { DesignPanels } from '@/components/resume/DesignPanels';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { message } from 'antd';
import { useUIStore } from '@/store/uiStore';
import { useSearchParams } from 'next/navigation';
import { useResumes, useResume, useCreateResume, useUpdateResume, useDeleteResume } from '@/hooks/use-resumes';
import { useDebounce } from '@/hooks/use-debounce';
import { CVModeSelector } from '@/components/resume/CVModeSelector';
import { ManualBuilderWizard, WizardData } from '@/components/resume/ManualBuilderWizard';
import { AIGenerateMode } from '@/components/resume/AIGenerateMode';
import { ImproveCVMode } from '@/components/resume/ImproveCVMode';
import { PromptToCVMode } from '@/components/resume/PromptToCVMode';
import { TemplateGallery } from '@/components/resume/TemplateGallery';
import { ATSScorePanel } from '@/components/resume/ATSScorePanel';
import { ContactSection } from '@/components/resume/ContactSection';
import { SummarySection } from '@/components/resume/SummarySection';
import { ExperienceSection } from '@/components/resume/ExperienceSection';
import { EducationSection } from '@/components/resume/EducationSection';

export type FlowState =
    | 'mode-selection'
    | 'manual-wizard'
    | 'ai-generate'
    | 'improve-cv'
    | 'prompt-to-cv'
    | 'template-gallery'
    | 'ats-score'
    | 'editor';

function mapWizardDataToResumeData(data: Partial<WizardData>, template: ResumeTemplate): Partial<ResumeData> {
    return {
        template: template.id,
        personalInfo: {
            fullName: data.contact?.fullName ?? '',
            email: data.contact?.email ?? '',
            phone: data.contact?.phone ?? '',
            location: data.contact?.location ?? '',
            linkedin: data.contact?.linkedin ?? '',
            portfolio: data.contact?.website ?? '',
        },
        summary: data.summary ?? '',
        experience: (data.experience ?? []).map(e => ({
            id: e.id,
            company: e.company,
            position: e.position,
            location: e.location,
            startDate: e.startDate,
            endDate: e.endDate,
            description: e.description,
            achievements: e.achievements,
        })),
        education: (data.education ?? []).map(e => ({
            id: e.id,
            school: e.school,
            degree: e.degree,
            field: e.field,
            startDate: e.startDate,
            endDate: e.endDate,
        })),
        skills: {
            technical: [...(data.skills?.technical ?? []), ...(data.skills?.tools ?? [])],
            soft: [...(data.skills?.soft ?? []), ...(data.skills?.languages ?? [])],
        },
        projects: (data.projects ?? []).map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            technologies: p.techStack,
            url: p.url,
        })),
        certifications: (data.certifications ?? []).map(c => ({
            id: c.id,
            name: c.name,
            issuer: c.issuer,
            date: c.date,
        })),
        languages: [],
        interests: [],
    };
}

const sections = ['Contact', 'Summary', 'Experience', 'Education', 'Certificates', 'Skills', 'Languages'];

export function ResumeBuilder({
    initialFlow = 'mode-selection',
    initialTab = 'editor'
}: {
    initialFlow?: FlowState | 'template-selection' | 'selection' | 'upload' | 'scratch';
    initialTab?: string;
}) {
    const search = useSearchParams();
    const resumeId = search.get('id');

    const [previewZoom, setPreviewZoom] = useState(100);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);

    // Normalise legacy initialFlow values
    const getInitialFlow = (): FlowState => {
        if (initialFlow === 'editor' || resumeId) return 'editor';
        return 'mode-selection';
    };

    const [flow, setFlow] = useState<FlowState>(getInitialFlow());
    const [selectedMode, setSelectedMode] = useState<CVMode | null>(null);
    const [pendingWizardData, setPendingWizardData] = useState<Partial<WizardData> | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(resumeTemplates[0]);
    const [isRenamingResume, setIsRenamingResume] = useState(false);
    const [newResumeName, setNewResumeName] = useState('');
    const [showATSScore, setShowATSScore] = useState(false);

    // Store
    const {
        currentResume,
        setResume,
        updateContact,
        updateSummary,
        updateStyling,
        updateExperience,
        updateEducation,
        updateTemplate,
        updateTitle,
        setFullResume,
        isDirty,
        markSaved,
    } = useDocumentStore();

    // Queries & Mutations
    const { data: resumesResponse } = useResumes();
    const resumes = resumesResponse?.data || [];
    const { data: resumeResponse, isLoading: isLoadingResume } = useResume(resumeId);
    const createMutation = useCreateResume();
    const updateMutation = useUpdateResume();
    const deleteMutation = useDeleteResume();

    // Sync server data to store
    useEffect(() => {
        if (resumeResponse?.data?.resume) {
            setResume(resumeResponse.data.resume);
            setFlow('editor');
        }
    }, [resumeResponse, setResume]);

    // Auto-save logic
    const debouncedResume = useDebounce(currentResume, 2000);

    useEffect(() => {
        if (isDirty && debouncedResume && resumeId) {
            updateMutation.mutate({ id: resumeId, data: debouncedResume }, {
                onSuccess: () => markSaved()
            });
        }
    }, [debouncedResume, isDirty, resumeId, updateMutation, markSaved]);

    const { sidebarOpen } = useUIStore();

    // ── Flow handlers ──────────────────────────────────────────────────────────

    const handleModeSelect = (mode: CVMode) => {
        setSelectedMode(mode);
        if (mode === 'manual') setFlow('manual-wizard');
        else if (mode === 'ai-generate') setFlow('ai-generate');
        else if (mode === 'improve-cv') setFlow('improve-cv');
        else if (mode === 'prompt-to-cv') setFlow('prompt-to-cv');
    };

    const handleWizardComplete = (data: Partial<WizardData>) => {
        setPendingWizardData(data);
        setFlow('template-gallery');
    };

    const handleTemplateChosen = (template: ResumeTemplate) => {
        if (!pendingWizardData) {
            if (currentResume) {
                updateTemplate(template.id);
            }
            setShowTemplateSelector(false);
            return;
        }

        const resumeData = mapWizardDataToResumeData(pendingWizardData, template);
        const title = pendingWizardData?.contact?.fullName
            ? `${pendingWizardData.contact.fullName}'s CV`
            : 'My New CV';

        createMutation.mutate({ ...resumeData, title }, {
            onSuccess: (response) => {
                setResume(response.data.resume);
                setFlow('editor');
                message.success('Your CV is ready to edit!');
            }
        });
        setPendingWizardData(null);
    };

    const handleChangeTemplate = (template: ResumeTemplate) => {
        if (currentResume) updateTemplate(template.id);
        setShowTemplateSelector(false);
    };

    const handleImproveComplete = (data: Partial<WizardData>, suggestions: any[]) => {
        setPendingWizardData(data);
        setFlow('template-gallery');
    };

    const handleRenameResume = () => {
        if (currentResume && newResumeName.trim()) {
            updateTitle(newResumeName.trim());
        }
        setIsRenamingResume(false);
        setNewResumeName('');
    };

    const handleDeleteResume = () => {
        if (!currentResume) return;
        deleteMutation.mutate(currentResume.id, {
            onSuccess: () => {
                setResume(null);
                setFlow('mode-selection');
                message.success('Resume deleted.');
            }
        });
    };

    const handleDownload = () => {
        setShowATSScore(!showATSScore);
    };

    useEffect(() => {
        if (initialFlow === 'editor' && resumes.length > 0 && !currentResume && !resumeId) {
            setResume(resumes[resumes.length - 1]);
        }
    }, [initialFlow, resumes, currentResume, resumeId, setResume]);

    if (flow === 'mode-selection') {
        return (
            <div className="min-h-screen">
                {resumes.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500">
                            You have <strong>{resumes.length}</strong> existing {resumes.length === 1 ? 'resume' : 'resumes'}.
                        </p>
                        <div className="flex gap-2">
                            {resumes.slice(0, 3).map((r: ResumeData) => (
                                <Button
                                    key={r.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setResume(r); setFlow('editor'); }}
                                    className="rounded-xl text-xs h-8"
                                >
                                    {r.title}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
                <CVModeSelector onSelect={handleModeSelect} />
            </div>
        );
    }

    if (flow === 'manual-wizard') {
        return (
            <ManualBuilderWizard
                selectedTemplate={selectedTemplate}
                onComplete={handleWizardComplete}
                onCancel={() => setFlow('mode-selection')}
            />
        );
    }

    if (flow === 'ai-generate') {
        return (
            <AIGenerateMode
                onComplete={handleWizardComplete}
                onCancel={() => setFlow('mode-selection')}
            />
        );
    }

    if (flow === 'improve-cv') {
        return (
            <ImproveCVMode
                onComplete={handleImproveComplete}
                onCancel={() => setFlow('mode-selection')}
            />
        );
    }

    if (flow === 'prompt-to-cv') {
        return (
            <PromptToCVMode
                onComplete={handleWizardComplete}
                onCancel={() => setFlow('mode-selection')}
            />
        );
    }

    if (flow === 'template-gallery') {
        return (
            <TemplateGallery
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
                onContinue={() => handleTemplateChosen(selectedTemplate!)}
                previewData={currentResume ?? undefined}
            />
        );
    }

    if (isLoadingResume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!currentResume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-slate-200 mx-auto" />
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">No CV selected</h2>
                    <p className="text-slate-500 text-sm">Go back to create or select a CV.</p>
                    <Button onClick={() => setFlow('mode-selection')} className="rounded-xl bg-indigo-600 text-white">
                        Create a CV
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f8f7f4] dark:bg-slate-950">
            <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 flex items-center h-[61px] px-6 gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFlow('mode-selection')}
                    className="rounded-xl text-slate-600 dark:text-slate-400 h-9 w-9"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                {isRenamingResume ? (
                    <div className="flex items-center gap-2">
                        <Input
                            autoFocus
                            value={newResumeName}
                            onChange={e => setNewResumeName(e.target.value)}
                            onBlur={handleRenameResume}
                            onKeyDown={e => { if (e.key === 'Enter') handleRenameResume(); if (e.key === 'Escape') setIsRenamingResume(false); }}
                            className="h-8 rounded-xl text-sm font-bold w-48"
                            placeholder={currentResume.title}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => { setIsRenamingResume(true); setNewResumeName(currentResume.title); }}
                        className="font-black text-slate-900 dark:text-white hover:text-indigo-600 transition-colors text-sm"
                    >
                        {currentResume.title}
                    </button>
                )}

                <div className="flex-1" />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplateSelector(true)}
                    className="rounded-xl text-xs h-9 gap-1.5 hidden sm:flex"
                >
                    Change Template
                </Button>

                <Button
                    size="sm"
                    onClick={() => setShowATSScore(!showATSScore)}
                    className="rounded-xl text-xs h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    <Zap className="w-3.5 h-3.5" /> ATS Score
                </Button>

                <Button
                    size="sm"
                    className="rounded-xl text-xs h-9 gap-1.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white"
                    onClick={handleDownload}
                >
                    <Download className="w-3.5 h-3.5" /> Download
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl">
                        <DropdownMenuItem onClick={() => { setIsRenamingResume(true); setNewResumeName(currentResume.title); }}>
                            Rename Resume
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowTemplateSelector(true)}>
                            Change Template
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleDeleteResume}>
                            Delete Resume
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AnimatePresence>
                {showATSScore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                        onClick={e => { if (e.target === e.currentTarget) setShowATSScore(false); }}
                    >
                        <ATSScorePanel
                            score={currentResume.atsScore ?? 62}
                            missingKeywords={['leadership', 'agile', 'stakeholder management', 'cross-functional']}
                            weakSections={['Summary — too generic', 'Experience — missing quantifiable results']}
                            onDownload={() => { setShowATSScore(false); window.print(); }}
                            onFixWithAI={() => setShowATSScore(false)}
                            onClose={() => setShowATSScore(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">
                <Tabs defaultValue={initialTab} className="space-y-6">
                    <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-1 gap-1 h-auto">
                        {['overview', 'editor', 'customize', 'optimizer'].map(tab => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-xl capitalize py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-sm font-semibold transition-all"
                            >
                                {tab === 'optimizer' ? 'AI Tools' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="editor" className="mt-0">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            <div className="xl:col-span-5 space-y-4 xl:h-[calc(100vh-200px)] xl:overflow-y-auto xl:pr-2">
                                {sections.map(section => (
                                    <Accordion key={section} type="single" collapsible>
                                        <AccordionItem value={section} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                                            <AccordionTrigger className="px-5 py-4 hover:no-underline font-bold text-sm">
                                                {section}
                                            </AccordionTrigger>
                                            <AccordionContent className="px-5 pb-5">
                                                {section === 'Contact' && (
                                                    <ContactSection
                                                        data={currentResume.personalInfo}
                                                        onChange={updateContact}
                                                    />
                                                )}

                                                {section === 'Summary' && (
                                                    <SummarySection
                                                        data={currentResume.summary}
                                                        onChange={updateSummary}
                                                    />
                                                )}

                                                {section === 'Experience' && (
                                                    <ExperienceSection
                                                        data={(currentResume.experience || []).map(e => ({
                                                            ...e,
                                                            endDate: e.endDate || '',
                                                            description: e.description || '',
                                                            achievements: e.achievements || [],
                                                        }))}
                                                        onChange={updateExperience}
                                                    />
                                                )}

                                                {section === 'Education' && (
                                                    <EducationSection
                                                        data={(currentResume.education || []).map(e => ({
                                                            ...e,
                                                            field: e.field || '',
                                                            location: e.location || '',
                                                            startDate: e.startDate || '',
                                                            endDate: e.endDate || '',
                                                            gpa: e.gpa || '',
                                                            description: e.description || '',
                                                        }))}
                                                        onChange={updateEducation}
                                                    />
                                                )}

                                                {section === 'Certificates' && (
                                                    <div className="space-y-4">
                                                        {currentResume.certifications?.map((cert, i) => (
                                                            <div key={cert.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold uppercase text-slate-400">Cert #{i + 1}</span>
                                                                    <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 h-7 w-7 rounded-full"
                                                                        onClick={() => {
                                                                            const newCerts = currentResume.certifications?.filter(c => c.id !== cert.id);
                                                                            setFullResume({ certifications: newCerts });
                                                                        }}>
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </div>
                                                                {[
                                                                    { key: 'name', label: 'Certificate Name', placeholder: 'AWS Solutions Architect' },
                                                                    { key: 'issuer', label: 'Issuer', placeholder: 'Amazon Web Services' },
                                                                    { key: 'date', label: 'Date', placeholder: 'Mar 2023' },
                                                                ].map(({ key, label, placeholder }) => (
                                                                    <div key={key} className="space-y-1">
                                                                        <Label className="text-xs font-semibold text-slate-400">{label}</Label>
                                                                        <Input value={(cert as any)[key] ?? ''} placeholder={placeholder} className="h-9 rounded-xl text-sm"
                                                                            onChange={e => {
                                                                                const newCerts = currentResume.certifications?.map(c => c.id === cert.id ? { ...c, [key]: e.target.value } : c);
                                                                                setFullResume({ certifications: newCerts });
                                                                            }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" className="w-full h-10 rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 text-sm"
                                                            onClick={() => {
                                                                const newCerts = [...(currentResume.certifications ?? []), { id: Math.random().toString(36).substr(2, 9), name: '', issuer: '', date: '' }];
                                                                setFullResume({ certifications: newCerts });
                                                                message.info('Added a new certificate slot');
                                                            }}>
                                                            <Plus className="w-3.5 h-3.5 mr-2" /> Add Certificate
                                                        </Button>
                                                    </div>
                                                )}

                                                {section === 'Skills' && (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical Skills</Label>
                                                            <Textarea
                                                                value={currentResume.skills?.technical?.join(', ') ?? ''}
                                                                placeholder="React, TypeScript, Python... (comma-separated)"
                                                                className="rounded-xl resize-none min-h-[80px] text-sm"
                                                                onChange={e => setFullResume({ skills: { ...currentResume.skills, technical: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Soft Skills</Label>
                                                            <Textarea
                                                                value={currentResume.skills?.soft?.join(', ') ?? ''}
                                                                placeholder="Leadership, Communication... (comma-separated)"
                                                                className="rounded-xl resize-none min-h-[80px] text-sm"
                                                                onChange={e => setFullResume({ skills: { ...currentResume.skills, soft: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {section === 'Languages' && (
                                                    <div className="space-y-4">
                                                        {currentResume.languages?.map((lang, i) => (
                                                            <div key={lang.id} className="flex items-end gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50">
                                                                <div className="flex-1 space-y-1.5">
                                                                    <Label className="text-xs font-semibold text-slate-500">Language</Label>
                                                                    <Input value={lang.name} placeholder="English" className="rounded-xl h-10 text-sm" onChange={e => {
                                                                        const newLangs = [...(currentResume.languages ?? [])];
                                                                        newLangs[i] = { ...newLangs[i], name: e.target.value };
                                                                        setFullResume({ languages: newLangs });
                                                                    }} />
                                                                </div>
                                                                <div className="flex-1 space-y-1.5">
                                                                    <Label className="text-xs font-semibold text-slate-500">Proficiency</Label>
                                                                    <Input value={lang.level} placeholder="Native" className="rounded-xl h-10 text-sm" onChange={e => {
                                                                        const newLangs = [...(currentResume.languages ?? [])];
                                                                        newLangs[i] = { ...newLangs[i], level: e.target.value };
                                                                        setFullResume({ languages: newLangs });
                                                                    }} />
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-50 h-9 w-9 rounded-full mb-0.5"
                                                                    onClick={() => setFullResume({ languages: currentResume.languages?.filter(l => l.id !== lang.id) })}>
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" className="w-full h-10 rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 text-sm"
                                                            onClick={() => {
                                                                const newLangs = [...(currentResume.languages ?? []), { id: Math.random().toString(36).substr(2, 9), name: '', level: '' }];
                                                                setFullResume({ languages: newLangs });
                                                            }}>
                                                            <Plus className="w-3.5 h-3.5 mr-2" /> Add Language
                                                        </Button>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                            </div>

                            <div className="xl:col-span-7 sticky top-[80px] h-[calc(100vh-130px)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                                <div className="flex-1 overflow-auto p-8 bg-slate-50/50 dark:bg-slate-900/50 flex justify-center items-start">
                                    <div className="shadow-2xl bg-white origin-top" style={{ transform: `scale(${previewZoom / 100})` }}>
                                        <TemplateRenderer resume={currentResume} zoom={1} />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-4 border border-slate-200 dark:border-slate-700">
                                    <button onClick={() => setPreviewZoom(Math.max(40, previewZoom - 10))} className="hover:text-indigo-600 transition-colors font-black text-xl">−</button>
                                    <span className="text-sm font-bold w-12 text-center">{previewZoom}%</span>
                                    <button onClick={() => setPreviewZoom(Math.min(100, previewZoom + 10))} className="hover:text-indigo-600 transition-colors font-black text-xl">+</button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="customize" className="mt-0">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            <div className="xl:col-span-4 h-[calc(100vh-160px)] overflow-y-auto pr-2">
                                <DesignPanels
                                    styling={currentResume.styling}
                                    onUpdate={styling => updateStyling(styling)}
                                />
                            </div>
                            <div className="xl:col-span-8">
                                <div className="sticky top-24 h-[calc(100vh-160px)] rounded-3xl bg-white dark:bg-slate-900 border-8 border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
                                    <div className="h-full overflow-y-auto p-12 bg-slate-100/50 dark:bg-slate-900/50">
                                        <TemplateRenderer resume={currentResume} zoom={previewZoom / 100} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="optimizer" className="mt-0">
                        <ResumeOptimizer
                            resumeId={currentResume.id}
                            originalData={currentResume}
                            onOptimize={data => setFullResume(data)}
                        />
                    </TabsContent>

                    <TabsContent value="overview" className="mt-0">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            <div className="xl:col-span-4">
                                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-5 shadow-sm">
                                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto">
                                        <FileText className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentResume.title}</h3>
                                    <p className="text-sm text-slate-500">Last edited {new Date(currentResume.updatedAt).toLocaleString()}</p>
                                    <div className="flex gap-3 justify-center pt-2">
                                        <Button variant="outline" className="rounded-xl" onClick={() => setShowATSScore(true)}>ATS Score</Button>
                                        <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white" onClick={handleDownload}>Download</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="xl:col-span-8">
                                <Card className="p-8 rounded-3xl border-0 shadow-sm">
                                    <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">Resume Stats</h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'ATS Score', value: `${currentResume.atsScore ?? 62}%`, sub: 'Moderate', color: 'text-amber-600' },
                                            { label: 'Word Count', value: '~320', sub: 'Good range', color: 'text-emerald-600' },
                                            { label: 'Completeness', value: '75%', sub: 'Almost there', color: 'text-indigo-600' },
                                        ].map(({ label, value, sub, color }) => (
                                            <div key={label} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                                                <div className={`text-4xl font-black mt-2 ${color}`}>{value}</div>
                                                <p className="text-xs text-slate-400 mt-1">{sub}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
                                        <h3 className="text-xl font-bold">Ready to apply?</h3>
                                        <p className="text-indigo-100 mt-1 text-sm">Export your resume and start sending applications.</p>
                                        <Button onClick={() => setShowATSScore(true)} className="bg-white text-indigo-600 hover:bg-indigo-50 mt-4 font-bold rounded-xl px-6 h-10 text-sm">
                                            Download PDF
                                        </Button>
                                        <FileText className="absolute top-1/2 -right-8 w-48 h-48 -translate-y-1/2 text-indigo-500/30 -rotate-12" />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            <TemplateSelector
                isOpen={showTemplateSelector}
                onClose={() => setShowTemplateSelector(false)}
                onSelect={handleChangeTemplate}
                selectedTemplateId={currentResume?.template}
            />

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl px-6 py-3 rounded-2xl flex items-center gap-6 z-50">
                <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-6">
                    <Button variant="ghost" size="icon" className="h-9 w-9"><Undo2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9"><Redo2 className="w-4 h-4" /></Button>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {updateMutation.isPending ? 'Saving…' : 'All changes saved'}
                </p>
            </div>
        </div>
    );
}
