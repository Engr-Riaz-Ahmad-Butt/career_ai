import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type StatusVariant = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'default' 
  | 'processing';

export interface StatusBadgeProps {
  /**
   * Status display text
   */
  label: string;
  
  /**
   * Visual variant
   */
  variant?: StatusVariant;
  
  /**
   * Optional icon
   */
  icon?: LucideIcon;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconSizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/**
 * Reusable status badge component
 * Standardizes status indicators across the app
 */
export function StatusBadge({
  label,
  variant = 'default',
  icon: Icon,
  size = 'md',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {Icon && <Icon className={iconSizeMap[size]} />}
      {label}
    </span>
  );
}
