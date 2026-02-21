'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { documentApi } from '@/lib/api/document';
import { resumeApi } from '@/lib/api/resume';
import { FileText, Download, Edit, Copy, Plus, Trash2, Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DocumentsPage() {
  const { data: docsData, isLoading: docsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentApi.getDocuments,
  });

  const { data: resumesData, isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeApi.getResumes,
  });

  const documents = docsData?.data?.documents || [];
  const resumes = resumesData?.data?.resumes || [];

  // Combine and format for display
  const allDocuments = [
    ...resumes.map((r: any) => ({
      id: r.id,
      title: r.title,
      category: 'Resume',
      lastModified: new Date(r.updatedAt),
      link: `/resume-builder?id=${r.id}`
    })),
    ...documents.map((d: any) => ({
      id: d.id,
      title: d.title,
      category: d.type.replace('_', ' '),
      lastModified: new Date(d.updatedAt),
      link: `/documents/${d.id}`
    }))
  ].sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

  if (docsLoading || resumesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Documents
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage all your career documents in one place
            </p>
          </div>
          <Link href="/resume-builder">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </Link>
        </motion.div>

        {/* Documents Grid */}
        {allDocuments.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {allDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                variants={itemVariants}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Document Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-indigo-600 dark:text-indigo-400 opacity-50" />
                </div>

                {/* Document Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 uppercase">
                    {doc.category}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                    Modified {doc.lastModified.toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={doc.link}>
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Download className="h-3 w-3 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No documents yet</h3>
            <p className="text-slate-500 mb-6">Create your first resume or cover letter to get started.</p>
            <Link href="/resume-builder">
              <Button>Create Now</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
