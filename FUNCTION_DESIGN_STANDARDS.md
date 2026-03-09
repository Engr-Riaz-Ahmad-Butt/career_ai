# Function Design Standards

This guide enforces strict function design rules across the entire codebase (frontend and backend). Every function must follow these principles to ensure clean, maintainable, and testable code.

## Rules Overview

### 1. FUNCTION SIZE (Max 30 Lines)

**Rule**: Each function should do ONE thing and do it well. If a function exceeds 30 lines, split it into smaller functions.

**Why**: 
- Easier to understand and maintain
- Simpler testing
- Better code reusability
- Easier to debug

#### ❌ Bad - Long Function (37 lines)
```typescript
async function processUserData(userId: string, updates: Record<string, any>) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  let hasChanges = false;
  const updateData: Record<string, any> = {};

  if (updates.profile) {
    const profileSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().optional(),
    });
    const validated = profileSchema.parse(updates.profile);
    updateData.profile = JSON.stringify(validated);
    hasChanges = true;
  }

  if (updates.settings) {
    const settingsSchema = z.object({
      theme: z.enum(['light', 'dark']),
      notifications: z.boolean(),
    });
    const validated = settingsSchema.parse(updates.settings);
    updateData.settings = JSON.stringify(validated);
    hasChanges = true;
  }

  if (updates.preferences) {
    const prefsSchema = z.object({
      language: z.string(),
      timezone: z.string(),
    });
    const validated = prefsSchema.parse(updates.preferences);
    updateData.preferences = JSON.stringify(validated);
    hasChanges = true;
  }

  if (!hasChanges) throw new Error('No valid updates provided');

  return prisma.user.update({ where: { id: userId }, data: updateData });
}
```

#### ✅ Good - Split into Multiple Functions
```typescript
// Extract validation into separate functions
function validateProfileUpdate(data: unknown): ValidatedProfile {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().optional(),
  });
  return schema.parse(data);
}

function validateSettingsUpdate(data: unknown): ValidatedSettings {
  const schema = z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  });
  return schema.parse(data);
}

// Main function: now handles only orchestration (12 lines)
async function processUserData(
  userId: string,
  updates: Partial<UserUpdates>
): Promise<User> {
  const user = await getUserOrThrow(userId);
  
  const updateData = buildUpdateData(updates);
  if (Object.keys(updateData).length === 0) {
    throw new InvalidUpdateError('No valid updates provided');
  }

  return prisma.user.update({ where: { id: userId }, data: updateData });
}

// Helper to build updates
function buildUpdateData(updates: Partial<UserUpdates>): Record<string, string> {
  const data: Record<string, string> = {};

  if (updates.profile) {
    data.profile = JSON.stringify(validateProfileUpdate(updates.profile));
  }
  if (updates.settings) {
    data.settings = JSON.stringify(validateSettingsUpdate(updates.settings));
  }
  if (updates.preferences) {
    data.preferences = JSON.stringify(validatePreferencesUpdate(updates.preferences));
  }

  return data;
}
```

---

### 2. PARAMETERS (Max 3 Parameters)

**Rule**: If a function needs more than 3 parameters, use an options object instead.

**Why**:
- Prevents parameter order confusion
- Self-documenting code
- Easy to add new parameters without breaking callers
- Supports optional parameters naturally

#### ❌ Bad - 5 Parameters
```typescript
function createResume(
  userId: string,
  title: string,
  template: string,
  targetRole: string,
  industry: string
) {
  // function body
}

// Calling it is confusing - what's the order again?
createResume('user123', 'My Resume', 'modern', 'Engineer', 'Tech');
```

#### ✅ Good - Options Object with 3 Parameters
```typescript
interface CreateResumeOptions {
  readonly title: string;
  readonly template: string;
  readonly targetRole?: string;
  readonly industry?: string;
  readonly isDraft?: boolean;
}

function createResume(userId: string, options: CreateResumeOptions): Resume {
  const { title, template, targetRole, industry, isDraft = false } = options;
  // function body
}

// Calling it is clear
createResume('user123', {
  title: 'My Resume',
  template: 'modern',
  targetRole: 'Engineer',
  industry: 'Tech',
});
```

#### ✅ Refactoring Service Functions

