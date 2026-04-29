'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Mail,
  GraduationCap,
  User,
  Mic,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { StatsCard } from '@/components/common/StatsCard';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useDocumentsLibrary } from '@/hooks/useDocumentsLibrary';
import { fadeInContainer, fadeInItem } from '@/lib/animations';
import apiClient from '@/lib/api/client';



const quickCreateItems = [
  {
    icon: FileText,
    label: 'Resume',
    description: 'Build or upload your CV',
    href: '/resume-builder/new',
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badge: 'Most Popular',
  },
  {
    icon: Mail,
    label: 'Cover Letter',
    description: 'Generate in seconds with AI',
    href: '/cover-letters/new',
    gradient: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    iconColor: 'text-sky-600 dark:text-sky-400',
    badge: null,
  },
  {
    icon: GraduationCap,
    label: 'SOP',
    description: 'For university applications',
    href: '/sop',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badge: null,
  },
  {
    icon: User,
    label: 'Bio Generator',
    description: 'LinkedIn, Twitter & more',
    href: '/bio-generator',
    gradient: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    iconColor: 'text-orange-600 dark:text-orange-400',
    badge: null,
  },
  {
    icon: Mic,
    label: 'Interview Prep',
    description: 'Practice with AI feedback',
    href: '/interview-prep',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badge: 'New',
  },
  {
    icon: Sparkles,
    label: 'AI Tailor',
    description: 'Match resume to any job',
    href: '/tailor',
    gradient: 'from-teal-500 to-fuchsia-600',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badge: null,
  },
];

const typeIconMap: Record<string, React.ElementType> = {
  Resume: FileText,
  'Cover Letter': Mail,
  SOP: GraduationCap,
  'Study Plan': GraduationCap,
  'Motivation Letter': Mail,
};

const typeColorMap: Record<string, string> = {
  Resume: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  'Cover Letter': 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
  SOP: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { items: allRecentDocs, isLoading: isDocsLoading } = useDocumentsLibrary();
  const recentDocuments = allRecentDocs.slice(0, 3);

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.get('/dashboard/stats').then((r) => r.data.data),
  });

  const { data: jobStats, isLoading: isJobStatsLoading } = useQuery({
    queryKey: ['job-tracker', 'stats'],
    queryFn: () => apiClient.get('/job-tracker/stats').then((r) => r.data.data),
    initialData: { total: 0, byStatus: { applied: 0, interview: 0, rejected: 0, offer: 0 }, conversionRate: 0 },
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
      <motion.div
        className="max-w-6xl mx-auto space-y-10 mt-8"
      variants={fadeInContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInItem}>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          What do you want to accomplish today?
        </p>
      </motion.div>

      {/* ── ZONE 1: Quick Create ── */}
      <motion.section variants={fadeInItem}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          Quick Create
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickCreateItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-5 rounded-2xl border border-slate-100 dark:border-slate-800 ${item.bg} cursor-pointer group transition-all duration-200 hover:shadow-lg hover:border-transparent`}
                >
                  {item.badge && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white dark:bg-slate-900 shadow-sm ${item.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                  <div className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${item.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Start <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* ── ZONE 2: Recent Documents ── */}
      <motion.section variants={fadeInItem}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Continue Where You Left Off
          </h2>
          <Link href="/documents">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {isDocsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : recentDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDocuments.map((doc) => {
              const DocIcon = typeIconMap[doc.category] ?? FileText;
              const colorClass = typeColorMap[doc.category] ?? 'bg-slate-100 text-slate-600';
              return (
                <motion.div
                  key={doc.id}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <DocIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{doc.title}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {doc.category} · {new Date(doc.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <Link href={doc.link} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-lg">
                      Continue
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-sm">No documents yet. Create something above to get started!</p>
          </div>
        )}
      </motion.section>

      {/* ── ZONE 3: Stats ── */}
      <motion.section variants={fadeInItem}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={Briefcase}
            label="Active Applications"
            value={jobStats.total}
            change={jobStats.byStatus.applied}
            changeLabel="applied"
            trend="up"
          />
          <StatsCard
            icon={CheckCircle2}
            label="Conversion Rate"
            value={`${jobStats.conversionRate.toFixed(1)}%`}
            change={0}
            changeLabel="this month"
            trend="up"
          />
          <StatsCard
            icon={BarChart3}
            label="Avg Resume Score"
            value={`${stats?.avgAtsScore ?? 0}/100`}
            change={0}
            changeLabel="overall"
            trend="up"
          />
          <StatsCard
            icon={TrendingUp}
            label="Offers Received"
            value={jobStats.byStatus.offer}
            change={0}
            changeLabel="congratulations!"
            trend="up"
          />
        </div>
      </motion.section>
    </motion.div>
  );
}
