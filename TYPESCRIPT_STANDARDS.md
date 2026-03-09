# TypeScript Strict Standards - CareerForge

## Overview

This project enforces **strict TypeScript standards** across all files (frontend and backend). Both tsconfig files have `"strict": true` enabled, requiring compliance with all strict type checks.

## Core Rules

### 1. No Implicit or Explicit `any`

❌ **AVOID:**
```typescript
// Implicit any - function params without types
export const processData = (data) => { ... }

// Explicit any
export const updateMe = (data: any) => { ... }

// Type assertions with any
const result = (resume.field as any) ?? default;
```

✅ **PREFER:**
```typescript
// Explicit types
export const processData = (data: Record<string, unknown>): void => { ... }

// Or with generics
export const processData = <T>(data: T): T => { ... }

// Proper type narrowing
const result = typeof resume.field === 'object' && resume.field !== null 
  ? resume.field 
  : default;
```

### 2. Use `unknown` with Type Narrowing, Not `any`

❌ **AVOID:**
```typescript
const execute: (...args: any[]) => Promise<T | undefined>;
```

✅ **PREFER:**
```typescript
const execute: (...args: unknown[]) => Promise<T | undefined>;

// Or with proper typing:
function handleArgs(args: unknown[]): void {
  for (const arg of args) {
    if (typeof arg === 'string') {
      // arg is string here
    } else if (typeof arg === 'object' && arg !== null) {
      // arg is object here
    }
  }
}
```

### 3. Use Interfaces for Object Shapes

❌ **AVOID:**
```typescript
const updateSettings = (data: any) => api.put('/settings', data);
```

✅ **PREFER:**
```typescript
interface UserSettings {
  theme?: string;
  emailNotifications?: boolean;
  language?: string;
  [key: string]: string | boolean | undefined;
}

const updateSettings = (data: Partial<UserSettings>) => 
  api.put('/settings', data);
```

### 4. Use Type Aliases for Unions and Computed Types

❌ **AVOID:**
```typescript
let status: 'idle' | 'loading' | 'success' | 'error';
```

✅ **PREFER:**
```typescript
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
const status: AsyncStatus = 'idle';
```

### 5. Use Discriminated Unions for State Management

❌ **AVOID:**
```typescript
interface LoadingState {
  status: string;
  data?: unknown;
  error?: Error;
  isLoading: boolean;
}
```

✅ **PREFER:**
```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Exhaustive type checking:
function handle<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle': // Only available properties for idle
      break;
    case 'loading': // No data/error needed
      break;
    case 'success': // data is guaranteed here
      console.log(state.data);
      break;
    case 'error': // error is guaranteed here
      console.log(state.error);
      break;
  }
}
```

### 6. Use Generics to Avoid Duplication

❌ **AVOID:**
```typescript
const handleStringArray = (arr: any[]) => { ... }
const handleNumberArray = (arr: any[]) => { ... }
```

✅ **PREFER:**
```typescript
function handleArray<T>(arr: T[]): void {
  arr.forEach(item => {
    // item is properly typed as T
  });
}

// For API responses:
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
}>;
```

### 7. Use Zod for Runtime Validation

❌ **AVOID:**
```typescript
const updateResumeData = async (data: any) => {
  if (!data.title) throw new Error('Title required');
  // Manual validation
};
```

✅ **PREFER:**
```typescript
import { z } from 'zod';

const CreateResumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  template: z.string().optional(),
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string().email(),
  }).optional(),
});

type CreateResumeInput = z.infer<typeof CreateResumeSchema>;

const updateResumeData = async (data: CreateResumeInput) => {
  // data is fully validated and typed
  const validated = CreateResumeSchema.parse(data); // Runtime validation
  // or use:
  const result = CreateResumeSchema.safeParse(data); // Doesn't throw
};
```

### 8. Use `readonly` for Immutable Objects

❌ **AVOID:**
```typescript
interface User {
  id: string;
  email: string;
  age: number;
}
```

✅ **PREFER:**
```typescript
interface User {
  readonly id: string;
  readonly email: string;
  readonly age: number;
}

// Or for state objects:
interface AsyncState<T> {
  readonly data: T | null;
  readonly error: Error | null;
  readonly status: AsyncStatus;
  readonly isLoading: boolean;
}
```

### 9. Use Optional Chaining and Nullish Coalescing

