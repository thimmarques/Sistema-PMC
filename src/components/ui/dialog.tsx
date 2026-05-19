import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './index';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg bg-[var(--color-surface)] p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--color-chumbo)]">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-[var(--color-chumbo)] opacity-70 transition-colors hover:bg-[var(--color-surface-high)] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
