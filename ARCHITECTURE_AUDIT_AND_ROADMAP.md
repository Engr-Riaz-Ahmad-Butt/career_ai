# CareerAI Architecture Audit & Implementation Roadmap
**Generated: March 9, 2026**

---

## 📊 CURRENT STATE AUDIT

### ✅ ALREADY IMPLEMENTED (EXCELLENT FOUNDATION)

#### Fix 1: JWT Security (95% Complete)
- ✅ Backend refresh endpoint reads HttpOnly cookies
- ✅ Frontend stores access token in Zustand memory only
- ✅ AuthProvider performs silent refresh on app load
- ✅ API client has 401 interceptor with token refresh queue
- ✅ API client auto-sends credentials (withCredentials: true)
- ⚠️ **VERIFY**: HttpOnly cookie being SET on refresh endpoint

#### Fix 2: Error Boundaries (90% Complete)
- ✅ RootErrorBoundary in app/layout.tsx with Sentry integration
- ✅ FeatureErrorBoundary for dashboard pages
- ✅ ComponentErrorBoundary exists
- ✅ ErrorFallback component with user-friendly messages
- ✅ Sentry configuration files present (client/edge/server)
- ⚠️ **VERIFY**: All boundaries properly tagged with context

#### Fix 3: API Modules (100% Complete)
- ✅ lib/api/endpoints/ directory structure
- ✅ 7 API modules: auth, resume, document, interview, billing, user, analytics
- ✅ Consistent typing and error propagation
- ✅ Functions properly named (get, list, create, update, delete)
- ✅ All return types properly defined

#### Fix 4: Caching Strategy (70% Complete)
- ✅ React Query query keys factory (lib/query-keys.ts)
- ✅ Stale times configured (lib/query-config.ts)
- ✅ Garbage collection times defined
- ✅ Proper key hierarchies for cache invalidation
- ⚠️ **MISSING**: Cache invalidation logic after mutations
- ⚠️ **MISSING**: Redis cache for AI results on backend
- ⚠️ **MISSING**: Cache key hashing utility for deterministic results

#### Frontend Code Quality
- ✅ Memory-only token storage (no localStorage)
- ✅ Absolute imports with @ alias
- ✅ Zod validation schemas
- ✅ TypeScript strict mode enabled
- ✅ Component error boundaries

#### Backend Code Quality
- ✅ Service-Controller pattern
- ✅ Middleware authentication guards
- ✅ Centralized env validation with Zod
- ✅ CORS configured with origin whitelist
- ✅ Rate limiting middleware
- ✅ Request logging with Morgan
- ✅ Helmet security headers

---

### ⏳ NOT YET IMPLEMENTED (CRITICAL PATH)

#### Fix 5: SSE Streaming for AI (0% Complete)
- ❌ No streaming endpoints defined
- ❌ No useAIStream hook
- ❌ No session-based token validation for SSE
- ❌ No EventSource session management

**Impact**: AI responses block UI for 10-15 seconds, users abandon

#### Fix 6: Background Jobs (0% Complete)
- ❌ BullMQ not installed
- ❌ No queues defined (pdf-generation, file-parsing, ai-batch, email)
- ❌ No workers process
- ❌ No useJobPoller hook
- ❌ No job status endpoints

**Impact**: PDF generation blocks server, file parsing slows requests

#### Fix 7: Shared Types (30% Complete)
- ⚠️ Types defined in multiple places
- ❌ No npm run sync-types script
- ❌ No single source of truth
- ⚠️ Type drift risk on API changes

**Impact**: Runtime errors when backend changes types

#### Fix 8: Structured Logging (20% Complete)
- ✅ Morgan request logging in place
- ❌ No Winston structured logger
- ❌ No request ID tracing (requestId header)
- ❌ No log aggregation (Axiom/Logtail)
- ❌ No event-based logging (ai_call_started, credits_deducted, etc.)

**Impact**: Cannot debug production issues, cannot trace requests

---

## 🎯 PRIORITY IMPLEMENTATION ROADMAP

### PHASE 1: SECURITY & VALIDATION (1-2 days)
**Goal**: Ensure all security standards are met

