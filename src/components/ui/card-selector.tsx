import React from 'react';
import { cn } from './index';

export interface CardSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  color?: string; // Optional CSS variable or hex color
  size?: 'sm' | 'md';
}

export const CardSelector: React.FC<CardSelectorProps> = ({ 
  selected, 
  icon, 
  title, 
  description, 
  className, 
  onClick, 
  color = 'var(--color-gold)', 
  size = 'md',
  ...props 
}) => {
  // Support for CSS variables check
  const isActiveVar = color.startsWith('var');

  const isSm = size === 'sm';

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border transition-all",
        isSm ? "p-4" : "p-6",
        !selected && "border-[var(--color-surface-high)] hover:border-[var(--color-chumbo)]/30",
        className
      )}
      style={selected ? { 
        borderColor: isActiveVar ? color : color,
        borderWidth: '2px',
        backgroundColor: isActiveVar ? `color-mix(in srgb, ${color}, transparent 95%)` : `${color}10` 
      } : {}}
      {...props}
    >
      <div 
        className={cn(
          "flex items-center justify-center rounded-full transition-colors",
          isSm ? "mb-3 h-10 w-10" : "mb-4 h-12 w-12",
          !selected && "bg-[var(--color-surface-high)] text-[var(--color-chumbo)]/60"
        )}
        style={selected ? {
          backgroundColor: isActiveVar ? `color-mix(in srgb, ${color}, transparent 85%)` : `${color}30`,
          color: color
        } : {}}
      >
        {React.cloneElement(icon as React.ReactElement, { size: isSm ? 20 : 24 })}
      </div>
      <h3 className={cn(
        "font-bold text-[var(--color-chumbo)] leading-tight",
        isSm ? "mb-1 text-sm" : "mb-2 text-lg"
      )}>{title}</h3>
      <p className={cn(
        "text-[var(--color-chumbo)]/70 leading-relaxed",
        isSm ? "text-[11px]" : "text-sm"
      )}>{description}</p>
    </div>
  );
}
