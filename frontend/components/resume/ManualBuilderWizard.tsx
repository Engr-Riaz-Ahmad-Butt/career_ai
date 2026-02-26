'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, Code, FolderOpen,
    ArrowRight, ArrowLeft, Plus, Trash2, Sparkles, Save, CheckCircle2, Github, Globe, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    ClassicProfessionalPreview,
    ModernTechPreview,
    MinimalistCleanPreview,
    CreativeDesignerPreview,
    ExecutiveElegantPreview,
    StartupVibrantPreview,
    AcademicStructuredPreview,
    GradientModernPreview,
} from '@/components/resume/template-preview';
import { resumeTemplates, ResumeTemplate } from '@/lib/resume-templates';

const PREVIEW_MAP: Record<string, React.ComponentType<any>> = {
    'classic-professional': ClassicProfessionalPreview,
    'modern-tech': ModernTechPreview,
    'minimalist-clean': MinimalistCleanPreview,
    'creative-designer': CreativeDesignerPreview,
    'executive-elegant': ExecutiveElegantPreview,
    'startup-vibrant': StartupVibrantPreview,
    'academic-structured': AcademicStructuredPreview,
    'gradient-modern': GradientModernPreview,
};

const STEPS = [
    { id: 'personal', title: 'Personal Info', icon: User, desc: 'Your contact details and links' },
    { id: 'experience', title: 'Work Experience', icon: Briefcase, desc: 'Where you have worked' },
    { id: 'education', title: 'Education', icon: GraduationCap, desc: 'Your academic background' },
    { id: 'skills', title: 'Skills', icon: Code, desc: 'Technical and soft skills' },
    { id: 'projects', title: 'Projects & Certs', icon: FolderOpen, desc: 'Projects and certifications' },
];

export interface WizardData {
    contact: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        github: string;
        website: string;
    };
    summary: string;
    experience: Array<{
        id: string;
        company: string;
        position: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string;
        achievements: string[];
    }>;
    education: Array<{
        id: string;
        school: string;
        degree: string;
        field: string;
        gpa: string;
        startDate: string;
        endDate: string;
    }>;
    skills: {
        technical: string[];
        soft: string[];
        tools: string[];
        languages: string[];
    };
    projects: Array<{
        id: string;
        name: string;
        description: string;
        techStack: string[];
        url: string;
    }>;
    certifications: Array<{
        id: string;
        name: string;
        issuer: string;
        date: string;
    }>;
}

const INITIAL_DATA: WizardData = {
    contact: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: { technical: [], soft: [], tools: [], languages: [] },
    projects: [],
    certifications: [],
};

interface ManualBuilderWizardProps {
    initialData?: Partial<WizardData>;
    selectedTemplate?: ResumeTemplate | null;
    onComplete: (data: WizardData) => void;
    onCancel: () => void;
}

function uid() { return Math.random().toString(36).substr(2, 9); }

function mapToPreviewData(data: WizardData, template: ResumeTemplate) {
    return {
        id: 'preview',
        name: 'Preview',
        template,
        contact: {
            fullName: data.contact.fullName,
            email: data.contact.email,
            phone: data.contact.phone,
            location: data.contact.location,
            linkedin: data.contact.linkedin,
            portfolio: data.contact.website,
        },
        summary: data.summary,
        experience: data.experience.map(e => ({
            id: e.id,
            company: e.company,
            position: e.position,
            location: e.location,
            startDate: e.startDate,
            endDate: e.endDate,
            description: e.description,
            achievements: e.achievements,
        })),
        education: data.education.map(e => ({
            id: e.id,
            school: e.school,
            degree: e.degree,
            field: e.field,
            startDate: e.startDate,
            endDate: e.endDate,
        })),
        skills: {
            technical: [...data.skills.technical, ...data.skills.tools],
            soft: [...data.skills.soft, ...data.skills.languages],
        },
        projects: data.projects.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            technologies: p.techStack,
            url: p.url,
        })),
        certifications: data.certifications.map(c => ({ id: c.id, name: c.name, issuer: c.issuer, date: c.date })),
        languages: [],
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        styling: {
            spacing: { fontSize: 10, lineHeight: 1.2, sideMargin: 15, topBottomMargin: 15, entrySpacing: 5 },
            colors: { primary: '#000000', accent: '#4f46e5', applyToName: true, applyToTitle: true, applyToIcons: true, applyToBubbles: true },
            typography: { fontFamily: 'Inter', category: 'Sans' as const },
            headingStyle: { style: 'line-under', capitalization: 'uppercase' as const, size: 'L' as const, icons: 'filled' as const },
            personalDetails: { align: 'left' as const, arrangement: 'horizontal' as const, iconStyle: 'classic' },
            entryLayout: { style: 'default' },
        },
    };
}

