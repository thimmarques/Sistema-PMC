import React from 'react';
import { cn } from './button';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  value?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export function Card({ className, title, icon, value, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-surface-high)] bg-[var(--color-surface-low)] p-5 shadow-sm transition-all',
        className
      )}
      {...props}
    >
      {(title || icon || value !== undefined) && (
        <div className="flex items-start gap-4 mb-2">
          {icon && (
            <div className="shrink-0">
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="text-xs font-medium uppercase text-[var(--color-text-secondary)]">{title}</h3>}
            {value !== undefined && (
              <div className="mt-1 text-2xl font-bold text-[var(--color-chumbo)]">
                {value}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="text-[var(--color-chumbo)]">
        {children}
      </div>
    </div>
  );
}
