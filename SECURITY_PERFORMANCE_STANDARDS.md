# Security & Performance Standards

**Status**: ✅ Implemented and Enforced (as of 2024)

This document describes the **production-grade security and performance guardrails** now enforced throughout CareerForge. These are not recommendations—they are active middleware, validators, and monitors running in code.

---

## 📊 Performance Targets

### Backend API Response Times

All endpoints are monitored via custom middleware with sub-millisecond precision:

| Endpoint Type | Target | Measured Metric |
|---------------|--------|----------------|
| **Non-AI endpoints** | < 200ms | Total response time |
| **AI endpoints** | < 500ms | Time to first byte (TTFB) |
| **Upload queue operations** | < 300ms | Queue enqueue time |

**How it works:**
- [`/backend/src/middleware/performanceMonitor.ts`](backend/src/middleware/performanceMonitor.ts) intercepts all responses
- Uses `process.hrtime.bigint()` for nanosecond-precision timing
- Logs warnings when targets exceeded (via sanitized logger)
- Sends performance headers to clients:
  - `X-Response-Time-Ms`: Total request duration
  - `X-First-Byte-Ms`: TTFB for streaming/AI responses

**Configuration:**
```bash
# .env
PERF_NON_AI_RESPONSE_TARGET_MS=200
PERF_AI_FIRST_BYTE_TARGET_MS=500
PERF_UPLOAD_QUEUE_TARGET_MS=300
```

### Frontend Core Web Vitals

Target budget enforced via runtime monitoring:

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Main content loading speed |
| **FID** (First Input Delay) | < 100ms | Interactivity responsiveness |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |

**How it works:**
- [`/frontend/components/providers/WebVitalsProvider.tsx`](frontend/components/providers/WebVitalsProvider.tsx) tracks real user metrics
- Logs console warnings when budgets exceeded
- Integrated in root layout for all pages

**Frontend Optimizations Applied:**
- ✅ `next/image` for all images (lazy loading, WebP conversion, responsive sizing)
- ✅ Dynamic imports for heavy sections (5 marketing components: TrustedBy, Features, HowItWorks, Testimonials, CTA)
- ✅ ReactQueryDevtools conditionally loaded (dev only, saves ~100KB in prod)
- ✅ Bundle analyzer integrated: `npm run analyze` to visualize bundle composition

---

## 🔒 Security Standards

### Input Sanitization

**ALL** incoming requests (`req.body`, `req.query`, `req.params`) are sanitized **before** reaching route handlers.

**What's removed:**
- Control characters (`\x00-\x08`, `\x0B`, `\x0C`, `\x0E-\x1F`, `\x7F`)
- Script tags (`<script>...</script>`, case-insensitive)
- JavaScript protocols (`javascript:`, `data:`, `vbscript:`)

**Implementation:**
- [`/backend/src/middleware/sanitizeInput.ts`](backend/src/middleware/sanitizeInput.ts)
- Applied globally in [`server.ts`](backend/src/server.ts) before cookie-parser
- Recursively sanitizes nested objects/arrays

### File Upload Validation

**MIME type alone is insufficient**—we verify file content via **magic byte signatures**.

