# 🚀 IMMEDIATE IMPLEMENTATION GUIDE

## Week 1: Foundation (Security + Performance)

### Day 1: VERIFICATION & SETUP (4 hours)

#### Task 1.1: Verify HttpOnly Cookie is Set (30 mins)
**File**: `backend/src/controllers/auth.controller.ts` (refreshAccessToken function)

**Check**:
```typescript
// Should look like this:
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);
```

**Test**: 
```bash
# 1. Clear all cookies
# 2. Login at http://localhost:3001/auth/login
# 3. Open DevTools → Application → Cookies
# 4. Verify refreshToken cookie has:
#    - HttpOnly ✅
#    - Secure (in production) ✅
#    - SameSite=Strict ✅
#    - Path=/ ✅
# 5. Try to access in console: document.cookie
#    Should NOT include refreshToken ✅
```

**Expected Output**:
```
> document.cookie
"other_cookies=..."  // No refreshToken here!
> // Request includes Cookie header automatically
> // (browser handles HttpOnly cookies)
```

---

#### Task 1.2: Add RequestId Middleware (1 hour)

**File**: `backend/src/server.ts`

**Add this line** (after helmet, before routes):
```typescript
app.use(requestIdMiddleware);
```

**Import**:
```typescript
import { requestIdMiddleware } from './middleware/requestId.middleware';
```

**Add to logger** (in all log statements):
```typescript
// Example in a service:
logger.info('Resume created', {
  requestId: res.locals?.requestId,
  userId: user.id,
  resumeId: resume.id,
})
```

---

#### Task 1.3: Add Credit Costs Constants (30 mins)

**Files Created**: 
- ✅ `backend/src/constants/creditCosts.ts`

**Usage in middleware**:
```typescript
// backend/src/middleware/requireCredits.ts
import { CREDIT_COSTS, getCreditCost, PLAN_MULTIPLIERS } from '@/constants/creditCosts';

export const requireCredits = (action: CreditActionType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    const multiplier = PLAN_MULTIPLIERS[user.plan];
    const cost = getCreditCost(action, multiplier);

    if (user.credits < cost) {
      return res.status(402).json(errorResponse(
        'Insufficient credits',
        'INSUFFICIENT_CREDITS',
        { needed: cost, available: user.credits }
      ));
    }
    next();
  };
};

// Usage:
router.post('/enhance', authenticate, requireCredits('RESUME_ENHANCE'), enhanceResume);
```

---

#### Task 1.4: Add API Response Standardizer (1 hour)

**Files Created**: 
- ✅ `backend/src/utils/apiResponse.ts`

**Replace all response patterns** in controllers:

**BEFORE**:
```typescript
export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
};
```

**AFTER**:
```typescript
import { successResponse } from '@/utils/apiResponse';

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json(successResponse(user, 'Account created successfully'));
};
```

**For errors**:
```typescript
import { errorResponse } from '@/utils/apiResponse';

try {
  // ...
} catch (error) {
  res.status(400).json(errorResponse(
    'Resume not found',
    'NOT_FOUND',
    { resumeId: req.params.id }
  ));
}
```

---

### Day 2: Cache Invalidation (4 hours)

#### Task 2.1: Add Cache Invalidations to Hooks (3 hours)

**Files Created**:
- ✅ `frontend/lib/api/invalidations.ts`

**Example: Update Resume Hook**

**BEFORE**:
```typescript
// frontend/hooks/use-resumes.ts
export const useUpdateResume = () => {
  return useMutation({
    mutationFn: (data) => resumeApi.update(data.id, data),
  });
};
```

**AFTER**:
```typescript
import { resumeInvalidations } from '@/lib/api/invalidations';

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => resumeApi.update(data.id, data),
    onSuccess: (resume) => {
      // Invalidate all affected caches
      queryClient.invalidateQueries({
        queryKey: resumeInvalidations.afterUpdate(resume.id),
      });
    },
  });
};
```

**All mutations pattern**:
```typescript
// Create
useMutation({
  mutationFn,
  onSuccess: () => queryClient.invalidateQueries({ 
    queryKey: resumeInvalidations.afterCreate()[0] 
  }),
})

// Update  
useMutation({
  mutationFn,
  onSuccess: (data) => queryClient.invalidateQueries({ 
    queryKey: resumeInvalidations.afterUpdate(data.id)[0] 
  }),
})

// Delete
useMutation({
  mutationFn,
  onSuccess: (_, { id }) => queryClient.invalidateQueries({ 
    queryKey: resumeInvalidations.afterDelete(id)[0] 
  }),
})

// AI Actions (also deduct credits)
useMutation({
  mutationFn,
  onSuccess: (data, { resumeId }) => queryClient.invalidateQueries({ 
    queryKey: mergeInvalidations(
      resumeInvalidations.afterEnhance(resumeId),
      userInvalidations.afterCreditDeduction()
    )[0]
  }),
})
```

