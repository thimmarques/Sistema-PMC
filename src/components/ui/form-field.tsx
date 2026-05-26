import React from 'react';
import { cn } from './index';

interface FormFieldProps {
  label: string;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormField({ label, error, helpText, children, className, required }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-[13px] font-semibold text-[var(--color-chumbo)]/80 uppercase tracking-wide">
        {label} {required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      {children}
      {helpText && (
        <span className="text-[11px] text-[var(--color-text-secondary)] opacity-70 italic">{helpText}</span>
      )}
      {error && (
        <span className="text-xs text-[var(--color-error)] mt-0.5">{error}</span>
      )}
    </div>
  );
}
