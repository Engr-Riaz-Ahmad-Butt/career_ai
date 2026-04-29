import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  githubLogin,
  githubCallback,
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Account created. Refresh token set as HttpOnly cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/register', validate(signupSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful. Refresh token set as HttpOnly cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate with Google OAuth ID token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [googleToken]
 *             properties:
 *               googleToken:
 *                 type: string
 *                 description: Google ID token from the Google Sign-In SDK
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post('/google', googleAuth);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Initiate GitHub OAuth flow
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to GitHub login
 */
router.get('/github', githubLogin);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to frontend success or failure page
 */
router.get('/github/callback', githubCallback);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Exchange a refresh token (HttpOnly cookie) for a new access token
 *     tags: [Auth]
 *     security: []
 *     description: |
 *       Reads the `refreshToken` HttpOnly cookie sent automatically by the browser.
 *       Returns a new access token and rotates the refresh token.
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Missing, expired, or revoked refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Revoke refresh token and clear cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authenticate, logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: If the email exists, a reset link has been sent (always 200 to prevent enumeration)
 */
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token from email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address with token from verification email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 */
router.post('/verify-email', verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent if account exists
 */
router.post('/resend-verification', validate(forgotPasswordSchema), resendVerification);

export default router;
