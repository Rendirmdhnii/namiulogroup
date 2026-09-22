import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  className?: string;
  barColor?: string;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  className,
  barColor,
  heightClass = 'h-2',
}) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  const getAutoColor = (pct: number) => {
    if (pct >= 100) return 'bg-emerald-500';
    if (pct >= 50) return 'bg-indigo-500';
    if (pct > 0) return 'bg-amber-500';
    return 'bg-zinc-300';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50', heightClass)}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            barColor || getAutoColor(clamped)
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