1. **Complete Fix 1 verification**
   - [ ] Verify /refresh endpoint sets HttpOnly cookie
   - [ ] Test cookie in browser DevTools
   - [ ] Verify cookie cannot be read by JavaScript
   - [ ] Test refresh token rotation works
   - [ ] Test logout clears cookie

2. **Complete Fix 2 verification**
   - [ ] Add context to all error boundaries
   - [ ] Test Sentry captures with full context
   - [ ] Add error boundaries to all feature pages
   - [ ] Test error recovery mechanisms

3. **Create backend error response standardizer**
   ```typescript
   // src/utils/apiResponse.ts
   export function successResponse<T>(data: T, message?: string) {
     return { success: true, data, message }
   }
   export function errorResponse(message: string, code: string, details?: unknown) {
     return { success: false, message, error: { code, details } }
   }
   ```

---

### PHASE 2: PERFORMANCE (2-3 days)
**Goal**: Ensure caching and fast responses

1. **Complete Fix 4: Cache invalidation**
   - [ ] Add invalidation after every mutation (create/update/delete)
   - [ ] Example: After create resume → invalidate ['resumes']
   - [ ] Example: After deduct credits → invalidate ['user', 'credits']
   - [ ] Create lib/api/invalidations.ts with all rules

2. **Implement Redis cache for AI**
   - [ ] Create src/services/ai/cache.service.ts
   - [ ] Implement deterministic cache key generation
   - [ ] Cache hits return cached result without credit deduction
   - [ ] Cache miss stores result after Claude call

3. **Add constants file for credit costs**
   ```typescript
   // backend/src/constants/creditCosts.ts
   export const CREDIT_COSTS = {
     RESUME_ENHANCE: 1,
     RESUME_TAILOR: 2,
     ATS_SCORE: 1,
     COVER_LETTER_GENERATE: 2,
     // ... etc
   }
   ```

---

### PHASE 3: SCALABILITY (3-4 days)
**Goal**: Handle long-running operations without blocking

1. **Setup BullMQ infrastructure**
   - [ ] Install @nestjs/bull, bull, redis
   - [ ] Create queues: pdf-generation, file-parsing, ai-batch, email
   - [ ] Create workers process (separate Railway service)
   - [ ] Job status tracking in database

2. **Implement PDF generation queue**
   - [ ] Controller adds job, returns jobId
   - [ ] Worker runs Puppeteer, uploads to R2
   - [ ] Frontend polls job status
   - [ ] Download button when complete

3. **Implement file parsing queue**
   - [ ] Middleware validates file type
   - [ ] Controller queues parse job
   - [ ] Worker extracts text and sends to Claude
   - [ ] Frontend polls and loads form with pre-filled data

4. **Create useJobPoller hook**
   ```typescript
   // frontend/hooks/useJobPoller.ts
   export const useJobPoller = (jobId: string) => {
     // Polls every 2 seconds with exponential backoff
     // Returns { status, result, error, isPolling }
   }
   ```

---

### PHASE 4: AI STREAMING (2-3 days)
**Goal**: Real-time AI responses without blocking UI

1. **Create SSE streaming endpoints**
   - [ ] POST /ai/stream/init → returns sessionId
   - [ ] GET /ai/stream/:sessionId → EventSource
   - [ ] POST /ai/stream/resume/enhance
   - [ ] POST /ai/stream/cover-letter/generate
   - [ ] POST /ai/stream/sop/generate

2. **Implement useAIStream hook**
   ```typescript
   // frontend/hooks/useAIStream.ts
   export const useAIStream = () => {
     // Manages EventSource, chunks, errors
     // { output, isStreaming, error, startStream, stopStream }
   }
   ```

3. **Add streaming to AI service**
   - [ ] Claude streaming implementation
   - [ ] Chunk buffering and batching
   - [ ] Error handling mid-stream

---

### PHASE 5: OBSERVABILITY (1-2 days)
**Goal**: Full request tracing and debugging

1. **Setup Winston logger**
   - [ ] Create src/config/logger.ts
   - [ ] Development: colorized console
   - [ ] Production: JSON to Axiom/Logtail
   - [ ] Every log includes requestId

2. **Add request ID middleware**
   - [ ] Generate UUID requestId on every request
   - [ ] Attach to res.locals.requestId
   - [ ] Include in all log entries
   - [ ] Return in response headers