**Before** (4 parameters):
```typescript
async function listResumes(
  userId: string,
  page: number,
  limit: number,
  sortBy: string
) {
  // ...
}
```

**After** (3 parameters):
```typescript
interface ListResumesOptions {
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: string;
  readonly order?: 'asc' | 'desc';
}

async function listResumes(
  userId: string,
  options: ListResumesOptions = {}
): Promise<PaginatedResult<Resume>> {
  // ...
}
```

#### Parameter Patterns

**Pattern 1**: Request/Response handlers (acceptable: 2 params)
```typescript
export const createResume = async (req: Request, res: Response): Promise<void> => {
  // Express handlers are exempt - standard library pattern
}
```

**Pattern 2**: Middleware (acceptable: 3 params)
```typescript
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Standard Express pattern
}
```

---

### 3. GUARD CLAUSES (Fail Fast)

**Rule**: Handle failure cases FIRST with guard clauses, then execute the actual logic.

**Benefits**:
- Eliminates deeply nested code
- Makes happy path obvious
- Easier to read and maintain
- Reduces cognitive load

#### ❌ Bad - Nested Conditionals
```typescript
async function deleteResume(userId: string, resumeId: string): Promise<void> {
  const user = await findUser(userId);
  if (user) {
    const resume = await findResume(resumeId);
    if (resume) {
      if (resume.userId === userId) {
        const credits = user.credits - 1;
        if (credits >= 0) {
          await prisma.resume.delete({ where: { id: resumeId } });
          await deductCredits(userId, 1);
        } else {
          throw new InsufficientCreditsError();
        }
      } else {
        throw new ForbiddenError('Not your resume');
      }
    } else {
      throw new NotFoundError('Resume not found');
    }
  } else {
    throw new NotFoundError('User not found');
  }
}
```

#### ✅ Good - Guard Clauses
```typescript
async function deleteResume(userId: string, resumeId: string): Promise<void> {
  // Guard clauses - fail fast
  const user = await findUserOrThrow(userId);
  const resume = await findResumeOrThrow(resumeId);
  
  if (resume.userId !== userId) {
    throw new ForbiddenError('Not authorized to delete this resume');
  }
  
  if (user.credits < 1) {
    throw new InsufficientCreditsError('Insufficient credits');
  }

  // Happy path - all checks passed
  await prisma.resume.delete({ where: { id: resumeId } });
  await deductCredits(userId, 1);
}

// Helper function
async function findUserOrThrow(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');
  return user;
}
```

#### Guard Clause Patterns

**Pattern 1**: Validate inputs
```typescript
function updateProfile(userId: string, data: ProfileUpdate): void {
  if (!userId) throw new InvalidInputError('userId is required');
  if (!data || typeof data !== 'object') throw new InvalidInputError('Invalid data');
  // Happy path
}
```

**Pattern 2**: Check authorization
```typescript
async function deleteComment(userId: string, commentId: string): Promise<void> {
  const comment = await findComment(commentId);
  if (comment.userId !== userId) throw new ForbiddenError('Not authorized');
  // Happy path
}
```

**Pattern 3**: Check preconditions
```typescript
async function startInterview(jobId: string, userId: string): Promise<Interview> {
  const user = await findUser(userId);
  if (!user) throw new NotFoundError('User not found');
  if (user.credits < 10) throw new InsufficientCreditsError('Need 10 credits');
  if (user.isPremium === false && user.freeUsesLeft === 0) {
    throw new TrialExpiredError('Free trial exhausted');
  }
  // Happy path
}
```

---

### 4. FUNCTION RULES

#### 4.1 Single Responsibility

**Rule**: Each function should have ONE reason to change. Do ONE thing well.

#### ✅ Good - Focused Functions
```typescript
// One responsibility: Validate resume data
function validateResumeData(data: unknown): ValidatedResume {
  const schema = createResumeSchema;
  return schema.parse(data);
}

// One responsibility: Save resume to database
async function saveResume(userId: string, data: ValidatedResume): Promise<Resume> {
  return prisma.resume.create({
    data: { userId, ...data, version: 1 },
  });
}

// One responsibility: Orchestrate the creation
async function createResume(userId: string, data: unknown): Promise<Resume> {
  const validated = validateResumeData(data);
  const resume = await saveResume(userId, validated);
  return resume;
}
```

