/**
 * Middleware to require authenticated userId
 * Eliminates repeated checks in every controller handler
 */

import { RequestHandler } from 'express';
import { UnauthorizedError } from '../utils/errorHandler';

/**
 * Require authenticated user with valid userId
 * 
 * @example
 * router.get('/resumes', requireUserId, resumeController.listResumes);
 */
export const requireUserId: RequestHandler = (req, res, next) => {
  if (!req.user?.userId) {
    throw new UnauthorizedError('Authentication required');
  }
  next();
};
