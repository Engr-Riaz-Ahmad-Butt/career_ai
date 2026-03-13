'use client';

import { motion } from 'framer-motion';
import { Check, Crown, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import {
    SimpleProfessionalPreview,
    ModernTemplatePreview,
    ClassicTemplatePreview,
    MinimalTemplatePreview,
    SidebarTemplatePreview,
    ExecutiveTemplatePreview,
    CreativeTemplatePreview,
    TwoColumnTemplatePreview,
    AtsClassicTemplatePreview,
    HarvardTemplatePreview,
    TechTemplatePreview,
    CleanProTemplatePreview,
    EuropassTemplatePreview,
    BoldLeaderTemplatePreview,
} from '@/components/resume/templates';
import { Button } from '@/components/ui/button';
import { resumeTemplates } from '@/lib/resumeTemplates';
import { ResumeTemplate } from '@/types/resume';
import { ResumeData } from '@/types/resume';

type FilterStyle = 'all' | 'ats-friendly' | 'modern' | 'creative' | 'executive' | 'simple';

const FILTERS: { id: FilterStyle; label: string }[] = [
    { id: 'all', label: 'All Templates' },
    { id: 'ats-friendly', label: 'ATS Friendly' },
    { id: 'modern', label: 'Modern' },
    { id: 'creative', label: 'Creative' },
    { id: 'executive', label: 'Executive' },
    { id: 'simple', label: 'Simple' },
];

const TEMPLATE_STYLES: Record<string, FilterStyle[]> = {
    'simple-professional': ['ats-friendly', 'simple'],
    'modern': ['modern'],
    'classic': ['ats-friendly'],
    'minimal': ['simple', 'ats-friendly'],
    'sidebar': ['modern'],
    'executive': ['executive'],
    'two-column': ['modern'],
    'ats-classic': ['ats-friendly'],
    'creative': ['creative'],
    'harvard': ['ats-friendly', 'simple'],
    'tech': ['modern'],
    'clean-pro': ['simple', 'modern'],
    'europass': ['ats-friendly', 'simple'],
    'bold-leader': ['executive', 'modern'],
};

const PREVIEW_MAP: Record<string, React.ComponentType<any>> = {
    'simple-professional': SimpleProfessionalPreview,
    'modern': ModernTemplatePreview,
    'classic': ClassicTemplatePreview,
    'minimal': MinimalTemplatePreview,
    'sidebar': SidebarTemplatePreview,
    'executive': ExecutiveTemplatePreview,
    'creative': CreativeTemplatePreview,
    'two-column': TwoColumnTemplatePreview,
    'ats-classic': AtsClassicTemplatePreview,
    'harvard': HarvardTemplatePreview,
    'tech': TechTemplatePreview,
    'clean-pro': CleanProTemplatePreview,
    'europass': EuropassTemplatePreview,
    'bold-leader': BoldLeaderTemplatePreview,
};

interface TemplateGalleryProps {
    selectedTemplate: ResumeTemplate | null;
    onSelect: (template: ResumeTemplate) => void;
    onContinue: () => void;
    previewData?: ResumeData;
    onBack?: () => void;
    continueLabel?: string;
}

export function TemplateGallery({ selectedTemplate, onSelect, onContinue, previewData, onBack, continueLabel = 'Continue with this design' }: TemplateGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<FilterStyle>('all');

    const filtered = resumeTemplates.filter((t) => {
        if (activeFilter === 'all') return true;
        return TEMPLATE_STYLES[t.id]?.includes(activeFilter);
    });

    return (
        <div className="min-h-screen bg-[#f8f7f4] dark:bg-slate-950 pb-24">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[61px] z-40 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">Choose a Template</h2>
                            <p className="text-sm text-slate-500">Click to select, switch freely — your data is never affected</p>
                        </div>
                    </div>
                    <Button
                        onClick={onContinue}
                        disabled={!selectedTemplate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-11 font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        {continueLabel} <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Filter tabs */}
                <div className="max-w-7xl mx-auto mt-4 flex gap-2 flex-wrap">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeFilter === filter.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((template, index) => {
                        const PreviewComponent = PREVIEW_MAP[template.id];
                        const isSelected = selectedTemplate?.id === template.id;
                        const isPro = false; // All free for now; set to true for pro templates

                        return (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => onSelect(template)}
                                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected
                                    ? 'ring-4 ring-indigo-500 ring-offset-2 shadow-2xl scale-[1.02]'
                                    : 'hover:shadow-xl hover:scale-[1.01]'
                                    }`}
                            >
                                {/* Pro badge */}
                                {isPro && (
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                                        <Crown className="w-3 h-3" />
                                        Pro
                                    </div>
                                )}

                                {/* Selected checkmark */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                {/* Preview */}
                                <div className="h-72 bg-slate-100 dark:bg-slate-800 overflow-hidden flex justify-center pt-6 relative">
                                    <div className="origin-top scale-[0.22] shadow-2xl pointer-events-none">
                                        {PreviewComponent && (
                                            <PreviewComponent template={template} data={previewData} isSelected={isSelected} />
                                        )}
                                    </div>
                                    {/* Hover overlay */}
                                    <div className={`absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`} />
                                </div>

                                {/* Footer */}
                                <div className={`p-4 border-t ${isSelected ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                                    <h3 className={`font-bold text-sm ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>
                                        {template.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{template.description}</p>
                                    {/* Style tags */}
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {TEMPLATE_STYLES[template.id]?.map((style) => (
                                            <span key={style} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full capitalize">
                                                {style.replace('-', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <p className="text-lg font-semibold">No templates match this filter.</p>
                        <button onClick={() => setActiveFilter('all')} className="mt-3 text-indigo-600 underline text-sm">
                            Show all templates
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
