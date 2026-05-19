import React from 'react';
import { cn } from './button';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'processos';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function StatusBadge({ className, variant = 'info', children, ...props }: BadgeProps) {
  const variants = {
    success: 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)] border-opacity-20',
    warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)] border-opacity-20',
    error: 'bg-[var(--color-error-light)] text-[var(--color-error)] border-[var(--color-error)] border-opacity-20',
    info: 'bg-[var(--color-info-light)] text-[var(--color-info)] border-[var(--color-info)] border-opacity-20',
    processos: 'bg-[var(--color-processos-light)] text-[var(--color-processos)] border-[var(--color-processos)] border-opacity-20',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
