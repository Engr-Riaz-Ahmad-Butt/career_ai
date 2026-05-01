'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, ChevronRight, ArrowLeft, Sparkles, Shield, Zap, Palette, GraduationCap, Briefcase, Code2, Building2, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

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
import { ResumeTemplate, ResumeData } from '@/types/resume';

// ── Template metadata ────────────────────────────────────────────────────────

type StyleTag = 'all' | 'ats-friendly' | 'modern' | 'creative' | 'executive' | 'simple';
type IndustryTag = 'all' | 'tech' | 'finance' | 'creative' | 'academic' | 'consulting' | 'general';

interface TemplateMeta {
  styles: StyleTag[];
  industries: IndustryTag[];
  badge?: { label: string; color: string };
  recommended?: boolean;
}

const TEMPLATE_META: Record<string, TemplateMeta> = {
  'simple-professional': {
    styles: ['ats-friendly', 'simple'],
    industries: ['general', 'finance', 'consulting'],
    badge: { label: 'Most Popular', color: 'indigo' },
    recommended: true,
  },
  'modern': {
    styles: ['modern'],
    industries: ['tech', 'creative'],
  },
  'classic': {
    styles: ['ats-friendly', 'simple'],
    industries: ['finance', 'consulting', 'general'],
  },
  'minimal': {
    styles: ['simple', 'ats-friendly'],
    industries: ['general', 'tech'],
  },
  'sidebar': {
    styles: ['modern'],
    industries: ['tech', 'creative', 'general'],
  },
  'executive': {
    styles: ['executive'],
    industries: ['consulting', 'finance'],
    badge: { label: 'Executive', color: 'amber' },
  },
  'two-column': {
    styles: ['modern'],
    industries: ['tech', 'creative'],
  },
  'ats-classic': {
    styles: ['ats-friendly'],
    industries: ['general', 'finance', 'consulting'],
    badge: { label: 'ATS Optimized', color: 'emerald' },
    recommended: true,
  },
  'creative': {
    styles: ['creative'],
    industries: ['creative'],
  },
  'harvard': {
    styles: ['ats-friendly', 'simple'],
    industries: ['academic', 'consulting', 'finance'],
    badge: { label: 'Harvard Style', color: 'rose' },
    recommended: true,
  },
  'tech': {
    styles: ['modern'],
    industries: ['tech'],
    badge: { label: 'Best for Engineers', color: 'sky' },
    recommended: true,
  },
  'clean-pro': {
    styles: ['simple', 'modern'],
    industries: ['general', 'tech'],
  },
  'europass': {
    styles: ['ats-friendly', 'simple'],
    industries: ['academic', 'general'],
    badge: { label: 'EU Standard', color: 'blue' },
  },
  'bold-leader': {
    styles: ['executive', 'modern'],
    industries: ['consulting', 'finance'],
    badge: { label: 'Senior Roles', color: 'orange' },
  },
};

const INDUSTRY_LABELS: Record<IndustryTag, string> = {
  all: 'All Industries',
  tech: 'Tech & Engineering',
  finance: 'Finance & Banking',
  creative: 'Creative & Design',
  academic: 'Academic & Research',
  consulting: 'Consulting & Strategy',
  general: 'General Purpose',
};

const INDUSTRY_ICONS: Record<IndustryTag, React.ElementType> = {
  all: Sparkles,
  tech: Code2,
  finance: Building2,
  creative: Palette,
  academic: GraduationCap,
  consulting: Briefcase,
  general: Zap,
};

const STYLE_FILTERS: { id: StyleTag; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ats-friendly', label: 'ATS Friendly' },
  { id: 'modern', label: 'Modern' },
  { id: 'executive', label: 'Executive' },
  { id: 'creative', label: 'Creative' },
  { id: 'simple', label: 'Simple' },
];

