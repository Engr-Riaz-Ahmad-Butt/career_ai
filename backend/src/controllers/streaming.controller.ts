/**
 * backend/src/controllers/streaming.controller.ts
 *
 * Streaming endpoints for real-time AI operations
 * Clients can subscribe to Server-Sent Events for live progress updates
 *
 * Usage from frontend:
 *   const eventSource = new EventSource('/api/v1/stream/enhance-resume/123?section=summary');
 *   eventSource.onmessage = (event) => {
 *     const chunk = JSON.parse(event.data);
 *     updateProgressBar(chunk.progress);
 *     if (chunk.type === 'complete') eventSource.close();
 *   };
 */

import { Request, Response } from 'express';
import {
  setupSSEResponse,
  streamProgress,
  streamResumeEnhancement,
  streamATSScoring,
  streamDocumentGeneration,
  streamInterviewGeneration,
} from '@/services/streaming.service';

/**
 * Stream resume enhancement with real-time progress
 * GET /stream/enhance-resume/:resumeId?section=summary&targetRole=PM
 */
export const streamEnhanceResume = (req: Request, res: Response) => {
  const { resumeId } = req.params;
  const { section = 'summary', targetRole = 'General' } = req.query as any;

  // Setup SSE response
  setupSSEResponse(res, `enhance:${resumeId}`);

  // Stream the enhancement
  streamProgress(res, () => streamResumeEnhancement(resumeId, section as string));
};

/**
 * Stream ATS scoring with real-time feedback
 * GET /stream/ats-score/:resumeId?jobDescription=...
 */
export const streamATSScore = (req: Request, res: Response) => {
  const { resumeId } = req.params;
  const { jobDescription } = req.query as { jobDescription?: string };

  if (!jobDescription) {
    return res.status(400).json({ success: false, message: 'Job description required' });
  }

  setupSSEResponse(res, `ats:${resumeId}`);

  streamProgress(res, () => streamATSScoring(resumeId, jobDescription));
};

/**
 * Stream document generation with real-time progress
 * POST /stream/document/generate
 * Body: { type: 'cover_letter' | 'sop' | 'bio', context: {...} }
 */
export const streamGenerateDocument = (req: Request, res: Response) => {
  const { type, context } = req.body as { type: string; context: any };

  if (!type) {
    return res.status(400).json({ success: false, message: 'Document type required' });
  }

  setupSSEResponse(res, `doc:${type}`);

  streamProgress(res, () => streamDocumentGeneration(type, context));
};

/**
 * Stream interview question generation
 * GET /stream/interview/generate?jobRole=PM&experienceLevel=Senior
 */
export const streamGenerateInterview = (req: Request, res: Response) => {
  const { jobRole = 'General', experienceLevel = 'Mid-level' } = req.query as any;

  setupSSEResponse(res, `interview:${jobRole}`);

  streamProgress(res, () =>
    streamInterviewGeneration(jobRole as string, experienceLevel as string)
  );
};

/**
 * Health check for streaming endpoint
 * GET /stream/ping
 */
export const streamPing = (req: Request, res: Response) => {
  setupSSEResponse(res, 'ping');

  res.write('data: {"type":"ping","message":"Connected to stream server"}\n\n');
  res.end();
};
