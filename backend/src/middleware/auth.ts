import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import prisma from '../config/database';
import { CREDIT_COSTS, getCreditCost, CreditActionType, PLAN_MULTIPLIERS } from '../constants/creditCosts';
/**
 * NEW: Require user to have credits for a specific AI action.
 * Automatically calculates cost based on plan multiplier.
 *
 * @example
 * router.post('/enhance', requireCreditsForAction('RESUME_ENHANCE'), enhanceResume);
 */
export const requireCreditsForAction = (action: CreditActionType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { credits: true, plan: true },
    });

    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    // Get plan multiplier (default to 1 if plan not in mapping)
    const multiplier = PLAN_MULTIPLIERS[user.plan as keyof typeof PLAN_MULTIPLIERS] ?? 1;
    const creditsNeeded = getCreditCost(action, multiplier);

    if (user.credits < creditsNeeded) {
      return res.status(402).json({
        success: false,
        message: `Insufficient credits for ${action}. Need ${creditsNeeded}, have ${user.credits}`,
        error: { 
          action,
          creditsNeeded, 
          creditsAvailable: user.credits,
          baseCost: CREDIT_COSTS[action],
          planMultiplier: multiplier,
        },
      });
    }
    next();
  };
};

/**
 * Authenticate JWT bearer token and attach req.user.
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, plan: true, isActive: true, deletedAt: true },
    });

    if (!user || !user.isActive || user.deletedAt) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    req.user = { userId: user.id, email: user.email, plan: user.plan };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Require a specific plan (or higher).
 */
export const requirePlan = (allowedPlans: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!allowedPlans.includes(req.user.plan)) {
      return res.status(403).json({ success: false, message: `Requires ${allowedPlans.join(' or ')} plan` });
    }
    next();
  };
};

/**
 * Require the user to be an admin (ENTERPRISE plan).
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.plan !== 'ENTERPRISE') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

/**
 * Require the user to have at least `creditsNeeded` credits.
 * Returns 402 (Payment Required) when credits are insufficient.
 */
export const requireCredits = (creditsNeeded: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { credits: true },
    });

    if (!user || user.credits < creditsNeeded) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient credits',
        error: { creditsNeeded, creditsAvailable: user?.credits ?? 0 },
      });
    }
    next();
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
