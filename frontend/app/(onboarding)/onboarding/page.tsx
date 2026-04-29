'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useOnboardingStore } from '@/store/onboardingStore';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { ResumeUploadStep } from '@/components/onboarding/ResumeUploadStep';
import { AtsScanStep } from '@/components/onboarding/AtsScanStep';
import { DocumentGenerateStep } from '@/components/onboarding/DocumentGenerateStep';
import { PortfolioPreviewStep } from '@/components/onboarding/PortfolioPreviewStep';

export default function OnboardingPage() {
  const step = useOnboardingStore((state) => state.step);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full">
      <StepIndicator currentStep={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && <ResumeUploadStep />}
          {step === 2 && <AtsScanStep />}
          {step === 3 && <DocumentGenerateStep />}
          {step === 4 && <PortfolioPreviewStep />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