#### 4.2 Pure Functions

**Rule**: Prefer functions that:
- Have no side effects
- Return the same output for the same input
- Don't rely on external state

#### ✅ Good - Pure Functions
```typescript
// Pure function - no side effects, deterministic
function calculateAtsScore(resume: Resume): number {
  const keywordCount = resume.skills.length;
  const experienceYears = resume.experience.length;
  const educationLevel = resume.education.length;
  
  return (keywordCount * 10 + experienceYears * 15 + educationLevel * 5) / 100;
}

// Pure function - transforms data without mutation
function groupJobsByStatus(jobs: JobApplication[]): Record<string, JobApplication[]> {
  return jobs.reduce((acc, job) => {
    if (!acc[job.status]) acc[job.status] = [];
    acc[job.status].push(job);
    return acc;
  }, {} as Record<string, JobApplication[]>);
}

// Pure function - computes based on input only
function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale).format(date);
}
```

#### 4.3 Async Functions Must Handle Errors

**Rule**: Every async function must handle errors properly. No unhandled promise rejections.

#### ❌ Bad - Unhandled Error
```typescript
// No error handling
export const fetchUserData = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ success: true, data: user });
});
```

#### ✅ Good - Proper Error Handling
```typescript
// With guard clauses and error handling
export const fetchUserData = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new UnauthorizedError('User not authenticated');

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new NotFoundError('User not found');

  res.json({ success: true, data: user });
});
```

#### Error Handling Patterns

**Pattern 1**: Using helper functions
```typescript
async function getUserOrThrow(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError(`User ${userId} not found`);
  return user;
}

async function updateUserProfile(userId: string, data: ProfileUpdate): Promise<User> {
  const user = await getUserOrThrow(userId); // Will throw if not found
  
  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });
  
  return updated;
}
```

**Pattern 2**: Explicit error catching
```typescript
async function processPayment(userId: string, amount: number): Promise<PaymentResult> {
  const user = await getUserOrThrow(userId);
  
  try {
    const result = await stripeService.charge(user.stripeId, amount);
    return result;
  } catch (error) {
    if (error instanceof StripeDeclinedError) {
      throw new PaymentFailedError('Card declined');
    }
    if (error instanceof StripeNetworkError) {
      throw new PaymentNetworkError('Network error, please retry');
    }
    throw new PaymentError('Failed to process payment');
  }
}
```

#### 4.4 Never Return Null

**Rule**: Avoid returning `null`. Use `undefined` or throw errors instead.

#### ✅ Good Options

```typescript
// Option 1: Throw error for missing data
async function getResumeOrThrow(id: string, userId: string): Promise<Resume> {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) throw new NotFoundError('Resume not found');
  return resume;
}

// Option 2: Return undefined for optional data
function findResumeByTitle(title: string): Resume | undefined {
  return resumes.find(r => r.title === title);
}

// Option 3: Return default value
function getDisplayName(user: User | undefined): string {
  return user?.name ?? 'Anonymous';
}

// Option 4: Return Result type (type-safe error handling)
type Result<T> = { success: true; data: T } | { success: false; error: string };

function tryGetResume(id: string): Result<Resume> {
  const resume = resumes.find(r => r.id === id);
  return resume 
    ? { success: true, data: resume }
    : { success: false, error: 'Not found' };
}
```

---

### 5. FUNCTION STYLE GUIDE

#### 5.1 Arrow Functions vs Named Functions

**Rule 1**: Use **arrow functions only for callbacks** (event handlers, array methods)

```typescript
// ✅ Good - Array callback
const filtered = users.filter((user) => user.isActive);
const mapped = resumes.map((r) => r.title);
const sorted = jobs.sort((a, b) => a.appliedDate - b.appliedDate);

// ✅ Good - Event handler
const handleClick = () => updateResume();
const handleSubmit = (e: React.FormEvent) => e.preventDefault();

// ✅ Good - Promise chain
promise.then((data) => processData(data)).catch((err) => handleError(err));
```

**Rule 2**: Use **named functions** for services, utilities, and independent logic

