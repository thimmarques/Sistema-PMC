import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './index';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className, ...props }: EmptyStateProps) {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center p-8 text-center", className)}
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface-high)] mb-4">
        <Icon size={40} className="text-[var(--color-chumbo)] opacity-50" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-chumbo)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-chumbo)] opacity-70 max-w-sm">{description}</p>
    </div>
  );
}
