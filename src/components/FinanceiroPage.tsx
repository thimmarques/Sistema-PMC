import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Percent
} from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { 
  Button, 
  Input, 
  Card, 
  StatusBadge as Badge, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell,
  Select,
  EmptyState,
  cn
} from './ui';
import { mockFinanceiro, mockAdvogadosResumo } from '../data/financeiroData';
import { getAreaColor } from '../lib/area-colors';

export function FinanceiroPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredFinanceiro = useMemo(() => {
    return mockFinanceiro.filter(p => {
      const matchesSearch = 
        p.processo.includes(searchTerm) || 
        p.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredFinanceiro.length / itemsPerPage);
  const paginatedFinanceiro = filteredFinanceiro.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case 'Honorário': return { bg: 'var(--color-info-light)', text: 'var(--color-info)' };
      case 'Repasse': return { bg: '#F3E8FF', text: '#7E22CE' }; // Purple
      case 'Despesa': return { bg: 'var(--color-warning-light)', text: 'var(--color-warning)' };
      case 'Custas': return { bg: '#F3F4F6', text: '#4B5563' }; // Gray
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Pago': return 'success';
      case 'Pendente': return 'warning';
      case 'Vencido': return 'error';
      case 'Parcelado': return 'info';
      default: return 'info';
    }
  };

  const parseCurrency = (val: string | undefined): number => {
    if (!val) return 0;
    return parseFloat(val.replace(/[^\d,-]/g, '').replace(',', '.') || '0');
  };

  const isThisMonth = (dateStr: string) => {
    if (!dateStr) return false;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;
    const now = new Date();
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return month === (now.getMonth() + 1) && year === now.getFullYear();
  };

  const stats = useMemo(() => {
    const aReceber = mockFinanceiro
      .filter(f => f.status !== 'Pago')
      .reduce((acc, f) => acc + parseCurrency(f.valor.amount), 0);
    
    const recebidoMes = mockFinanceiro
      .filter(f => f.status === 'Pago' && isThisMonth(f.vencimento.data))
      .reduce((acc, f) => acc + parseCurrency(f.valor.amount), 0);

    const emAtraso = mockFinanceiro
      .filter(f => (f.status === 'Vencido' || (!f.vencimento.isPago && f.vencimento.isVencido)))
      .reduce((acc, f) => acc + parseCurrency(f.valor.amount), 0);

    const countAReceber = mockFinanceiro.filter(f => f.status !== 'Pago').length;
    const countRecebidoMes = mockFinanceiro.filter(f => f.status === 'Pago' && isThisMonth(f.vencimento.data)).length;
    const countEmAtraso = mockFinanceiro.filter(f => (f.status === 'Vencido' || (!f.vencimento.isPago && f.vencimento.isVencido))).length;

    return { aReceber, recebidoMes, emAtraso, countAReceber, countRecebidoMes, countEmAtraso };
  }, [mockFinanceiro.length]);

  const dynamicAdvogadosResumo = useMemo(() => {
    // Get unique lawyers names
    const lawyerNames = Array.from(new Set(mockFinanceiro.map(f => f.advogado.nome)));
    if (lawyerNames.length === 0) return [];

    return lawyerNames.map(name => {
      const advTrans = mockFinanceiro.filter(f => f.advogado.nome === name);
      const initials = advTrans[0]?.advogado.iniciais || name.substring(0, 2).toUpperCase();
      const aReceber = advTrans.filter(f => f.status !== 'Pago').reduce((acc, f) => acc + parseCurrency(f.valor.amount), 0);
      const recebido = advTrans.filter(f => f.status === 'Pago' && isThisMonth(f.vencimento.data)).reduce((acc, f) => acc + parseCurrency(f.valor.amount), 0);
      const total = aReceber + recebido;
      const taxa = total > 0 ? (recebido / total * 100).toFixed(0) + '%' : '0%';
      
      const areas = Array.from(new Set(advTrans.map(f => f.cliente.area)));
      
      return {
        nome: name,
        iniciais: initials,
        areas: areas.slice(0, 2),
        aReceber: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aReceber),
        recebido: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recebido),
        taxa,
        colorBase: name.includes('Ricardo') ? '#C5B382' : name.includes('Ana') ? '#059669' : '#C5B382'
      };
    });
  }, [mockFinanceiro.length]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const filteredTotal = useMemo(() => {
    return filteredFinanceiro.reduce((acc, f) => acc + parseCurrency(f.valor.amount), 0);
  }, [filteredFinanceiro]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Financeiro" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)] dark:text-[var(--color-chumbo)]">Financeiro</h1>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">WebHubPro ERP / Financeiro</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="flex items-center gap-2 bg-[var(--color-surface-low)] border-[var(--color-surface-high)]">
                  <Download size={16} />
                  Exportar
                </Button>
                <Button className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold flex items-center gap-2">
                  <Plus size={18} />
                  Novo Lançamento
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <Card className="flex items-center p-5 gap-4 shadow-sm border-[var(--color-surface-high)]">
                <div className="h-12 w-12 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center shrink-0">
                  <Wallet className="text-[var(--color-gold)]" size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--color-chumbo)]">{formatCurrency(stats.aReceber)}</span>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Total a receber</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{stats.countAReceber} lançamentos em aberto</span>
                </div>
              </Card>

              {/* Card 2 */}
              <Card className="flex items-center p-5 gap-4 shadow-sm border-[var(--color-surface-high)]">
                <div className="h-12 w-12 rounded-lg bg-[var(--color-success-light)] flex items-center justify-center shrink-0 text-[var(--color-success)]">
                  <TrendingUp size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--color-chumbo)]">{formatCurrency(stats.recebidoMes)}</span>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Recebido este mês</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{stats.countRecebidoMes} pagamentos</span>
                </div>
              </Card>

              {/* Card 3 */}
              <Card className="flex items-center p-5 gap-4 shadow-sm border-red-100 dark:border-red-900/30">
                <div className="h-12 w-12 rounded-lg bg-[var(--color-error-light)] flex items-center justify-center shrink-0 text-[var(--color-error)]">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--color-error)]">{formatCurrency(stats.emAtraso)}</span>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Em atraso</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">{stats.countEmAtraso} vencidos</span>
                </div>
              </Card>

              {/* Card 4 */}
              <Card className="flex items-center p-5 gap-4 shadow-sm border-orange-100 dark:border-orange-900/30">
                <div className="h-12 w-12 rounded-lg bg-[var(--color-warning-light)] flex items-center justify-center shrink-0 text-[var(--color-warning)]">
                   <Percent size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--color-warning)]">{formatCurrency(stats.aReceber)}</span>
                  <span className="text-[10px] font-bold text-[var(--color-warning)] uppercase">Valores a Receber</span>
                </div>
              </Card>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Column (Table) */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Filters Area */}
                <Card className="p-3 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
                  <div className="flex flex-col xl:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        placeholder="Buscar por cliente ou processo..." 
                        className="pl-10 bg-[var(--color-surface)] border-[var(--color-surface-high)] w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:flex xl:flex-row gap-3">
                      <Select 
                        className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm xl:w-[140px]"
                        options={[{ label: 'Todos Advogados', value: 'Todos' }]}
                      />
                      <Select 
                        className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm xl:w-[130px]"
                        options={[{ label: 'Todos Tipos', value: 'Todos' }]}
                      />
                      <Select 
                        className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm xl:w-[130px]"
                        options={[{ label: 'Todos Status', value: 'Todos' }]}
                      />
                      <Select 
                        className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm xl:w-[130px]"
                        options={[{ label: 'Todas Áreas', value: 'Todas' }]}
                      />
                      <Select 
                        className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm xl:w-[140px]"
                        options={[{ label: 'Todos Períodos', value: 'Todos' }]}
                      />
                    </div>
                  </div>
                </Card>

                {/* Table */}
                <Card className="p-0 overflow-hidden border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[var(--color-surface-low)] border-b border-[var(--color-surface-high)]">
                          <TableHead className="text-[10px] font-bold uppercase py-4">Cliente</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Processo</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Advogado</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Tipo</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Descrição</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Vencimento</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Valor</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Status</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedFinanceiro.length > 0 ? (
                          paginatedFinanceiro.map((p) => {
                            const areaColors = getAreaColor(p.cliente.area);
                            const tipoColors = getTipoColor(p.tipo);

                            return (
                              <TableRow key={p.id} className="hover:bg-[var(--color-gold)]/5 border-b border-[var(--color-surface-high)] group transition-colors">
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-chumbo)] text-[10px] font-bold shrink-0">
                                      {p.cliente.nome.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col gap-0.5 min-w-[140px]">
                                      <span className="font-bold text-[12px] text-[var(--color-chumbo)]">{p.cliente.nome}</span>
                                      <div 
                                        className="inline-flex w-fit px-1.5 py-0.5 rounded text-[9px] font-bold"
                                        style={{ backgroundColor: `color-mix(in srgb, ${areaColors.bg}, transparent 90%)`, color: areaColors.text }}
                                      >
                                        {p.cliente.area}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium font-mono">{p.processo}</span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] text-[9px] font-bold shrink-0">
                                      {p.advogado.iniciais}
                                    </div>
                                    <span className="text-[11px] font-medium text-[var(--color-text-secondary)] whitespace-nowrap">{p.advogado.nome}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div 
                                    className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold"
                                    style={{ backgroundColor: tipoColors.bg, color: tipoColors.text }}
                                  >
                                    {p.tipo}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-[12px] text-[var(--color-text-secondary)] max-w-[150px] truncate block">
                                    {p.descricao}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className={cn(
                                      "text-[10px] font-medium",
                                      p.vencimento.isVencido ? "text-[var(--color-error)]" : 
                                      p.vencimento.isPago ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"
                                    )}>
                                      {p.vencimento.statusText}
                                    </span>
                                    <span className={cn(
                                      "text-[11px] font-bold",
                                      p.vencimento.isVencido ? "text-[var(--color-error)]" : 
                                      p.vencimento.isPago ? "text-[var(--color-success)]" : "text-[var(--color-chumbo)]"
                                    )}>
                                      {p.vencimento.data}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-[var(--color-chumbo)]">
                                      {p.valor.amount}
                                    </span>
                                    {p.valor.parcelas && (
                                      <span className="text-[10px] text-[var(--color-info)] font-medium">
                                        {p.valor.parcelas}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={getStatusBadgeVariant(p.status)}
                                    className="text-[10px] px-2 py-0.5 font-bold tracking-wide"
                                  >
                                    {p.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <button className="text-[var(--color-chumbo)] opacity-40 hover:opacity-100 transition-opacity">
                                    <MoreHorizontal size={18} />
                                  </button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={9} className="py-20 text-center">
                              <EmptyState 
                                title="Nenhum lançamento encontrado" 
                                description="Tente ajustar seus filtros para encontrar o que procura."
                                icon={Filter}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between p-4 border-t border-[var(--color-surface-high)] bg-[var(--color-surface-low)]/50">
                    <p className="text-[12px] text-[var(--color-text-secondary)] font-medium">
                      {filteredFinanceiro.length > 0 
                        ? `Mostrando ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredFinanceiro.length)} de ${filteredFinanceiro.length} lançamentos`
                        : "Nenhum lançamento para mostrar"
                      }
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] font-bold text-[var(--color-text-secondary)]">Total filtrado: <span className="text-[var(--color-chumbo)]">{formatCurrency(filteredTotal)}</span></span>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => p - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft size={16} />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          disabled={currentPage === totalPages || totalPages === 0}
                          onClick={() => setCurrentPage(p => p + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column (Resumo por Advogado) */}
              <div className="w-full lg:w-[400px] shrink-0">
                <Card className="flex flex-col h-full bg-[var(--color-surface-low)] border-[var(--color-surface-high)] p-0 overflow-hidden shadow-sm">
                  {/* Resumo Header */}
                  <div className="flex items-center justify-between p-5 border-b border-[var(--color-surface-high)]">
                    <h3 className="text-[14px] font-bold text-[var(--color-chumbo)]">Resumo por Advogado</h3>
                    <span className="text-[12px] text-[var(--color-text-secondary)]">Este Mês</span>
                  </div>

                  {/* Resumo List */}
                  <div className="flex-1 overflow-y-auto p-5 pb-0 space-y-6">
                    {dynamicAdvogadosResumo.length > 0 ? dynamicAdvogadosResumo.map((adv, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                            style={{ backgroundColor: adv.colorBase }}
                          >
                            {adv.iniciais}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-bold text-[var(--color-chumbo)] leading-none">{adv.nome}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {adv.areas.map(area => {
                                const areaColors = getAreaColor(area);
                                return (
                                  <span 
                                    key={area}
                                    className="px-1.5 rounded text-[8px] font-bold"
                                    style={{ backgroundColor: `color-mix(in srgb, ${areaColors.bg}, transparent 85%)`, color: areaColors.text }}
                                  >
                                    {area}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col p-2 bg-[var(--color-warning-light)]/40 rounded border border-[var(--color-warning)]/20">
                            <span className="text-[9px] font-bold text-[var(--color-warning)] uppercase">A Receber</span>
                            <span className="text-[13px] font-bold text-[var(--color-warning)]">{adv.aReceber}</span>
                          </div>
                          <div className="flex flex-col p-2 bg-[var(--color-success-light)] rounded border border-[var(--color-success)]/20">
                            <span className="text-[9px] font-bold text-[var(--color-success)] uppercase">Recebido</span>
                            <span className="text-[13px] font-bold text-[var(--color-success)]">{adv.recebido}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 mt-1 border-b border-[var(--color-surface-high)] pb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">Captação / Recebimento</span>
                            <span className="text-[11px] font-bold" style={{ color: adv.colorBase }}>{adv.taxa}</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full" 
                              style={{ width: adv.taxa, backgroundColor: adv.colorBase }}
                            />
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="py-10 text-center opacity-50 text-xs italic">Nenhum dado por advogado</div>
                    )}
                  </div>

                  {/* Resumo Footer */}
                  <div className="p-5 bg-gray-50 dark:bg-[var(--color-surface)] border-t border-[var(--color-surface-high)] mt-auto">
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mb-3 block">Total do Escritório</span>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">A Receber</span>
                        <span className="text-[14px] font-bold text-[var(--color-warning)]">{formatCurrency(stats.aReceber)}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">Recebido (mês)</span>
                        <span className="text-[14px] font-bold text-[var(--color-success)]">{formatCurrency(stats.recebidoMes)}</span>
                      </div>
                    </div>
                  </div>

                </Card>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
