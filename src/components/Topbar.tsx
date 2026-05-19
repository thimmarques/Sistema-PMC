import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Menu, Moon, Sun, Bell, Search } from 'lucide-react';

interface TopbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-surface-high)] bg-[var(--color-surface-low)] px-6 md:px-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-[var(--color-chumbo)] hover:text-[var(--color-gold)] transition-colors"
        >
          <Menu size={24} />
        </button>
        {title && (
          <h1 className="text-lg font-bold text-[var(--color-chumbo)] tracking-tight">{title}</h1>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
        {/* Search Bar */}
        <div className="relative hidden w-full max-w-[400px] sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-[var(--color-text-secondary)]" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-full rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface)] pl-10 pr-4 text-sm text-[var(--color-chumbo)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button 
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-chumbo)] opacity-80 transition-all hover:bg-[var(--color-surface)] hover:opacity-100"
            aria-label="Notificações"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--color-error)] border-2 border-[var(--color-surface-low)]"></span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-chumbo)] opacity-80 transition-all hover:bg-[var(--color-surface)] hover:opacity-100"
            aria-label="Alternar tema"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
