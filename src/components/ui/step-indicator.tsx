import React from 'react';
import { cn } from './index';

export interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number;
  totalSteps: number;
  title: string;
  className?: string;
}

export function StepIndicator({ currentStep, totalSteps, title, className, ...props }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-3 text-sm font-semibold tracking-wide text-[var(--color-chumbo)]/60", className)} {...props}>
      <span className="h-2 w-2 rounded-full bg-[#C5B382]"></span>
      <span>PASSO {currentStep} DE {totalSteps} — {title.toUpperCase()}</span>
    </div>
  );
}
