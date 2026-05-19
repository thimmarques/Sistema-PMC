import React from 'react';
import { cn } from './index';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormField({ label, error, children, className, required }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-[13px] font-semibold text-[var(--color-chumbo)]/80 uppercase tracking-wide">
        {label} {required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-[var(--color-error)] mt-0.5">{error}</span>
      )}
    </div>
  );
}
