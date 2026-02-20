'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SkillRoadmap } from '@/lib/skill-gap-data';
import { Calendar, DollarSign, BookOpen, Award, ExternalLink } from 'lucide-react';

interface RoadmapProps {
  roadmaps: SkillRoadmap[];
}

export function Roadmap({ roadmaps }: RoadmapProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
      {roadmaps.map((roadmap, index) => (
        <motion.div key={roadmap.skillName} variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{roadmap.skillName}</CardTitle>
                  <CardDescription className="mt-2">
                    From {roadmap.currentLevel} to {roadmap.targetLevel}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  Week {roadmap.timeline}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeline & Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Time to Complete</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {roadmap.timeline} weeks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total Investment</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      ${roadmap.estimatedCost.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Courses */}
              {roadmap.courses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Recommended Courses ({roadmap.courses.length})
                  </h4>
                  <div className="space-y-2">
                    {roadmap.courses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {course.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {course.platform} • {course.duration}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                                ★ {course.rating}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {course.level}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(course.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {roadmap.certifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications ({roadmap.certifications.length})
                  </h4>
                  <div className="space-y-2">
                    {roadmap.certifications.map((cert) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {cert.name}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {cert.issuer} • {cert.timeToComplete}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={
                                  cert.credibility === 'high'
                                    ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300'
                                    : 'border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300'
                                }
                              >
                                {cert.credibility} credibility
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                ${cert.cost}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  Learning Path Progress
                </p>
                <Progress value={Math.random() * 40 + 20} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