❌ **AVOID:**
```typescript
const name = user && user.profile && user.profile.name ? user.profile.name : 'Unknown';

const value = data && data.value !== undefined ? data.value : defaultValue;
```

✅ **PREFER:**
```typescript
const name = user?.profile?.name ?? 'Unknown';

const value = data?.value ?? defaultValue;
```

### 10. Avoid Type Assertions When Possible

❌ **AVOID:**
```typescript
const data = (resume.personalInfo as any)?.fullName ?? '';

const status = (resume.status as any) ?? 'DRAFT';
```

✅ **PREFER:**
```typescript
// Create helper functions:
function extractPersonalInfo(data: unknown): Record<string, unknown> {
  if (typeof data === 'object' && data !== null) {
    return data as Record<string, unknown>;
  }
  return {};
}

const personalData = extractPersonalInfo(resume.personalInfo);
const fullName = String(personalData.fullName ?? '');

// Or use type guards:
function isResume(obj: unknown): obj is BackendResume {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'title' in obj;
}

if (isResume(data)) {
  // data is properly typed as BackendResume
}
```

## API Layer Standards

### Zod Schemas for API Functions

```typescript
// validation.ts
export const generateResumeSchema = z.object({
  jobTitle: z.string().min(1, 'Job title required'),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export type GenerateResumeInput = z.infer<typeof generateResumeSchema>;

// use-ai.ts
import { GenerateResumeInput, generateResumeSchema } from '@/lib/validation';

export const aiApi = {
  generateResume: (data: GenerateResumeInput) => 
    api.post('/ai/generate-resume', data).then((res) => res.data),
};
```

## Component Standards

### Type-Safe Event Handlers

❌ **AVOID:**
```typescript
const handleChange = (e: any) => {
  setData(e.target.value);
};

const handleSubmit = (e: any) => {
  e.preventDefault();
};
```

✅ **PREFER:**
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setData(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// For custom callbacks:
type OnDataChange = (data: Record<string, unknown>) => void;

interface ComponentProps {
  title: string;
  onDataChange: OnDataChange;
}
```

### Props Interface Pattern

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'secondary' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly isLoading?: boolean;
  readonly onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size, 
  isLoading, 
  ...props 
}) => {
  // Component implementation
};
```

## Service Layer Standards

### Service Method Typing

```typescript
interface CreateResumeInput {
  readonly title: string;
  readonly template: string;
  readonly userId: string;
}

interface ResumResponse {
  readonly id: string;
  readonly title: string;
  readonly createdAt: Date;
}

export class ResumeService {
  async create(input: CreateResumeInput): Promise<ResumResponse> {
    // Implementation
  }

  async getMany(
    filter: { userId: string },
    pagination?: { page: number; limit: number },
  ): Promise<ResumResponse[]> {
    // Implementation
  }
}
```

## Utility Function Standards

```typescript
// Properly typed generic utility:
function filterByPredicate<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// Type-safe batch operations:
async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  return results;
}
```

## Tests Standards

```typescript
// Mock types properly:
interface MockService {
  fetchUser: jest.Mock<Promise<User>>;
  updateUser: jest.Mock<Promise<User>>;
}

const mockService: MockService = {
  fetchUser: jest.fn(),
  updateUser: jest.fn(),
};

// Type-safe assertions:
expect(mockService.fetchUser).toHaveBeenCalledWith('user-id');

// Don't use 'as any' in tests:
const user: User = {
  id: 'test',
  email: 'test@example.com',
  name: 'Test User',
};
```

## Migration Checklist

- [ ] Enable strict mode in all tsconfigs (already done)
- [ ] Replace all `any` types with specific types or `unknown`
- [ ] Add Zod schemas for all API input/output
- [ ] Create type-safe event handlers
- [ ] Replace type assertions (`as any`) with type guards or helpers
- [ ] Add `readonly` modifiers to immutable objects
- [ ] Use discriminated unions for state management
- [ ] Create proper interfaces for all props
- [ ] Validate builds pass with strict mode
- [ ] Update documentation for new patterns

## Tools and Resources

- **Zod**: Runtime validation and TypeScript inference https://zod.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
- **Utility Types**: Partial, Pick, Omit, Record, etc.

## Enforcement

All pull requests must pass TypeScript strict mode checks:
```bash
# Frontend
npm run build

# Backend
npm run build
```

Violations will be caught during CI/CD pipeline.
