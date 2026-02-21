'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewApi } from '@/lib/api/interview';
import { interviewQuestions } from '@/lib/mock-data';
import { Mic, Volume2, BookOpen, CheckCircle2, Plus, Loader2, History, Wand2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function InterviewPrepPage() {
  const [practicedQuestions, setPracticedQuestions] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['interview', 'sessions'],
    queryFn: interviewApi.getSessions,
  });

  const generateMutation = useMutation({
    mutationFn: () => interviewApi.generateSession({
      resumeId: 'default', // In a real app, we'd select a resume
      jobDescription: 'Software Engineer Position',
      questionCount: 5,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview', 'sessions'] });
      alert('Interview session generated successfully!');
    },
    onError: (error) => {
      console.error('Generation failed:', error);
      alert('Failed to generate interview session. Check credits.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => interviewApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview', 'sessions'] });
    }
  });

  const togglePracticed = (question: string) => {
    setPracticedQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  const categories = Object.keys(interviewQuestions) as Array<
    keyof typeof interviewQuestions
  >;

  const sessions = sessionsData?.data?.sessions || [];

  if (sessionsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Interview Preparation
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Master common interview questions with AI-powered answers
            </p>
          </div>
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Generate AI Session
          </Button>
        </motion.div>

        <Tabs defaultValue="practice" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <TabsTrigger value="practice" className="gap-2">
              <BookOpen className="h-4 w-4" /> Practice Bank
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" /> My Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="space-y-6 m-0">
            {/* Stats */}
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {practicedQuestions.length} questions practiced
                    </CardTitle>
                    <CardDescription>
                      Keep going! Practice makes perfect.
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <div className="space-y-6">
              {categories.map((category) => (
                <div
                  key={category as string}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {category as string}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {interviewQuestions[category].length} questions
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="p-0">
                    {interviewQuestions[category].map((item: any, idx: number) => (
                      <AccordionItem
                        key={idx}
                        value={`${category as string}-${idx}`}
                        className="border-b border-slate-200 dark:border-slate-800 last:border-b-0"
                      >
                        <div className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <Checkbox
                            checked={practicedQuestions.includes(item.question)}
                            onCheckedChange={() => togglePracticed(item.question)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <AccordionTrigger className="flex-1 hover:no-underline py-0">
                            <span className="text-sm font-medium text-left text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                              {item.question}
                            </span>
                          </AccordionTrigger>
                        </div>

                        <AccordionContent className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                                AI-Suggested Answer:
                              </h4>
                              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {item.answer}
                              </p>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                              <Button size="sm" variant="outline" className="gap-2 text-xs">
                                <Volume2 className="h-3 w-3" /> Listen
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2 text-xs">
                                <Mic className="h-3 w-3" /> Record Answer
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2 text-xs">
                                <BookOpen className="h-3 w-3" /> Add Note
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0">
            {sessions.length > 0 ? (
              <div className="grid gap-4">
                {sessions.map((session: any) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{session.title || 'AI Interview Session'}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-500"
                          onClick={() => deleteMutation.mutate(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        Created {new Date(session.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center gap-4 mt-2">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded text-xs text-indigo-600 dark:text-indigo-400">
                          {session.questions?.length || 0} Questions
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded text-xs text-purple-600 dark:text-purple-400 uppercase">
                          {session.difficulty || 'Mid'}
                        </div>
                        <Link href={`/interview-prep/${session.id}`} className="ml-auto">
                          <Button size="sm">Resume Session</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <History className="h-12 w-12 text-slate-300 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No sessions yet</h3>
                  <p className="text-slate-500 mb-6">Generate an AI-powered interview session tailored to your resume.</p>
                  <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
                    {generateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                    Build AI Interview
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
