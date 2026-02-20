'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { mockDocuments } from '@/lib/mock-data';
import { FileText, Download, Edit, Copy, Plus, Trash2 } from 'lucide-react';

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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mockDocuments.map((doc) => (
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
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  {doc.category}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                  Modified {doc.lastModified.toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
