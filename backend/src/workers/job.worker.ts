import { Worker } from 'bullmq';
import { env } from '@/config/env';
import { ResumeService } from '@/services/resume.service';
import { AIService } from '@/services/ai/aiService';
import { getBullMqConnectionOptions } from '@/services/bullmq-connection';
import {
  JOB_NAMES,
  JOB_QUEUE_NAME,
  ResumeAtsScoreJobPayload,
  ResumePdfJobPayload,
} from '@/services/job.types';

let workerInstance: Worker | null = null;

export function startJobWorker(): Worker | null {
  if (!env.REDIS_URL) {
    console.warn('WARNING: REDIS_URL not configured. Job worker not started.');
    return null;
  }

  if (workerInstance) {
    return workerInstance;
  }

  const resumeService = new ResumeService();
  const aiService = new AIService();

  workerInstance = new Worker(
    JOB_QUEUE_NAME,
    async (job) => {
      if (job.name === JOB_NAMES.RESUME_PDF) {
        const payload = job.data as ResumePdfJobPayload;
        return resumeService.generatePdf(payload.userId, payload.resumeId);
      }

      if (job.name === JOB_NAMES.RESUME_ATS_SCORE) {
        const payload = job.data as ResumeAtsScoreJobPayload;
        return aiService.scoreATS(
          payload.userId,
          payload.resumeId,
          payload.jobDescription,
          payload.returnSuggestions
        );
      }

      throw new Error(`Unsupported job type: ${job.name}`);
    },
    {
      connection: getBullMqConnectionOptions(),
      concurrency: 3,
    }
  );

  workerInstance.on('ready', () => {
    console.log('Job worker ready');
  });

  workerInstance.on('completed', (job) => {
    console.log(`Job completed: ${job.id} (${job.name})`);
  });

  workerInstance.on('failed', (job, error) => {
    console.error(`Job failed: ${job?.id} (${job?.name}) - ${error.message}`);
  });

  workerInstance.on('error', (error) => {
    console.error('Worker error:', error);
  });

  return workerInstance;
}

export async function stopJobWorker(): Promise<void> {
  if (workerInstance) {
    await workerInstance.close();
    workerInstance = null;
  }
}

if (require.main === module) {
  const worker = startJobWorker();

  if (!worker) {
    process.exit(1);
  }

  console.log('BullMQ worker started');

  const shutdown = async () => {
    await stopJobWorker();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
