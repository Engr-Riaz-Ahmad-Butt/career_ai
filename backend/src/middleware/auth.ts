import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import prisma from '@/config/database';
import { CREDIT_COSTS, getCreditCost, CreditActionType, PLAN_MULTIPLIERS } from '@/constants/creditCosts';
import {
  ForbiddenError,
  InsufficientCreditsError,
  UnauthorizedError,
} from '@/utils/errorHandler';
/**
 * NEW: Require user to have credits for a specific AI action.
 * Automatically calculates cost based on plan multiplier.
 *
 * @example
 * router.post('/enhance', requireCreditsForAction('RESUME_ENHANCE'), enhanceResume);
 */
export const requireCreditsForAction = (action: CreditActionType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { credits: true, plan: true },
      });

      if (!user) {
        return next(new UnauthorizedError('User not found'));
      }

      const multiplier = PLAN_MULTIPLIERS[user.plan as keyof typeof PLAN_MULTIPLIERS] ?? 1;
      const creditsNeeded = getCreditCost(action, multiplier);

      if (user.credits < creditsNeeded) {
        return next(new InsufficientCreditsError(
          `Insufficient credits for ${action}. Need ${creditsNeeded}, have ${user.credits}`,
          {
            action,
            creditsNeeded,
            creditsAvailable: user.credits,
            baseCost: CREDIT_COSTS[action],
            planMultiplier: multiplier,
          }
        ));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

async function loadActiveUserFromToken(token: string) {
  const decoded = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, plan: true, isActive: true, deletedAt: true },
  });

  if (!user || !user.isActive || user.deletedAt) {
    throw new UnauthorizedError('User not found or inactive');
  }

  return user;
}

function readBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

function readQueryToken(req: Request): string | null {
  const token = req.query?.token;
  if (typeof token === 'string' && token.trim().length > 0) {
    return token;
  }
  return null;
}

/**
 * Authenticate JWT bearer token and attach req.user.
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = readBearerToken(req);
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const user = await loadActiveUserFromToken(token);
    req.user = { userId: user.id, email: user.email, plan: user.plan };
    next();
  } catch (error) {
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Stream authentication.
 * Supports:
 * 1) Authorization: Bearer <token>
 * 2) token query parameter (needed for EventSource)
 */
export const authenticateStream = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = readBearerToken(req) ?? readQueryToken(req);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const user = await loadActiveUserFromToken(token);
    req.user = { userId: user.id, email: user.email, plan: user.plan };
    next();
  } catch (error) {
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Require a specific plan (or higher).
 */
export const requirePlan = (allowedPlans: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError('Authentication required'));
    if (!allowedPlans.includes(req.user.plan)) {
      return next(new ForbiddenError(`Requires ${allowedPlans.join(' or ')} plan`));
    }
    next();
  };
};

/**
 * Require the user to be an admin (ENTERPRISE plan).
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.plan !== 'ENTERPRISE') {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
};

/**
 * Require the user to have at least `creditsNeeded` credits.
 * Returns 402 (Payment Required) when credits are insufficient.
 */
export const requireCredits = (creditsNeeded: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { credits: true },
      });

      if (!user || user.credits < creditsNeeded) {
        return next(new InsufficientCreditsError('Insufficient credits', {
          creditsNeeded,
          creditsAvailable: user?.credits ?? 0,
        }));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication — attaches req.user if token is valid, continues otherwise.
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const decoded = verifyAccessToken(authHeader.substring(7));
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, plan: true, isActive: true },
      });
      if (user?.isActive) {
        req.user = { userId: user.id, email: user.email, plan: user.plan };
      }
    }
  } catch { /* ignore invalid tokens */ }
  next();
};
