import React from 'react';
import { cn } from './index';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function RadioGroup({ className, value, onValueChange, children, ...props }: RadioGroupProps) {
  return (
    <div className={cn("flex gap-4", className)} role="radiogroup" {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => onValueChange(child.props.value),
          } as any);
        }
        return child;
      })}
    </div>
  );
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  className?: string;
  id?: string;
}

export function RadioGroupItem({ className, label, id, value, ...props }: RadioGroupItemProps) {
  const inputId = id || value?.toString();
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={inputId}
        value={value}
        className={cn(
          "h-4 w-4 border-[var(--color-surface-high)] text-[var(--color-gold)] focus:ring-[var(--color-gold)]",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-none text-[var(--color-chumbo)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
