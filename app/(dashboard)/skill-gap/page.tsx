'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GapAnalyzer } from '@/components/skill-gap/gap-analyzer';
import { Roadmap } from '@/components/skill-gap/roadmap';
import { generateRoadmap, getSkillGaps } from '@/lib/skill-gap-data';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, TrendingUp, BookOpen } from 'lucide-react';

export default function SkillGapPage() {
  const [analyzed, setAnalyzed] = useState(false);
  const skillGaps = getSkillGaps();

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

  // Generate roadmaps for missing skills
  const roadmaps = skillGaps.missing.slice(0, 3).map((skill) => generateRoadmap(skill));

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Skill Gap Analyzer
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Identify missing skills and create a personalized learning roadmap
          </p>
        </motion.div>

        {/* Stats */}
        {analyzed && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                      Skills Matched
                    </p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                      {skillGaps.present.length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 opacity-30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                      To Learn
                    </p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                      {skillGaps.missing.length}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                      Match Rate
                    </p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                      {Math.round((skillGaps.present.length / (skillGaps.present.length + skillGaps.missing.length)) * 100)}%
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400 opacity-30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="analyzer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="analyzer">Analyze Skills</TabsTrigger>
              <TabsTrigger value="roadmap" disabled={!analyzed}>
                Learning Roadmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyzer" className="space-y-6">
              <GapAnalyzer onAnalyze={() => setAnalyzed(true)} />
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6">
              {analyzed && roadmaps.length > 0 ? (
                <Roadmap roadmaps={roadmaps} />
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                      Analyze skills first to see recommended learning paths
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
