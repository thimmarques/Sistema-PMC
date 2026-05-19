import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (msg: string, t: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setType(t);
    setOpen(false);
    setTimeout(() => setOpen(true), 100);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          className={`fixed bottom-4 right-4 z-50 flex items-center justify-between gap-4 rounded-md p-4 shadow-lg transition-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-0 ${
            type === 'error' ? 'bg-error text-white' : type === 'success' ? 'bg-success text-white' : 'bg-info text-white'
          }`}
        >
          <ToastPrimitive.Description className="text-sm font-medium">
            {message}
          </ToastPrimitive.Description>
          <ToastPrimitive.Close className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2">
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
