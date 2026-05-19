import React, { forwardRef } from 'react';
import { cn } from './index';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface-low)] px-3 py-2 text-sm placeholder:text-[var(--color-chumbo)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-[var(--color-error)] text-[var(--color-error)] focus:ring-[var(--color-error)]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
