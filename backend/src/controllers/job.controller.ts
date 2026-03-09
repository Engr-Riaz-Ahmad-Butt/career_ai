import { Request, Response } from 'express';
import { asyncHandler } from '@/middleware/error';
import { getJobQueueService } from '@/services/job-queue.service';
import { successResponse, errorResponse, jobStatusResponse } from '@/utils/apiResponse';

const queue = getJobQueueService();

function normalizeResult(result: unknown): Record<string, any> | null {
  if (result === null || result === undefined) {
    return null;
  }

  if (typeof result === 'object') {
    return result as Record<string, any>;
  }

  return { value: result };
}

export const enqueueResumePdfJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const resumeId = req.params.id;

  const job = await queue.enqueueResumePdfJob(userId, resumeId);

  res.status(202).json(
    successResponse({ jobId: job.jobId, status: job.status }, 'Resume PDF generation started')
  );
});

export const enqueueAtsScoreJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const resumeId = req.params.id;
  const { jobDescription, returnSuggestions = true } = req.body as {
    jobDescription?: string;
    returnSuggestions?: boolean;
  };

  if (!jobDescription) {
    return res
      .status(400)
      .json(errorResponse('Job description is required', 'VALIDATION_ERROR'));
  }

  const job = await queue.enqueueResumeAtsScoreJob(
    userId,
    resumeId,
    jobDescription,
    returnSuggestions
  );

  res.status(202).json(
    successResponse({ jobId: job.jobId, status: job.status }, 'ATS scoring job started')
  );
});

export const getJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const job = await queue.getJob(req.params.jobId);

  if (!job) {
    return res.status(404).json(errorResponse('Job not found', 'JOB_NOT_FOUND'));
  }

  if (job.userId && job.userId !== req.user!.userId) {
    return res.status(403).json(errorResponse('Access denied', 'FORBIDDEN'));
  }

  res.json(
    jobStatusResponse({
      jobId: job.jobId,
      status: job.status,
      result: normalizeResult(job.result),
      error: job.error,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    })
  );
});

export const listMyJobs = asyncHandler(async (req: Request, res: Response) => {
  const jobs = await queue.listUserJobs(req.user!.userId, 20);

  res.json(
    successResponse({ jobs }, 'Recent jobs fetched successfully')
  );
});

export const jobQueueHealth = asyncHandler(async (_req: Request, res: Response) => {
  const cleaned = await queue.cleanupCompleted();
  const stats = await queue.getStats();

  res.json(
    successResponse({ stats, cleaned }, 'Job queue healthy')
  );
});
