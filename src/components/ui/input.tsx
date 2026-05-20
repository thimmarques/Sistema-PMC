import React, { forwardRef } from 'react';
import { cn } from './button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, leftAddon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="relative flex items-center w-full">
          {leftAddon && (
            <div className="absolute left-3 text-sm text-[var(--color-text-secondary)] pointer-events-none">
              {leftAddon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface-low)] px-3 py-1 text-sm placeholder:text-[var(--color-chumbo)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              leftAddon && 'pl-9',
              error && 'border-[var(--color-error)] text-[var(--color-error)] focus:ring-[var(--color-error)]',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
