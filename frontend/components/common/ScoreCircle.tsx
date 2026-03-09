import { motion } from 'framer-motion';

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ScoreCircle({
  score,
  maxScore = 100,
  label,
  size = 'md',
  showLabel = true,
}: ScoreCircleProps) {
  const percentage = (score / maxScore) * 100;

  // Color based on score
  let color = '#ef4444'; // red
  if (score >= 70) color = '#10b981'; // green
  else if (score >= 50) color = '#f59e0b'; // amber

  const sizeMap = {
    sm: 'h-20 w-20',
    md: 'h-32 w-32',
    lg: 'h-40 w-40',
  };

  const textSizeMap = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`relative ${sizeMap[size]} flex items-center justify-center`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-200 dark:text-slate-800" />

          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        {/* Score text */}
        <div className="flex flex-col items-center justify-center gap-1">
          <motion.span
            className={`font-bold text-slate-900 dark:text-white ${textSizeMap[size]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {score}
          </motion.span>
          {showLabel && (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {label}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
