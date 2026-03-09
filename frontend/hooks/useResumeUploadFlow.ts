import { useState } from 'react';
import { resumeApi } from '@/lib/api/endpoints/resume.api';
import type { ResumeExtractedData } from '@/types/resumeExtraction.types';

export type UploadStep = 'upload' | 'extracting' | 'review';

interface UseResumeUploadFlowResult {
  readonly step: UploadStep;
  readonly file: File | null;
  readonly progress: number;
  readonly error: string | null;
  readonly extractedData: ResumeExtractedData | null;
  readonly handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleUpload: () => Promise<void>;
  readonly resetToUploadStep: () => void;
}

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function isValidUploadFile(file: File): boolean {
  return ALLOWED_MIME_TYPES.has(file.type);
}

export function useResumeUploadFlow(): UseResumeUploadFlowResult {
  const [step, setStep] = useState<UploadStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ResumeExtractedData | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    if (!isValidUploadFile(selectedFile)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
  }

  async function handleUpload(): Promise<void> {
    if (!file) {
      return;
    }

    setStep('extracting');
    setProgress(10);

    const progressInterval = window.setInterval(() => {
      setProgress((previousProgress) => {
        if (previousProgress >= 90) {
          window.clearInterval(progressInterval);
          return 90;
        }

        return previousProgress + 5;
      });
    }, 500);

    try {
      const extractedResumeData = await resumeApi.extractFromFile(file);

      window.clearInterval(progressInterval);
      setProgress(100);
      setExtractedData(extractedResumeData);
      setStep('review');
    } catch (uploadError) {
      window.clearInterval(progressInterval);
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to extract data. Please try again.');
      setStep('upload');
    }
  }

  function resetToUploadStep(): void {
    setStep('upload');
    setProgress(0);
  }

  return {
    step,
    file,
    progress,
    error,
    extractedData,
    handleFileChange,
    handleUpload,
    resetToUploadStep,
  };
}
