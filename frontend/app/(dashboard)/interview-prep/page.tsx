'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { interviewQuestions } from '@/lib/mock-data';
import { Mic, Volume2, BookOpen, CheckCircle2 } from 'lucide-react';

export default function InterviewPrepPage() {
  const [practicedQuestions, setPracticedQuestions] = useState<string[]>([]);

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

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Interview Preparation
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Master common interview questions with AI-powered answers
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {practicedQuestions.length} questions practiced
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Keep going! Practice makes perfect.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {category}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {interviewQuestions[category].length} questions
                </p>
              </div>

              <Accordion type="single" collapsible className="p-0">
                {interviewQuestions[category].map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${category}-${idx}`}
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-xs"
                          >
                            <Volume2 className="h-3 w-3" />
                            Listen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-xs"
                          >
                            <Mic className="h-3 w-3" />
                            Record Answer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-xs"
                          >
                            <BookOpen className="h-3 w-3" />
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
