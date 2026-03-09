/**
 * Common Hooks - Reusable logic patterns
 * Used across the application to reduce duplication
 */

// Async operations
export { useAsync, useAsyncFn } from './use-async';
export type { AsyncState, AsyncStatus, UseAsyncReturn } from './use-async';

// Confirmation dialogs
export { useConfirm } from './use-confirm.tsx';
export type { ConfirmOptions, UseConfirmReturn } from './use-confirm.tsx';

// Debouncing
export { useDebounce } from './use-debounce';

// Local storage
export { useLocalStorage } from './use-local-storage';

// Pagination
export { usePagination, getPaginatedData } from './use-pagination';
export type { PaginationConfig, UsePaginationReturn } from './use-pagination';

// Toast notifications
export { useToast } from './use-toast';
export type { ToastOptions, UseToastReturn } from './use-toast';
