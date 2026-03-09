import { z } from 'zod';

import type {
  ResumeImprovement,
  ResumeOptimizationViewData,
} from '@/types/resumeOptimizer.types';

const keyChangeSchema = z.object({
  reason: z.string().optional(),
  after: z.string().optional(),
});

const optimizePayloadSchema = z
  .object({
    optimizedData: z.record(z.string(), z.unknown()).optional(),
    optimizedResume: z.record(z.string(), z.unknown()).optional(),
    keyChanges: z.array(keyChangeSchema).optional(),
    improvements: z.array(z.string()).optional(),
  })
  .passthrough();

type OptimizePayload = z.infer<typeof optimizePayloadSchema>;

function buildStableId(source: string): string {
  let hash = 0;
  for (const char of source) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return `improvement-${Math.abs(hash)}`;
}

function getOptimizedResume(payload: OptimizePayload): Record<string, unknown> {
  return payload.optimizedData ?? payload.optimizedResume ?? payload;
}

function toImprovementText(payload: OptimizePayload): readonly string[] {
  if (payload.improvements && payload.improvements.length > 0) {
    return payload.improvements;
  }

  if (!payload.keyChanges || payload.keyChanges.length === 0) {
    return [];
  }

  return payload.keyChanges
    .map((change) => change.reason ?? change.after ?? '')
    .filter((text) => text.trim().length > 0);
}

function buildImprovements(texts: readonly string[]): readonly ResumeImprovement[] {
  const seen = new Map<string, number>();
  const improvements: ResumeImprovement[] = [];

  for (const text of texts) {
    const seenCount = (seen.get(text) ?? 0) + 1;
    seen.set(text, seenCount);

    improvements.push({
      id: `${buildStableId(text)}-${seenCount}`,
      text,
      rank: improvements.length + 1,
    });
  }

  return improvements;
}

function getSummary(optimizedResume: Record<string, unknown>, fallbackSummary: string): string {
  const summaryValue = optimizedResume.summary;
  return typeof summaryValue === 'string' && summaryValue.trim().length > 0
    ? summaryValue
    : fallbackSummary;
}

export function transformResumeOptimizerPayload(
  payload: unknown,
  fallbackSummary: string
): ResumeOptimizationViewData {
  const parsedPayload = optimizePayloadSchema.safeParse(payload);
  const normalizedPayload = parsedPayload.success ? parsedPayload.data : optimizePayloadSchema.parse({});
  const optimizedResume = getOptimizedResume(normalizedPayload);
  const improvements = buildImprovements(toImprovementText(normalizedPayload));

  return {
    optimizedResume,
    summary: getSummary(optimizedResume, fallbackSummary),
    improvements,
  };
}
