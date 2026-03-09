import { Job, JobState, Queue } from 'bullmq';
import { env } from '@/config/env';
import { createHttpError } from '@/utils/errorHandler';
import { getBullMqConnectionOptions } from '@/services/bullmqConnection';
import {
  JOB_NAMES,
  JOB_QUEUE_NAME,
  QueueJobStatus,
  ResumeAtsScoreJobPayload,
  ResumePdfJobPayload,
} from '@/services/job.types';

interface EnqueueResult {
  jobId: string;
  status: 'processing';
}

class JobQueueService {
  private queue: Queue | null = null;
  private enabled = false;

  constructor() {
    if (!env.REDIS_URL) {
      console.warn('WARNING: REDIS_URL not configured. Background jobs are disabled.');
      return;
    }

    this.queue = new Queue(JOB_QUEUE_NAME, {
      connection: getBullMqConnectionOptions(),
      defaultJobOptions: {
        attempts: 1,
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 500 },
      },
    });

    this.enabled = true;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async enqueueResumePdfJob(userId: string, resumeId: string): Promise<EnqueueResult> {
    this.ensureEnabled();

    const payload: ResumePdfJobPayload = { userId, resumeId };
    const job = await this.queue!.add(JOB_NAMES.RESUME_PDF, payload);

    return {
      jobId: job.id!,
      status: 'processing',
    };
  }

  async enqueueResumeAtsScoreJob(
    userId: string,
    resumeId: string,
    jobDescription: string,
    returnSuggestions: boolean
  ): Promise<EnqueueResult> {
    this.ensureEnabled();

    const payload: ResumeAtsScoreJobPayload = {
      userId,
      resumeId,
      jobDescription,
      returnSuggestions,
    };

    const job = await this.queue!.add(JOB_NAMES.RESUME_ATS_SCORE, payload);

    return {
      jobId: job.id!,
      status: 'processing',
    };
  }

  async getJob(jobId: string): Promise<QueueJobStatus | null> {
    this.ensureEnabled();

    const job = await this.queue!.getJob(jobId);
    if (!job) {
      return null;
    }

    return this.toQueueJobStatus(job);
  }

  async listUserJobs(userId: string, limit = 20): Promise<QueueJobStatus[]> {
    this.ensureEnabled();

    const jobs = await this.queue!.getJobs(
      ['active', 'waiting', 'delayed', 'completed', 'failed', 'paused', 'prioritized'],
      0,
      Math.max(limit * 8, 100),
      true
    );

    const userJobs = jobs
      .filter((job) => (job.data as Partial<ResumePdfJobPayload>)?.userId === userId)
      .slice(0, limit);

    return Promise.all(userJobs.map((job) => this.toQueueJobStatus(job)));
  }

  async getStats(): Promise<{ total: number; processing: number; complete: number; failed: number }> {
    this.ensureEnabled();

    const counts = await this.queue!.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
      'paused',
      'prioritized'
    );

    const processing =
      counts.waiting + counts.active + counts.delayed + counts.paused + counts.prioritized;
    const complete = counts.completed;
    const failed = counts.failed;

    return {
      total: processing + complete + failed,
      processing,
      complete,
      failed,
    };
  }

  async cleanupCompleted(maxAgeMs = 24 * 60 * 60 * 1000): Promise<number> {
    this.ensureEnabled();

    const completed = await this.queue!.clean(maxAgeMs, 1000, 'completed');
    const failed = await this.queue!.clean(maxAgeMs, 1000, 'failed');

    return completed.length + failed.length;
  }

  async close(): Promise<void> {
    if (this.queue) {
      await this.queue.close();
    }
  }

  private ensureEnabled() {
    if (!this.enabled || !this.queue) {
      throw createHttpError(503, 'Background jobs unavailable. Configure REDIS_URL.');
    }
  }

  private async toQueueJobStatus(job: Job): Promise<QueueJobStatus> {
    const state = await job.getState();
    const status = this.mapStateToStatus(state);

    return {
      jobId: job.id!,
      type: job.name as QueueJobStatus['type'],
      status,
      result: (job.returnvalue as unknown) ?? null,
      error: job.failedReason ?? null,
      createdAt: new Date(job.timestamp).toISOString(),
      completedAt:
        status === 'complete' || status === 'failed'
          ? new Date(job.finishedOn ?? Date.now()).toISOString()
          : null,
      userId: (job.data as Partial<ResumePdfJobPayload>)?.userId,
    };
  }

  private mapStateToStatus(state: JobState | 'unknown'): 'processing' | 'complete' | 'failed' {
    if (state === 'completed') {
      return 'complete';
    }

    if (state === 'failed') {
      return 'failed';
    }

    return 'processing';
  }
}

let queueInstance: JobQueueService | null = null;

export function getJobQueueService(): JobQueueService {
  if (!queueInstance) {
    queueInstance = new JobQueueService();
  }
  return queueInstance;
}

