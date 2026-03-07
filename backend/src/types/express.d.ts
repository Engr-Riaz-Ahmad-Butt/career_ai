import { Request } from 'express';
import { Plan } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        plan: Plan;
      };
    }
  }
}