const BADGE_COLORS: Record<string, string> = {
  indigo: 'bg-indigo-600 text-white',
  amber: 'bg-amber-500 text-white',
  emerald: 'bg-emerald-600 text-white',
  rose: 'bg-rose-600 text-white',
  sky: 'bg-sky-600 text-white',
  blue: 'bg-blue-600 text-white',
  orange: 'bg-orange-600 text-white',
};

const INDUSTRY_PILL_COLORS: Record<IndustryTag, string> = {
  all: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  tech: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  finance: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  creative: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  academic: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  consulting: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  general: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
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

// ── Component ────────────────────────────────────────────────────────────────

interface TemplateGalleryProps {
  selectedTemplate: ResumeTemplate | null;
  onSelect: (template: ResumeTemplate) => void;
  onContinue: () => void;
  previewData?: ResumeData;
  onBack?: () => void;
  continueLabel?: string;
}

export function TemplateGallery({
  selectedTemplate,
  onSelect,
  onContinue,
  previewData,
  onBack,
  continueLabel = 'Use This Template',
}: TemplateGalleryProps) {
  const [styleFilter, setStyleFilter] = useState<StyleTag>('all');
  const [industryFilter, setIndustryFilter] = useState<IndustryTag>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return resumeTemplates.filter((t) => {
      const meta = TEMPLATE_META[t.id];
      if (!meta) return true;
      const matchStyle = styleFilter === 'all' || meta.styles.includes(styleFilter);
      const matchIndustry = industryFilter === 'all' || meta.industries.includes(industryFilter);
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
      return matchStyle && matchIndustry && matchSearch;
    });
  }, [styleFilter, industryFilter, search]);

  const recommended = resumeTemplates.filter((t) => TEMPLATE_META[t.id]?.recommended);

  return (
    <div className="min-h-screen bg-[#f6f5f2] dark:bg-slate-950 pb-24">

      {/* ── Sticky Header ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[61px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Choose a Template</h2>
                <p className="text-xs text-slate-400 mt-0.5">{resumeTemplates.length} industry-standard templates · your data stays safe when switching</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-500 w-48">
                <Search className="w-4 h-4 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="bg-transparent outline-none w-full text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                />
              </div>
              <Button
                onClick={onContinue}
                disabled={!selectedTemplate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-10 font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
              >
                {selectedTemplate ? continueLabel : 'Select a template'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ── Style filter pills ── */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {STYLE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStyleFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  styleFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.id === 'ats-friendly' && <Shield className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}
                {f.label}
              </button>
            ))}
          </div>

          {/* ── Industry filter row ── */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {(Object.entries(INDUSTRY_LABELS) as [IndustryTag, string][]).map(([id, label]) => {
              const Icon = INDUSTRY_ICONS[id];
              return (
                <button
                  key={id}
                  onClick={() => setIndustryFilter(id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                    industryFilter === id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                      : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* ── Recommended strip (only when no filter is active) ── */}
        {styleFilter === 'all' && industryFilter === 'all' && !search && (
          <div className="pt-8 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Top Picks</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommended.map((template) => {
                const PreviewComponent = PREVIEW_MAP[template.id];
                const meta = TEMPLATE_META[template.id];
                const isSelected = selectedTemplate?.id === template.id;
                return (
                  <motion.button
                    key={template.id}
                    whileHover={{ y: -3 }}
                    onClick={() => onSelect(template)}
                    className={`relative rounded-2xl overflow-hidden text-left transition-all duration-200 ${
                      isSelected
                        ? 'ring-4 ring-indigo-500 ring-offset-2 shadow-2xl'
                        : 'hover:shadow-xl shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {meta?.badge && (
                      <div className={`absolute top-2 left-2 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full ${BADGE_COLORS[meta.badge.color]}`}>
                        {meta.badge.label}
                      </div>
                    )}
                    <div className="h-44 bg-slate-50 dark:bg-slate-800 overflow-hidden flex justify-center items-start pt-3 relative">
                      <div className="origin-top scale-[0.22] pointer-events-none">
                        {PreviewComponent && <PreviewComponent template={template} data={previewData} isSelected={isSelected} />}
                      </div>
                      <div className={`absolute inset-0 bg-indigo-600/10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </div>
                    <div className={`px-3 py-2 border-t ${isSelected ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                      <p className={`text-xs font-bold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>{template.name}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-8 mb-2 h-px bg-slate-200 dark:bg-slate-800" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 mb-1">All Templates</p>
          </div>
        )}

        {/* ── Main Grid ── */}
        <div className={`${styleFilter === 'all' && industryFilter === 'all' && !search ? 'pt-2' : 'pt-8'}`}>
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <p className="text-slate-400 text-lg font-semibold mb-2">No templates match your filters.</p>
                <button
                  onClick={() => { setStyleFilter('all'); setIndustryFilter('all'); setSearch(''); }}
                  className="text-indigo-600 text-sm underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${styleFilter}-${industryFilter}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filtered.map((template, index) => {
                  const PreviewComponent = PREVIEW_MAP[template.id];
                  const meta = TEMPLATE_META[template.id];
                  const isSelected = selectedTemplate?.id === template.id;

                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                      onClick={() => onSelect(template)}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 bg-white dark:bg-slate-900 ${
                        isSelected
                          ? 'ring-4 ring-indigo-500 ring-offset-2 shadow-2xl scale-[1.02]'
                          : 'hover:shadow-xl hover:scale-[1.01] shadow-sm'
                      }`}
                    >
                      {/* Badge */}
                      {meta?.badge && (
                        <div className={`absolute top-3 left-3 z-20 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow ${BADGE_COLORS[meta.badge.color]}`}>
                          {meta.badge.label}
                        </div>
                      )}

                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 z-20 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      {/* Preview area */}
                      <div className="h-64 bg-slate-50 dark:bg-slate-800/60 overflow-hidden flex justify-center items-start pt-4 relative">
                        <div className="origin-top scale-[0.24] pointer-events-none drop-shadow-xl">
                          {PreviewComponent && (
                            <PreviewComponent template={template} data={previewData} isSelected={isSelected} />
                          )}
                        </div>
                        {/* Hover / selected overlay */}
                        <div className={`absolute inset-0 transition-opacity duration-200 ${
                          isSelected
                            ? 'bg-indigo-600/8 opacity-100'
                            : 'bg-slate-900/5 opacity-0 group-hover:opacity-100'
                        }`} />
                        {/* Select prompt on hover */}
                        {!isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                              Click to select
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card footer */}
                      <div className={`p-4 border-t ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-100 dark:border-indigo-900'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                      }`}>
                        <div className="flex items-start justify-between mb-1.5">
                          <h3 className={`font-bold text-sm ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>
                            {template.name}
                          </h3>
                          {meta?.styles.includes('ats-friendly') && (
                            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                              <Shield className="w-2.5 h-2.5" /> ATS
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mb-2.5 line-clamp-2">
                          {template.description}
                        </p>
                        {/* Industry pills */}
                        <div className="flex flex-wrap gap-1">
                          {meta?.industries.slice(0, 3).map((ind) => (
                            <span
                              key={ind}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${INDUSTRY_PILL_COLORS[ind]}`}
                            >
                              {INDUSTRY_LABELS[ind]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Floating selected bar ── */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-6 py-3.5 shadow-2xl border border-slate-800 dark:border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-sm">{selectedTemplate.name}</span>
                <span className="text-slate-400 dark:text-slate-500 text-sm">selected</span>
              </div>
              <div className="w-px h-5 bg-slate-700 dark:bg-slate-300" />
              <button
                onClick={onContinue}
                className="flex items-center gap-1.5 text-sm font-bold text-indigo-400 dark:text-indigo-600 hover:text-indigo-300 dark:hover:text-indigo-500 transition-colors"
              >
                {continueLabel} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
