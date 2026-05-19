import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  Filter,
  Users2,
  AlertCircle,
  CheckCircle2,
  Gavel,
  Briefcase,
  Trash2,
  X,
  FileText,
  Scale
} from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { 
  Button, 
  Input, 
  Card, 
  StatusBadge as Badge, 
  Select,
  EmptyState,
  cn
} from './ui';
import { mockAudiencias, Audiencia } from '../data/audienciasData';
import { getAreaColor } from '../lib/area-colors';

export function AudienciasPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todas');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [responsavelFilter, setResponsavelFilter] = useState('Todos');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const tabs = ['Todas', 'Hoje', 'Esta Semana', 'Este Mês', 'Realizadas'];

  const filteredAudiencias = useMemo(() => {
    return mockAudiencias.filter(a => {
      const matchesSearch = 
        a.processo.includes(searchTerm) || 
        a.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesArea = areaFilter === 'Todas' || a.area === areaFilter;
      
      return matchesSearch && matchesArea;
    });
  }, [searchTerm, areaFilter]);

  // Group by date
  const groupedAudiencias = useMemo(() => {
    const groups: Record<string, Audiencia[]> = {};
    filteredAudiencias.forEach(a => {
      if (!groups[a.data_formatada]) {
        groups[a.data_formatada] = [];
      }
      groups[a.data_formatada].push(a);
    });
    return groups;
  }, [filteredAudiencias]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Audiências" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)] text-left">Audiências</h1>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium text-left">WebHubPro ERP / Audiências</p>
              </div>
              <Button className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold flex items-center gap-2 px-6">
                <Gavel size={18} />
                Nova Audiência
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              <div className="flex items-center bg-[var(--color-surface-low)] border border-[var(--color-surface-high)] rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap",
                      activeTab === tab 
                        ? "bg-[var(--color-gold)] text-white shadow-sm" 
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters bar */}
            <div className="flex flex-col xl:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Buscar por processo ou cliente..." 
                  className="pl-10 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] w-full h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select 
                  className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] text-sm h-11 min-w-[160px]"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  options={[
                    { label: 'Todas Áreas', value: 'Todas' },
                    { label: 'Trabalhista', value: 'Trabalhista' },
                    { label: 'Criminal', value: 'Criminal' }
                  ]}
                />
                <Select 
                  className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] text-sm h-11 min-w-[160px]"
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  options={[{ label: 'Todos Tipos', value: 'Todos' }]}
                />
                <Select 
                  className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] text-sm h-11 min-w-[180px]"
                  value={responsavelFilter}
                  onChange={(e) => setResponsavelFilter(e.target.value)}
                  options={[{ label: 'Todos Responsáveis', value: 'Todos' }]}
                />
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="flex items-center p-5 gap-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)]">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-text-secondary)]">
                  <Gavel size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-2xl font-bold text-[var(--color-chumbo)]">9</span>
                  <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase">audiências</span>
                </div>
              </Card>
              <Card className="flex items-center p-5 gap-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)]">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-info-light)] flex items-center justify-center text-[var(--color-info)]">
                  <Calendar size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-2xl font-bold text-[var(--color-chumbo)]">0</span>
                  <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase">agendadas</span>
                </div>
              </Card>
              <Card className="flex items-center p-5 gap-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)]">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                  <Clock size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-2xl font-bold text-[var(--color-chumbo)]">0</span>
                  <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase">nesta semana</span>
                </div>
              </Card>
              <Card className="flex items-center p-5 gap-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)]">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-error-light)] flex items-center justify-center text-[var(--color-error)] border border-[var(--color-error)]/10">
                  <AlertCircle size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-2xl font-bold text-[var(--color-error)]">0</span>
                  <span className="text-[11px] font-bold text-[var(--color-error)] uppercase">prazos urgentes</span>
                </div>
              </Card>
            </div>

            {/* Audiencias List Grouped */}
            <div className="space-y-8 pb-10">
              {Object.keys(groupedAudiencias).length > 0 ? (
                Object.entries(groupedAudiencias).map(([date, items]) => (
                  <div key={date} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{date}</h2>
                      <div className="flex-1 h-[1px] bg-[var(--color-surface-high)]" />
                    </div>
                    
                    <div className="space-y-4 text-left">
                      {(items as Audiencia[]).map((item) => {
                        const areaColors = getAreaColor(item.area);
                        return (
                          <div key={item.id}>
                            <Card 
                              className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] hover:shadow-md transition-shadow p-5"
                            >
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Left: Date Box */}
                              <div className="flex w-full lg:w-[85px] flex-col items-center justify-center bg-[var(--color-surface)] border border-[var(--color-surface-high)] rounded-lg p-3 shrink-0">
                                <span className="text-3xl font-bold text-[var(--color-chumbo)] leading-tight">{item.dia}</span>
                                <span className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">{item.mes}</span>
                                <span className="text-[11px] font-medium text-[var(--color-text-secondary)] opacity-60">{item.ano}</span>
                              </div>

                              {/* Middle: Info */}
                              <div className="flex-1 flex flex-col gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[12px] font-mono text-[var(--color-text-secondary)] font-medium">
                                    {item.processo}
                                  </span>
                                  <div className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-30" />
                                  <div 
                                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                                    style={{ backgroundColor: `${areaColors.bg}20`, color: areaColors.text, border: `1px solid ${areaColors.bg}30` }}
                                  >
                                    {item.area}
                                  </div>
                                </div>
                                
                                <h3 className="text-[18px] font-bold text-[var(--color-chumbo)] leading-tight">
                                  {item.titulo}
                                </h3>

                                <div className="flex flex-col gap-2 mt-1">
                                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <UserIcon size={16} className="opacity-60" />
                                    <span className="text-[14px] font-medium">{item.cliente}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <MapPin size={15} className="opacity-60" />
                                    <span className="text-[13px] font-medium">{item.local}</span>
                                  </div>
                                </div>

                                {/* Lawyer Row */}
                                <div className="flex items-center gap-3 mt-2 border-t border-[var(--color-surface-high)] pt-3">
                                  <div 
                                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                                    style={{ backgroundColor: item.advogado.cor }}
                                  >
                                    {item.advogado.iniciais}
                                  </div>
                                  <span className="text-[13px] font-bold text-[var(--color-text-secondary)]">{item.advogado.nome}</span>
                                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                                  <div className="px-2 py-0.5 rounded bg-[var(--color-info-light)] text-[var(--color-info)] text-[10px] font-bold uppercase border border-[var(--color-info)]/10">
                                    {item.tipo}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Meta */}
                              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 shrink-0">
                                <div className="flex flex-col lg:items-end">
                                  <div className="flex items-center gap-2 text-[var(--color-chumbo)]">
                                    <Clock size={18} className="opacity-60" />
                                    <span className="text-[16px] font-bold">{item.hora_inicio} <span className="opacity-40 font-normal">-{item.hora_fim}</span></span>
                                  </div>
                                  <div className="mt-2 text-right">
                                    <Badge 
                                      variant={item.status === 'Agendada' ? 'info' : item.status === 'Realizada' ? 'success' : 'error'}
                                      className="text-[10px] px-3 py-[2px] font-bold tracking-wide"
                                    >
                                      {item.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="relative">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(openMenuId === item.id ? null : item.id);
                                    }}
                                    className="h-8 w-8 rounded-full border border-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] transition-colors mt-auto lg:mt-0"
                                  >
                                    <MoreHorizontal size={18} />
                                  </button>

                                  {openMenuId === item.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setOpenMenuId(null)}
                                      />
                                      <div className="absolute right-0 top-10 w-56 bg-[var(--color-surface-low)] rounded-lg shadow-xl border border-[var(--color-surface-high)] py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-chumbo)] hover:bg-[var(--color-surface)] transition-colors text-left">
                                          <Briefcase size={16} />
                                          <span className="font-medium">Ver Processo</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-success)] hover:bg-[var(--color-success-light)] transition-colors text-left">
                                          <CheckCircle2 size={16} />
                                          <span className="font-medium">Registrar Resultado</span>
                                        </button>
                                        <div className="h-[1px] bg-[var(--color-surface-high)] my-1" />
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-chumbo)] hover:bg-[var(--color-surface)] transition-colors text-left">
                                          <Scale size={16} />
                                          <span className="font-medium">Editar</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-error)] hover:bg-[var(--color-error-light)] transition-colors text-left">
                                          <X size={16} />
                                          <span className="font-medium">Cancelar Audiência</span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <EmptyState 
                    title="Nenhuma audiência encontrada" 
                    description="Não há audiências agendadas com os critérios selecionados."
                    icon={Gavel}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
