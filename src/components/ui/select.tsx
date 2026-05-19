import React, { forwardRef } from 'react';
import { cn } from './index';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <select
          className={cn(
            'flex h-10 w-full rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface-low)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors appearance-none',
            error && 'border-[var(--color-error)] text-[var(--color-error)] focus:ring-[var(--color-error)]',
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="" disabled>Selecione uma opção</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
