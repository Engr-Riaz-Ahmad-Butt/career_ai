import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface KeywordTagProps {
  text: string;
  status: 'found' | 'missing';
  onRemove?: () => void;
  animated?: boolean;
}

export function KeywordTag({ text, status, onRemove, animated = true }: KeywordTagProps) {
  const isFound = status === 'found';
  const bgColor = isFound ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30';
  const textColor = isFound ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300';

  const Component = animated ? motion.div : 'div';

  return (
    <Component
      initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      exit={animated ? { opacity: 0, scale: 0.8 } : undefined}
      transition={animated ? { duration: 0.2 } : undefined}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${bgColor} ${textColor}`}
    >
      {text}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-70">
          <X className="h-3 w-3" />
        </button>
      )}
    </Component>
  );
}
