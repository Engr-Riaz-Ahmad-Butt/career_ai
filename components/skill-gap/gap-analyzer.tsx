'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSkillStore } from '@/store/skillStore';
import { getSkillGaps, jobRequiredSkills } from '@/lib/skill-gap-data';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface GapAnalyzerProps {
  onAnalyze?: () => void;
}

export function GapAnalyzer({ onAnalyze }: GapAnalyzerProps) {
  const [jobDesc, setJobDesc] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const jobDescription = useSkillStore((state) => state.jobDescription);
  const setJobDescription = useSkillStore((state) => state.setJobDescription);

  const skillGaps = getSkillGaps();

  const handleAnalyze = () => {
    setJobDescription(jobDesc);
    setAnalyzed(true);
    onAnalyze?.();
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Input Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Analyze Job Requirements</CardTitle>
            <CardDescription>
              Paste a job description to identify skill gaps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-40"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
            <Button
              onClick={handleAnalyze}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={!jobDesc.trim()}
            >
              <Zap className="h-4 w-4 mr-2" />
              Analyze Skill Gaps
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      {analyzed && (
        <motion.div
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Overview */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                      Skills You Have
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                      {skillGaps.present.length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                      Skills to Learn
                    </p>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                      {skillGaps.missing.length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                      Match Rate
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                      {Math.round((skillGaps.present.length / jobRequiredSkills.length) * 100)}%
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Present Skills */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Skills You Already Have
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGaps.present.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Missing Skills */}
          {skillGaps.missing.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                    <AlertCircle className="h-5 w-5" />
                    Skills You Need to Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillGaps.missing.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300 bg-white dark:bg-amber-950/40"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recommendation */}
          {skillGaps.missing.length > 0 && (
            <motion.div variants={itemVariants}>
              <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  You're missing {skillGaps.missing.length} skill{skillGaps.missing.length !== 1 ? 's' : ''}. 
                  Check the roadmap section to find courses and certifications to close these gaps quickly.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
