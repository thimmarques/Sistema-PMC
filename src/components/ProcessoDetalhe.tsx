import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  X, 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  Info, 
  Activity, 
  FileText, 
  Scale, 
  MapPin as MapPinIcon, 
  Building2, 
  StickyNote,
  MessageSquare,
  Mail
} from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Button, Card, StatusBadge as Badge, cn } from './ui';
import { mockProcessos } from '../data/processosData';
import { getAreaColor } from '../lib/area-colors';
import { formatCurrency } from '../lib/formatters';

type TabType = 'resumo' | 'atividades' | 'financeiro' | 'audiencias' | 'diario';

export function ProcessoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('resumo');

  const processo = useMemo(() => {
    return mockProcessos.find(p => p.id === id);
  }, [id]);

  if (!processo) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-chumbo)]">Processo não encontrado</h2>
          <Button className="mt-4" onClick={() => navigate('/processos')}>Voltar para Processos</Button>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const areaColors = getAreaColor(processo.area);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getPoloLabel = (area: string, isAtivo: boolean) => {
    const a = area.toLowerCase();
    if (a.includes('trabalhista')) return isAtivo ? 'Reclamante' : 'Reclamada';
    if (a.includes('previdenciário')) return isAtivo ? 'Segurado' : 'Réu';
    if (a.includes('criminal')) return isAtivo ? 'Autor' : 'Réu';
    return isAtivo ? 'Autor' : 'Réu';
  };

  const tabs = [
    { id: 'resumo', label: 'Resumo', icon: Info },
    { id: 'atividades', label: 'Atividades', icon: Activity, count: 1 },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, count: 1 },
    { id: 'audiencias', label: 'Audiências', icon: Scale, count: 0 },
    { id: 'diario', label: 'Diário', icon: FileText, count: 0 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Detalhes do Processo" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Back Link */}
            <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <Link to="/processos" className="flex items-center gap-1 hover:text-[var(--color-gold)] transition-colors">
                <ArrowLeft size={14} />
                Processos
              </Link>
            </nav>

            {/* Main Information Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold text-[var(--color-chumbo)] select-all">{processo.numero}</h1>
                  <div className="flex items-center gap-2">
                    <div 
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                      style={{ 
                        backgroundColor: `color-mix(in srgb, ${areaColors.bg}, transparent 90%)`, 
                        color: areaColors.text,
                        borderColor: `color-mix(in srgb, ${areaColors.bg}, transparent 80%)`
                      }}
                    >
                      {processo.area}
                    </div>
                    <Badge 
                      variant={processo.status === 'Encerrado' ? 'info' : 'success'} 
                      className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500"
                    >
                      {processo.status}
                    </Badge>
                    <Badge 
                      variant="info" 
                      className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500"
                    >
                      Sentença
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-text-secondary)]">{processo.titulo}</h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-[12px] text-[var(--color-text-secondary)] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={15} className="opacity-60" />
                      {processo.tribunal.nome}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Scale size={15} className="opacity-60" />
                      {processo.tribunal.vara}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon size={15} className="opacity-60" />
                      {processo.comarca || 'Comarca não informada'}
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Calendar size={15} className="opacity-60" />
                       {processo.dataDistribuicao || '—'}
                    </div>
                    <div className="text-[var(--color-error)] font-bold uppercase">
                       {getPoloLabel(processo.area, processo.poloAtivo === processo.cliente.nome)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                 <Button variant="secondary" size="sm" className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] font-semibold flex items-center gap-2 text-[11px]">
                    <Activity size={14} />
                    Editar
                 </Button>
                 <Button variant="secondary" size="sm" className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] font-semibold flex items-center gap-2 text-[11px]">
                    <MessageSquare size={14} />
                    Peticionar
                 </Button>
                 <Button className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold flex items-center gap-2 text-[11px] px-4 py-2 h-auto shadow-sm">
                    <Clock size={16} />
                    Novo Prazo
                 </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] flex items-center gap-4 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  <DollarSign size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[var(--color-chumbo)] leading-tight">{processo.valorCausa ? formatCurrency(processo.valorCausa) : '—'}</span>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Valor da Causa</span>
                </div>
              </Card>
              <Card className="p-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] flex items-center gap-4 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                  <Scale size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[var(--color-chumbo)] leading-tight">{processo.proximaAudiencia?.split(' ')[0] || '—'}</span>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Próx. Audiência</span>
                </div>
              </Card>
              <Card className="p-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] flex items-center gap-4 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                  <Clock size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[var(--color-error)] leading-tight">{processo.prazoFatal || '—'}</span>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Prazo Fatal</span>
                </div>
              </Card>
              <Card className="p-4 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] flex items-center gap-4 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                  <DollarSign size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-[var(--color-chumbo)] leading-tight">{processo.financeiroPago ? formatCurrency(processo.financeiroPago) : '—'}</span>
                    <span className="text-[10px] font-bold text-[var(--color-success)] uppercase tracking-wider">Financeiro Pago</span>
                </div>
              </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-[var(--color-surface-high)] pt-2 overflow-x-auto scrollbar-hide">
              <div className="flex gap-8">
                 {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={cn(
                        "pb-3 text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap",
                        activeTab === tab.id 
                          ? "text-[var(--color-gold)]" 
                          : "text-[var(--color-chumbo)] opacity-50 hover:opacity-100"
                      )}
                    >
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[9px]">{tab.count}</span>
                      )}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-gold)] rounded-full translate-y-px" />
                      )}
                    </button>
                 ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'resumo' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
                {/* Main Information */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Partes section */}
                  <Card className="p-0 overflow-hidden border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                    <div className="p-4 border-b border-[var(--color-surface-high)]">
                      <h3 className="text-sm font-bold text-[var(--color-chumbo)] uppercase tracking-wider">Qualificação das Partes</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-surface-high)] flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Polo Ativo ({getPoloLabel(processo.area, true)})</span>
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)] text-xs font-bold uppercase">
                              {getInitials(processo.poloAtivo || processo.cliente.nome)}
                           </div>
                           <span className="text-sm font-bold text-[var(--color-chumbo)]">{processo.poloAtivo || processo.cliente.nome}</span>
                        </div>
                      </div>
                      <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-surface-high)] flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Polo Passivo ({getPoloLabel(processo.area, false)})</span>
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-bold uppercase">
                              {getInitials(processo.poloPassivo || processo.cliente.subtitulo || 'DP')}
                           </div>
                           <span className="text-sm font-bold text-[var(--color-chumbo)]">{processo.poloPassivo || processo.cliente.subtitulo || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Detalhes do Processo section */}
                  <Card className="p-0 overflow-hidden border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                    <div className="p-4 border-b border-[var(--color-surface-high)] flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[var(--color-chumbo)] uppercase tracking-wider">Dados do Processo</h3>
                      <button className="text-[11px] font-bold text-blue-600 hover:underline px-2 py-1">Editar</button>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-4">
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Tipo de Ação</span>
                          <p className="text-sm font-bold text-[var(--color-chumbo)] select-all">{processo.titulo}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Tribunal</span>
                          <p className="text-sm font-bold text-[var(--color-chumbo)]">{processo.tribunal.nome}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Vara</span>
                          <p className="text-sm font-bold text-[var(--color-chumbo)]">{processo.tribunal.vara}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Comarca</span>
                          <p className="text-sm font-bold text-[var(--color-chumbo)]">{processo.comarca || '—'}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Fase Atual</span>
                          <Badge variant="info" className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit">
                            <Activity size={12} />
                            {processo.faseAtual || '—'}
                          </Badge>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Valor da Causa</span>
                          <p className="text-sm font-bold text-[var(--color-chumbo)]">{processo.valorCausa ? formatCurrency(processo.valorCausa) : '—'}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Data de Distribuição</span>
                          <p className="text-sm font-bold text-[var(--color-chumbo)] opacity-90">{processo.dataDistribuicao || '—'}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase opacity-60">Última Movimentação</span>
                          <p className="text-sm font-bold text-[var(--color-chumbo)] opacity-90">{processo.ultimaMovimentacao || '—'}</p>
                       </div>
                    </div>
                  </Card>

                </div>

                {/* Sidebar Information */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Responsável Sidebar Card */}
                  <Card className="p-5 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] space-y-4 shadow-sm">
                    <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Responsável</h3>
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm border-2 border-[var(--color-surface)]">
                          {getInitials(processo.responsavel.nome)}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[var(--color-chumbo)]">{processo.responsavel.nome}</span>
                          <span className="text-[11px] text-[var(--color-text-secondary)] opacity-70">{processo.responsavel.oab || 'OAB/SP —'}</span>
                       </div>
                    </div>
                    <div className="pt-3 border-t border-[var(--color-surface-high)] space-y-3">
                       <div className="flex items-center gap-2">
                          <Mail size={12} className="text-[var(--color-text-secondary)]" />
                          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{processo.responsavel.email || 'contato@webhubpro.com.br'}</span>
                       </div>
                    </div>
                  </Card>

                  {/* Observações Card */}
                  <div className="p-5 rounded-lg bg-[var(--color-gold)]/5 border-l-4 border-l-[var(--color-gold)] border border-y-[var(--color-surface-high)] border-r-[var(--color-surface-high)] space-y-2">
                    <div className="flex items-center gap-2">
                       <StickyNote size={14} className="text-[var(--color-gold)]" />
                       <h3 className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-wider">Observações Internas</h3>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-secondary)] italic font-medium leading-relaxed">
                       {processo.observacoesInternas || 'Nenhuma observação interna registrada.'}
                    </p>
                  </div>

                  {/* Atividade Recente */}
                  <Card className="p-5 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] space-y-4 shadow-sm">
                     <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Movimentação Recente</h3>
                     <div className="relative pl-4 space-y-4">
                        <div className="absolute left-0 top-1 bottom-1 w-[1px] bg-[var(--color-surface-high)]" />
                        <div className="relative">
                           <div className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-gold)] border-2 border-[var(--color-surface-low)]" />
                           <span className="text-[9px] font-bold text-[var(--color-text-secondary)] uppercase">{processo.ultimaMovimentacao || '—'}</span>
                           <p className="text-[11px] font-bold text-[var(--color-chumbo)] leading-tight mt-0.5">{processo.faseAtual || '—'}</p>
                        </div>
                     </div>
                  </Card>

                </div>
              </div>
            )}

            {activeTab !== 'resumo' && (
              <div className="flex items-center justify-center p-20 bg-[var(--color-surface-low)]/50 border border-dashed border-[var(--color-surface-high)] rounded-xl">
                 <div className="text-center space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-high)]">
                       <Activity size={24} className="text-[var(--color-chumbo)] opacity-40" />
                    </div>
                    <h4 className="text-base font-bold text-[var(--color-chumbo)] opacity-60">Conteúdo de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} em desenvolvimento</h4>
                 </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