---

#### Task 2.2: Add Cache Invalidation to API Responses (1 hour)

**Option: Invalidate on response** (cleaner)

In your API endpoint modules, you can add metadata:

```typescript
// frontend/lib/api/endpoints/resume.api.ts
export const resumeApi = {
  create: (data: CreateResumeInput): Promise<Resume> => {
    return apiClient.post('/resumes', data)
      .then((r) => r.data.data);
  },
};

// Mark mutation metadata
resumeApi.create._invalidates = () => [queryKeys.resumes.all()];
resumeApi.update._invalidates = (id: string) => [
  queryKeys.resumes.byId(id),
  queryKeys.resumes.all(),
];
```

Then in hooks:
```typescript
const queryClient = useQueryClient();
useMutation({
  mutationFn: resumeApi.enhance,
  onSuccess: (data) => {
    if (resumeApi.enhance._invalidates) {
      queryClient.invalidateQueries({
        queryKey: resumeApi.enhance._invalidates(data.id)[0],
      });
    }
  },
});
```

---

### Day 3-5: Redis Cache for AI (8 hours)

#### Task 3.1: Create AI Cache Service

**File**: `backend/src/services/ai/cache.service.ts`

```typescript
import { createHash } from 'crypto';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const CACHE_TTL = {
  RESUME_ENHANCE: 3600,      // 1 hour
  ATS_SCORE: 7200,           // 2 hours
  COVER_LETTER: 1800,        // 30 minutes
  KEYWORD_EXTRACT: 86400,    // 24 hours
} as const;

export async function getCachedAIResult(
  action: keyof typeof CACHE_TTL,
  inputs: Record<string, any>
): Promise<string | null> {
  const cacheKey = generateCacheKey(action, inputs);
  return redis.get(cacheKey);
}

export async function cacheAIResult(
  action: keyof typeof CACHE_TTL,
  inputs: Record<string, any>,
  result: string
): Promise<void> {
  const cacheKey = generateCacheKey(action, inputs);
  const ttl = CACHE_TTL[action];
  await redis.setex(cacheKey, ttl, result);
}

export async function invalidateAICache(
  resumeId: string
): Promise<void> {
  // Delete all ai:*:{resumeId}:* keys
  const pattern = `ai:*:${resumeId}:*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

function generateCacheKey(
  action: string,
  inputs: Record<string, any>
): string {
  // Deterministic hash of all inputs
  const inputStr = JSON.stringify(inputs);
  const hash = createHash('sha256').update(inputStr).digest('hex');
  return `ai:${action}:${hash}`;
}
```

#### Task 3.2: Use Cache in AI Service

```typescript
// backend/src/services/ai/aiService.ts
import { getCachedAIResult, cacheAIResult } from './cache.service';

export async function enhanceResume(
  userId: string,
  resumeId: string,
  section: string,
  bypassCache?: boolean
): Promise<string> {
  if (!bypassCache) {
    const cached = await getCachedAIResult('RESUME_ENHANCE', {
      resumeId,
      section,
    });
    if (cached) {
      logger.info('AI cache hit', { action: 'RESUME_ENHANCE', resumeId });
      return cached; // Don't deduct credits!
    }
  }

  // Cache miss or bypass — call Claude
  const result = await callClaude(...);
  
  // Store in cache
  await cacheAIResult('RESUME_ENHANCE', { resumeId, section }, result);
  
  // Deduct credits
  await creditsService.deduct(userId, 'RESUME_ENHANCE', {
    resumeId,
    section,
  });

  return result;
}
```

---

## Quick Testing Checklist

- [ ] Run `npm run build` on both frontend and backend  
- [ ] Run backend tests: `npm test`
- [ ] Test login flow with DevTools open
- [ ] Verify HttpOnly cookie set and not readable by JavaScript
- [ ] Test cache invalidation by:
  1. Create resume
  2. Open DevTools Network → Resumes list request
  3. Update resume
  4. Verify resumes list is re-fetched (not cached)
- [ ] Test credit deduction logged correctly

---

## Next Week Preview

- **Database migrations** for job queue tables
- **BullMQ setup** for background jobs
- **SSE endpoints** for AI streaming
- **Winston logger** for structured logging

