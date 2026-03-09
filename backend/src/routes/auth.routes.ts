import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '@/utils/validation';

const router = Router();

router.post('/register', validate(signupSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleAuth); // googleToken validated in controller for now or add schema
router.post('/refresh', refreshAccessToken);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', validate(forgotPasswordSchema), resendVerification);

export default router;