3. **Add event-based logging**
   - [ ] user_registered, user_logged_in
   - [ ] ai_call_started, ai_call_completed, ai_call_failed
   - [ ] credits_deducted, credits_insufficient
   - [ ] And 10+ other key events

4. **Setup Sentry on frontend**
   - [ ] Verify already configured ✅
   - [ ] Add breadcrumbs for user actions
   - [ ] Filter sensitive data

---

### PHASE 6: TYPE SAFETY (1 day)
**Goal**: Single source of truth for types

1. **Create backend types file**
   - [ ] backend/src/types/index.ts
   - [ ] Export all shared types
   - [ ] Add build step to package.json: "build:types"

2. **Create sync script**
   - [ ] npm run sync-types → copies backend types to frontend
   - [ ] Run before every build
   - [ ] Prevents type drift

---

## 📋 DETAILED TASK CHECKLIST

### IMMEDIATE (This Week)
- [ ] Verify HttpOnly cookie is being set on /refresh
- [ ] Add cache invalidation logic after mutations
- [ ] Create CREDIT_COSTS constants file
- [ ] Add requestId middleware to backend
- [ ] Setup Winston logger

### SHORT TERM (Next Week)
- [ ] Implement Redis cache for AI results
- [ ] Create backends/src/utils/apiResponse.ts standardizer
- [ ] Setup BullMQ infrastructure
- [ ] Create PDF generation queue
- [ ] Create file parsing queue

### MEDIUM TERM (Week 3)
- [ ] Implement SSE streaming endpoints
- [ ] Create useAIStream hook
- [ ] Add streaming to UI components
- [ ] Create useJobPoller hook
- [ ] Add job status endpoints

### LONG TERM (Week 4+)
- [ ] Event-based logging (15+ event types)
- [ ] Shared types setup
- [ ] Email queue implementation
- [ ] Performance optimization
- [ ] Load testing and monitoring

---

## ✨ KEY IMPROVEMENTS TO FRONTLOAD

### 1. Fix 1 Verification (30 mins)
**Check**: Does refresh endpoint SET the HttpOnly cookie?
```typescript
// backend/src/controllers/auth.controller.ts
res.cookie('refreshToken', newRefreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
})
```

### 2. Add Cache Invalidation (1-2 hours)
**Create**: lib/api/invalidations.ts with all mutation rules
```typescript
export const cacheInvalidations = {
  afterCreateResume: () => [
    queryKeys.resumes.all(),
    queryKeys.dashboard.stats(),
  ],
  afterUpdateResume: (id: string) => [
    queryKeys.resumes.byId(id),
    queryKeys.resumes.all(),
  ],
  afterDeductCredits: () => [
    queryKeys.user.credits(),
  ],
  // ... etc
}
```

### 3. Add CREDIT_COSTS Constants (30 mins)
**Create**: backend/src/constants/creditCosts.ts
```typescript
export const CREDIT_COSTS = {
  RESUME_ENHANCE: 1,
  RESUME_TAILOR: 2,
  // ... etc
} as const
```

### 4. Setup Request ID Middleware (1 hour)
**Create**: backend/src/middleware/requestId.middleware.ts
```typescript
export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = crypto.randomUUID()
  res.locals.requestId = requestId
  res.setHeader('X-Request-ID', requestId)
  next()
}
```

---

## 🎯 SUCCESS METRICS

After implementation completion:

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **AI Response Time** | 10-15s blocking | 0s-5s streaming | < 5s to first byte |
| **PDF Generation** | 3-8s API timeout risk | Queued, 30s-2min | No API blocking |
| **Cache Hit Rate** | 0% | 40-60% | > 50% |
| **Error Boundary Coverage** | 60% | 100% | 100% |
| **Type Safety** | 70% | 95% | 100% |
| **Request Tracing** | Impossible | Full trace | Debug any issue in < 5 min |
| **Page Load Time** | ~2-3s | ~1-2s | < 1.5s |

---

## 🚀 QUICK START - NEXT 3 STEPS

1. **TODAY**: Verify Fix 1, add cache invalidation, create constants
2. **TOMORROW**: Setup BullMQ, implement PDF queue
3. **THIS WEEK**: Add Winston logger, update error boundaries

Start with the highest ROI items: security verification, then performance (caching), then scalability (queues).

