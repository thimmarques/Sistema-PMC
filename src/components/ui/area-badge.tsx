import React from 'react';
import { cn } from './index';
import { getAreaColor } from '../../lib/area-colors';

export interface AreaBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  label: string;
  id: string;
  key?: string | number;
  className?: string;
  onClick?: () => void;
}

export function AreaBadge({ selected, label, id, className, onClick, ...props }: AreaBadgeProps) {
  const colors = getAreaColor(id);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-5 py-2 text-sm font-medium transition-all border",
        selected 
          ? "border-transparent text-white shadow-sm" 
          : "border-[var(--color-surface-high)] bg-transparent text-[var(--color-chumbo)]/70 hover:border-[var(--color-chumbo)]/30 hover:text-[var(--color-chumbo)]",
        className
      )}
      style={selected ? { backgroundColor: colors.bg } : {}}
      {...props}
    >
      {label}
    </button>
  );
}
