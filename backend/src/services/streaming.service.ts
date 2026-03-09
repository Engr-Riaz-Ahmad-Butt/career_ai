/**
 * backend/src/services/streaming.service.ts
 *
 * Server-Sent Events (SSE) streaming for real-time AI operations
 * Allows clients to see progress/partial results as they're generated
 *
 * Advantages over polling:
 * - Lower latency: Results streamed immediately
 * - Lower bandwidth: Single connection vs repeated requests
 * - Better UX: Real-time progress feedback
 * - Server-push: No client polling needed
 */

import { Response } from 'express';
import { env } from '@/config/env';

export interface StreamChunk {
  type: 'progress' | 'data' | 'error' | 'complete';
  id?: string;
  message?: string;
  progress?: number; // 0-100
  data?: any;
  timestamp?: Date;
}

/**
 * Setup SSE streaming response
 * @param res Express Response object
 * @param clientId Unique client identifier for logging
 */
export function setupSSEResponse(res: Response, clientId: string): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.setHeader('Access-Control-Allow-Origin', env.FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

/**
 * Send chunk of data to SSE client
 */
export function sendChunk(res: Response, chunk: StreamChunk): void {
  try {
    // Format as SSE: "data: <json>\n\n"
    const data = JSON.stringify(chunk);
    res.write(`data: ${data}\n\n`);
  } catch (err) {
    console.error('Error sending SSE chunk:', err);
  }
}

/**
 * Stream progress updates while processing
 * @param res Express Response
 * @param processFn Async function that handles streaming
 * @param onProgress Callback to track progress
 */
export async function streamProgress(
  res: Response,
  processFn: () => AsyncGenerator<StreamChunk>,
  timeout = 300000 // 5 minutes
): Promise<void> {
  try {
    const generator = processFn();

    // Set timeout to prevent hanging connections
    const timeoutHandle = setTimeout(() => {
      sendChunk(res, {
        type: 'error',
        message: 'Stream timeout',
      });
      res.end();
    }, timeout);

    for await (const chunk of generator) {
      if (res.destroyed) {
        clearTimeout(timeoutHandle);
        return;
      }
      sendChunk(res, chunk);
    }

    // Send completion message
    sendChunk(res, {
      type: 'complete',
      message: 'Stream complete',
    });

    clearTimeout(timeoutHandle);
    res.end();
  } catch (err) {
    console.error('Stream error:', err);
    sendChunk(res, {
      type: 'error',
      message: err instanceof Error ? err.message : 'Stream error',
    });
    res.end();
  }
}

/**
 * Mock streaming AI operation for demonstration
 * Simulates a long-running AI task with progress updates
 */
export async function* mockAIStream(
  initialMessage = 'Starting AI operation...'
): AsyncGenerator<StreamChunk> {
  yield {
    type: 'progress',
    progress: 0,
    message: initialMessage,
    timestamp: new Date(),
  };

  // Simulate processing steps
  for (let i = 1; i <= 5; i++) {
    await delay(200); // Simulate work

    yield {
      type: 'progress',
      progress: i * 20,
      message: `Processing... ${i * 20}%`,
      timestamp: new Date(),
    };
  }

  // Send final result
  yield {
    type: 'data',
    progress: 100,
    data: {
      result: 'Operation completed successfully',
      processedAt: new Date(),
    },
    message: 'Complete',
    timestamp: new Date(),
  };
}

/**
 * Stream resume enhancement with real-time updates
 */
export async function* streamResumeEnhancement(
  resumeId: string,
  section: string
): AsyncGenerator<StreamChunk> {
  yield {
    type: 'progress',
    progress: 0,
    message: `Analyzing ${section}...`,
  };

  // Step 1: Extract content
  await delay(100);
  yield {
    type: 'progress',
    progress: 20,
    message: `Extracted ${section} content`,
  };

  // Step 2: Generate suggestions
  await delay(200);
  yield {
    type: 'progress',
    progress: 40,
    message: 'Generating AI suggestions...',
  };

  // Step 3: Format output
  await delay(150);
  yield {
    type: 'progress',
    progress: 60,
    message: 'Formatting suggestions...',
  };

  // Step 4: Validate
  await delay(100);
  yield {
    type: 'progress',
    progress: 80,
    message: 'Validating content...',
  };

  // Send final result
  await delay(100);
  yield {
    type: 'data',
    progress: 100,
    data: {
      id: resumeId,
      section,
      suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
      timestamp: new Date(),
    },
    message: 'Enhancement complete',
  };
}

/**
 * Stream ATS scoring with real-time feedback
 */
export async function* streamATSScoring(
  resumeId: string,
  jobDescription: string
): AsyncGenerator<StreamChunk> {
  yield {
    type: 'progress',
    progress: 0,
    message: 'Parsing resume and job description...',
  };

  await delay(150);
  yield {
    type: 'progress',
    progress: 25,
    message: 'Extracting keywords...',
  };

  await delay(150);
  yield {
    type: 'progress',
    progress: 50,
    message: 'Analyzing match score...',
  };

  await delay(150);
  yield {
    type: 'progress',
    progress: 75,
    message: 'Generating recommendations...',
  };

  await delay(100);
  yield {
    type: 'data',
    progress: 100,
    data: {
      id: resumeId,
      score: 78,
      matchedKeywords: ['JavaScript', 'React', 'TypeScript'],
      missingKeywords: ['Node.js', 'AWS'],
      recommendations: ['Add more backend experience', 'Highlight cloud skills'],
      timestamp: new Date(),
    },
    message: 'ATS scoring complete',
  };
}

/**
 * Stream document generation (cover letter, SOP, etc.)
 */
export async function* streamDocumentGeneration(
  documentType: string,
  context: any
): AsyncGenerator<StreamChunk> {
  yield {
    type: 'progress',
    progress: 0,
    message: `Preparing to generate ${documentType}...`,
  };

  await delay(100);
  yield {
    type: 'progress',
    progress: 15,
    message: 'Gathering context and requirements...',
  };

  await delay(200);
  yield {
    type: 'progress',
    progress: 40,
    message: 'Generating content with AI...',
  };

  await delay(150);
  yield {
    type: 'progress',
    progress: 70,
    message: 'Formatting and polishing...',
  };

  await delay(100);
  yield {
    type: 'progress',
    progress: 90,
    message: 'Final review...',
  };

  await delay(50);
  yield {
    type: 'data',
    progress: 100,
    data: {
      documentType,
      content: `Generated ${documentType} content here...`,
      wordCount: 500,
      readingTime: '2 minutes',
      timestamp: new Date(),
    },
    message: 'Document generation complete',
  };
}

/**
 * Stream interview question generation
 */
export async function* streamInterviewGeneration(
  jobRole: string,
  experienceLevel: string
): AsyncGenerator<StreamChunk> {
  yield {
    type: 'progress',
    progress: 0,
    message: `Generating ${jobRole} interview questions...`,
  };

  const questions = ['Technical Question', 'Behavioral Question', 'Experience Question'];

  for (let i = 0; i < questions.length; i++) {
    await delay(300);
    yield {
      type: 'progress',
      progress: ((i + 1) / questions.length) * 100,
      message: `Generating ${questions[i]}...`,
      data: {
        questionGenerated: questions[i],
        questionsRemaining: questions.length - i - 1,
      },
    };
  }

  await delay(100);
  yield {
    type: 'data',
    progress: 100,
    data: {
      jobRole,
      experienceLevel,
      questions: [
        'Describe your experience with...',
        'How would you handle...',
        'Tell me about a time when...',
      ],
      timestamp: new Date(),
    },
    message: 'Interview generation complete',
  };
}

/**
 * Helper to introduce delay (simulate processing)
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const streamingPatterns = {
  resumeEnhancement: streamResumeEnhancement,
  atsScoring: streamATSScoring,
  documentGeneration: streamDocumentGeneration,
  interviewGeneration: streamInterviewGeneration,
};
