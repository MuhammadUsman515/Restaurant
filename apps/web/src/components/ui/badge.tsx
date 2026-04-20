import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const variants = {
  primary: 'bg-primary/20 text-primary-light border-primary/30',
  secondary: 'bg-secondary/20 text-secondary-light border-secondary/30',
  success: 'bg-success/20 text-success-light border-success/30',
  warning: 'bg-warning/20 text-warning-light border-warning/30',
  danger: 'bg-danger/20 text-danger-light border-danger/30',
  info: 'bg-info/20 text-info border-info/30',
  neutral: 'bg-white/10 text-muted-light border-white/10',
};

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

interface BadgeProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full', {
            'bg-primary-light': variant === 'primary',
            'bg-secondary-light': variant === 'secondary',
            'bg-success-light': variant === 'success',
            'bg-warning-light': variant === 'warning',
            'bg-danger-light': variant === 'danger',
            'bg-info': variant === 'info',
            'bg-muted-light': variant === 'neutral',
          })}
        />
      )}
      {children}
    </span>
  );
}
