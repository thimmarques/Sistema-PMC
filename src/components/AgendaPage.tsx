import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AgendaList } from './AgendaList';
import { mockAgendaEvents, AgendaEvent } from '../data/agendaData';
import { AgendaCalendar } from './AgendaCalendar';
import { Button, Input, Select, Card } from './ui';
import { Plus, Search, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AgendaPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState<AgendaEvent[]>(mockAgendaEvents);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Pendente');

  const { user } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleToggleStatus = (id: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        return {
          ...evt,
          status: evt.status === 'Concluído' ? 'Pendente' : 'Concluído'
        };
      }
      return evt;
    }));
  };

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          evt.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evt.process?.includes(searchTerm);
    const matchesType = filterType === 'Todos' || evt.type === filterType;
    const matchesStatus = filterStatus === 'Todos' || evt.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Agenda" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)]">Agenda</h1>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium opacity-70">WebHubPro ERP / Agenda e Compromissos</p>
              </div>
              <Button className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold flex items-center gap-2 px-4 py-2 h-auto shadow-sm">
                <Plus size={18} />
                <span>Novo Agendamento</span>
              </Button>
            </div>

            {/* Filters */}
            <Card className="p-3 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Buscar por título, cliente ou processo..." 
                    className="pl-10 bg-[var(--color-surface)] border-[var(--color-surface-high)]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3">
                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[180px]"
                    options={[
                      { label: 'Todos os Tipos', value: 'Todos' },
                      { label: 'Audiência', value: 'Audiência' },
                      { label: 'Reunião', value: 'Reunião' },
                      { label: 'Prazo', value: 'Prazo' },
                      { label: 'Tarefa', value: 'Tarefa' },
                      { label: 'Lembrete', value: 'Lembrete' },
                    ]}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  />
                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[180px]"
                    options={[
                      { label: 'Todos os Status', value: 'Todos' },
                      { label: 'Pendentes', value: 'Pendente' },
                      { label: 'Concluídos', value: 'Concluído' },
                      { label: 'Cancelados', value: 'Cancelado' },
                    ]}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Calendar Area */}
              <div className="lg:col-span-3">
                <AgendaCalendar events={filteredEvents} />
              </div>

              {/* Sidebar Info Panel */}
              <div className="space-y-6">
                <h2 className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest border-b border-[var(--color-surface-high)] pb-2 mb-4 flex items-center gap-2">
                  <CalendarIcon size={14} className="text-[var(--color-gold)]" />
                  Próximos Compromissos
                </h2>
                
                <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--color-surface-high)] scrollbar-track-transparent">
                  <AgendaList 
                    events={filteredEvents.filter(e => e.status === 'Pendente')}
                    onToggleStatus={handleToggleStatus}
                    compact={true}
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
