import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}

export interface PageHeaderProps {
  /**
   * Main page title
   */
  title: string;
  
  /**
   * Optional subtitle/description
   */
  description?: string;
  
  /**
   * Optional icon
   */
  icon?: LucideIcon;
  
  /**
   * Action buttons
   */
  actions?: PageHeaderAction[];
  
  /**
   * Custom children (for advanced layouts)
   */
  children?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reusable page header component
 * Standardizes page titles and actions across the app
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  actions = [],
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('border-b border-gray-200 dark:border-gray-800 pb-5 mb-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex-shrink-0">
                <Icon className="h-8 w-8 text-indigo-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions.map((action, index) => (
              <Button
                key={`${action.label}-${index}`}
                onClick={action.onClick}
                variant={action.variant || 'default'}
                disabled={action.disabled}
                className="gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
