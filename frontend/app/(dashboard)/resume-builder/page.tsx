'use client';

import { useState, useMemo } from 'react';
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
  User
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
} from '@/components/ui/dropdown-menu';
import { message } from 'antd';
import { ResumeData } from '@/store/documentStore';

const sections = ['Contact', 'Summary', 'Experience', 'Education', 'Skills'];

export default function ResumeBuilderPage() {
  const [previewZoom, setPreviewZoom] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showNewResume, setShowNewResume] = useState(true);
  const [activeTab, setActiveTab] = useState('editor');

  const { currentResume, updateContact, updateSummary, updateSkills, updateStyling, setFullResume, updateTemplate, createResume, createResumeWithData } = useDocumentStore();

  const handleCreateResume = (template: ResumeTemplate) => {
    createResume(`Resume - ${new Date().toLocaleDateString()}`, template);
    setShowTemplateSelector(false);
    setShowNewResume(false);
  };

  const handleChangeTemplate = (template: ResumeTemplate) => {
    if (currentResume) {
      updateTemplate(template);
    }
    setShowTemplateSelector(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    message.success('Resume saved successfully!');
  };

  const [flow, setFlow] = useState<'selection' | 'upload' | 'scratch' | 'editor'>('selection');

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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tighter">CareerAI</span>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-bold flex items-center gap-2 px-3 py-1.5 h-auto">
                  {currentResume?.name || 'Untitled Resume'}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => setShowTemplateSelector(true)}>Change Template</DropdownMenuItem>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem className="text-rose-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 hover:opacity-100">
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 hover:opacity-100">
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
              <TabsList className="bg-transparent border-0 h-9">
                <TabsTrigger value="overview" className="rounded-lg h-7 px-4 font-bold text-xs">Overview</TabsTrigger>
                <TabsTrigger value="editor" className="rounded-lg h-7 px-4 font-bold text-xs">Content</TabsTrigger>
                <TabsTrigger value="customize" className="rounded-lg h-7 px-4 font-bold text-xs">Customize</TabsTrigger>
                <TabsTrigger value="optimizer" className="rounded-lg h-7 px-4 font-bold text-xs flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> AI Tools
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-500">
              <MoreVertical className="w-5 h-5" />
            </Button>
            <Button className="bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl font-bold px-6 flex items-center gap-2" onClick={handleSave}>
              Download <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <Tabs value={activeTab} className="w-full">
          {/* CONTENT (EDITOR) VIEW */}
          <TabsContent value="editor" className="mt-0">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* Sidebar: Form */}
              <div className="xl:col-span-4 space-y-6">
                {/* Profile Card */}
                <Card className="p-6 rounded-3xl border-0 shadow-sm overflow-hidden relative group">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-md group-hover:opacity-80 transition-opacity">
                        {currentResume?.contact.photoUrl ? (
                          <img src={currentResume.contact.photoUrl} className="w-full h-full rounded-full object-cover" alt="Profile" />
                        ) : (
                          <User className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-black truncate">{currentResume?.contact.fullName || 'Your Name'}</h2>
                      <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
                        <p className="truncate">{currentResume?.contact.email || 'email@example.com'}</p>
                        <p>{currentResume?.contact.phone || '+1 234 567 890'}</p>
                        <p className="truncate">{currentResume?.contact.location || 'Location'}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Section Accordions */}
                <Accordion type="single" collapsible defaultValue="contact" className="space-y-4">
                  {sections.map((section) => (
                    <AccordionItem key={section} value={section.toLowerCase()} className="border-0">
                      <AccordionTrigger className="hover:no-underline bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-data-[state=open]:bg-indigo-50 dark:group-data-[state=open]:bg-indigo-900/30 group-data-[state=open]:text-indigo-600 transition-colors">
                            {section === 'Contact' && <User className="w-4 h-4" />}
                            {section === 'Summary' && <FileText className="w-4 h-4" />}
                            {section === 'Experience' && <LayoutIcon className="w-4 h-4" />}
                            {section === 'Education' && <Plus className="w-4 h-4" />}
                            {section === 'Skills' && <Zap className="w-4 h-4" />}
                          </div>
                          <span className="font-bold">{section}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-6 px-4 space-y-6 bg-white/50 dark:bg-slate-900/50 rounded-b-2xl -mt-4 border-x border-b border-white/20">
                        {section === 'Contact' && currentResume && (
                          <>
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input
                                value={currentResume.contact.fullName}
                                onChange={(e) => updateContact({ ...currentResume.contact, fullName: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                  value={currentResume.contact.email}
                                  onChange={(e) => updateContact({ ...currentResume.contact, email: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                  value={currentResume.contact.phone}
                                  onChange={(e) => updateContact({ ...currentResume.contact, phone: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Location</Label>
                              <Input
                                value={currentResume.contact.location}
                                onChange={(e) => updateContact({ ...currentResume.contact, location: e.target.value })}
                              />
                            </div>
                          </>
                        )}

                        {section === 'Summary' && currentResume && (
                          <div className="space-y-4">
                            <Label>Professional Summary</Label>
                            <Textarea
                              value={currentResume.summary}
                              onChange={(e) => updateSummary(e.target.value)}
                              className="min-h-[150px]"
                            />
                          </div>
                        )}

                        {section === 'Experience' && currentResume && (
                          <div className="space-y-8">
                            {currentResume.experience.map((exp, index) => (
                              <div key={exp.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-sm">Experience #{index + 1}</h4>
                                  <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8" onClick={() => useDocumentStore.getState().removeExperience(exp.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Input value={exp.company} placeholder="Company" onChange={(e) => {
                                  const newExp = [...currentResume.experience];
                                  newExp[index].company = e.target.value;
                                  setFullResume({ experience: newExp });
                                }} />
                                <Input value={exp.position} placeholder="Position" onChange={(e) => {
                                  const newExp = [...currentResume.experience];
                                  newExp[index].position = e.target.value;
                                  setFullResume({ experience: newExp });
                                }} />
                                <Textarea value={exp.description} placeholder="Description" onChange={(e) => {
                                  const newExp = [...currentResume.experience];
                                  newExp[index].description = e.target.value;
                                  setFullResume({ experience: newExp });
                                }} />
                              </div>
                            ))}
                            <Button variant="outline" className="w-full dashed" onClick={() => useDocumentStore.getState().addExperience({
                              id: Math.random().toString(36).substr(2, 9),
                              company: '',
                              position: '',
                              startDate: '',
                              endDate: '',
                              description: '',
                            })}>
                              <Plus className="w-4 h-4 mr-2" /> Add Experience
                            </Button>
                          </div>
                        )}

                        {section === 'Education' && currentResume && (
                          <div className="space-y-8">
                            {currentResume.education.map((edu, index) => (
                              <div key={edu.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-sm">Education #{index + 1}</h4>
                                  <Button variant="ghost" size="icon" className="text-rose-500 h-8 w-8" onClick={() => useDocumentStore.getState().removeEducation(edu.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Input value={edu.school} placeholder="School/University" onChange={(e) => {
                                  const newEdu = [...currentResume.education];
                                  newEdu[index].school = e.target.value;
                                  setFullResume({ education: newEdu });
                                }} />
                                <Input value={edu.degree} placeholder="Degree" onChange={(e) => {
                                  const newEdu = [...currentResume.education];
                                  newEdu[index].degree = e.target.value;
                                  setFullResume({ education: newEdu });
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                  <Input value={edu.startDate} placeholder="Start Date" onChange={(e) => {
                                    const newEdu = [...currentResume.education];
                                    newEdu[index].startDate = e.target.value;
                                    setFullResume({ education: newEdu });
                                  }} />
                                  <Input value={edu.endDate} placeholder="End Date" onChange={(e) => {
                                    const newEdu = [...currentResume.education];
                                    newEdu[index].endDate = e.target.value;
                                    setFullResume({ education: newEdu });
                                  }} />
                                </div>
                              </div>
                            ))}
                            <Button variant="outline" className="w-full dashed" onClick={() => useDocumentStore.getState().addEducation({
                              id: Math.random().toString(36).substr(2, 9),
                              school: '',
                              degree: '',
                              startDate: '',
                              endDate: '',
                            })}>
                              <Plus className="w-4 h-4 mr-2" /> Add Education
                            </Button>
                          </div>
                        )}

                        {section === 'Skills' && currentResume && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Technical Skills (comma separated)</Label>
                              <Textarea
                                value={currentResume.skills.technical.join(', ')}
                                placeholder="React, Node.js, TypeScript..."
                                onChange={(e) => updateSkills({
                                  ...currentResume.skills,
                                  technical: e.target.value.split(',').map(s => s.trim())
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Soft Skills (comma separated)</Label>
                              <Textarea
                                value={currentResume.skills.soft.join(', ')}
                                placeholder="Leadership, Communication, Problem Solving..."
                                onChange={(e) => updateSkills({
                                  ...currentResume.skills,
                                  soft: e.target.value.split(',').map(s => s.trim())
                                })}
                              />
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Preview Side */}
              <div className="xl:col-span-8">
                <div className="sticky top-24 h-[calc(100vh-160px)] rounded-3xl bg-white dark:bg-slate-900 border-8 border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
                  <div className="absolute top-6 right-6 z-10 flex gap-2">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-4 border border-slate-200 dark:border-slate-700">
                      <button onClick={() => setPreviewZoom(Math.max(40, previewZoom - 5))} className="hover:text-indigo-600 transition-colors font-black text-xl">−</button>
                      <span className="text-sm font-bold w-12 text-center">{previewZoom}%</span>
                      <button onClick={() => setPreviewZoom(Math.min(100, previewZoom + 5))} className="hover:text-indigo-600 transition-colors font-black text-xl">+</button>
                    </div>
                  </div>
                  <div className="h-full overflow-y-auto custom-scrollbar p-12 bg-slate-100/50 dark:bg-slate-900/50">
                    {currentResume ? (
                      <TemplateRenderer resume={currentResume} zoom={previewZoom / 100} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
                    )}
                  </div>
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
