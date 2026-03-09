import { z } from 'zod';
import {
  DEFAULT_KEYWORDS,
  DEFAULT_METRICS,
  DEFAULT_SUGGESTIONS,
} from '@/constants/analyze.constants';
import type {
  AnalysisKeyword,
  AnalysisMetric,
  AnalysisSuggestion,
  AtsAnalysisViewData,
} from '@/types/atsAnalysis.types';

const scoreValueSchema = z.union([
  z.number(),
  z.object({ score: z.number().optional() }),
]);

const suggestionSchema = z.union([
  z.string(),
  z.object({ action: z.string().optional(), issue: z.string().optional(), fix: z.string().optional() }),
]);

const keywordSchema = z.union([
  z.string(),
  z.object({ name: z.string(), value: z.number().optional() }),
]);

const atsPayloadSchema = z
  .object({
    score: z.number().optional(),
    atsScore: z.number().optional(),
    keywordMatch: scoreValueSchema.optional(),
    formatting: scoreValueSchema.optional(),
    readability: scoreValueSchema.optional(),
    suggestions: z.array(suggestionSchema).optional(),
    recommendations: z.array(z.string()).optional(),
    keywords: z.array(keywordSchema).optional(),
    matchedKeywords: z.array(z.string()).optional(),
  })
  .passthrough();

type AtsPayload = z.infer<typeof atsPayloadSchema>;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function extractScore(value: z.infer<typeof scoreValueSchema> | undefined): number {
  if (typeof value === 'number') {
    return clampScore(value);
  }

  if (typeof value?.score === 'number') {
    return clampScore(value.score);
  }

  return 0;
}

function buildStableId(source: string): string {
  let hash = 0;
  for (const char of source) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return `item-${Math.abs(hash)}`;
}

function buildSuggestionText(value: z.infer<typeof suggestionSchema>): string {
  if (typeof value === 'string') {
    return value;
  }

  return value.action ?? value.fix ?? value.issue ?? '';
}

function buildSuggestions(payload: AtsPayload): readonly AnalysisSuggestion[] {
  const rawSuggestions = payload.suggestions ?? payload.recommendations ?? DEFAULT_SUGGESTIONS;
  const seen = new Map<string, number>();
  const suggestions: AnalysisSuggestion[] = [];

  for (const rawSuggestion of rawSuggestions) {
    const text = buildSuggestionText(rawSuggestion).trim();
    if (!text) {
      continue;
    }

    const seenCount = (seen.get(text) ?? 0) + 1;
    seen.set(text, seenCount);

    suggestions.push({
      id: `${buildStableId(text)}-${seenCount}`,
      text,
      rank: suggestions.length + 1,
    });
  }

  if (suggestions.length > 0) {
    return suggestions;
  }

  for (const fallbackText of DEFAULT_SUGGESTIONS) {
    const fallbackCount = (seen.get(fallbackText) ?? 0) + 1;
    seen.set(fallbackText, fallbackCount);

    suggestions.push({
      id: `${buildStableId(fallbackText)}-${fallbackCount}`,
      text: fallbackText,
      rank: suggestions.length + 1,
    });
  }

  return suggestions;
}

function buildKeywords(payload: AtsPayload): readonly AnalysisKeyword[] {
  const rawKeywords = payload.keywords ?? payload.matchedKeywords ?? [];

  if (rawKeywords.length === 0) {
    return DEFAULT_KEYWORDS;
  }

  const keywordScores: Record<string, number> = {};

  for (const keyword of rawKeywords) {
    if (typeof keyword === 'string') {
      keywordScores[keyword] = keywordScores[keyword] ?? 25;
      continue;
    }

    keywordScores[keyword.name] = keyword.value ?? keywordScores[keyword.name] ?? 25;
  }

  return Object.entries(keywordScores).map(([name, value]) => ({
    id: buildStableId(name),
    name,
    value: clampScore(value),
  }));
}

function buildMetrics(payload: AtsPayload): readonly AnalysisMetric[] {
  const overallScore = clampScore(payload.score ?? payload.atsScore ?? 0);
  const keywordMatchScore = extractScore(payload.keywordMatch);
  const formattingScore = extractScore(payload.formatting);
  const readabilityScore = extractScore(payload.readability);

  if (overallScore === 0 && keywordMatchScore === 0 && formattingScore === 0 && readabilityScore === 0) {
    return DEFAULT_METRICS;
  }

  return [
    { label: 'Overall Score', score: overallScore },
    { label: 'Keyword Match', score: keywordMatchScore },
    { label: 'Formatting', score: formattingScore },
    { label: 'Readability', score: readabilityScore },
  ];
}

export function transformAtsAnalysisPayload(payload: unknown): AtsAnalysisViewData {
  const parsedPayload = atsPayloadSchema.safeParse(payload);
  const normalizedPayload = parsedPayload.success ? parsedPayload.data : atsPayloadSchema.parse({});

  return {
    metrics: buildMetrics(normalizedPayload),
    keywords: buildKeywords(normalizedPayload),
    suggestions: buildSuggestions(normalizedPayload),
  };
}