```typescript
// ✅ Good - Named function
export function calculateAtsScore(resume: Resume): number {
  // implementation
}

export async function saveResume(userId: string, resume: Resume): Promise<void> {
  // implementation
}

export function validateEmail(email: string): boolean {
  // implementation
}

// ✅ Good - Component/Hook (also named)
export function ResumeBuilder(): React.ReactElement {
  // implementation
}

export function useResumes(userId: string) {
  // implementation
}
```

#### Arrow Function Exception - Complex Callbacks

```typescript
// ❌ Bad - Complex logic shouldn't be inline
items.map((item) => {
  const processed = processData(item.data);
  const validated = validateProcessed(processed);
  const transformed = transformForDisplay(validated);
  return { ...item, display: transformed };
});

// ✅ Good - Extract to named function
function transformItemForDisplay(item: Item): DisplayItem {
  const processed = processData(item.data);
  const validated = validateProcessed(processed);
  const transformed = transformForDisplay(validated);
  return { ...item, display: transformed };
}

items.map(transformItemForDisplay);
```

#### 5.2 Function Declaration Styles

```typescript
// Style 1: Named function (PREFERRED for services/utilities)
export function getUserById(id: string): User {
  return users.find(u => u.id === id);
}

// Style 2: Arrow function in object (ACCEPTABLE for object methods)
export const userApi = {
  getMe: () => api.get('/me'),
  updateMe: (data: UserUpdate) => api.put('/me', data),
};

// Style 3: Async named function
export async function fetchUserData(userId: string): Promise<User> {
  return prisma.user.findUnique({ where: { id: userId } });
}

// Style 4: Async arrow function (ONLY for callbacks/handlers)
const handleAsync = async () => {
  const data = await fetchData();
  setData(data);
};
```

---

## Implementation Checklist

For every function in your code, verify:

- [ ] **Size**: Function is ≤ 30 lines
- [ ] **Parameters**: Function has ≤ 3 parameters (or uses options object)
- [ ] **Guard Clauses**: Failure cases handled first
- [ ] **Single Responsibility**: Function does ONE thing
- [ ] **Pure Functions**: No side effects when possible
- [ ] **Error Handling**: All async functions handle errors
- [ ] **No Null**: Returns undefined or throws, never null
- [ ] **Named Functions**: Services/utilities use named functions
- [ ] **Arrow Functions**: Only callbacks and handlers
- [ ] **Early Returns**: Maximum nesting depth ≤ 2

---

## Backend Service Refactoring Pattern

```typescript
// Old Pattern - Multiple responsibilities, >30 lines, unhandled errors
async function processResumeUpdate(
  userId: string,
  resumeId: string,
  data: any,
  validateSchema: any,
  cacheKey: string,
  cacheService: CacheService
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
    if (resume) {
      const validated = validateSchema.parse(data);
      const updated = await prisma.resume.update({
        where: { id: resumeId },
        data: validated,
      });
      await cacheService.set(cacheKey, updated);
      await invalidateCacheKeys([`resume:${userId}`]);
      return updated;
    }
  }
  throw new Error('Not found');
}
```

### New Pattern - Single Responsibility

```typescript
// Helper 1: Validation (validates data)
function validateResumeUpdate(data: unknown): ResumeUpdateData {
  return resumeUpdateSchema.parse(data);
}

// Helper 2: Authorization (checks permissions)
async function ensureResumeOwnership(
  userId: string,
  resumeId: string
): Promise<Resume> {
  const resume = await findResumeOrThrow(resumeId);
  if (resume.userId !== userId) {
    throw new ForbiddenError('Not authorized');
  }
  return resume;
}

// Helper 3: Persist (saves to database)
async function persistResumeUpdate(
  resumeId: string,
  data: ResumeUpdateData
): Promise<Resume> {
  return prisma.resume.update({ where: { id: resumeId }, data });
}

// Helper 4: Cache invalidation
async function invalidateResumeCache(resumeId: string, userId: string): Promise<void> {
  const cacheKeys = [`resume:${resumeId}`, `resumes:${userId}`];
  await cacheService.deleteMany(cacheKeys);
}

// Orchestrator (14 lines - within limits)
export async function updateResume(
  userId: string,
  resumeId: string,
  data: unknown
): Promise<Resume> {
  const validated = validateResumeUpdate(data);
  await ensureResumeOwnership(userId, resumeId);
  
  const updated = await persistResumeUpdate(resumeId, validated);
  await invalidateResumeCache(resumeId, userId);
  
  return updated;
}
```

