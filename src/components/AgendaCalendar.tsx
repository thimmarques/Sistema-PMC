import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, cn } from './ui';
import { AgendaEvent } from '../data/agendaData';

interface AgendaCalendarProps {
  events: AgendaEvent[];
}

export function AgendaCalendar({ events }: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });

  const days = [];
  // Pad the first days
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Card className="border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-surface-high)]">
        <h2 className="text-lg font-bold text-[var(--color-chumbo)] capitalize">
          {monthName} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-high)]/50 transition-colors text-[var(--color-chumbo)]"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs font-bold rounded-md border border-[var(--color-surface-high)] hover:bg-[var(--color-surface-high)]/30 transition-colors text-[var(--color-chumbo)] uppercase tracking-wider"
          >
            Hoje
          </button>
          <button 
            onClick={nextMonth}
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-high)]/50 transition-colors text-[var(--color-chumbo)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--color-surface-high)]">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider border-r border-[var(--color-surface-high)] last:border-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 min-h-[400px]">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="border-r border-b border-[var(--color-surface-high)] bg-[var(--color-surface-high)]/30" />;
          }

          // Format date for comparison: YYYY-MM-DD
          const currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = currentDayStr === todayStr;
          
          const dayEvents = events.filter(e => e.date === currentDayStr);

          return (
            <div 
              key={day} 
              className={cn(
                "border-r border-b border-[var(--color-surface-high)] p-2 h-28 sm:h-32 xl:h-40 overflow-y-auto hover:bg-[var(--color-surface-low)] transition-colors relative",
                isToday ? "bg-[var(--color-gold)]/5" : "bg-[var(--color-surface)]"
              )}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 text-sm font-bold rounded-full",
                  isToday 
                    ? "bg-[var(--color-gold)] text-white shadow-sm" 
                    : "text-[var(--color-chumbo)]"
                )}>
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] opacity-60">
                    {dayEvents.length} {dayEvents.length === 1 ? 'evt' : 'evts'}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-1 mt-1">
                {dayEvents.map(evt => {
                  const isDone = evt.status === 'Concluído';
                  return (
                    <div 
                      key={evt.id} 
                      className={cn(
                        "text-[9px] sm:text-[10px] font-bold px-1.5 py-1 rounded border-l-2 truncate cursor-default group",
                        isDone ? "opacity-50 line-through bg-gray-100 border-gray-400 text-gray-600" :
                        evt.type === 'Audiência' ? "bg-red-50 border-red-500 text-red-700" :
                        evt.type === 'Prazo' ? "bg-amber-50 border-amber-500 text-amber-700" :
                        evt.type === 'Reunião' ? "bg-blue-50 border-blue-500 text-blue-700" :
                        "bg-emerald-50 border-emerald-500 text-emerald-700"
                      )}
                      title={evt.title}
                    >
                      {evt.time && <span className="opacity-70 mr-1">{evt.time}</span>}
                      {evt.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
