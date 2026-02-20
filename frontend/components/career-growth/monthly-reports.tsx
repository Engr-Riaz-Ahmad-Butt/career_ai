'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCareerGrowthStore, MonthlyReport } from '@/store/careerGrowthStore';
import { Download, TrendingUp, Award, Book, Zap } from 'lucide-react';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface MonthlyReportProps {
  report: MonthlyReport;
}

export function MonthlyReportCard({ report }: MonthlyReportProps) {
  const handleDownload = () => {
    // Generate PDF or download logic
    console.log('Downloading report:', report.id);
  };

  return (
    <motion.div variants={item} initial="hidden" animate="show">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {report.month} {report.year} Career Report
              </CardTitle>
              <CardDescription>Generated on {report.generatedDate.toLocaleDateString()}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/30 p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Applications</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {report.applicationsSent}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/30 p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Interviews</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {report.interviewsScheduled}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/30 p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Offers</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {report.offersReceived}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/30 p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {report.successRate}%
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Highlights</h3>
            </div>
            <ul className="space-y-2">
              {report.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-amber-600 font-bold">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Learned */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Book className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Skills Learned</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.skillsLearned.map((skill, idx) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Resume Improvement */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Resume Improvement</h3>
              </div>
              <span className="text-lg font-bold text-emerald-600">+{report.resumeImprovement}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full"
                style={{ width: `${report.resumeImprovement}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CareerReportList() {
  const reports = useCareerGrowthStore((state) => state.getReports());

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Monthly Reports</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Track your career progress with detailed monthly insights
        </p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-slate-500 mb-4">No reports yet. Start your career journey today!</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="space-y-4"
        >
          {reports.map((report) => (
            <MonthlyReportCard key={report.id} report={report} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