export function ManualBuilderWizard({ initialData, selectedTemplate, onComplete, onCancel }: ManualBuilderWizardProps) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<WizardData>({ ...INITIAL_DATA, ...initialData });
    const [saving, setSaving] = useState(false);
    const [enhancing, setEnhancing] = useState(false);
    const saveTimerRef = useRef<NodeJS.Timeout>();
    const previewTemplate = selectedTemplate || resumeTemplates[0];
    const PreviewComp = PREVIEW_MAP[previewTemplate.id] || ClassicProfessionalPreview;
    const previewData = mapToPreviewData(data, previewTemplate);

    // Auto-save every 30s
    useEffect(() => {
        saveTimerRef.current = setInterval(() => {
            setSaving(true);
            setTimeout(() => setSaving(false), 1200);
        }, 30000);
        return () => clearInterval(saveTimerRef.current);
    }, []);

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
        else onComplete(data);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
        else onCancel();
    };

    const updateContact = (field: string, value: string) =>
        setData(d => ({ ...d, contact: { ...d.contact, [field]: value } }));

    const updateSkills = (field: keyof WizardData['skills'], value: string) => {
        const arr = value.split(',').map(s => s.trim()).filter(Boolean);
        setData(d => ({ ...d, skills: { ...d.skills, [field]: arr } }));
    };

    const addExp = () => setData(d => ({
        ...d, experience: [...d.experience, { id: uid(), company: '', position: '', location: '', startDate: '', endDate: '', description: '', achievements: [] }]
    }));
    const removeExp = (id: string) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
    const updateExp = (id: string, field: string, value: any) => setData(d => ({
        ...d, experience: d.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));

    const addEdu = () => setData(d => ({
        ...d, education: [...d.education, { id: uid(), school: '', degree: '', field: '', gpa: '', startDate: '', endDate: '' }]
    }));
    const removeEdu = (id: string) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
    const updateEdu = (id: string, field: string, value: string) => setData(d => ({
        ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));

    const addProject = () => setData(d => ({
        ...d, projects: [...d.projects, { id: uid(), name: '', description: '', techStack: [], url: '' }]
    }));
    const removeProject = (id: string) => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
    const updateProject = (id: string, field: string, value: any) => setData(d => ({
        ...d, projects: d.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));

    const addCert = () => setData(d => ({
        ...d, certifications: [...d.certifications, { id: uid(), name: '', issuer: '', date: '' }]
    }));
    const removeCert = (id: string) => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== id) }));
    const updateCert = (id: string, field: string, value: string) => setData(d => ({
        ...d, certifications: d.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));

    const handleEnhanceSection = async () => {
        setEnhancing(true);
        await new Promise(r => setTimeout(r, 2000)); // Simulated AI call
        setEnhancing(false);
    };

    const renderStep = () => {
        const stepId = STEPS[step].id;
        switch (stepId) {
            case 'personal':
                return (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name *</Label>
                            <Input value={data.contact.fullName} onChange={e => updateContact('fullName', e.target.value)} placeholder="e.g. Jane Smith" className="h-11 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email *</Label>
                                <Input type="email" value={data.contact.email} onChange={e => updateContact('email', e.target.value)} placeholder="jane@example.com" className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone *</Label>
                                <Input value={data.contact.phone} onChange={e => updateContact('phone', e.target.value)} placeholder="+1 555 000 0000" className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</Label>
                            <Input value={data.contact.location} onChange={e => updateContact('location', e.target.value)} placeholder="City, Country" className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Linkedin className="w-3 h-3" /> LinkedIn URL</Label>
                            <Input value={data.contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} placeholder="https://linkedin.com/in/janesmith" className="h-11 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</Label>
                                <Input value={data.contact.github} onChange={e => updateContact('github', e.target.value)} placeholder="github.com/janesmith" className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Globe className="w-3 h-3" /> Website</Label>
                                <Input value={data.contact.website} onChange={e => updateContact('website', e.target.value)} placeholder="https://janesmith.dev" className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Professional Summary</Label>
                            <Textarea
                                value={data.summary}
                                onChange={e => setData(d => ({ ...d, summary: e.target.value }))}
                                placeholder="Brief professional summary — 2 to 4 sentences. AI can write this for you."
                                className="min-h-[100px] rounded-xl resize-none"
                            />
                        </div>
                    </div>
                );
            case 'experience':
                return (
                    <div className="space-y-5">
                        {data.experience.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">No work experience added yet.</p>
                            </div>
                        )}
                        {data.experience.map((exp, i) => (
                            <Card key={exp.id} className="p-5 space-y-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 relative">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience #{i + 1}</span>
                                    <Button variant="ghost" size="icon" onClick={() => removeExp(exp.id)} className="text-red-500 hover:bg-red-50 h-7 w-7 rounded-full">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Job Title *</Label>
                                        <Input value={exp.position} onChange={e => updateExp(exp.id, 'position', e.target.value)} placeholder="Senior Engineer" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Company *</Label>
                                        <Input value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} placeholder="Google" className="h-10 rounded-xl" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Location</Label>
                                        <Input value={exp.location} onChange={e => updateExp(exp.id, 'location', e.target.value)} placeholder="New York, NY" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Start Date</Label>
                                        <Input value={exp.startDate} onChange={e => updateExp(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">End Date</Label>
                                        <Input value={exp.endDate} onChange={e => updateExp(exp.id, 'endDate', e.target.value)} placeholder="Present" className="h-10 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-500">Description</Label>
                                    <Textarea value={exp.description} onChange={e => updateExp(exp.id, 'description', e.target.value)} placeholder="Describe your role and responsibilities..." className="min-h-[80px] rounded-xl resize-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-500">Key Achievements (one per line)</Label>
                                    <Textarea
                                        value={exp.achievements.join('\n')}
                                        onChange={e => updateExp(exp.id, 'achievements', e.target.value.split('\n').filter(Boolean))}
                                        placeholder="Increased revenue by 30%&#10;Managed a team of 8 engineers"
                                        className="min-h-[80px] rounded-xl resize-none"
                                    />
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" onClick={addExp} className="w-full h-11 border-dashed border-2 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Add Work Experience
                        </Button>
                    </div>
                );
            case 'education':
                return (
                    <div className="space-y-5">
                        {data.education.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                                <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">No education added yet.</p>
                            </div>
                        )}
                        {data.education.map((edu, i) => (
                            <Card key={edu.id} className="p-5 space-y-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Education #{i + 1}</span>
                                    <Button variant="ghost" size="icon" onClick={() => removeEdu(edu.id)} className="text-red-500 hover:bg-red-50 h-7 w-7 rounded-full">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-500">Institution *</Label>
                                    <Input value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} placeholder="MIT, Stanford University..." className="h-10 rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Degree *</Label>
                                        <Input value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} placeholder="B.Sc. Computer Science" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Field of Study</Label>
                                        <Input value={edu.field} onChange={e => updateEdu(edu.id, 'field', e.target.value)} placeholder="Software Engineering" className="h-10 rounded-xl" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Start Date</Label>
                                        <Input value={edu.startDate} onChange={e => updateEdu(edu.id, 'startDate', e.target.value)} placeholder="Sep 2018" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">End Date</Label>
                                        <Input value={edu.endDate} onChange={e => updateEdu(edu.id, 'endDate', e.target.value)} placeholder="Jun 2022" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">GPA (optional)</Label>
                                        <Input value={edu.gpa} onChange={e => updateEdu(edu.id, 'gpa', e.target.value)} placeholder="3.8/4.0" className="h-10 rounded-xl" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" onClick={addEdu} className="w-full h-11 border-dashed border-2 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Add Education
                        </Button>
                    </div>
                );
            case 'skills':
                return (
                    <div className="space-y-5">
                        {[
                            { key: 'technical', label: 'Technical Skills', placeholder: 'React, TypeScript, Node.js, Python...' },
                            { key: 'soft', label: 'Soft Skills', placeholder: 'Leadership, Communication, Problem Solving...' },
                            { key: 'tools', label: 'Tools & Platforms', placeholder: 'Figma, AWS, Docker, Jira...' },
                            { key: 'languages', label: 'Languages Spoken', placeholder: 'English (Native), French (Fluent)...' },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key} className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</Label>
                                <Textarea
                                    value={data.skills[key as keyof WizardData['skills']].join(', ')}
                                    onChange={e => updateSkills(key as keyof WizardData['skills'], e.target.value)}
                                    placeholder={placeholder + ' (comma-separated)'}
                                    className="min-h-[80px] rounded-xl resize-none"
                                />
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {data.skills[key as keyof WizardData['skills']].filter(Boolean).map((skill, i) => (
                                        <span key={i} className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-medium border border-indigo-100 dark:border-indigo-800">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                return (
                    <div className="space-y-5">
                        <div className="space-y-5">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Projects</h3>
                            {data.projects.map((proj, i) => (
                                <Card key={proj.id} className="p-5 space-y-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Project #{i + 1}</span>
                                        <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)} className="text-red-500 hover:bg-red-50 h-7 w-7 rounded-full">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-500">Project Name *</Label>
                                            <Input value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} placeholder="AI Portfolio Builder" className="h-10 rounded-xl" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-500">URL</Label>
                                            <Input value={proj.url} onChange={e => updateProject(proj.id, 'url', e.target.value)} placeholder="https://github.com/..." className="h-10 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Description</Label>
                                        <Textarea value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder="What did this project do and what was your impact?" className="min-h-[70px] rounded-xl resize-none" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Tech Stack (comma-separated)</Label>
                                        <Input value={proj.techStack.join(', ')} onChange={e => updateProject(proj.id, 'techStack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="React, Node.js, MongoDB" className="h-10 rounded-xl" />
                                    </div>
                                </Card>
                            ))}
                            <Button variant="outline" onClick={addProject} className="w-full h-11 border-dashed border-2 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all">
                                <Plus className="w-4 h-4 mr-2" /> Add Project
                            </Button>
                        </div>

                        <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Certifications</h3>
                            {data.certifications.map((cert, i) => (
                                <Card key={cert.id} className="p-5 space-y-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cert #{i + 1}</span>
                                        <Button variant="ghost" size="icon" onClick={() => removeCert(cert.id)} className="text-red-500 hover:bg-red-50 h-7 w-7 rounded-full">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-500">Certificate Name *</Label>
                                            <Input value={cert.name} onChange={e => updateCert(cert.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" className="h-10 rounded-xl" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-500">Issuing Organization</Label>
                                            <Input value={cert.issuer} onChange={e => updateCert(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" className="h-10 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-500">Date Earned</Label>
                                        <Input value={cert.date} onChange={e => updateCert(cert.id, 'date', e.target.value)} placeholder="Mar 2023" className="h-10 rounded-xl" />
                                    </div>
                                </Card>
                            ))}
                            <Button variant="outline" onClick={addCert} className="w-full h-11 border-dashed border-2 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all">
                                <Plus className="w-4 h-4 mr-2" /> Add Certification
                            </Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-[calc(100vh-61px)] bg-[#f8f7f4] dark:bg-slate-950 overflow-hidden">
            {/* Left panel: Form */}
            <div className="w-full lg:w-[520px] xl:w-[580px] flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
                {/* Progress header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">{STEPS[step].title}</h2>
                            <p className="text-sm text-slate-500">{STEPS[step].desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {saving && (
                                <span className="text-xs text-emerald-600 flex items-center gap-1 animate-pulse">
                                    <Save className="w-3 h-3" /> Saving…
                                </span>
                            )}
                            <span className="text-sm font-bold text-slate-400">{step + 1} / {STEPS.length}</span>
                        </div>
                    </div>

                    {/* Step indicators */}
                    <div className="flex gap-2">
                        {STEPS.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => i < step && setStep(i)}
                                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i < step ? 'bg-indigo-600 cursor-pointer hover:bg-indigo-700' :
                                        i === step ? 'bg-indigo-600' :
                                            'bg-slate-100 dark:bg-slate-800 cursor-not-allowed'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Step icon row */}
                    <div className="flex gap-2 mt-3">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={s.id} className={`flex-1 flex flex-col items-center gap-1`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i < step ? 'bg-indigo-600 text-white' :
                                            i === step ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 ring-2 ring-indigo-600' :
                                                'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                        }`}>
                                        {i < step ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-[9px] font-semibold text-center leading-tight hidden sm:block ${i === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {s.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer nav */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <Button variant="ghost" onClick={handleBack} className="flex items-center gap-1 text-slate-600">
                        <ArrowLeft className="w-4 h-4" /> {step === 0 ? 'Cancel' : 'Back'}
                    </Button>
                    <div className="flex-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEnhanceSection}
                        disabled={enhancing}
                        className="text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-bold flex items-center gap-1.5 text-xs"
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${enhancing ? 'animate-spin' : ''}`} />
                        {enhancing ? 'Enhancing…' : '✨ AI Enhance'}
                    </Button>
                    <Button
                        onClick={handleNext}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-10 font-bold flex items-center gap-2"
                    >
                        {step === STEPS.length - 1 ? 'Finish & Choose Template' : 'Next'}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Right panel: Live preview */}
            <div className="flex-1 overflow-hidden hidden lg:flex flex-col">
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
                    <span className="text-xs text-slate-400">Updates as you type</span>
                </div>
                <div className="flex-1 overflow-auto flex items-start justify-center py-8 px-4 bg-[#f8f7f4] dark:bg-slate-950">
                    <div className="origin-top" style={{ transform: 'scale(0.6)', transformOrigin: 'top center' }}>
                        <PreviewComp template={previewTemplate} data={previewData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
