'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewNote } from '@/lib/job-tracker-data';
import { Calendar, User, MessageCircle } from 'lucide-react';

interface InterviewNotesProps {
  jobId: string;
  interviewNotes: InterviewNote[];
}

export function InterviewNotes({ jobId, interviewNotes }: InterviewNotesProps) {
  if (interviewNotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
          <CardDescription>No interviews scheduled yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div className="space-y-4">
      {interviewNotes.map((note, index) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Round {note.round} Interview
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    {note.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </div>
                <div className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
                  Completed
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {note.interviewer && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Interviewer</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {note.interviewer}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Interview Notes
                </h4>
                <p className="text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  {note.notes}
                </p>
              </div>

              {note.feedback && (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                    Feedback
                  </h4>
                  <p className="text-green-900 dark:text-green-200">{note.feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
