import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './card';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  sparklineData?: number[];
  className?: string;
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary-light"
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  sparklineData,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted mb-1">{label}</p>
          <p className="text-2xl font-heading font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp size={14} className="text-success" />
              ) : (
                <TrendingDown size={14} className="text-danger" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-danger'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted">vs last week</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary-light">
              {icon}
            </div>
          )}
          {sparklineData && <MiniSparkline data={sparklineData} />}
        </div>
      </div>
    </Card>
  );
}
