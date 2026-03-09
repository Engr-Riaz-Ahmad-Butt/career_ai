import { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /**
   * Icon to display
   */
  icon?: LucideIcon;
  
  /**
   * Main heading text
   */
  title: string;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reusable empty state component
 * Standardizes "no items found" displays across the app
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-6">
          <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
