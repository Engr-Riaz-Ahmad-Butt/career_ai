'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';
import { LoadingState } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { documentApi } from '@/lib/api/endpoints/document.api';
import { queryKeys } from '@/lib/queryKeys';

function useSOPs() {
    return useQuery({
        queryKey: queryKeys.documents.byType('SOP'),
        queryFn: () => documentApi.list({ type: 'SOP' }),
    });
}

export default function SopPage() {
    const { data, isLoading } = useSOPs();
    const sops = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingState size="lg" />
            </div>
        );
    }

    return (
        <FeatureErrorBoundary featureName="SOP & Scholarship">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">SOP & Scholarship</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Statements of purpose and scholarship essays.</p>
                    </div>
                    <Link href="/sop/new">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl font-bold">
                            <Plus className="h-4 w-4" /> Create New
                        </Button>
                    </Link>
                </div>

                {sops.length > 0 ? (
                    <div className="space-y-3">
                        {sops.map((sop) => (
                            <motion.div
                                key={sop.id}
                                whileHover={{ y: -1 }}
                                className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{sop.title}</p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            Updated {new Date(sop.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <Link href={`/sop/${sop.id}`}>
                                    <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
                                        Open <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No documents yet. Start writing your SOP!</p>
                        <Link href="/sop/new">
                            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                                <Plus className="h-4 w-4" /> Generate your first
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </FeatureErrorBoundary>
    );
}
