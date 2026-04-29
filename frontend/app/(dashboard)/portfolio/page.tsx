'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Github, Zap, Plus, ExternalLink, RefreshCw, Trash2, CheckCircle, AlertCircle, Loader2, Copy, Check
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import toast from 'react-hot-toast';

import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';

interface Portfolio {
  id: string;
  resumeId?: string;
  theme: string;
  deployStatus: 'PENDING' | 'DEPLOYED' | 'FAILED';
  liveUrl?: string;
  lastDeployedAt?: string;
  createdAt: string;
}

interface Resume {
  id: string;
  title: string;
}

const THEMES = ['MINIMAL', 'MODERN', 'CREATIVE', 'DARK', 'ACADEMIC'];

function StatusBadge({ status }: { status: Portfolio['deployStatus'] }) {
  if (status === 'DEPLOYED') return (
    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
      <CheckCircle className="h-3.5 w-3.5" /> Live
    </span>
  );
  if (status === 'FAILED') return (
    <span className="flex items-center gap-1.5 text-rose-500 text-xs font-semibold">
      <AlertCircle className="h-3.5 w-3.5" /> Failed
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Pending
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-slate-400 hover:text-slate-600 transition-colors">
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function PortfolioPageContent() {
  const searchParams = useSearchParams();
  const user = useAuthStore(s => s.user);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // form state
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('MODERN');
  const [isCreating, setIsCreating] = useState(false);

  const hasGithub = !!(user as any)?.githubToken || !!(user as any)?.githubUsername;
  const hasVercel = !!(user as any)?.vercelToken;

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pRes, rRes] = await Promise.all([
        apiClient.get('/portfolio'),
        apiClient.get('/resumes?limit=50'),
      ]);
      setPortfolios(pRes.data.data?.portfolios ?? []);
      setResumes(rRes.data.data?.resumes ?? []);
    } catch {
      toast.error('Failed to load portfolios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (searchParams.get('vercel') === 'connected') {
      toast.success('Vercel connected successfully!');
    }
  }, [fetchData, searchParams]);

  const handleCreate = async () => {
    if (!selectedResume) return toast.error('Please select a resume');
    setIsCreating(true);
    try {
      await apiClient.post('/portfolio/generate', { resumeId: selectedResume, theme: selectedTheme });
      toast.success('Portfolio created! Now deploy it.');
      setShowCreateModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create portfolio');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeploy = async (portfolio: Portfolio) => {
    if (!hasGithub) return toast.error('Please connect your GitHub account first');
    if (!hasVercel) return toast.error('Please connect your Vercel account first');
    setDeployingId(portfolio.id);
    try {
      const { data } = await apiClient.post(`/portfolio/${portfolio.id}/deploy`);
      toast.success('Portfolio deployed! 🎉');
      setPortfolios(prev => prev.map(p => p.id === portfolio.id ? data.data.portfolio : p));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Deployment failed');
    } finally {
      setDeployingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this portfolio?')) return;
    try {
      await apiClient.delete(`/portfolio/${id}`);
      setPortfolios(prev => prev.filter(p => p.id !== id));
      toast.success('Portfolio deleted');
    } catch {
      toast.error('Failed to delete portfolio');
    }
  };

  return (
    <FeatureErrorBoundary featureName="Portfolio">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Portfolio</h1>
              <p className="text-slate-500 dark:text-slate-400">Deploy your AI-generated portfolio to the web in one click</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-teal-600 hover:opacity-90 text-white gap-2"
            >
              <Plus className="h-4 w-4" /> New Portfolio
            </Button>
          </motion.div>

          {/* Account Connection Status */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* GitHub */}
            <div className={`p-4 rounded-2xl border flex items-center gap-4 ${hasGithub ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'}`}>
              <Github className={`h-7 w-7 ${hasGithub ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">GitHub</p>
                <p className="text-xs text-slate-500">{hasGithub ? 'Connected ✓' : 'Required for deployment'}</p>
              </div>
              {!hasGithub && (
                <a href="/auth/github" className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity">
                  Connect
                </a>
              )}
            </div>

            {/* Vercel */}
            <div className={`p-4 rounded-2xl border flex items-center gap-4 ${hasVercel ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'}`}>
              <Zap className={`h-7 w-7 ${hasVercel ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Vercel</p>
                <p className="text-xs text-slate-500">{hasVercel ? 'Connected ✓' : 'Required for deployment'}</p>
              </div>
              {!hasVercel && (
                <a href={`${apiBase}/auth/vercel/connect`} className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity">
                  Connect
                </a>
              )}
            </div>
          </motion.div>

          {/* Portfolio List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : portfolios.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Globe className="h-14 w-14 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-lg mb-2">No portfolios yet</h3>
              <p className="text-slate-500 text-sm mb-6">Create your first portfolio and deploy it live with one click</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Plus className="h-4 w-4" /> Create Portfolio
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {portfolios.map((portfolio, i) => (
                <motion.div
                  key={portfolio.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg">
                        {portfolio.theme}
                      </span>
                      <StatusBadge status={portfolio.deployStatus} />
                    </div>
                    {portfolio.liveUrl && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500 truncate font-mono">{portfolio.liveUrl}</span>
                        <CopyButton text={portfolio.liveUrl} />
                        <a href={portfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 text-slate-400 hover:text-indigo-600 transition-colors" />
                        </a>
                      </div>
                    )}
                    {portfolio.lastDeployedAt && (
                      <p className="text-xs text-slate-400 mt-1">Last deployed: {new Date(portfolio.lastDeployedAt).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeploy(portfolio)}
                      disabled={deployingId === portfolio.id}
                      className="gap-2"
                    >
                      {deployingId === portfolio.id ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Deploying...</>
                      ) : (
                        <><RefreshCw className="h-4 w-4" /> {portfolio.deployStatus === 'DEPLOYED' ? 'Redeploy' : 'Deploy'}</>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(portfolio.id)}
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">New Portfolio</h2>
              <p className="text-slate-500 text-sm mb-6">Select a resume and a theme to generate your portfolio</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resume</label>
                  <select
                    value={selectedResume}
                    onChange={e => setSelectedResume(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="">Select a resume...</option>
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {THEMES.map(theme => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`py-2 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${
                          selectedTheme === theme
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-teal-600 hover:opacity-90 text-white"
                    onClick={handleCreate}
                    disabled={isCreating || !selectedResume}
                  >
                    {isCreating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : 'Create Portfolio'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FeatureErrorBoundary>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <PortfolioPageContent />
    </Suspense>
  );
}
