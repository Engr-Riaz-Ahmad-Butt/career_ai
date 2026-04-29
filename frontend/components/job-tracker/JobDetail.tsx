'use client';

import { motion } from 'framer-motion';
import { ExternalLink, DollarSign, TrendingUp, FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStatusColor, getStatusIcon } from '@/lib/jobTrackerData';

interface JobDetailProps {
  job: any;
}

export function JobDetail({ job }: JobDetailProps) {
  const appliedDate = new Date(job.appliedAt || job.appliedDate || job.createdAt);
  const interviewNotes = job.interviewNotes || [];
  const interviewDates = job.interviewDates || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{job.title || job.jobTitle}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{job.company}</p>
        </div>
        <Badge className={`${getStatusColor(job.status)} text-base px-3 py-1`}>
          {getStatusIcon(job.status)} {job.status}
        </Badge>
      </div>

      {/* Quick Links & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="justify-start h-auto p-3"
          onClick={() => {
              const url = job.url || job.jobLink;
              if (url) window.open(url, '_blank');
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          <span className="text-left">
            <div className="text-sm font-medium">View Job Post</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Open in browser</div>
          </span>
        </Button>

        <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium">ATS Score</span>
              </div>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {job.atsScore || 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Keyword Match</span>
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {job.keywordMatch || 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interviews">
            Interviews ({interviewDates.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Applied Date</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {appliedDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Days Since Applied</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {Math.floor(
                      (new Date().getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24)
                    )}
                    days
                  </p>
                </div>
              </div>

              {job.tailoredResumeId && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Tailored Resume:</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {job.tailoredResumeId}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
           <p className="text-slate-600 dark:text-slate-400 p-4">Interview management coming soon.</p>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
              <CardDescription>View personal notes about this opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              {job.notes || (interviewNotes.length > 0 ? (
                <div className="space-y-3">
                  {interviewNotes.map((note: any) => (
                    <div
                      key={note.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Round {note.round}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(note.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-900 dark:text-white mb-2">{note.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">No notes yet</p>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Salary Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Salary</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {typeof job.salary === 'string' ? job.salary : `$${job.salary?.expected?.toLocaleString() || 'N/A'}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
