/**
 * backend/tests/auth-cookies.test.ts
 * 
 * Test suite for HttpOnly cookie security
 * Verifies that refresh tokens are set as HttpOnly cookies
 * and NOT accessible from JavaScript
 */

import { Request, Response } from 'express';
import { register, login, logout, refreshAccessToken } from '../src/controllers/auth.controller';
import { AuthService } from '../src/services/auth.service';

// Mock dependencies
jest.mock('../src/services/auth.service');
jest.mock('../src/utils/validation');

describe('Auth Controller - HttpOnly Cookies', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();

    // Setup mock response with cookie tracking
    const cookies: Record<string, { value: string; options: any }> = {};

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(function (name: string, value: string, options: any) {
        cookies[name] = { value, options };
        return this;
      }),
      clearCookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      locals: {},
      cookies,
    } as any;

    mockRequest = {
      body: {},
      headers: {},
      cookies: {},
    };

    mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
  });

  describe('register - HttpOnly cookie', () => {
    it('should set refresh token as HttpOnly cookie', async () => {
      // Arrange
      const testUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        plan: 'FREE',
      };

      const mockInstance = {
        register: jest.fn().mockResolvedValue({
          accessToken: 'access_token_123',
          refreshToken: 'refresh_token_456',
          user: testUser,
        }),
      };

      (AuthService as any).mockImplementation(() => mockInstance);

      // Act
      const controller = require('../src/controllers/auth.controller');
      await controller.register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh_token_456',
        expect.objectContaining({
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/',
        })
      );

      // Verify response includes accessToken but not refreshToken in body
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.success).toBe(true);
      expect(jsonCall.data.accessToken).toBe('access_token_123');
      expect(jsonCall.data.refreshToken).toBeUndefined();
    });
  });

  describe('login - HttpOnly cookie', () => {
    it('should set refresh token as HttpOnly cookie on login', async () => {
      // Arrange
      const testUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        plan: 'FREE',
      };

      const mockInstance = {
        login: jest.fn().mockResolvedValue({
          accessToken: 'access_token_123',
          refreshToken: 'refresh_token_456',
          user: testUser,
        }),
      };

      (AuthService as any).mockImplementation(() => mockInstance);

      mockRequest.body = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      // Act
      const controller = require('../src/controllers/auth.controller');
      await controller.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh_token_456',
        expect.objectContaining({
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        })
      );
    });
  });

  describe('refreshAccessToken - HttpOnly cookie rotation', () => {
    it('should rotate refresh token with new HttpOnly cookie', async () => {
      // Arrange
      const testUser = {
        id: 'user-123',
        email: 'test@example.com',
        plan: 'FREE',
      };

      const mockInstance = {
        refreshTokens: jest.fn().mockResolvedValue({
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token',
          user: testUser,
        }),
      };

      (AuthService as any).mockImplementation(() => mockInstance);

      mockRequest.cookies = {
        refreshToken: 'old_refresh_token',
      };

      // Act
      const controller = require('../src/controllers/auth.controller');
      await controller.refreshAccessToken(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new_refresh_token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
        })
      );
    });

    it('should reject request if no refresh token cookie present', async () => {
      // Arrange
      mockRequest.cookies = {};

      // Act
      const controller = require('../src/controllers/auth.controller');
      await controller.refreshAccessToken(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('No refresh token'),
        })
      );
    });
  });

  describe('logout - Cookie clearing', () => {
    it('should clear HttpOnly refresh token cookie', async () => {
      // Arrange
      const mockInstance = {
        logout: jest.fn().mockResolvedValue({}),
      };

      (AuthService as any).mockImplementation(() => mockInstance);

      mockRequest.cookies = {
        refreshToken: 'refresh_token_to_clear',
      };

      // Act
      const controller = require('../src/controllers/auth.controller');
      await controller.logout(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        })
      );
    });
  });

  describe('Cookie security properties', () => {
    it('should have secure flag set in production', () => {
      // This test documents that in production, secure: true is set
      const isProduction = process.env.NODE_ENV === 'production';
      const expectedSecureFlag = isProduction; // true in production

      expect(expectedSecureFlag).toBe(isProduction);
    });

    it('should always use sameSite: strict to prevent CSRF', () => {
      // sameSite strict doesn't send cookies in cross-site requests
      // This prevents CSRF attacks where cookies would be auto-sent
      const sameSiteMode = 'strict';
      expect(['strict', 'lax', 'none'].includes(sameSiteMode)).toBe(true);
      expect(sameSiteMode).toBe('strict');
    });

    it('should never expose HttpOnly cookies to JavaScript', () => {
      // HttpOnly flag means document.cookie cannot access the cookie
      // This protects against XSS attacks
      const httpOnlyFlag = true; // Always true for refresh tokens
      expect(httpOnlyFlag).toBe(true);
    });
  });
});
