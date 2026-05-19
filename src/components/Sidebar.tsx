import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Calendar, 
  Gavel, 
  BarChart3, 
  Users2, 
  Settings,
  X,
  Scale,
  LogOut
} from 'lucide-react';
import { cn } from './ui';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: FileText, label: 'Processos', path: '/processos' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
    { icon: Calendar, label: 'Agenda', path: '/agenda' },
    { icon: Gavel, label: 'Audiências', path: '/audiencias' },
    { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
    { icon: Users2, label: 'Equipe', path: '/equipe' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)] border-r border-white/5 dark:border-[var(--color-surface-high)] transition-all duration-300 ease-in-out md:static md:flex",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "w-64"
        )}
      >
        <div className={cn(
          "flex h-24 flex-col items-center justify-center px-4 border-b border-white/10 dark:border-[var(--color-surface-high)] transition-all",
          "px-6"
        )}>
          <div className="flex flex-col items-center gap-1">
            <div className="h-10 w-10 rounded bg-[var(--color-gold)] flex items-center justify-center text-white shadow-lg shrink-0">
              <Scale size={24} />
            </div>
            <div className="text-center animate-in fade-in duration-500">
              <span className="text-sm font-bold tracking-widest text-[var(--color-sidebar-text)] block">
                WEBHUBPRO
              </span>
              
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 md:hidden text-[var(--color-sidebar-text)] opacity-70 hover:opacity-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-[var(--color-gold)] text-white shadow-md" 
                      : "text-[var(--color-sidebar-text)] opacity-70 hover:bg-[var(--color-gold)] hover:bg-opacity-20 hover:opacity-100"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 dark:border-[var(--color-surface-high)]">
          <div className="flex items-center justify-between gap-3 rounded-md text-sm font-medium text-[var(--color-sidebar-text)] bg-white/5 transition-all px-3 py-2.5">
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-white shrink-0">
                <Users2 size={14} />
              </div>
              <span className="truncate">{user?.name || 'Admin'}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center justify-center rounded-md text-[var(--color-sidebar-text)] opacity-70 hover:opacity-100 hover:text-red-400 transition-colors shrink-0 outline-none cursor-pointer"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
