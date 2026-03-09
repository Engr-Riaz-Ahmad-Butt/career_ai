import crypto from 'crypto';

export type JobStatus = 'processing' | 'complete' | 'failed';

export interface JobRecord<T = unknown> {
  jobId: string;
  type: string;
  status: JobStatus;
  payload: unknown;
  result: T | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  userId?: string;
}

interface EnqueueOptions {
  userId?: string;
  timeoutMs?: number;
}

class JobQueueService {
  private readonly jobs = new Map<string, JobRecord<unknown>>();
  private readonly maxJobs = 1000;
  private readonly defaultTimeoutMs = 5 * 60 * 1000;

  enqueue<T>(
    type: string,
    payload: unknown,
    worker: () => Promise<T>,
    options: EnqueueOptions = {}
  ): JobRecord<T> {
    const jobId = crypto.randomUUID();
    const now = new Date().toISOString();

    const job: JobRecord<T> = {
      jobId,
      type,
      status: 'processing',
      payload,
      result: null,
      error: null,
      createdAt: now,
      completedAt: null,
      userId: options.userId,
    };

    this.jobs.set(jobId, job as JobRecord<unknown>);

    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;
    setImmediate(() => {
      void this.processJob(jobId, worker, timeoutMs);
    });

    this.trimIfNeeded();
    return job;
  }

  getJob<T = unknown>(jobId: string): JobRecord<T> | null {
    const job = this.jobs.get(jobId);
    return (job as JobRecord<T> | undefined) ?? null;
  }

  listUserJobs(userId: string, limit = 20): JobRecord[] {
    return Array.from(this.jobs.values())
      .filter((job) => job.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  getStats() {
    const allJobs = Array.from(this.jobs.values());
    return {
      total: allJobs.length,
      processing: allJobs.filter((j) => j.status === 'processing').length,
      complete: allJobs.filter((j) => j.status === 'complete').length,
      failed: allJobs.filter((j) => j.status === 'failed').length,
    };
  }

  cleanupCompleted(maxAgeMs = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let removed = 0;

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === 'processing' || !job.completedAt) {
        continue;
      }

      const completedAt = new Date(job.completedAt).getTime();
      if (now - completedAt > maxAgeMs) {
        this.jobs.delete(jobId);
        removed += 1;
      }
    }

    return removed;
  }

  private async processJob<T>(jobId: string, worker: () => Promise<T>, timeoutMs: number): Promise<void> {
    const job = this.jobs.get(jobId) as JobRecord<T> | undefined;
    if (!job) {
      return;
    }

    try {
      const result = await Promise.race([
        worker(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Job timed out')), timeoutMs);
        }),
      ]);

      job.status = 'complete';
      job.result = result;
      job.completedAt = new Date().toISOString();
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown job error';
      job.completedAt = new Date().toISOString();
    }
  }

  private trimIfNeeded(): void {
    if (this.jobs.size <= this.maxJobs) {
      return;
    }

    const ordered = Array.from(this.jobs.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const overflow = this.jobs.size - this.maxJobs;

    let removed = 0;
    for (const job of ordered) {
      if (removed >= overflow) {
        break;
      }

      if (job.status !== 'processing') {
        this.jobs.delete(job.jobId);
        removed += 1;
      }
    }

    if (removed < overflow) {
      for (const job of ordered) {
        if (removed >= overflow) {
          break;
        }
        this.jobs.delete(job.jobId);
        removed += 1;
      }
    }
  }
}

let queueInstance: JobQueueService | null = null;

export function getJobQueueService(): JobQueueService {
  if (!queueInstance) {
    queueInstance = new JobQueueService();
  }
  return queueInstance;
}
