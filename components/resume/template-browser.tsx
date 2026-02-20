'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resumeTemplates, type ResumeTemplate } from '@/lib/resume-templates';
import { Eye } from 'lucide-react';

interface TemplateBrowserProps {
  onSelectTemplate?: (template: ResumeTemplate) => void;
  onViewTemplate?: (templateId: string) => void;
}

export function TemplateBrowser({
  onSelectTemplate,
  onViewTemplate,
}: TemplateBrowserProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Resume Templates
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Choose from our collection of professionally designed resume templates
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumeTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4 flex flex-col justify-between relative">
                {/* Template color preview */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})`,
                    }}
                  />
                </div>

                {/* Content preview */}
                <div className="relative z-10 space-y-2">
                  <div
                    className="w-full h-1 rounded"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  <div className="space-y-1">
                    <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-1.5 bg-slate-300 dark:bg-slate-700 rounded w-full" />
                  </div>
                </div>

                {/* Badge */}
                <div className="relative z-10">
                  <Badge
                    className="capitalize"
                    variant="secondary"
                  >
                    {template.category}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {onViewTemplate && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onViewTemplate(template.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                  {onSelectTemplate && (
                    <Button
                      size="sm"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
