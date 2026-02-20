'use client';

import { useState } from 'react';
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
import { Plus, Trash2, Zap, Eye, Download, Palette } from 'lucide-react';

const sections = ['Contact', 'Summary', 'Experience', 'Education', 'Skills', 'Certifications'];

export default function ResumeBuilderPage() {
  const [previewZoom, setPreviewZoom] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showNewResume, setShowNewResume] = useState(true);

  const currentResume = useDocumentStore((state) => state.currentResume);
  const createResume = useDocumentStore((state) => state.createResume);
  const updateTemplate = useDocumentStore((state) => state.updateTemplate);

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
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  // Show template selector if no resume is created yet
  if (showNewResume) {
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create New Resume
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Choose a template to get started
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TemplateSelector
            isOpen={true}
            onClose={() => { }}
            onSelect={handleCreateResume}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Resume Builder
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create an ATS-optimized resume with AI guidance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-6">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Progress
                  </h3>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    4 of 6 completed
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '66%' }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Sections */}
              <Accordion type="single" collapsible defaultValue="contact">
                {sections.map((section) => (
                  <AccordionItem key={section} value={section.toLowerCase()}>
                    <AccordionTrigger className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      {section}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {section === 'Contact' && (
                        <>
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input placeholder="John Doe" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input type="email" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input placeholder="+1 (555) 123-4567" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input placeholder="San Francisco, CA" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>LinkedIn</Label>
                              <Input placeholder="linkedin.com/in/johndoe" />
                            </div>
                            <div className="space-y-2">
                              <Label>Portfolio</Label>
                              <Input placeholder="johndoe.com" />
                            </div>
                          </div>
                        </>
                      )}

                      {section === 'Summary' && (
                        <div className="space-y-2">
                          <Label>Professional Summary</Label>
                          <Textarea
                            placeholder="Write a compelling summary of your professional background..."
                            className="min-h-24"
                          />
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Zap className="h-4 w-4 mr-1" />
                              AI Enhance
                            </Button>
                          </div>
                        </div>
                      )}

                      {section === 'Experience' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input placeholder="Google" />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Input placeholder="Senior Software Engineer" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Start Date</Label>
                              <Input type="month" />
                            </div>
                            <div className="space-y-2">
                              <Label>End Date</Label>
                              <Input type="month" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe your responsibilities and achievements..."
                              className="min-h-20"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Experience
                            </Button>
                            <Button variant="outline" size="sm" className="text-rose-600">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}

                      {section === 'Education' && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Education section content...
                        </div>
                      )}

                      {section === 'Skills' && (
                        <div className="space-y-2">
                          <Label>Skills (comma-separated)</Label>
                          <Textarea
                            placeholder="e.g., React, TypeScript, Node.js, GraphQL..."
                            className="min-h-20"
                          />
                        </div>
                      )}

                      {section === 'Certifications' && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Certifications section content...
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>

          {/* Right Panel - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sticky top-24 space-y-4">
              {/* Template Info & Selector */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-semibold">Current Template</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {currentResume?.template.name}
                  </p>
                </div>
                <Button
                  onClick={() => setShowTemplateSelector(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Change Template
                </Button>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Zoom</Label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewZoom(Math.max(50, previewZoom - 10))}
                    className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    −
                  </button>
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-12 text-center">
                    {previewZoom}%
                  </span>
                  <button
                    onClick={() => setPreviewZoom(Math.min(150, previewZoom + 10))}
                    className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Resume Preview */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800 min-h-96 flex items-center justify-center overflow-hidden">
                {currentResume ? (
                  <TemplateRenderer resume={currentResume} zoom={previewZoom} />
                ) : (
                  <div className="text-slate-500 text-sm">No resume selected</div>
                )}
              </div>

              {/* Save & Download */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isSaving ? 'Saving...' : 'Save Resume'}
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Template Selector Modal */}
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelect={handleChangeTemplate}
          selectedTemplateId={currentResume?.template.id}
        />
      </div>
    </>
  );
}
