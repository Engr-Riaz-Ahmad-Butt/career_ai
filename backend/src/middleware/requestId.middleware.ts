/**
 * backend/src/middleware/requestId.middleware.ts
 *
 * Generates a unique request ID for every incoming request.
 * This ID is included in all logs, allowing full request tracing.
 *
 * Usage:
 *   app.use(requestIdMiddleware)
 *   // Now every request has res.locals.requestId
 *   // And every response includes X-Request-ID header
 */

import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Generate unique request ID
  const requestId = crypto.randomUUID();
  const locals = res.locals as { requestId?: string };

  // Store in res.locals for access in controllers/services
  locals.requestId = requestId;

  // Send in response headers for client to track
  res.setHeader('X-Request-ID', requestId);

  // Users can pass X-Request-ID in requests for grouped logging
  const incomingRequestId = req.headers['x-request-id'] as string;
  if (incomingRequestId) {
    locals.requestId = incomingRequestId;
    res.setHeader('X-Request-ID', incomingRequestId);
  }

  next();
};
