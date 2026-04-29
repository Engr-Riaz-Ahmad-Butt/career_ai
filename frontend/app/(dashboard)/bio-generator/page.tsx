'use client';

import { motion } from 'framer-motion';
import { User, Sparkles, Wand2, Copy, Check, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Switch } from '@/components/ui/switch';
import { useAI } from '@/hooks/use-ai';
import { resumeApi } from '@/lib/api/endpoints/resume.api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { toast } from 'sonner';
import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';

export default function BioGeneratorPage() {
  const [bioType, setBioType] = useState('LinkedIn');
  const [resumeId, setResumeId] = useState('');
  const [tone, setTone] = useState('Professional');
  const [wordLimit, setWordLimit] = useState(150);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [generatedBio, setGeneratedBio] = useState('');
  const [copied, setCopied] = useState(false);

  const { data: resumesData, isLoading: isResumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list(),
  });

  const { generateLinkedInBio } = useAI();

  const handleGenerate = async () => {
    try {
      const result = await generateLinkedInBio.mutateAsync({
        bioType,
        resumeId: (resumeId === 'none' || !resumeId) ? undefined : resumeId,
        tone,
        wordLimit,
        includeCallToAction: includeCTA,
      });

      if (result?.data?.document?.content) {
        setGeneratedBio(result.data.document.content);
        toast.success('Bio generated successfully!');
      } else {
        throw new Error('Failed to generate bio');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate bio. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <FeatureErrorBoundary featureName="Bio Generator">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 mx-auto">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Bio Generator</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Generate a professional bio tailored for LinkedIn, Twitter/X, portfolio sites, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Generator Settings</CardTitle>
              <CardDescription>Customize how your bio is generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Platform / Type</Label>
                <Select value={bioType} onValueChange={setBioType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn About Section</SelectItem>
                    <SelectItem value="Twitter">Twitter/X Bio</SelectItem>
                    <SelectItem value="Portfolio">Portfolio Site Bio</SelectItem>
                    <SelectItem value="Instagram">Instagram Bio</SelectItem>
                    <SelectItem value="GitHub">GitHub Profile Bio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Source Resume (Optional)</Label>
                <Select value={resumeId} onValueChange={setResumeId}>
                  <SelectTrigger>
                    <SelectValue placeholder={isResumesLoading ? "Loading resumes..." : "Select a resume"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Use profile info)</SelectItem>
                    {resumesData?.data?.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Linking a resume helps AI personalize your bio with real achievements.</p>
              </div>

              <div className="space-y-2">
                <Label>Tone of Voice</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional & Formal</SelectItem>
                    <SelectItem value="Casual">Casual & Friendly</SelectItem>
                    <SelectItem value="Creative">Creative & Bold</SelectItem>
                    <SelectItem value="Minimalist">Minimalist & Clean</SelectItem>
                    <SelectItem value="Executive">Executive & Authoritative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Word Limit</Label>
                  <Input
                    type="number"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(parseInt(e.target.value))}
                    min={20}
                    max={500}
                  />
                </div>
                <div className="flex flex-col justify-end space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="cta-switch" className="cursor-pointer">Include CTA</Label>
                    <Switch
                      id="cta-switch"
                      checked={includeCTA}
                      onCheckedChange={setIncludeCTA}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg"
                disabled={generateLinkedInBio.isPending}
              >
                {generateLinkedInBio.isPending ? (
                  <LoadingSpinner size="sm" variant="current" className="mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate Bio
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Generated Result</CardTitle>
                  <CardDescription>Your AI-generated professional bio</CardDescription>
                </div>
                {generatedBio && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleGenerate} disabled={generateLinkedInBio.isPending}>
                      <RefreshCcw className={`h-4 w-4 ${generateLinkedInBio.isPending ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                {generatedBio ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 min-h-[200px] whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed"
                  >
                    {generatedBio}
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg opacity-50">
                    <Sparkles className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-slate-500">Your generated bio will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </FeatureErrorBoundary>
  );
}
