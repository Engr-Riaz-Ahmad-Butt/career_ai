'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { resumeTemplates, ResumeTemplate } from '@/lib/resume-templates';
import {
  Plus,
  Trash2,
  Zap,
  Eye,
  Download,
  Palette,
  Upload,
  Undo2,
  Redo2,
  ChevronDown,
  MoreVertical,
  Camera,
  Layout as LayoutIcon,
  FileText,
  User,
  Briefcase,
  Globe
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ResumeUploadFlow } from '@/components/resume/ResumeUploadFlow';
import { ResumeMultiStepForm } from '@/components/resume/ResumeMultiStepForm';
import { ResumeOptimizer } from '@/components/resume/ResumeOptimizer';
import { DesignPanels } from '@/components/resume/DesignPanels';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { message } from 'antd';
import { ResumeData } from '@/store/documentStore';
import { useUIStore } from '@/store/uiStore';
import { ChevronLeft, Home } from 'lucide-react';
import Link from 'next/link';

const sections = ['Contact', 'Summary', 'Experience', 'Education', 'Certificates', 'Skills', 'Languages'];

export default function ResumeBuilderPage({
  initialFlow = 'selection',
  initialTab = 'editor'
}: {
  initialFlow?: 'selection' | 'upload' | 'scratch' | 'editor';
  initialTab?: string;
}) {
  const [previewZoom, setPreviewZoom] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showNewResume, setShowNewResume] = useState(initialFlow === 'selection');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [flow, setFlow] = useState<'selection' | 'upload' | 'scratch' | 'editor'>(initialFlow);

  const {
    currentResume,
    updateContact,
    updateSummary,
    updateSkills,
    updateStyling,
    setFullResume,
    updateTemplate,
    deleteResume
  } = useDocumentStore();

  const { setSidebarOpen } = useUIStore();

  useEffect(() => {
    // Collapse sidebar when entering resume builder
    setSidebarOpen(false);
    return () => {
      // Re-open sidebar when leaving
      setSidebarOpen(true);
    };
  }, [setSidebarOpen]);

  const handleDownload = () => {
    setIsSaving(true);
    // Simulate downloading
    setTimeout(() => {
      setIsSaving(false);
      message.success('Resume downloaded successfully!');
    }, 1000);
  };

  const handleChangeTemplate = (template: ResumeTemplate) => {
    updateTemplate(template);
    setShowTemplateSelector(false);
    message.success(`Template changed to ${template.name}`);
  };

  const handleDelete = () => {
    if (currentResume) {
      if (confirm('Are you sure you want to delete this resume?')) {
        deleteResume(currentResume.id);
        setFlow('selection');
        setShowNewResume(true);
        message.success('Resume deleted');
      }
    }
  };

  const handleRename = () => {
    const newName = prompt('Enter new resume name:', currentResume?.name);
    if (newName && currentResume) {
      setFullResume({ name: newName });
      message.success('Resume renamed');
    }
  };

  const handleUploadComplete = (extractedData: any) => {
    setFlow('editor');
    setShowNewResume(false);

    const mappedData: Partial<ResumeData> = {
      contact: {
        fullName: extractedData.personalInfo?.name || '',
        email: extractedData.personalInfo?.email || '',
        phone: extractedData.personalInfo?.phone || '',
        location: extractedData.personalInfo?.location || '',
      },
      summary: extractedData.summary || '',
      experience: extractedData.experience?.map((exp: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        company: exp.company || '',
        position: exp.title || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
        achievements: exp.achievements || [],
      })) || [],
      education: extractedData.education?.map((edu: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        school: edu.institution || '',
        degree: edu.degree || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      })) || [],
      skills: {
        technical: extractedData.skills?.technical || [],
        soft: extractedData.skills?.soft || [],
      },
      projects: extractedData.projects?.map((proj: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || [],
      })) || [],
    };

    useDocumentStore.getState().createResumeWithData(
      `Resume - ${new Date().toLocaleDateString()}`,
      resumeTemplates[0],
      mappedData
    );
  };

  const handleScratchComplete = (formData: any) => {
    setFlow('editor');
    setShowNewResume(false);

    useDocumentStore.getState().createResumeWithData(
      `Resume - ${new Date().toLocaleDateString()}`,
      resumeTemplates[0],
      formData
    );
  };

  if (flow === 'selection' && showNewResume) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            How do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">build your resume?</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload an existing CV to let AI do the heavy lifting, or start fresh with a guided multi-step process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-500 group"
            onClick={() => setFlow('upload')}
          >
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Existing CV</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Upload your current PDF or Word resume. Our AI will extract all information and map it to a professional template instantly.
            </p>
            <Button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              Import Document
            </Button>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500 group"
            onClick={() => setFlow('scratch')}
          >
            <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create From Scratch</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Follow our guided step-by-step process. Ideal for those starting fresh or wanting to ensure every detail is perfect.
            </p>
            <Button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              Start Building
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (flow === 'upload') {
    return (
      <ResumeUploadFlow
        onComplete={handleUploadComplete}
        onCancel={() => setFlow('selection')}
      />
    );
  }

  if (flow === 'scratch') {
    return (
      <ResumeMultiStepForm
        onComplete={handleScratchComplete}
        onCancel={() => setFlow('selection')}
      />
    );
  }

  return (
    <div className="bg-[#f8f7f4] dark:bg-slate-950 min-h-screen">
      {/* Top Breadcrumb & Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-bold">Resume Builder</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-50 border-slate-200 font-bold flex items-center gap-4 px-4 py-2 h-10 rounded-xl min-w-[200px] justify-between">
                <span className="truncate">{currentResume?.name || 'Untitled Resume'}</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setShowTemplateSelector(true)}>Change Template</DropdownMenuItem>
              <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-500" onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-[#1a1c20] hover:bg-[#2a2c30] text-white rounded-xl font-bold px-6 h-10 flex items-center gap-2 shadow-sm" onClick={handleDownload}>
            Download <Download className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Sub-Header Tabs */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-[61px] z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-0 h-16 w-full justify-start gap-8">
              <TabsTrigger
                value="overview"
                className="bg-transparent border-0 h-16 px-2 font-bold text-sm data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none transition-none shadow-none"
              >
                <LayoutIcon className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="editor"
                className="bg-transparent border-0 h-16 px-2 font-bold text-sm data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none transition-none shadow-none"
              >
                <FileText className="w-4 h-4 mr-2" /> Content
              </TabsTrigger>
              <TabsTrigger
                value="customize"
                className="bg-transparent border-0 h-16 px-2 font-bold text-sm data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none transition-none shadow-none"
              >
                <Palette className="w-4 h-4 mr-2" /> Customize
              </TabsTrigger>
              <TabsTrigger
                value="optimizer"
                className="bg-transparent border-0 h-16 px-2 font-bold text-sm data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none transition-none shadow-none flex items-center"
              >
                <Zap className="w-4 h-4 mr-2 fill-amber-500 text-amber-500" /> AI Tools
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <Tabs value={activeTab} className="w-full">
          {/* CONTENT (EDITOR) VIEW */}
          <TabsContent value="editor" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Form */}
              <div className="space-y-6 pb-20">
                {/* Profile Section */}
                <Card className="p-6 rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden relative group">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border-4 border-white shadow-sm group-hover:opacity-80 transition-opacity">
                        {currentResume?.contact.photoUrl ? (
                          <img src={currentResume.contact.photoUrl} className="w-full h-full rounded-full object-cover" alt="Profile" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#ff4b8b] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                        <Palette className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 truncate">{currentResume?.contact.fullName || 'Your Name'}</h2>
                          <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-3 h-3" />
                              </div>
                              <span className="truncate">{currentResume?.contact.email || 'email@example.com'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-3 h-3" />
                              </div>
                              <span>{currentResume?.contact.phone || '+1 234 567 890'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <LayoutIcon className="w-3 h-3" />
                              </div>
                              <span className="truncate">{currentResume?.contact.location || 'Location'}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Section Cards */}
                <div className="space-y-4">
                  {sections.map((section) => (
                    <Card key={section} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={section.toLowerCase()} className="border-0">
                          <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 transition-colors group-data-[state=open]:bg-indigo-50 group-data-[state=open]:text-indigo-600">
                                {section === 'Contact' && <User className="w-5 h-5" />}
                                {section === 'Summary' && <FileText className="w-5 h-5" />}
                                {section === 'Experience' && <Briefcase className="w-5 h-5" />}
                                {section === 'Education' && <LayoutIcon className="w-5 h-5" />}
                                {section === 'Certificates' && <Plus className="w-5 h-5" />}
                                {section === 'Skills' && <Zap className="w-5 h-5" />}
                                {section === 'Languages' && <Globe className="w-5 h-5" />}
                              </div>
                              <span className="font-bold text-slate-900">{section}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6 pt-2">
                            {section === 'Contact' && currentResume && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</Label>
                                  <Input
                                    value={currentResume.contact.fullName}
                                    placeholder="Enter your full name"
                                    className="rounded-xl border-slate-200 focus:border-indigo-500 transition-colors h-11"
                                    onChange={(e) => updateContact({ ...currentResume.contact, fullName: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</Label>
                                    <Input
                                      value={currentResume.contact.email}
                                      placeholder="example@gmail.com"
                                      className="rounded-xl border-slate-200 focus:border-indigo-500 transition-colors h-11"
                                      onChange={(e) => updateContact({ ...currentResume.contact, email: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</Label>
                                    <Input
                                      value={currentResume.contact.phone}
                                      placeholder="+1 234 567 890"
                                      className="rounded-xl border-slate-200 focus:border-indigo-500 transition-colors h-11"
                                      onChange={(e) => updateContact({ ...currentResume.contact, phone: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</Label>
                                  <Input
                                    value={currentResume.contact.location}
                                    placeholder="City, Country"
                                    className="rounded-xl border-slate-200 focus:border-indigo-500 transition-colors h-11"
                                    onChange={(e) => updateContact({ ...currentResume.contact, location: e.target.value })}
                                  />
                                </div>
                              </div>
                            )}

                            {section === 'Summary' && currentResume && (
                              <div className="space-y-4">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Summary</Label>
                                <Textarea
                                  value={currentResume.summary}
                                  placeholder="Briefly describe your professional background and key strengths..."
                                  className="min-h-[150px] rounded-xl border-slate-200 focus:border-indigo-500 transition-colors p-4"
                                  onChange={(e) => updateSummary(e.target.value)}
                                />
                                <div className="flex justify-end pt-2">
                                  <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50">
                                    <Zap className="w-4 h-4 mr-2" /> Enhance with AI
                                  </Button>
                                </div>
                              </div>
                            )}

                            {section === 'Experience' && currentResume && (
                              <div className="space-y-6">
                                {currentResume.experience.map((exp, index) => (
                                  <div key={exp.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4 relative group/exp">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-bold text-sm text-slate-700">Experience #{index + 1}</h4>
                                      <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8 hover:bg-rose-50 rounded-full" onClick={() => useDocumentStore.getState().removeExperience(exp.id)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Company</Label>
                                        <Input
                                          value={exp.company}
                                          placeholder="e.g. Google"
                                          className="rounded-xl border-slate-200 h-10"
                                          onChange={(e) => {
                                            const newExp = [...currentResume.experience];
                                            newExp[index] = { ...newExp[index], company: e.target.value };
                                            setFullResume({ experience: newExp });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Position</Label>
                                        <Input
                                          value={exp.position}
                                          placeholder="e.g. Senior Developer"
                                          className="rounded-xl border-slate-200 h-10"
                                          onChange={(e) => {
                                            const newExp = [...currentResume.experience];
                                            newExp[index] = { ...newExp[index], position: e.target.value };
                                            setFullResume({ experience: newExp });
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Start Date</Label>
                                        <Input value={exp.startDate} placeholder="MM/YYYY" className="rounded-xl h-10" onChange={(e) => {
                                          const newExp = [...currentResume.experience];
                                          newExp[index] = { ...newExp[index], startDate: e.target.value };
                                          setFullResume({ experience: newExp });
                                        }} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">End Date</Label>
                                        <Input value={exp.endDate} placeholder="MM/YYYY or Present" className="rounded-xl h-10" onChange={(e) => {
                                          const newExp = [...currentResume.experience];
                                          newExp[index] = { ...newExp[index], endDate: e.target.value };
                                          setFullResume({ experience: newExp });
                                        }} />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-bold text-slate-500">Description</Label>
                                      <Textarea
                                        value={exp.description}
                                        placeholder="Describe your responsibilities and achievements..."
                                        className="rounded-xl border-slate-200 min-h-[100px]"
                                        onChange={(e) => {
                                          const newExp = [...currentResume.experience];
                                          newExp[index] = { ...newExp[index], description: e.target.value };
                                          setFullResume({ experience: newExp });
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                                <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 transition-all" onClick={() => useDocumentStore.getState().addExperience({
                                  id: Math.random().toString(36).substr(2, 9),
                                  company: '',
                                  position: '',
                                  startDate: '',
                                  endDate: '',
                                  description: '',
                                })}>
                                  <Plus className="w-4 h-4 mr-2" /> Add Experience entry
                                </Button>
                              </div>
                            )}

                            {section === 'Education' && currentResume && (
                              <div className="space-y-6">
                                {currentResume.education.map((edu, index) => (
                                  <div key={edu.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4 relative group/edu">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-bold text-sm text-slate-700">Education #{index + 1}</h4>
                                      <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8 hover:bg-rose-50 rounded-full" onClick={() => useDocumentStore.getState().removeEducation(edu.id)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-bold text-slate-500">School / University</Label>
                                      <Input
                                        value={edu.school}
                                        placeholder="e.g. Stanford University"
                                        className="rounded-xl h-10"
                                        onChange={(e) => {
                                          const newEdu = [...currentResume.education];
                                          newEdu[index] = { ...newEdu[index], school: e.target.value };
                                          setFullResume({ education: newEdu });
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-bold text-slate-500">Degree</Label>
                                      <Input
                                        value={edu.degree}
                                        placeholder="e.g. Bachelor of Science in Computer Science"
                                        className="rounded-xl h-10"
                                        onChange={(e) => {
                                          const newEdu = [...currentResume.education];
                                          newEdu[index] = { ...newEdu[index], degree: e.target.value };
                                          setFullResume({ education: newEdu });
                                        }}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Start Date</Label>
                                        <Input value={edu.startDate} placeholder="MM/YYYY" className="rounded-xl h-10" onChange={(e) => {
                                          const newEdu = [...currentResume.education];
                                          newEdu[index] = { ...newEdu[index], startDate: e.target.value };
                                          setFullResume({ education: newEdu });
                                        }} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">End Date</Label>
                                        <Input value={edu.endDate} placeholder="MM/YYYY" className="rounded-xl h-10" onChange={(e) => {
                                          const newEdu = [...currentResume.education];
                                          newEdu[index] = { ...newEdu[index], endDate: e.target.value };
                                          setFullResume({ education: newEdu });
                                        }} />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 transition-all" onClick={() => useDocumentStore.getState().addEducation({
                                  id: Math.random().toString(36).substr(2, 9),
                                  school: '',
                                  degree: '',
                                  startDate: '',
                                  endDate: '',
                                })}>
                                  <Plus className="w-4 h-4 mr-2" /> Add Education entry
                                </Button>
                              </div>
                            )}

                            {section === 'Certificates' && currentResume && (
                              <div className="space-y-6">
                                {currentResume.certifications?.map((cert, index) => (
                                  <div key={cert.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4 relative group/cert">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-bold text-sm text-slate-700">Certificate #{index + 1}</h4>
                                      <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8 hover:bg-rose-50 rounded-full" onClick={() => {
                                        const newCerts = currentResume.certifications?.filter(c => c.id !== cert.id);
                                        setFullResume({ certifications: newCerts });
                                      }}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-bold text-slate-500">Certificate Name</Label>
                                      <Input
                                        value={cert.name}
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                        className="rounded-xl h-10"
                                        onChange={(e) => {
                                          const newCerts = [...(currentResume.certifications || [])];
                                          newCerts[index] = { ...newCerts[index], name: e.target.value };
                                          setFullResume({ certifications: newCerts });
                                        }}
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Issuer</Label>
                                        <Input
                                          value={cert.issuer}
                                          placeholder="e.g. Amazon Web Services"
                                          className="rounded-xl h-10"
                                          onChange={(e) => {
                                            const newCerts = [...(currentResume.certifications || [])];
                                            newCerts[index] = { ...newCerts[index], issuer: e.target.value };
                                            setFullResume({ certifications: newCerts });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Date</Label>
                                        <Input
                                          value={cert.date}
                                          placeholder="MM/YYYY"
                                          className="rounded-xl h-10"
                                          onChange={(e) => {
                                            const newCerts = [...(currentResume.certifications || [])];
                                            newCerts[index] = { ...newCerts[index], date: e.target.value };
                                            setFullResume({ certifications: newCerts });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 transition-all" onClick={() => {
                                  const newCerts = [...(currentResume.certifications || [])];
                                  newCerts.push({
                                    id: Math.random().toString(36).substr(2, 9),
                                    name: '',
                                    issuer: '',
                                    date: ''
                                  });
                                  setFullResume({ certifications: newCerts });
                                }}>
                                  <Plus className="w-4 h-4 mr-2" /> Add Certificate
                                </Button>
                              </div>
                            )}

                            {section === 'Skills' && currentResume && (
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Technical Skills</Label>
                                  <Textarea
                                    value={currentResume.skills.technical.join(', ')}
                                    placeholder="React, Node.js, TypeScript, etc. (comma separated)"
                                    className="rounded-xl border-slate-200 min-h-[100px] p-4"
                                    onChange={(e) => updateSkills({
                                      ...currentResume.skills,
                                      technical: e.target.value.split(',').map(s => s.trim())
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Soft Skills</Label>
                                  <Textarea
                                    value={currentResume.skills.soft.join(', ')}
                                    placeholder="Leadership, Communication, etc. (comma separated)"
                                    className="rounded-xl border-slate-200 min-h-[100px] p-4"
                                    onChange={(e) => updateSkills({
                                      ...currentResume.skills,
                                      soft: e.target.value.split(',').map(s => s.trim())
                                    })}
                                  />
                                </div>
                              </div>
                            )}

                            {section === 'Languages' && currentResume && (
                              <div className="space-y-6">
                                {currentResume.languages?.map((lang, index) => (
                                  <div key={lang.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-4">
                                    <div className="flex-1 space-y-2">
                                      <Label className="text-xs font-bold text-slate-500">Language</Label>
                                      <Input value={lang.name} placeholder="e.g. English" className="rounded-xl h-10" onChange={(e) => {
                                        const newLangs = [...(currentResume.languages || [])];
                                        newLangs[index] = { ...newLangs[index], name: e.target.value };
                                        setFullResume({ languages: newLangs });
                                      }} />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <Label className="text-xs font-bold text-slate-500">Proficiency</Label>
                                      <Input value={lang.level} placeholder="e.g. Native" className="rounded-xl h-10" onChange={(e) => {
                                        const newLangs = [...(currentResume.languages || [])];
                                        newLangs[index] = { ...newLangs[index], level: e.target.value };
                                        setFullResume({ languages: newLangs });
                                      }} />
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8 hover:bg-rose-50 rounded-full self-end mb-1" onClick={() => {
                                      const newLangs = currentResume.languages?.filter(l => l.id !== lang.id);
                                      setFullResume({ languages: newLangs });
                                    }}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 transition-all" onClick={() => {
                                  const newLangs = [...(currentResume.languages || [])];
                                  newLangs.push({
                                    id: Math.random().toString(36).substr(2, 9),
                                    name: '',
                                    level: ''
                                  });
                                  setFullResume({ languages: newLangs });
                                }}>
                                  <Plus className="w-4 h-4 mr-2" /> Add Language
                                </Button>
                              </div>
                            )}

                            {section !== 'Contact' && section !== 'Summary' && section !== 'Experience' && section !== 'Education' && section !== 'Certificates' && section !== 'Skills' && section !== 'Languages' && (
                              <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">
                                Form inputs for {section} coming soon...
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  ))}
                </div>

                {/* Add Content Button */}
                <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#ff4b8b] to-[#ff2d55] hover:opacity-90 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]">
                  <Plus className="w-6 h-6" /> Add Content
                </Button>
              </div>

              {/* Right Column: Preview */}
              <div className="sticky top-[141px] h-[calc(100vh-181px)] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto p-12 bg-slate-50/50 custom-scrollbar flex justify-center items-start">
                  <div className="shadow-2xl bg-white origin-top" style={{ transform: `scale(${previewZoom / 100})` }}>
                    {currentResume ? (
                      <TemplateRenderer resume={currentResume} zoom={1} />
                    ) : (
                      <div className="w-[210mm] h-[297mm] flex items-center justify-center text-slate-300">
                        No data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Zoom Controls Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-4 border border-slate-200">
                  <button onClick={() => setPreviewZoom(Math.max(40, previewZoom - 5))} className="hover:text-indigo-600 transition-colors font-black text-xl">−</button>
                  <span className="text-sm font-bold w-12 text-center">{previewZoom}%</span>
                  <button onClick={() => setPreviewZoom(Math.min(100, previewZoom + 5))} className="hover:text-indigo-600 transition-colors font-black text-xl">+</button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* CUSTOMIZE VIEW */}
          <TabsContent value="customize" className="mt-0">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-4 h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pr-2">
                {currentResume && (
                  <DesignPanels
                    styling={currentResume.styling}
                    onUpdate={(styling) => updateStyling(styling)}
                  />
                )}
              </div>
              <div className="xl:col-span-8">
                <div className="sticky top-24 h-[calc(100vh-160px)] rounded-3xl bg-white dark:bg-slate-900 border-8 border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
                  <div className="h-full overflow-y-auto custom-scrollbar p-12 bg-slate-100/50 dark:bg-slate-900/50">
                    {currentResume && <TemplateRenderer resume={currentResume} zoom={previewZoom / 100} />}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI TOOLS (OPTIMIZER) VIEW */}
          <TabsContent value="optimizer" className="mt-0">
            {currentResume && (
              <ResumeOptimizer
                resumeId={currentResume.id}
                originalData={currentResume}
                onOptimize={(optimizedData) => setFullResume(optimizedData)}
              />
            )}
          </TabsContent>

          {/* OVERVIEW VIEW */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-4">
                <div className="h-[calc(100vh-160px)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold">{currentResume?.name}</h3>
                  <p className="text-sm text-slate-500">Last edited {currentResume?.updatedAt.toLocaleTimeString()}</p>
                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="rounded-xl">Preview</Button>
                    <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">Download</Button>
                  </div>
                </div>
              </div>
              <div className="xl:col-span-8">
                <Card className="p-10 h-full rounded-3xl border-0 shadow-sm flex flex-col justify-center">
                  <h2 className="text-3xl font-black mb-8">Resume Stats & Insights</h2>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ATS Score</span>
                      <div className="text-5xl font-black mt-2 text-indigo-600">{currentResume?.atsScore || 0}%</div>
                      <p className="text-xs text-indigo-500 mt-2 font-bold uppercase tracking-tighter">Excellent</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Word Count</span>
                      <div className="text-5xl font-black mt-2">452</div>
                      <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-tighter">Ideal range</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Readability</span>
                      <div className="text-5xl font-black mt-2">High</div>
                      <p className="text-xs text-emerald-500 mt-2 font-bold uppercase tracking-tighter">Easy to scan</p>
                    </div>
                  </div>

                  <div className="mt-12 p-8 rounded-3xl bg-indigo-600 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold">Ready to apply?</h3>
                      <p className="text-indigo-100 mt-2">Export your resume in multiple formats and start your applications.</p>
                      <Button className="bg-white text-indigo-600 hover:bg-indigo-50 mt-6 font-bold rounded-xl px-8 h-12">
                        Download PDF
                      </Button>
                    </div>
                    <FileText className="absolute top-1/2 -right-8 w-64 h-64 -translate-y-1/2 text-indigo-500/30 -rotate-12" />
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
        selectedTemplateId={currentResume?.template.id}
      />

      {/* Undo/Redo/Save Floating Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl px-6 py-3 rounded-2xl flex items-center gap-6 z-50">
        <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-6">
          <Button variant="ghost" size="icon" className="h-10 w-10"><Undo2 className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="h-10 w-10"><Redo2 className="w-5 h-5" /></Button>
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {isSaving ? 'Cloud Saving...' : 'All changes saved'}
        </p>
      </div>
    </div>
  );
}
