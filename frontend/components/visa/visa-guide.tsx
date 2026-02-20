'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { visaSponsorshipData } from '@/lib/visa-scholarship-data';
import { CheckCircle2, AlertCircle, Clock, DollarSign } from 'lucide-react';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function VisaGuide() {
  const getDifficultyColor = (level: number) => {
    if (level === 1) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (level === 2) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Visa Sponsorship Guides
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Country-specific visa paths with document checklists and expert tips
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {visaSponsorshipData.map((visa) => (
          <motion.div key={visa.id} variants={item}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg">{visa.country}</CardTitle>
                    <CardDescription>{visa.visaType}</CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(visa.difficultyLevel)}>
                    Level {visa.difficultyLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Documents */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Required Documents
                  </h4>
                  <ul className="space-y-1">
                    {visa.documentChecklist.slice(0, 3).map((doc, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400">
                        • {doc}
                      </li>
                    ))}
                    {visa.documentChecklist.length > 3 && (
                      <li className="text-xs text-slate-500">
                        + {visa.documentChecklist.length - 3} more documents
                      </li>
                    )}
                  </ul>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Key Tips
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {visa.tips[0]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
