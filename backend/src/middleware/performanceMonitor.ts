import { NextFunction, Request, Response } from 'express';
import { PERFORMANCE } from '@/constants/performance';
import { logger } from '@/utils/logger';

type ResponseMethod = (...args: any[]) => any;

type EndpointType = 'non-ai' | 'ai' | 'upload';

function getEndpointType(path: string): EndpointType {
  if (path.includes('/api/v1/ai') || path.includes('/api/v1/stream')) {
    return 'ai';
  }

  if (path.includes('/upload')) {
    return 'upload';
  }

  return 'non-ai';
}

function targetForEndpoint(endpointType: EndpointType): number {
  if (endpointType === 'ai') {
    return PERFORMANCE.TARGETS_MS.AI_FIRST_BYTE;
  }

  if (endpointType === 'upload') {
    return PERFORMANCE.TARGETS_MS.UPLOAD_QUEUE;
  }

  return PERFORMANCE.TARGETS_MS.NON_AI_RESPONSE;
}

export function performanceMonitor(req: Request, res: Response, next: NextFunction): void {
  const startedAt = process.hrtime.bigint();
  const endpointType = getEndpointType(req.originalUrl);
  const targetMs = targetForEndpoint(endpointType);
  let firstByteMs: number | null = null;

  const originalWrite = res.write.bind(res) as ResponseMethod;
  const originalEnd = res.end.bind(res) as ResponseMethod;

  const markFirstByte = () => {
    if (firstByteMs !== null) {
      return;
    }

    const elapsedNs = process.hrtime.bigint() - startedAt;
    firstByteMs = Number(elapsedNs) / 1_000_000;

    if (!res.headersSent) {
      res.setHeader(PERFORMANCE.FIRST_BYTE_HEADER, firstByteMs.toFixed(1));
    }
  };

  res.write = ((...args: any[]) => {
    markFirstByte();
    return originalWrite(...args);
  }) as ResponseMethod;

  res.end = ((...args: any[]) => {
    markFirstByte();

    const elapsedNs = process.hrtime.bigint() - startedAt;
    const totalMs = Number(elapsedNs) / 1_000_000;

    if (!res.headersSent) {
      res.setHeader(PERFORMANCE.RESPONSE_TIME_HEADER, totalMs.toFixed(1));
    }

    const measuredMs = endpointType === 'ai' ? firstByteMs ?? totalMs : totalMs;
    if (measuredMs > targetMs) {
      logger.warn('Performance target exceeded', {
        endpointType,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        measuredMs: Number(measuredMs.toFixed(2)),
        targetMs,
      });
    }

    return originalEnd(...args);
  }) as ResponseMethod;

  next();
}
