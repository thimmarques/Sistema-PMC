import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, itemName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[var(--color-surface-low)] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-surface-high)] p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-error-light)] text-[var(--color-error)]">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-chumbo)]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-chumbo)] opacity-50 transition-colors hover:bg-[var(--color-surface-high)] hover:opacity-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-[var(--color-chumbo)] opacity-80">
            Tem certeza que deseja excluir <span className="font-bold text-[var(--color-chumbo)]">"{itemName}"</span>?
          </p>
          <p className="mt-2 text-sm text-[var(--color-error)] font-medium">
            Esta ação não poderá ser desfeita.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[var(--color-surface-high)] bg-[var(--color-surface)] p-4 sm:px-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-semibold text-[var(--color-chumbo)] opacity-70 hover:bg-transparent hover:opacity-100"
          >
            CANCELAR
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 text-white px-6 font-semibold"
          >
            EXCLUIR
          </Button>
        </div>
      </div>
    </div>
  );
}
