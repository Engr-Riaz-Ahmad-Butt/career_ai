'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useABTestStore } from '@/store/abTestStore';
import { ABTestVariant } from '@/lib/ab-testing-data';
import { Sparkles, Plus } from 'lucide-react';

export function ABTestCreator() {
  const [step, setStep] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [variantA, setVariantA] = useState<Partial<ABTestVariant>>({
    name: 'Version A',
    content: {
      headline: '',
      summary: '',
      skills: [],
      experience: [],
    },
  });
  const [variantB, setVariantB] = useState<Partial<ABTestVariant>>({
    name: 'Version B',
    content: {
      headline: '',
      summary: '',
      skills: [],
      experience: [],
    },
  });

  const createTest = useABTestStore((state) => state.createTest);

  const handleCreateTest = () => {
    if (!jobDescription || !variantA.content?.headline || !variantB.content?.headline) {
      alert('Please fill in all required fields');
      return;
    }

    const testA: ABTestVariant = {
      id: `variant-a-${Date.now()}`,
      name: variantA.name || 'Version A',
      content: variantA.content || {
        headline: '',
        summary: '',
        skills: [],
        experience: [],
      },
      createdDate: new Date(),
    };

    const testB: ABTestVariant = {
      id: `variant-b-${Date.now()}`,
      name: variantB.name || 'Version B',
      content: variantB.content || {
        headline: '',
        summary: '',
        skills: [],
        experience: [],
      },
      createdDate: new Date(),
    };

    createTest(testA, testB, jobDescription);
    setStep(0);
    setJobDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Create A/B Test
        </CardTitle>
        <CardDescription>
          Create two resume variants and get AI predictions on which performs better
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Job Description */}
          <div>
            <Label htmlFor="job">Paste Job Description</Label>
            <Textarea
              id="job"
              placeholder="Paste the job description you're targeting..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-2 h-32"
            />
          </div>

          {/* Variant A */}
          <div className="border-l-4 border-blue-600 pl-4">
            <Label>Variant A - Version 1</Label>
            <Textarea
              placeholder="Enter your resume headline/summary for this variant"
              value={variantA.content?.headline || ''}
              onChange={(e) =>
                setVariantA({
                  ...variantA,
                  content: {
                    ...variantA.content!,
                    headline: e.target.value,
                  },
                })
              }
              className="mt-2 h-24"
            />
          </div>

          {/* Variant B */}
          <div className="border-l-4 border-purple-600 pl-4">
            <Label>Variant B - Version 2</Label>
            <Textarea
              placeholder="Enter your resume headline/summary for this variant"
              value={variantB.content?.headline || ''}
              onChange={(e) =>
                setVariantB({
                  ...variantB,
                  content: {
                    ...variantB.content!,
                    headline: e.target.value,
                  },
                })
              }
              className="mt-2 h-24"
            />
          </div>

          <Button
            onClick={handleCreateTest}
            className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            Run A/B Test & Get Prediction
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
