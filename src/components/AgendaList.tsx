import React from 'react';
import { AgendaEvent } from '../data/agendaData';
import { Card, StatusBadge as Badge } from './ui';
import { Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from './ui';

interface AgendaListProps {
  events: AgendaEvent[];
  onToggleStatus: (id: string) => void;
  compact?: boolean;
}

export function AgendaList({ events, onToggleStatus, compact = false }: AgendaListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-secondary)]">
        <Calendar size={48} className="opacity-20 mb-4" />
        <p className="text-sm font-medium">Nenhum evento agendado.</p>
      </div>
    );
  }

  // Sort events primarily by date, then time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-4">
      {sortedEvents.map((evt) => {
        const isPast = new Date(`${evt.date}T${evt.time || '23:59'}`) < new Date();
        const isDone = evt.status === 'Concluído';
        
        return (
          <Card 
            key={evt.id} 
            className={cn(
              "p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm transition-all flex flex-col gap-3",
              isDone ? "opacity-60 grayscale-[30%]" : "hover:border-[var(--color-gold)]/50"
            )}
          >
            {/* Top row: Date and Time */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase">
                  {new Date(evt.date).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className="text-xl font-bold text-[var(--color-chumbo)] tracking-tight">
                  {new Date(evt.date).getDate().toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase">
                  {new Date(evt.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                </span>
              </div>
              
              {evt.time && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-chumbo)] bg-[var(--color-surface)] border border-[var(--color-surface-high)] px-2 py-1 rounded-md">
                  <Clock size={12} className="opacity-60" />
                  {evt.time}
                </div>
              )}
            </div>

            {/* Content: Badge, Title & Button */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={
                    evt.type === 'Audiência' ? 'error' : 
                    evt.type === 'Prazo' ? 'warning' : 
                    evt.type === 'Reunião' ? 'info' : 
                    'success'
                  }
                  className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest bg-transparent border shadow-sm"
                >
                  {evt.type}
                </Badge>
                
                <button 
                  onClick={() => onToggleStatus(evt.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all text-[10px] font-bold uppercase tracking-wider",
                    isDone 
                      ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10" 
                      : "border-[var(--color-surface-high)] text-[var(--color-text-secondary)] bg-[var(--color-surface)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  )}
                >
                  <CheckCircle2 size={13} className={isDone ? "" : "opacity-40"} />
                  {isDone ? 'Concluído' : 'Concluir'}
                </button>
              </div>

              <div>
                <h3 className={cn("text-base font-bold text-[var(--color-chumbo)] mb-1", isDone && "line-through opacity-70")}>
                  {evt.title}
                </h3>
                
                {evt.description && (
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                    {evt.description}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[var(--color-surface-high)] flex flex-col gap-3">
               <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[var(--color-chumbo)]">
                 {evt.client && (
                   <span className="flex items-center gap-1.5"><User size={14} className="text-[var(--color-text-secondary)]" /> {evt.client}</span>
                 )}
                 {evt.process && (
                   <span className="flex items-center gap-1.5"><FileText size={14} className="text-[var(--color-text-secondary)]" /> {evt.process}</span>
                 )}
               </div>
               
               <div className="flex items-center justify-end gap-2 text-[12px] font-medium text-[var(--color-text-secondary)]">
                 <span className="h-6 w-6 rounded-full bg-[var(--color-surface-high)] flex items-center justify-center text-[9px] font-bold text-[var(--color-chumbo)]">
                    {evt.user.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                 </span>
                 {evt.user}
               </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
