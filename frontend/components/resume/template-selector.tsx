'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resumeTemplates, ResumeTemplate } from '@/lib/resume-templates';
import {
  ClassicProfessionalPreview,
  ModernTechPreview,
  MinimalistCleanPreview,
  CreativeDesignerPreview,
  ExecutiveElegantPreview,
  StartupVibrantPreview,
  AcademicStructuredPreview,
  GradientModernPreview,
} from './template-preview';
import { X, Check } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: ResumeTemplate) => void;
  selectedTemplateId?: string;
}

const previewMap: Record<string, React.ComponentType<{ template: ResumeTemplate; isSelected: boolean }>> = {
  'classic-professional': ClassicProfessionalPreview,
  'modern-tech': ModernTechPreview,
  'minimalist-clean': MinimalistCleanPreview,
  'creative-designer': CreativeDesignerPreview,
  'executive-elegant': ExecutiveElegantPreview,
  'startup-vibrant': StartupVibrantPreview,
  'academic-structured': AcademicStructuredPreview,
  'gradient-modern': GradientModernPreview,
};

const categories = ['classic', 'modern', 'minimal', 'creative'] as const;

export function TemplateSelector({
  isOpen,
  onClose,
  onSelect,
  selectedTemplateId,
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<typeof categories[number]>('modern');

  const filteredTemplates = resumeTemplates.filter(
    (t) => t.category === selectedCategory
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-950 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Choose Resume Template
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Select a template to get started. You can change it anytime.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, index) => {
                  const PreviewComponent = previewMap[template.id];
                  const isSelected = selectedTemplateId === template.id;

                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group cursor-pointer"
                      onClick={() => onSelect(template)}
                    >
                      <div
                        className={`rounded-lg border-2 transition-all overflow-hidden ${isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 group-hover:border-indigo-300 dark:group-hover:border-indigo-700'
                          }`}
                      >
                        <div className="h-72 bg-slate-50 dark:bg-slate-900 overflow-hidden relative group">
                          {PreviewComponent && (
                            <div className="absolute inset-0 flex justify-center origin-top scale-[0.25] transition-transform group-hover:scale-[0.28]">
                              <PreviewComponent
                                template={template}
                                isSelected={isSelected}
                              />
                            </div>
                          )}
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-black/20 flex items-center justify-center"
                            >
                              <motion.div
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                className="bg-indigo-600 rounded-full p-3"
                              >
                                <Check className="w-6 h-6 text-white" />
                              </motion.div>
                            </motion.div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            {template.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {template.description}
                          </p>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {template.features.slice(0, 2).map((feature) => (
                              <Badge
                                key={feature}
                                variant="secondary"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          {/* Select Button */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(template);
                            }}
                            className={`w-full mt-4 transition-all ${isSelected
                              ? 'bg-indigo-600 hover:bg-indigo-700'
                              : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                              }`}
                          >
                            {isSelected ? 'Selected' : 'Select Template'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-6 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={onClose}
              >
                Continue with Selected
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import * as React from 'react';
