'use client';

import { resumeTemplates } from '@/lib/resumeTemplates';
import { ResumeData } from '@/types/resume';

import { 
  SimpleProfessionalPreview,
  ModernTemplatePreview,
  ClassicTemplatePreview,
  MinimalTemplatePreview,
  SidebarTemplatePreview,
  ExecutiveTemplatePreview,
  CreativeTemplatePreview,
  TwoColumnTemplatePreview,
  AtsClassicTemplatePreview
} from './templates';

interface TemplateRendererProps {
  resume: ResumeData;
  zoom?: number;
}

const previewMap: Record<string, React.ComponentType<any>> = {
  'simple-professional': SimpleProfessionalPreview,
  'modern': ModernTemplatePreview,
  'classic': ClassicTemplatePreview,
  'minimal': MinimalTemplatePreview,
  'sidebar': SidebarTemplatePreview,
  'executive': ExecutiveTemplatePreview,
  'creative': CreativeTemplatePreview,
  'two-column': TwoColumnTemplatePreview,
  'ats-classic': AtsClassicTemplatePreview
};

export function TemplateRenderer({ resume, zoom = 1 }: TemplateRendererProps) {
  const templateObject = resumeTemplates.find(t => t.id === resume.template) || resumeTemplates[0];
  const PreviewComponent = previewMap[resume.template];

  if (!PreviewComponent) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        Template not found
      </div>
    );
  }

  return (
    <div
      style={{ transform: `scale(${zoom})` }}
      className="origin-top flex justify-center w-full"
    >
      <PreviewComponent
        template={templateObject}
        data={resume}
        isSelected={false}
      />
    </div>
  );
}
