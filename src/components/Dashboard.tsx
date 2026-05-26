import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Users, 
  Scale, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Percent,
  LogOut,
  Loader2
} from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Card, StatusBadge, cn } from './ui';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../contexts/DataContext';
import { getAreaColor } from '../lib/area-colors';

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { clientes, processos, financeiro, isLoading: isDataLoading } = useData();
  const isAdmin = user?.role === 'admin';

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const activeProcessosCount = useMemo(() => processos.filter(p => p.status === 'Ativo').length, [processos]);
  
  const nextHearing = useMemo(() => {
    const process = processos.find(p => p.proxima_audiencia);
    if (!process) return null;
    return { data: process.proxima_audiencia?.split(' ')[0], vara: process.tribunal_vara };
  }, [processos]);

  const totalPrazos = useMemo(() => processos.filter(p => p.prazo_fatal).length, [processos]);
  const totalPrazosFatais = useMemo(() => processos.filter(p => p.prazo_fatal === 'VENCIDO').length, [processos]);

  const areaDistribution = useMemo(() => {
    const areas: Record<string, number> = {};
    processos.forEach(p => {
      areas[p.area] = (areas[p.area] || 0) + 1;
    });
    return Object.entries(areas).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [processos]);

  const parseCurrency = (val: string | undefined): number => {
    if (!val) return 0;
    return parseFloat(val.replace(/[^\d,-]/g, '').replace(',', '.') || '0');
  };

  const isCurrentMonth = (dateStr: string) => {
    if (!dateStr) return false;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;
    const now = new Date();
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return month === (now.getMonth() + 1) && year === now.getFullYear();
  };

  const totalHonorariosContratados = useMemo(() => {
    return clientes.reduce((acc, c) => acc + parseCurrency(c.valor_honorarios), 0);
  }, [clientes]);

  const totalFinanceiroPagoMes = useMemo(() => {
    return financeiro
      .filter(f => f.status === 'Pago' && isCurrentMonth(f.vencimento_data))
      .reduce((acc, f) => acc + parseCurrency(f.valor_amount), 0);
  }, [financeiro]);

  const totalEmAtraso = useMemo(() => {
    return financeiro
      .filter(f => f.status === 'Vencido' || (f.status === 'Pendente' && f.vencimento_status === 'Vencido'))
      .reduce((acc, f) => acc + parseCurrency(f.valor_amount), 0);
  }, [financeiro]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Linha 1 & 2: KPIs Gerais (4x2 Grid) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card 
                title="MEUS PROCESSOS ATIVOS" 
                value={activeProcessosCount.toString()} 
                icon={
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-info-light)] text-[var(--color-info)]">
                    <Briefcase size={24} />
                  </div>
                }
              >
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">Geral: {processos.length} processos</p>
              </Card>

              <Card 
                title="MEUS CLIENTES" 
                value={clientes.length.toString()} 
                icon={
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-success-light)] text-[var(--color-success)]">
                    <Users size={24} />
                  </div>
                }
              >
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">Ativos e inativos</p>
              </Card>

              <Card 
                title="PRÓXIMA AUDIÊNCIA" 
                value={nextHearing?.data || '—'} 
                icon={
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-info-light)] text-[var(--color-info)]">
                    <Scale size={24} />
                  </div>
                }
              >
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 truncate" title={nextHearing?.vara}>{nextHearing?.vara || 'Aguardando agendamento'}</p>
              </Card>

              <Card 
                title="PRAZOS FUTUROS/VENCIDOS" 
                value={totalPrazos.toString()} 
                icon={
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-error-light)] text-[var(--color-error)]">
                    <AlertCircle size={24} />
                  </div>
                }
              >
                <p className={cn("text-xs mt-1", totalPrazosFatais > 0 ? "text-[var(--color-error)] font-bold" : "text-[var(--color-text-secondary)]")}>
                  {totalPrazosFatais} prazo(s) fatal(is)
                </p>
              </Card>

              {/* Linha 2 (Admin) */}
              {isAdmin && (
                <>
                  <Card 
                    title="HONORÁRIOS (CAUSA TOTAL)" 
                    value={formatCurrency(totalHonorariosContratados)} 
                    icon={
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-success-light)] text-[var(--color-success)]">
                        <DollarSign size={24} />
                      </div>
                    } 
                  />
                  <Card 
                    title="HONORÁRIOS (RECEBIDOS)" 
                    value={formatCurrency(totalFinanceiroPagoMes)} 
                    icon={
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-info-light)] text-[var(--color-info)]">
                        <TrendingUp size={24} />
                      </div>
                    } 
                  />
                  <Card 
                    title="EM ATRASO" 
                    value={formatCurrency(totalEmAtraso)} 
                    icon={
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-error-light)] text-[var(--color-error)]">
                        <AlertTriangle size={24} />
                      </div>
                    } 
                  />
                  <Card 
                    title="INADIMPLÊNCIA" 
                    value="0,0%" 
                    icon={
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-warning-light)] text-[var(--color-warning)]">
                        <Percent size={24} />
                      </div>
                    } 
                  />
                </>
              )}
            </div>

            {/* Linha 3: Atividade e Audiências */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Atividade Recente (2/3) */}
              <Card className="lg:col-span-2">
                <h3 className="text-base font-semibold text-[var(--color-chumbo)] mb-4">Atividade Recente</h3>
                <div className="space-y-6 relative">
                  <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-[var(--color-surface-high)]"></div>
                  {processos.slice(0, 4).map((processo, index) => (
                    <div key={processo.id} className="relative pl-6">
                      <div className={cn(
                        "absolute left-0 top-2 h-2 w-2 rounded-full bg-[var(--color-chumbo)]",
                        index > 2 ? "opacity-40" : "opacity-100"
                      )}></div>
                      <p className="text-sm text-[var(--color-chumbo)] font-medium">Movimentação em {processo.numero}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{processo.ultima_movimentacao} — {processo.fase_atual}</p>
                    </div>
                  ))}
                  {processos.length === 0 && <p className="text-xs text-gray-400 italic">Nenhuma atividade recente.</p>}
                </div>
              </Card>

              {/* Próximas Audiências (1/3) */}
              <Card className="lg:col-span-1">
                <h3 className="text-base font-semibold text-[var(--color-chumbo)] mb-4">Próximas Audiências</h3>
                <div className="space-y-4">
                  {processos.filter(p => !!p.proxima_audiencia).map((processo) => {
                    const dateParts = processo.proxima_audiencia!.split(' ')[0].split('/');
                    const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
                    const day = dateParts[0];
                    const month = dateParts[1] ? monthNames[parseInt(dateParts[1], 10) - 1] : '';

                    return (
                      <div key={processo.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center rounded-lg bg-[var(--color-surface-high)] bg-opacity-50 p-2 min-w-[50px] shrink-0">
                          <span className="text-xl font-bold text-[var(--color-chumbo)]">{day}</span>
                          <span className="text-[10px] font-bold uppercase text-[var(--color-text-secondary)]">{month}</span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-[var(--color-chumbo)] truncate">{processo.clientes?.nome}</p>
                          <p className="text-[11px] text-[var(--color-text-secondary)] mb-1.5 truncate">{processo.titulo}</p>
                          <StatusBadge 
                            style={{ 
                              backgroundColor: `color-mix(in srgb, ${getAreaColor(processo.area).bg}, transparent 90%)`,
                              color: getAreaColor(processo.area).text,
                              borderColor: `color-mix(in srgb, ${getAreaColor(processo.area).bg}, transparent 80%)`
                            }}
                            className="text-[9px] uppercase font-bold py-0.5 px-2"
                          >
                            {processo.area}
                          </StatusBadge>
                        </div>
                      </div>
                    );
                  })}
                  {processos.filter(p => !!p.proxima_audiencia).length === 0 && (
                    <p className="text-sm text-[var(--color-text-secondary)] italic">Nenhuma audiência marcada.</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Linha 4: Distribuição por Área */}
            <div className="grid grid-cols-1">
              <Card>
                <h3 className="text-base font-semibold text-[var(--color-chumbo)] mb-6">Distribuição por Área</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-6">
                  {areaDistribution.map((area) => {
                    const colors = getAreaColor(area.name);
                    const maxValue = Math.max(...areaDistribution.map(a => a.value));
                    return (
                      <div key={area.name} className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.text }}>{area.name}</span>
                          <span className="text-sm font-bold text-[var(--color-chumbo)]">{area.value}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-high)] overflow-hidden">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(area.value / (maxValue || 1)) * 100}%`,
                              backgroundColor: colors.bg
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

