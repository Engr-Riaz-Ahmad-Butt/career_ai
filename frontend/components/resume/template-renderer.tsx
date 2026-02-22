'use client';

import { ResumeData } from '@/store/documentStore';
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

interface TemplateRendererProps {
  resume: ResumeData;
  zoom?: number;
}

const previewMap: Record<string, React.ComponentType<any>> = {
  'classic-professional': ClassicProfessionalPreview,
  'modern-tech': ModernTechPreview,
  'minimalist-clean': MinimalistCleanPreview,
  'creative-designer': CreativeDesignerPreview,
  'executive-elegant': ExecutiveElegantPreview,
  'startup-vibrant': StartupVibrantPreview,
  'academic-structured': AcademicStructuredPreview,
  'gradient-modern': GradientModernPreview,
};

export function TemplateRenderer({ resume, zoom = 1 }: TemplateRendererProps) {
  const PreviewComponent = previewMap[resume.template.id];

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
        template={resume.template}
        data={resume}
        isSelected={false}
      />
    </div>
  );
}