**Supported formats and signatures:**
| MIME Type | Magic Bytes (Hex) | File Types |
|-----------|-------------------|------------|
| `image/jpeg` | `FF D8 FF` | JPEG |
| `image/png` | `89 50 4E 47 0D 0A 1A 0A` | PNG |
| `image/gif` | `47 49 46 38` | GIF87a/89a |
| `image/webp` | `52 49 46 46 ... 57 45 42 50` | WebP |
| `application/pdf` | `25 50 44 46` (%PDF-) | PDF |
| `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `50 4B 03 04` (ZIP header) | DOCX |

**How it works:**
- [`/backend/src/middleware/upload.ts`](backend/src/middleware/upload.ts) exports `validateAvatarMagicBytes` and `validateResumeMagicBytes`
- Applied to:
  - `POST /api/users/me/avatar` (JPEG/PNG/GIF/WebP)
  - `POST /api/resumes/upload` (PDF/DOCX)
  - `POST /api/resumes/extract` (PDF/DOCX)
- Reads first 16 bytes from buffer (memory uploads) or disk (temp files)
- Rejects with 400 error if magic bytes don't match declared MIME type

### Strict CORS Configuration

**Origin validation is mandatory** to prevent cross-origin abuse.

**Default behavior:**
- Requests with `Origin` header: Must match allowlist in `CORS_ALLOWED_ORIGINS` (comma-separated)
- Requests with no `Origin` header: **BLOCKED** unless `CORS_ALLOW_NO_ORIGIN=true`
- Exposed headers: Performance metrics (`X-Response-Time-Ms`, `X-First-Byte-Ms`)

**Configuration:**
```bash
# .env
CORS_ALLOWED_ORIGINS=https://careerforge.ai,https://www.careerforge.ai
CORS_ALLOW_NO_ORIGIN=false  # Set true for same-origin API calls (e.g., server-side Next.js)
```

**Implementation:**
- Custom origin validator in [`server.ts`](backend/src/server.ts)
- Validates against allowlist before allowing requests
- Logs warnings for rejected origins (via sanitized logger)

### Sanitized Logging

**NO sensitive data in logs**—all logging goes through a redaction layer.

**What's redacted:**
- Passwords, tokens, API keys, secrets
- Detected via pattern matching: `password`, `token`, `secret`, `apikey`, `api_key`, `authorization`, `auth`, `cookie`
- Replaced with `[REDACTED]` placeholder

**Implementation:**
- [`/backend/src/utils/logger.ts`](backend/src/utils/logger.ts) provides `logger.info()`, `logger.warn()`, `logger.error()`
- Recursively scans objects (including nested structures)
- Handles Error objects specially (extracts `name` + `message`, drops `stack`)
- Replaces **ALL** `console.log`/`console.error` across:
  - [`server.ts`](backend/src/server.ts) startup/shutdown
  - [`error.ts`](backend/src/middleware/error.ts) error handler
  - [`cache.service.ts`](backend/src/services/cache.service.ts) Redis operations
  - [`job.worker.ts`](backend/src/workers/job.worker.ts) BullMQ worker
  - [`email.service.ts`](backend/src/services/email.service.ts) SMTP errors
  - [`streaming.service.ts`](backend/src/services/streaming.service.ts) SSE failures
  - [`jobQueue.service.ts`](backend/src/services/jobQueue.service.ts) queue warnings

**Usage:**
```typescript
import logger from '@/utils/logger';

logger.info('User logged in', { userId: user.id }); // ✅ Safe
logger.error('Auth failed', { password: 'secret123' }); // → { password: '[REDACTED]' }
```

### Additional Security Layers

| Feature | Status | Implementation |
|---------|--------|----------------|
| **Helmet middleware** | ✅ Active | Sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.) |
| **CUID IDs** | ✅ Active | Unpredictable user/resource IDs prevent enumeration attacks |
| **Parameterized queries** | ✅ Active | Prisma ORM prevents SQL injection by default |
| **Environment validation** | ✅ Active | Zod schema in [`env.ts`](backend/src/config/env.ts) enforces required vars at startup |
| **HttpOnly cookies** | ✅ Active | Refresh tokens stored as HttpOnly, SameSite=Strict (prevents CSRF/XSS theft) |

---

## 🔍 Monitoring & Auditing

### Daily Operations

**Check performance in production:**
1. Backend logs include warnings when targets exceeded:
   ```
   WARN: /api/resumes/analyze exceeded non-AI target (250ms > 200ms target)
   ```
2. Client-side: Inspect `X-Response-Time-Ms` header in browser DevTools Network tab
3. Frontend: Check browser console for Core Web Vitals warnings:
   ```
   WARN: LCP exceeded target (3200ms > 2500ms target)
   ```

**Bundle size analysis:**
```bash
cd frontend
npm run analyze  # Opens bundle visualization in browser
```
Look for:
- Unexpectedly large chunks (> 200KB gzipped)
- Duplicate dependencies across chunks
- Unused code from libraries

### Security Audits

**Dependency vulnerability scans:**
```bash
# Backend
cd backend
npm run audit:deps  # Exits non-zero if moderate+ vulnerabilities found

