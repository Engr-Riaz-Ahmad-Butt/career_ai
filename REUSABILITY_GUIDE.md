# Reusability Improvements Documentation

## Overview
This document describes the reusable components, hooks, and utilities created to reduce code duplication across the CareerForge AI application.

## Frontend - Shared Components

### Created Components

#### 1. LoadingSpinner (`components/shared/LoadingSpinner.tsx`)
**Purpose:** Standardize loading indicators across the app  
**Replaces:** 15+ instances of `<Loader2 className="... animate-spin" />`

**Variants:**
- `LoadingSpinner` - Configurable spinner with size and variant
- `LoadingState` - Full-page loading state with optional message
- `InlineLoading` - Inline loading with text

**Usage:**
```tsx
import { LoadingSpinner, LoadingState, InlineLoading } from '@/components/shared';

// Simple spinner
<LoadingSpinner size="md" variant="primary" />

// Full page
<LoadingState size="xl" message="Loading data..." />

// Inline with text
<InlineLoading text="Saving..." size="sm" />
```

#### 2. EmptyState (`components/shared/EmptyState.tsx`)
**Purpose:** Standardize "no items found" displays  
**Replaces:** Repeated empty state patterns

**Usage:**
```tsx
import { EmptyState } from '@/components/shared';
import { Inbox } from 'lucide-react';

<EmptyState
  icon={Inbox}
  title="No documents found"
  description="Upload your first document to get started"
  action={{
    label: "Upload Document",
    onClick: handleUpload,
    icon: Upload
  }}
/>
```

#### 3. StatusBadge (`components/shared/StatusBadge.tsx`)
**Purpose:** Standardize status indicators  
**Variants:** success, error, warning, info, default, processing

**Usage:**
```tsx
import { StatusBadge } from '@/components/shared';

<StatusBadge 
  label="Completed" 
  variant="success" 
  icon={CheckCircle}
  size="md"
/>
```

#### 4. FileUploader (`components/shared/FileUploader.tsx`)
**Purpose:** Standardize file upload UI with drag-and-drop  
**Replaces:** 3+ file input patterns

**Usage:**
```tsx
import { FileUploader } from '@/components/shared';

<FileUploader
  accept=".pdf,.docx"
  maxSizeMB={10}
  onFilesSelected={handleFiles}
  files={uploadedFiles}
  onRemoveFile={handleRemove}
  label="Upload Resume"
/>
```

#### 5. PageHeader (`components/shared/PageHeader.tsx`)
**Purpose:** Standardize page titles and actions

**Usage:**
```tsx
import { PageHeader } from '@/components/shared';
import { Plus, FileText } from 'lucide-react';

<PageHeader
  title="Documents"
  description="Manage your uploaded documents"
  icon={FileText}
  actions={[
    {
      label: "New Document",
      onClick: handleNew,
      icon: Plus,
      variant: "default"
    }
  ]}
/>
```

#### 6. CreditCost (`components/shared/CreditCost.tsx`)
**Purpose:** Standardize credit amount displays

**Usage:**
```tsx
import { CreditCost } from '@/components/shared';

<CreditCost amount={5} label="Cost" variant="badge" />
<CreditCost amount={10} variant="inline" />
```

## Frontend - Shared Hooks

### Created Hooks

#### 1. useAsync (`hooks/use-async.ts`)
**Purpose:** Manage async operations state  
**Replaces:** 39+ instances of local `isLoading` state management

**Usage:**
```tsx
import { useAsync } from '@/hooks';

const { execute, isLoading, data, error, isSuccess } = useAsync(
  async (userId: string) => {
    return await api.fetchUser(userId);
  }
);

// In component
const handleFetch = () => execute('user-123');

{isLoading && <LoadingSpinner />}
{error && <p>Error: {error.message}</p>}
{data && <UserProfile data={data} />}
```

#### 2. useConfirm (`hooks/use-confirm.ts`)
**Purpose:** Show confirmation dialogs programmatically

**Usage:**
```tsx
import { useConfirm } from '@/hooks';

const { confirm, ConfirmDialog } = useConfirm();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Delete Item?',
    description: 'This action cannot be undone.',
    variant: 'destructive',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  });
  
  if (confirmed) {
    await deleteItem();
  }
};

return (
  <>
    <button onClick={handleDelete}>Delete</button>
    <ConfirmDialog />
  </>
);
```

#### 3. useDebounce (`hooks/use-debounce.ts`)
**Purpose:** Debounce values (already existed, now indexed)

**Usage:**
```tsx
import { useDebounce } from '@/hooks';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // API call with debounced value
  searchAPI(debouncedSearch);
}, [debouncedSearch]);
```

#### 4. useLocalStorage (`hooks/use-local-storage.ts`)
**Purpose:** Persist state in localStorage with sync across tabs

**Usage:**
```tsx
import { useLocalStorage } from '@/hooks';

const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

// Use like useState
setTheme('dark');
```

#### 5. usePagination (`hooks/use-pagination.ts`)
**Purpose:** Client-side pagination logic

**Usage:**
```tsx
import { usePagination, getPaginatedData } from '@/hooks';

const { 
  currentPage, 
  totalPages, 
  nextPage, 
  prevPage, 
  isFirstPage, 
  isLastPage,
  rangeText 
} = usePagination({
  totalItems: items.length,
  pageSize: 10
});

const pageData = getPaginatedData(items, currentPage, 10);
```

#### 6. useToast (`hooks/use-toast.ts`)
**Purpose:** Wrapper around antd message API

