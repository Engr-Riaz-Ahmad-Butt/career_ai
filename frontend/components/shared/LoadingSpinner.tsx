import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  /**
   * Size variant for the spinner
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Color/theme variant
   */
  variant?: 'primary' | 'white' | 'current';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Optional label for accessibility
   */
  label?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
} as const;

const variantMap = {
  primary: 'text-indigo-600',
  white: 'text-white',
  current: 'text-current',
} as const;

/**
 * Reusable loading spinner component
 * Replaces all instances of <Loader2 className="... animate-spin" />
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className,
  label = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin', sizeMap[size], variantMap[variant], className)}
      aria-label={label}
      role="status"
    />
  );
}

/**
 * Full-page loading state with centered spinner
 */
export interface LoadingStateProps {
  size?: LoadingSpinnerProps['size'];
  variant?: LoadingSpinnerProps['variant'];
  message?: string;
}

export function LoadingState({ size = 'xl', variant = 'primary', message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size={size} variant={variant} />
      {message && <p className="text-gray-600 dark:text-gray-400">{message}</p>}
    </div>
  );
}

/**
 * Inline loading indicator with text
 */
export interface InlineLoadingProps {
  text: string;
  size?: LoadingSpinnerProps['size'];
}

export function InlineLoading({ text, size = 'sm' }: InlineLoadingProps) {
  return (
    <span className="flex items-center gap-2">
      <LoadingSpinner size={size} variant="current" />
      <span>{text}</span>
    </span>
  );
}
