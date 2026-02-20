'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useJobTrackerStore } from '@/store/jobTrackerStore';
import { JobApplication, getStatusColor, getStatusIcon } from '@/lib/job-tracker-data';
import { ExternalLink, MoreVertical, Trash2, Edit2 } from 'lucide-react';

interface JobTableProps {
  onSelectJob?: (job: JobApplication) => void;
  onEditJob?: (job: JobApplication) => void;
}

export function JobTable({ onSelectJob, onEditJob }: JobTableProps) {
  const jobs = useJobTrackerStore((state) => state.jobs);
  const deleteJob = useJobTrackerStore((state) => state.deleteJob);
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status'>('date');

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
    }
    if (sortBy === 'company') {
      return a.company.localeCompare(b.company);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <TableHead className="text-left">Job Title</TableHead>
              <TableHead className="text-left">Company</TableHead>
              <TableHead className="text-left">Applied</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">ATS Score</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedJobs.map((job) => (
              <motion.tr
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                onClick={() => onSelectJob?.(job)}
              >
                <TableCell>
                  <div className="font-medium text-slate-900 dark:text-white">{job.jobTitle}</div>
                </TableCell>
                <TableCell>
                  <div className="text-slate-700 dark:text-slate-300">{job.company}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {job.appliedDate.toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusIcon(job.status)} {job.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {job.atsScore}%
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(job.jobLink, '_blank');
                      }}
                      title="Open job link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditJob?.(job);
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteJob(job.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">No job applications yet</p>
        </div>
      )}
    </motion.div>
  );
}