**Usage:**
```tsx
import { useToast } from '@/hooks';

const toast = useToast();

toast.success('Profile updated!');
toast.error('Something went wrong');
toast.warning('Please verify your email');
```

## Backend - Utilities

### Created Utilities

#### 1. Error Handler (`utils/errorHandler.ts`)
**Purpose:** Standardize error handling  
**Replaces:** 24+ try-catch blocks

**Error Classes:**
- `AppError` - Base error with status code
- `ValidationError` - 400 validation errors
- `UnauthorizedError` - 401 unauthorized
- `ForbiddenError` - 403 forbidden
- `NotFoundError` - 404 not found
- `ConflictError` - 409 conflict
- `InsufficientCreditsError` - 402 payment required

**Usage:**
```typescript
import { asyncHandler, NotFoundError, ValidationError } from '@/utils';

// Wrap route handlers to auto-catch errors
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json(successResponse(user));
}));

// In app.ts, add error handler middleware at the end
import { errorHandler } from '@/utils';
app.use(errorHandler);
```

#### 2. Validators (`utils/validators.ts`)
**Purpose:** Common validation patterns

**Functions:**
- `validateRequired(data, fields)` - Check required fields
- `validateEmail(email)` - Email format validation
- `validatePassword(password)` - Password strength
- `validatePagination(page, limit)` - Pagination params
- `sanitizeString(value)` - Trim and clean strings
- `validateEnum(value, allowed, field)` - Enum validation
- `validateNonEmptyArray(arr, field)` - Array validation

**Usage:**
```typescript
import { validateRequired, validateEmail, sanitizeFields } from '@/utils';

// Validate required
validateRequired(req.body, ['email', 'password', 'name']);

// Validate email
if (!validateEmail(email)) {
  throw new ValidationError('Invalid email format');
}

// Sanitize inputs
const clean = sanitizeFields(req.body, ['name', 'bio']);
```

#### 3. Base Service (`utils/BaseService.ts`)
**Purpose:** Base class for services with common patterns

**Usage:**
```typescript
import { BaseService } from '@/utils';

export class UserService extends BaseService<User> {
  protected entityName = 'User';

  async findById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id } });
    this.assertExists(user, id); // Throws NotFoundError if null
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    this.validateRequired(data, ['email', 'password', 'name']);
    
    const { skip, take, page } = this.getPaginationParams(
      data.page, 
      data.limit
    );
    
    // ... create user
  }
}
```

#### 4. Database Helpers (`utils/dbHelpers.ts`)
**Purpose:** Common database operation patterns

**Functions:**
- `withTransaction(fn)` - Auto-rollback transaction wrapper
- `softDelete(model, id)` - Set deletedAt timestamp
- `recordExists(model, where)` - Check existence
- `getPaginated(model, params)` - Paginated query with total count

**Usage:**
```typescript
import { withTransaction, getPaginated, recordExists } from '@/utils';

// Transaction
const user = await withTransaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.profile.create({ data: { userId: user.id } });
  return user;
});

// Paginated results
const { data, total } = await getPaginated('resume', {
  where: { userId: user.id },
  skip: 0,
  take: 20,
  orderBy: { createdAt: 'desc' }
});

// Check existence
if (await recordExists('user', { email })) {
  throw new ConflictError('Email already exists');
}
```

## Migration Guide

### Frontend: Replacing Loader2 with LoadingSpinner

**Before:**
```tsx
import { Loader2 } from 'lucide-react';

{isLoading && <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />}
```

**After:**
```tsx
import { LoadingSpinner } from '@/components/shared';

{isLoading && <LoadingSpinner size="lg" variant="primary" />}
```

### Frontend: Replacing Local Loading State with useAsync

**Before:**
```tsx
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const result = await api.fetch();
    setData(result);
  } catch (err) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};
```

**After:**
```tsx
import { useAsync } from '@/hooks';

const { execute, isLoading, data, error } = useAsync(
  async () => await api.fetch()
);

// Call execute() to trigger
```

### Backend: Adding Error Handling

**Before:**
```typescript
router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.params.id } 
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});
```

**After:**
```typescript
import { asyncHandler, NotFoundError, successResponse } from '@/utils';

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ 
    where: { id: req.params.id } 
  });
  
  if (!user) throw new NotFoundError('User');
  
  res.json(successResponse(user));
}));
```

## Summary of Changes

### Frontend
- **Created:** 6 shared components (LoadingSpinner, EmptyState, StatusBadge, FileUploader, PageHeader, CreditCost)
- **Created:** 6 shared hooks (useAsync, useConfirm, useLocalStorage, usePagination, useToast, useDebounce)
- **Replaced:** 15+ Loader2 instances with LoadingSpinner
- **Impact:** ~39 files with local `isLoading` state can be refactored to use `useAsync`

### Backend
- **Created:** Error handling utilities (AppError classes, asyncHandler, errorHandler middleware)
- **Created:** Validation utilities (validateRequired, validateEmail, etc.)
- **Created:** Database helpers (withTransaction, getPaginated, etc.)
- **Created:** BaseService class for consistent service patterns
- **Impact:** ~24 try-catch blocks can use asyncHandler, all services can extend BaseService

## Next Steps

1. Gradually migrate existing components to use shared components
2. Refactor pages with local loading state to use `useAsync`
3. Update backend controllers to use `asyncHandler`
4. Create services extending `BaseService`
5. Replace direct Prisma calls with database helpers where appropriate
