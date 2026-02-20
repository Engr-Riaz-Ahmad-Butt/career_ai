'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobTable } from '@/components/job-tracker/job-table';
import { JobDetail } from '@/components/job-tracker/job-detail';
import { useJobTrackerStore } from '@/store/jobTrackerStore';
import { JobApplication } from '@/lib/job-tracker-data';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Plus, BarChart3, TrendingUp } from 'lucide-react';

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const jobs = useJobTrackerStore((state) => state.jobs);
  const stats = useJobTrackerStore((state) => state.stats);

  const getJobsByStatus = (status?: string) => {
    if (!status || status === 'all') return jobs;
    return jobs.filter((j) => j.status === status);
  };

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

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Job Tracker
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track all your job applications and interview progress
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                    {stats.total}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                    Interviews
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                    {stats.byStatus.interview}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    Offers
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                    {stats.byStatus.offer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20 border-rose-200 dark:border-rose-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rose-700 dark:text-rose-400 font-medium">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-1">
                    {stats.conversionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Job List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>View and manage all your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-4">
                    <TabsTrigger value="all">
                      All
                      <span className="ml-1 text-xs">{jobs.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="applied">
                      Applied
                      <span className="ml-1 text-xs">{stats.byStatus.applied}</span>
                    </TabsTrigger>
                    <TabsTrigger value="interview">
                      Interview
                      <span className="ml-1 text-xs">{stats.byStatus.interview}</span>
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected
                      <span className="ml-1 text-xs">{stats.byStatus.rejected}</span>
                    </TabsTrigger>
                    <TabsTrigger value="offer">
                      Offer
                      <span className="ml-1 text-xs">{stats.byStatus.offer}</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="space-y-4">
                    <JobTable
                      onSelectJob={(job) => setSelectedJob(job)}
                      onEditJob={(job) => setSelectedJob(job)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Position</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {selectedJob.jobTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Company</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {selectedJob.company}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">ATS Score</p>
                      <div className="mt-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${selectedJob.atsScore}%` }}
                        />
                      </div>
                      <p className="text-sm font-semibold mt-1 text-indigo-600 dark:text-indigo-400">
                        {selectedJob.atsScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Keyword Match</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {selectedJob.keywordMatch}%
                      </p>
                    </div>
                    <Button className="w-full mt-4" onClick={() => window.open(selectedJob.jobLink, '_blank')}>
                      View Full Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    Select a job to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