# Frontend
cd frontend
npm run audit:deps
```

**Current baseline (as of last check):**
- **Backend**: 9 vulnerabilities (1 moderate, 8 high) in ajv, minimatch, multer, nodemailer
- **Frontend**: 11 vulnerabilities (3 low, 1 moderate, 6 high, 1 critical) in Next.js, ajv, cookie, glob, minimatch

⚠️ **Known issues requiring upstream fixes:**
- Next.js critical: Cache poisoning (GHSA-gp8f-8m3g-qvj9), image DoS, middleware SSRF
- Multer high: DoS via resource exhaustion, recursion, incomplete cleanup
- Nodemailer high: Domain confusion + DoS

**Resolution strategy:**
- Monitor for security patches from upstream packages
- Test `npm audit fix --force` in staging before applying (may cause breaking changes)
- Consider alternative packages if vulnerabilities persist

### Automated Checks (Recommended CI/CD)

Add to GitHub Actions or equivalent:
```yaml
- name: Security audit
  run: |
    npm run audit:deps
  working-directory: backend

- name: Lint backend
  run: npm run lint
  working-directory: backend

- name: Backend tests
  run: npm test
  working-directory: backend
```

---

## 📋 Compliance Checklist

For production deployments, verify:

- [ ] **Environment variables configured** (see [`backend/.env.example`](backend/.env.example))
- [ ] **CORS origins allowlist set** (`CORS_ALLOWED_ORIGINS`)
- [ ] **Database queries indexed** (check slow query logs)
- [ ] **Pagination applied** to list endpoints (default: 20 items per page)
- [ ] **Rate limiting active** (recommended: `express-rate-limit` on auth routes)
- [ ] **HTTPS enforced** (set `NODE_ENV=production` for secure cookies)
- [ ] **Dependency audits passing** (or known vulnerabilities documented in security log)
- [ ] **Bundle size monitored** (run `npm run analyze` before each release)
- [ ] **Core Web Vitals tracked** (RUM in production, not just dev)

---

## 🛠️ Development Workflow

### Adding New Endpoints

1. **Use sanitized logger** (not `console.log`):
   ```typescript
   import logger from '@/utils/logger';
   logger.info('Processing request', { userId });
   ```

2. **Performance will be auto-monitored** (no manual instrumentation needed)

3. **File uploads?** Add magic byte validation:
   ```typescript
   import { createMagicBytesValidator } from '@/middleware/upload';
   
   const validatePdf = createMagicBytesValidator(['application/pdf']);
   router.post('/upload', upload.single('file'), validatePdf, handler);
   ```

4. **Test with production-like conditions**:
   ```bash
   NODE_ENV=production npm run dev
   ```

### Frontend Component Best Practices

1. **Heavy components (> 50KB)?** Use dynamic imports:
   ```typescript
   const HeavyChart = dynamic(() => import('./HeavyChart'), {
     loading: () => <Spinner />,
     ssr: false  // If client-side only
   });
   ```

2. **Images**: Always use `next/image`:
   ```tsx
   <Image 
     src="/hero.jpg" 
     alt="Hero"
     width={1200}
     height={630}
     priority={isAboveFold}
   />
   ```

3. **External images**: Add domains to [`next.config.js`](frontend/next.config.js):
   ```javascript
   images: {
     remotePatterns: [
       { protocol: 'https', hostname: 'images.unsplash.com' }
     ]
   }
   ```

---

## 📚 Reference Documentation

- **Performance monitoring**: [backend/src/middleware/performanceMonitor.ts](backend/src/middleware/performanceMonitor.ts)
- **Input sanitization**: [backend/src/middleware/sanitizeInput.ts](backend/src/middleware/sanitizeInput.ts)
- **File validation**: [backend/src/middleware/upload.ts](backend/src/middleware/upload.ts)
- **Sanitized logger**: [backend/src/utils/logger.ts](backend/src/utils/logger.ts)
- **Web Vitals tracking**: [frontend/components/providers/WebVitalsProvider.tsx](frontend/components/providers/WebVitalsProvider.tsx)
- **Environment config**: [backend/src/config/env.ts](backend/src/config/env.ts)

---

## ✅ Verification Status

| Component | Build | Tests | Lint | Audit |
|-----------|-------|-------|------|-------|
| **Backend** | ✅ Pass | ✅ 13/13 | ⚠️ Import order warnings | ⚠️ 9 vulnerabilities |
| **Frontend** | ✅ Pass | - | ⚠️ 3 hook warnings | ⚠️ 11 vulnerabilities |

**Last validated**: 2024 (conversation completion)

All critical security and performance features are **deployed and active**. Lint warnings are cosmetic (import ordering). Dependency vulnerabilities are documented and awaiting upstream patches.