---

## Frontend Component Refactoring Pattern

```typescript
// Old Pattern - Complex logic in component
export function ResumeBuilder() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = (field, value, index) => {
    if (field && value !== undefined && index !== null) {
      const updated = JSON.parse(JSON.stringify(data));
      const parts = field.split('.');
      let obj = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]][index] = value;
      setData(updated);
    }
  };

  return (
    <div>
      {data?.experience?.map((exp, idx) => (
        <input
          onChange={(e) => handleUpdate('experience.title', e.target.value, idx)}
        />
      ))}
    </div>
  );
}
```

### New Pattern - Extracted Logic

```typescript
// Helper 1: Type-safe data updater
interface UpdateFieldOptions {
  readonly data: ResumeData;
  readonly path: string;
  readonly index: number;
  readonly value: unknown;
}

function updateResumeField(options: UpdateFieldOptions): ResumeData {
  const { data, path, index, value } = options;
  
  // Validate inputs
  if (!path || value === undefined || index < 0) {
    return data; // Return unchanged if invalid
  }

  // Create immutable copy and update
  const updated = structuredClone(data);
  const parts = path.split('.');
  let obj: any = updated;
  
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]];
  }
  
  if (Array.isArray(obj[parts[parts.length - 1]])) {
    obj[parts[parts.length - 1]][index] = value;
  }
  
  return updated;
}

// Helper 2: Create onChange handler
function createFieldChangeHandler(
  setter: (data: ResumeData) => void,
  data: ResumeData,
  path: string,
  index: number
) {
  return (value: unknown): void => {
    const updated = updateResumeField({ data, path, index, value });
    setter(updated);
  };
}

// Component - Now Simple & Focused
export function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(initialData);

  const handleExperienceChange = (idx: number, value: string): void => {
    setData(updateResumeField({ data, path: 'experience.title', index: idx, value }));
  };

  return (
    <div>
      {data.experience.map((exp, idx) => (
        <input
          key={exp.id}
          value={exp.title}
          onChange={(e) => handleExperienceChange(idx, e.target.value)}
        />
      ))}
    </div>
  );
}
```

---

## Linting & Enforcement

Add to ESLint config to auto-detect violations:

```json
{
  "rules": {
    "max-lines-per-function": ["error", { "max": 30 }],
    "max-params": ["error", { "max": 3 }],
    "no-nested-ternary": "error",
    "complexity": ["error", { "max": 5 }],
    "no-implicit-coercion": "error",
    "no-unused-vars": "error",
    "prefer-arrow-callback": "error",
    "no-var": "error",
    "@typescript-eslint/explicit-function-return-types": "error"
  }
}
```

---

## Summary

| Aspect | Rule | Why |
|--------|------|-----|
| **Size** | ≤ 30 lines | Easier to understand, test, debug |
| **Parameters** | ≤ 3 params (use options) | Prevents confusion, self-documenting |
| **Guard Clauses** | Fail fast, early returns | Eliminates nesting, improves readability |
| **Responsibility** | One reason to change | Focused, reusable, testable |
| **Purity** | No side effects | Predictable, testable, composable |
| **Error Handling** | Always handle in async | Prevents unhandled rejections |
| **Return Values** | No null, use undefined/throw | Type-safe, explicit intent |
| **Style** | Named functions, arrow callbacks | Clear intent, consistency |

---

## Quick Reference

```typescript
// ✅ GOOD FUNCTION
async function handleUserUpdate(
  userId: string,
  updates: UserUpdateOptions  // 1 object param = counts as 1
): Promise<User> {
  // Guard clauses first
  if (!userId) throw new InvalidInputError('userId required');
  if (!updates || Object.keys(updates).length === 0) {
    throw new InvalidInputError('No updates provided');
  }

  // Get data (single responsibility)
  const user = await getUserOrThrow(userId);
  
  // Validate (single responsibility)
  const validatedUpdates = validateUserUpdate(updates);
  
  // Persist (single responsibility)
  const updated = await persistUserUpdate(userId, validatedUpdates);
  
  // Handle side effects (single responsibility)
  await invalidateUserCache(userId);
  
  // Return result
  return updated;
  // Total: 18 lines - WITHIN LIMIT ✅
}
```

