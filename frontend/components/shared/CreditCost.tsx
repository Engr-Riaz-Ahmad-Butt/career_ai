import { cn } from '@/lib/utils';

export interface CreditCostProps {
  /**
   * Number of credits
   */
  amount: number;
  
  /**
   * Label text (e.g., "Cost", "Credits Required")
   */
  label?: string;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Display style
   */
  variant?: 'default' | 'badge' | 'inline';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeStyles = {
  sm: {
    container: 'text-xs',
    icon: 'text-base',
  },
  md: {
    container: 'text-sm',
    icon: 'text-lg',
  },
  lg: {
    container: 'text-base',
    icon: 'text-xl',
  },
};

/**
 * Reusable credit cost display component
 * Standardizes credit amount displays across the app
 */
export function CreditCost({
  amount,
  label,
  size = 'md',
  variant = 'default',
  className,
}: CreditCostProps) {
  const styles = sizeStyles[size];

  if (variant === 'badge') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
          'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
          'font-medium',
          styles.container,
          className
        )}
      >
        <span className={styles.icon}>✨</span>
        {amount} {amount === 1 ? 'credit' : 'credits'}
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1 text-indigo-600', styles.container, className)}>
        <span className={styles.icon}>✨</span>
        <span className="font-medium">{amount}</span>
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', styles.container, className)}>
      <span className={cn('text-indigo-600', styles.icon)}>✨</span>
      <div>
        {label && <span className="text-gray-600 dark:text-gray-400">{label}: </span>}
        <span className="font-semibold text-gray-900 dark:text-white">
          {amount} {amount === 1 ? 'credit' : 'credits'}
        </span>
      </div>
    </div>
  );
}
