import { cn } from '@/lib/utils';
import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
);
Label.displayName = 'Label';
