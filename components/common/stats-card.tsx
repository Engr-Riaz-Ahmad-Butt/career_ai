import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  trend = 'neutral',
  className = '',
}: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-slate-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {value}
            </motion.p>
            {change !== undefined && (
              <span className={`text-xs font-medium ${trendColor}`}>
                {trend === 'up' ? '+' : ''}{change}% {changeLabel}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-3">
          <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    </motion.div>
  );
}
