'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VisaGuide } from '@/components/visa/visa-guide';
import { FinancialProofGenerator } from '@/components/visa/financial-proof-generator';
import { Briefcase, Award, FileText } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function VisaScholarshipPage() {
  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Visa & Scholarship Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive guides for visa sponsorship and scholarship applications
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={item}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Job Visas</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">4 Countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Universities</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">Top 4 Listed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Document Types</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">20+ Templates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Resources & Tools</CardTitle>
              <CardDescription>
                Access country-specific guides and document generators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visa" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="visa">Visa Guides</TabsTrigger>
                  <TabsTrigger value="financial">Financial Proof</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="visa" className="mt-6">
                  <VisaGuide />
                </TabsContent>

                <TabsContent value="financial" className="mt-6">
                  <FinancialProofGenerator />
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Coming Soon</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 dark:text-slate-400">
                          University-specific customization and scholarship matching tools
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
