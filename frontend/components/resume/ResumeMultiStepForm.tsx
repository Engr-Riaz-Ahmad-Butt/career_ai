'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, TextSelect, Briefcase, GraduationCap, Code, FolderOpen, ArrowRight, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ResumeMultiStepFormProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

const STEPS = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'summary', title: 'Summary', icon: TextSelect },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'projects', title: 'Projects', icon: FolderOpen },
    { id: 'certifications', title: 'Certifications', icon: CheckCircle2 },
    { id: 'languages', title: 'Languages', icon: User },
];

export function ResumeMultiStepForm({ onComplete, onCancel }: ResumeMultiStepFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        experience: [],
        education: [],
        skills: { technical: [], soft: [] },
        projects: [],
        certifications: [],
        languages: [],
    });

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(formData);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            onCancel();
        }
    };

    const updatePersonalInfo = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value },
        }));
    };

    const addArrayItem = (section: string, initialValue: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: [...prev[section], initialValue],
        }));
    };

    const updateArrayItem = (section: string, index: number, field: string, value: any) => {
        setFormData((prev: any) => {
            const items = [...prev[section]];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, [section]: items };
        });
    };

    const removeArrayItem = (section: string, index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: prev[section].filter((_: any, i: number) => i !== index),
        }));
    };

    const renderStep = () => {
        const stepId = STEPS[currentStep].id;

        switch (stepId) {
            case 'personal':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={formData.personalInfo.name}
                                onChange={(e) => updatePersonalInfo('name', e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.personalInfo.email}
                                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    value={formData.personalInfo.phone}
                                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={formData.personalInfo.location}
                                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                placeholder="New York, NY"
                            />
                        </div>
                    </div>
                );
            case 'summary':
                return (
                    <div className="space-y-4">
                        <Label>Summary</Label>
                        <Textarea
                            className="min-h-[200px]"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            placeholder="Briefly describe your professional background and key achievements..."
                        />
                    </div>
                );
            case 'experience':
                return (
                    <div className="space-y-6">
                        {formData.experience.map((exp: any, i: number) => (
                            <Card key={i} className="p-4 relative space-y-4 border-slate-200 dark:border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-rose-500"
                                    onClick={() => removeArrayItem('experience', i)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={exp.title}
                                            onChange={(e) => updateArrayItem('experience', i, 'title', e.target.value)}
                                            placeholder="Software Engineer"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company</Label>
                                        <Input
                                            value={exp.company}
                                            onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)}
                                            placeholder="Google"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            value={exp.startDate}
                                            onChange={(e) => updateArrayItem('experience', i, 'startDate', e.target.value)}
                                            placeholder="01/2020"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            value={exp.endDate}
                                            onChange={(e) => updateArrayItem('experience', i, 'endDate', e.target.value)}
                                            placeholder="Present"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={exp.description}
                                        onChange={(e) => updateArrayItem('experience', i, 'description', e.target.value)}
                                        placeholder="Describe your role..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Achievements (comma-separated)</Label>
                                    <Textarea
                                        value={exp.achievements?.join(', ') || ''}
                                        onChange={(e) => updateArrayItem('experience', i, 'achievements', e.target.value.split(',').map(s => s.trim()))}
                                        placeholder="Increased sales by 20%, Managed a team of 5..."
                                    />
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => addArrayItem('experience', { title: '', company: '', startDate: '', endDate: '', description: '', achievements: [] })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Experience
                        </Button>
                    </div>
                );
            case 'education':
                return (
                    <div className="space-y-6">
                        {formData.education.map((edu: any, i: number) => (
                            <Card key={i} className="p-4 relative space-y-4 border-slate-200 dark:border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-rose-500"
                                    onClick={() => removeArrayItem('education', i)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="space-y-2">
                                    <Label>Degree</Label>
                                    <Input
                                        value={edu.degree}
                                        onChange={(e) => updateArrayItem('education', i, 'degree', e.target.value)}
                                        placeholder="B.S. Computer Science"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Institution</Label>
                                    <Input
                                        value={edu.institution}
                                        onChange={(e) => updateArrayItem('education', i, 'institution', e.target.value)}
                                        placeholder="Stanford University"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            value={edu.startDate}
                                            onChange={(e) => updateArrayItem('education', i, 'startDate', e.target.value)}
                                            placeholder="09/2016"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            value={edu.endDate}
                                            onChange={(e) => updateArrayItem('education', i, 'endDate', e.target.value)}
                                            placeholder="06/2020"
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => addArrayItem('education', { degree: '', institution: '', startDate: '', endDate: '' })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Education
                        </Button>
                    </div>
                );
            case 'skills':
                return (
                    <div className="space-y-4">
                        <Label>Technical Skills (comma-separated)</Label>
                        <Textarea
                            className="min-h-[100px]"
                            value={formData.skills.technical.join(', ')}
                            onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, technical: e.target.value.split(',').map(s => s.trim()) } })}
                            placeholder="React, TypeScript, Node.js..."
                        />
                    </div>
                );
            case 'projects':
                return (
                    <div className="space-y-6">
                        {formData.projects.map((proj: any, i: number) => (
                            <Card key={i} className="p-4 relative space-y-4 border-slate-200 dark:border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-rose-500"
                                    onClick={() => removeArrayItem('projects', i)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    <Input
                                        value={proj.name}
                                        onChange={(e) => updateArrayItem('projects', i, 'name', e.target.value)}
                                        placeholder="AI Portfolio Builder"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={proj.description}
                                        onChange={(e) => updateArrayItem('projects', i, 'description', e.target.value)}
                                        placeholder="Describe your project..."
                                    />
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [] })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Project
                        </Button>
                    </div>
                );
            case 'certifications':
                return (
                    <div className="space-y-6">
                        {formData.certifications.map((cert: any, i: number) => (
                            <Card key={i} className="p-4 relative space-y-4 border-slate-200 dark:border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-rose-500"
                                    onClick={() => removeArrayItem('certifications', i)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="space-y-2">
                                    <Label>Certification Name</Label>
                                    <Input
                                        value={cert.name}
                                        onChange={(e) => updateArrayItem('certifications', i, 'name', e.target.value)}
                                        placeholder="AWS Certified Solutions Architect"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Issuer</Label>
                                        <Input
                                            value={cert.issuer}
                                            onChange={(e) => updateArrayItem('certifications', i, 'issuer', e.target.value)}
                                            placeholder="Amazon"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input
                                            value={cert.date}
                                            onChange={(e) => updateArrayItem('certifications', i, 'date', e.target.value)}
                                            placeholder="2023"
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '' })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Certification
                        </Button>
                    </div>
                );
            case 'languages':
                return (
                    <div className="space-y-6">
                        {formData.languages.map((lang: any, i: number) => (
                            <Card key={i} className="p-4 relative space-y-4 border-slate-200 dark:border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-rose-500"
                                    onClick={() => removeArrayItem('languages', i)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <Input
                                            value={lang.name}
                                            onChange={(e) => updateArrayItem('languages', i, 'name', e.target.value)}
                                            placeholder="English"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Level</Label>
                                        <Input
                                            value={lang.level}
                                            onChange={(e) => updateArrayItem('languages', i, 'level', e.target.value)}
                                            placeholder="Native / Fluent"
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => addArrayItem('languages', { name: '', level: 'Fluent' })}>
                            <Plus className="h-4 w-4 mr-2" /> Add Language
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        const active = i === currentStep;
                        const completed = i < currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center flex-1 relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${active ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' :
                                    completed ? 'border-indigo-600 bg-indigo-600 text-white' :
                                        'border-slate-200 dark:border-slate-800 text-slate-400'
                                    }`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${active ? 'text-indigo-600' : 'text-slate-400'
                                    }`}>
                                    {step.title}
                                </span>
                                {i < STEPS.length - 1 && (
                                    <div className={`absolute left-[50%] top-5 w-full h-[2px] -z-0 ${completed ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="min-h-[450px]">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{STEPS[currentStep].title}</h2>
                        <p className="text-slate-500 text-sm">Step {currentStep + 1} of {STEPS.length}</p>
                    </div>
                    {renderStep()}
                </motion.div>
            </div>

            <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {currentStep === 0 ? 'Cancel' : 'Back'}
                </Button>
                <Button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                >
                    {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
