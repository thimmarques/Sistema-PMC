import React from 'react';
import { cn } from './index';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function Toggle({ checked, onChange, label, className, icon }: ToggleProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2",
          checked ? "bg-[var(--color-gold)]" : "bg-gray-200 dark:bg-[var(--color-chumbo)]/20"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {(label || icon) && (
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-chumbo)]">
          {icon}
          {label}
        </label>
      )}
    </div>
  );
}
