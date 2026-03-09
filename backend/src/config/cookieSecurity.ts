/**
 * backend/src/config/cookie-security.ts
 *
 * Documentation and validation of HttpOnly cookie security configuration
 * Ensures all cookies are configured according to security best practices
 */

/**
 * REFRESH TOKEN COOKIE CONFIGURATION
 *
 * Location: backend/src/controllers/auth.controller.ts
 * 
 * Configuration:
 * - httpOnly: true          ✓ Prevents JavaScript access (XSS protection)
 * - secure: true (prod)     ✓ Only sent over HTTPS (prevents interception)
 * - sameSite: 'strict'      ✓ Prevents CSRF attacks (no cross-site transmission)
 * - maxAge: 7 days          ✓ Reasonable expiration (7 * 24 * 60 * 60 * 1000 ms)
 * - path: '/'               ✓ Available to entire site
 *
 * SECURITY VERIFICATION CHECKLIST:
 * ================================
 * 
 * 1. XSS Protection (httpOnly)
 *    - Attacker cannot steal token via document.cookie
 *    - Token ONLY sent with HTTP requests, never exposed to JS
 *    - Test: await expect(document.cookie).not.toContain('refreshToken')
 * 
 * 2. HTTPS Protection (secure)
 *    - In production: Cookie only sent over HTTPS connections
 *    - In development: Cookie sent over HTTP (for testing)
 *    - Prevents man-in-the-middle token interception
 *    - IMPORTANT: Ensure HTTPS is enforced in production
 * 
 * 3. CSRF Protection (sameSite)
 *    - sameSite: 'strict' = Cookie sent ONLY for same-site requests
 *    - Prevents third-party sites from initiating authenticated requests
 *    - Example: Attacker site cannot make authenticated calls to CareerAI API
 *    - Test: Cross-site request should NOT include this cookie
 * 
 * 4. Token Rotation
 *    - Location: backend/src/controllers/auth.controller.ts::refreshAccessToken
 *    - New refresh token issued on each refresh request
 *    - Old token invalidated in database
 *    - Reduces window of exposure if token is compromised
 * 
 * IMPLEMENTATION GUIDELINES:
 * =========================
 *
 * Frontend Cookie Usage Pattern:
 * ├─ Login: Backend sets refreshToken cookie (httpOnly)
 * ├─ Store: accessToken in memory (useAuthStore)
 * ├─ Request: Include accessToken in Authorization header
 * ├─ If 401: Call POST /auth/refresh
 * ├─ Refresh: Backend reads cookie, validates, returns new accessToken
 * └─ Logout: Backend clears cookie, frontend clears memory token
 *
 * Sample Flow:
 * 1. User logs in via POST /auth/login
 *    - Backend validates credentials
 *    - Backend sets refreshToken in httpOnly cookie
 *    - Backend returns accessToken in JSON body
 *    - Frontend stores accessToken in Zustand memory
 * 
 * 2. API request with accessToken
 *    - Frontend includes accessToken in Authorization header
 *    - refreshToken cookie automatically sent by browser (httpOnly)
 *    - Backend validates accessToken in header
 * 
 * 3. Access token expires (401)
 *    - Frontend intercepts 401 error
 *    - Frontend calls POST /auth/refresh
 *    - Browser automatically sends refreshToken cookie
 *    - Backend extracts refreshToken from cookie
 *    - Backend generates new accessToken
 *    - Frontend receives new accessToken in JSON body
 *    - Frontend updates memory store with new accessToken
 * 
 * 4. User logs out
 *    - Frontend calls POST /auth/logout
 *    - Backend clears refreshToken cookie (httpOnly)
 *    - Frontend clears accessToken from memory
 *    - Subsequent requests include no tokens
 * 
 * TESTING HTTPONLY COOKIES:
 * ==========================
 * 
 * In Browser DevTools:
 * 1. Open Application > Cookies > localhost:3000
 * 2. Find "refreshToken" cookie
 * 3. Verify:
 *    ✓ "HttpOnly" column shows checkmark
 *    ✓ "Secure" column shows checkmark (if HTTPS)
 *    ✓ "SameSite" shows "Strict"
 *    ✓ Value is not visible (redacted by DevTools)
 * 
 * In Test Code:
 * ├─ Cannot read document.cookie (would be empty or fail)
 * ├─ Can verify via response headers: Set-Cookie
 * ├─ Can verify via mocking res.cookie() calls
 * └─ See backend/tests/auth-cookies.test.ts
 * 
 * PRODUCTION DEPLOYMENT CHECKLIST:
 * =================================
 * 
 * Before deploying to production:
 * ✓ Ensure backend is behind HTTPS (Nginx, Cloudflare, AWS ALB, etc.)
 * ✓ Set NODE_ENV=production
 * ✓ Verify secure: true takes effect (automatic when NODE_ENV=production)
 * ✓ Test login flow works with HTTPS
 * ✓ Test that cookies are marked "Secure" in DevTools
 * ✓ Test that CORS allows credentials (credentials: true)
 * ✓ Test that frontend makes requests with withCredentials: true (Axios configured)
 * 
 * COMPLIANCE & STANDARDS:
 * ========================
 * 
 * ✓ OWASP Top 10: A07:2021 Cross-Site Request Forgery (CSRF)
 *   - sameSite: strict prevents unauthorized cross-site requests
 * 
 * ✓ OWASP Top 10: A03:2021 Injection
 *   - httpOnly prevents JavaScript injection attacks
 * 
 * ✓ OWASP TopTop 10: A02:2021 Cryptographic Failures
 *   - secure + HTTPS prevents token interception
 * 
 * ✓ OAuth 2.0 Best Current Practice (RFC 8252)
 *   - Use httpOnly + Secure cookies for refresh tokens
 *   - Consider token rotation for additional security
 * 
 * TROUBLESHOOTING:
 * =================
 * 
 * Issue: Cookies not being set
 * ├─ Check: CORS credentials: true on frontend
 * ├─ Check: Frontend requests include withCredentials: true
 * ├─ Check: Backend CORS includes credentials: true
 * └─ Check: sameSite not blocking same-origin requests
 * 
 * Issue: HttpOnly not shown in DevTools
 * ├─ Possible: Not actually httpOnly - verify in Set-Cookie header
 * ├─ Possible: Different domain - cookies domain-specific
 * └─ Possible: Cookie cleared by middleware - check flow
 * 
 * Issue: 401 errors on refresh
 * ├─ Check: refreshToken cookie being sent (use Network tab)
 * ├─ Check: Backend req.cookies.refreshToken exists
 * ├─ Check: JWT signature validation
 * └─ Check: Token not expired in database
 *
 * RELATED FILES:
 * ===============
 * - backend/src/controllers/auth.controller.ts (Cookie setting)
 * - backend/src/middleware/auth.ts (JWT validation)
 * - frontend/lib/api/client.ts (401 interceptor, refresh retry)
 * - frontend/components/auth/AuthProvider.tsx (Silent refresh on mount)
 * - backend/tests/auth-cookies.test.ts (Cookie security tests)
 */

/**
 * Validate that all security requirements are met
 * Run this in tests to catch security regressions
 */
export const HTTPONLY_SECURITY_CHECKLIST = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * Helper to verify cookie options are properly secured
 */
export function verifyCookieSecurity(options: any): { isSecure: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!options.httpOnly) issues.push('httpOnly flag not set');
  if (process.env.NODE_ENV === 'production' && !options.secure) issues.push('secure flag missing in production');
  if (options.sameSite !== 'strict') issues.push('sameSite should be "strict"');
  if (!options.path) issues.push('path not specified');

  return {
    isSecure: issues.length === 0,
    issues,
  };
}
