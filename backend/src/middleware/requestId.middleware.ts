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

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Res {
      locals: {
        requestId?: string;
      };
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Generate unique request ID
  const requestId = crypto.randomUUID();

  // Store in res.locals for access in controllers/services
  res.locals.requestId = requestId;

  // Send in response headers for client to track
  res.setHeader('X-Request-ID', requestId);

  // Users can pass X-Request-ID in requests for grouped logging
  const incomingRequestId = req.headers['x-request-id'] as string;
  if (incomingRequestId) {
    res.locals.requestId = incomingRequestId;
    res.setHeader('X-Request-ID', incomingRequestId);
  }

  next();
};
