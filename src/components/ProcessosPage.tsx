import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Users,
  Eye,
  Pencil,
  Gavel,
  CheckCircle2,
  Trash2,
  Loader2
} from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { useData } from '../contexts/DataContext';
import { NovoProcessoModal } from './Modals/NovoProcessoModal';
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
import { mockProcessos, Processo } from '../data/processosData';
import { getAreaColor } from '../lib/area-colors';

export function ProcessosPage() {
  const navigate = useNavigate();
  const { processos, isLoading: isDataLoading } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isNovoProcessoModalOpen, setIsNovoProcessoModalOpen] = useState(false);
  
  const itemsPerPage = 10;

  const filteredProcessos = useMemo(() => {
    return processos.filter(p => {
      const matchesSearch = 
        p.numero.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.clientes?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.titulo || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesArea = areaFilter === 'Todas' || p.area === areaFilter;
      const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [searchTerm, areaFilter, statusFilter, processos]);

  const totalPages = Math.ceil(filteredProcessos.length / itemsPerPage);
  const paginatedProcessos = filteredProcessos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleOpenDetail = (processo: Processo) => {
    navigate(`/processos/${processo.id}`);
    setOpenMenuId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Processos" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)]">Processos</h1>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">WebHubPro ERP / Processos</p>
              </div>
              <Button 
                onClick={() => setIsNovoProcessoModalOpen(true)}
                className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold flex items-center gap-2"
              >
                <Plus size={18} />
                Novo Processo
              </Button>
            </div>

            {/* Filters Area */}
            <Card className="p-3 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Buscar por número CNJ ou cliente..." 
                    className="pl-10 bg-[var(--color-surface)] border-[var(--color-surface-high)]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3">
                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[160px]"
                    options={[
                      { label: 'Todas Áreas', value: 'Todas' },
                      { label: 'Trabalhista', value: 'Trabalhista' },
                      { label: 'Civil', value: 'Civil' },
                      { label: 'Criminal', value: 'Criminal' },
                      { label: 'Previdenciário', value: 'Previdenciário' },
                    ]}
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                  />
                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[160px]"
                    options={[
                        { label: 'Todos Status', value: 'Todos' },
                        { label: 'Ativo', value: 'Ativo' },
                        { label: 'Encerrado', value: 'Encerrado' },
                        { label: 'Acordo', value: 'Acordo' },
                        { label: 'Pendente', value: 'Pendente' },
                    ]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />

                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[160px]"
                    options={[
                        { label: 'Todos Prazos', value: 'Todos' },
                        { label: 'Esta Semana', value: 'Semana' },
                        { label: 'Este Mês', value: 'Mes' },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* KPI Small Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface)] shadow-sm">
                <span className="px-2 py-0.5 rounded bg-[var(--color-surface-high)] text-[11px] font-bold text-[var(--color-chumbo)]">
                  {processos.length}
                </span>
                <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">processos</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface)] shadow-sm">
                <span className="px-2 py-0.5 rounded bg-[var(--color-info-light)] text-[11px] font-bold text-[var(--color-info)]">
                  {processos.filter((p) => p.proxima_audiencia).length}
                </span>
                <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">com audiência</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface)] shadow-sm">
                <span className="px-2 py-0.5 rounded bg-[var(--color-error-light)] text-[11px] font-bold text-[var(--color-error)]">
                  {processos.filter((p) => p.prazo_fatal === 'VENCIDO').length}
                </span>
                <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">prazos vencidos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--color-surface-high)] bg-[var(--color-surface)] shadow-sm">
                <span className="text-[14px] font-bold text-[var(--color-chumbo)]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    processos.reduce((acc, p) => acc + (parseFloat(p.valor_causa?.replace(/[^\d,-]/g, '').replace(',', '.') || '0')), 0)
                  )}
                </span>
                <span className="text-[13px] font-medium text-[var(--color-text-secondary)] ml-1">valor da causa geral</span>
              </div>
            </div>

            {/* Table */}
            <Card className="p-0 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
              <div className="overflow-x-visible">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[var(--color-surface-low)] border-b border-[var(--color-surface-high)]">
                      <TableHead className="text-[10px] font-bold uppercase py-4">Processo</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4">Cliente</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4">Área</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4">Tribunal</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4">Status</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4">Próx. Audiência</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4">Prazo Fatal</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4">Responsável</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isDataLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[var(--color-gold)]" />
                            <p className="text-xs font-medium">Carregando processos...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedProcessos.length > 0 ? (
                      paginatedProcessos.map((p) => {
                        const areaColors = getAreaColor(p.area);
                        const initials = getInitials(p.clientes?.nome || 'C');
                        const respInitials = getInitials(p.responsavel_nome || 'R');

                        return (
                          <TableRow 
                            key={p.id} 
                            onClick={() => navigate(`/processos/${p.id}`)}
                            className="hover:bg-[var(--color-gold)]/5 border-b border-[var(--color-surface-high)] group transition-colors cursor-pointer"
                          >
                            <TableCell className="py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-[13px] text-[var(--color-chumbo)]">{p.numero}</span>
                                <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">{p.titulo}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)] text-[10px] font-bold shrink-0">
                                  {initials}
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-[120px]">
                                  <span className="font-bold text-[12px] text-[var(--color-chumbo)]">{p.clientes?.nome}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div 
                                className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold"
                                style={{ backgroundColor: `color-mix(in srgb, ${areaColors.bg}, transparent 90%)`, color: areaColors.text }}
                              >
                                {p.area}
                              </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <div className="inline-flex w-fit px-1.5 py-0.5 rounded bg-[var(--color-surface-high)] text-[var(--color-chumbo)] text-[9px] font-bold opacity-70">
                                        {p.tribunal_nome}
                                    </div>
                                    <span className="text-[10px] text-[var(--color-text-secondary)] truncate max-w-[150px]">
                                        {p.tribunal_vara}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  p.status === 'Ativo' ? 'success' : 
                                  p.status === 'Pendente' ? 'warning' : 
                                  p.status === 'Cancelado' ? 'error' : 'info'
                                }
                                className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider"
                              >
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[11px] text-[var(--color-chumbo)] opacity-80 font-medium">
                              {p.proxima_audiencia || '—'}
                            </TableCell>
                            <TableCell>
                              {p.prazo_fatal ? (
                                <Badge variant="error" className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md">
                                  {p.prazo_fatal}
                                </Badge>
                              ) : (
                                <span className="text-[11px] text-[var(--color-text-secondary)]">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 text-[9px] font-bold shrink-0">
                                  {respInitials}
                                </div>
                                <span className="text-[11px] font-bold text-[var(--color-chumbo)] opacity-90">{p.responsavel_nome}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === p.id ? null : p.id);
                                  }}
                                  className="text-[var(--color-chumbo)] opacity-40 hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal size={18} />
                                </button>

                                {openMenuId === p.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(null);
                                      }}
                                    />
                                    <div className="absolute right-0 top-8 w-52 bg-[var(--color-surface-low)] rounded-lg shadow-xl border border-[var(--color-surface-high)] py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenDetail(p);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-chumbo)] hover:bg-[var(--color-surface)] transition-colors text-left"
                                      >
                                        <Eye size={16} />
                                        <span className="font-medium">Ver Detalhes</span>
                                      </button>
                                      <button 
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-chumbo)] hover:bg-[var(--color-surface)] transition-colors text-left"
                                      >
                                        <Pencil size={16} />
                                        <span className="font-medium">Editar</span>
                                      </button>
                                      <button 
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-chumbo)] hover:bg-[var(--color-surface)] transition-colors text-left"
                                      >
                                        <Gavel size={16} />
                                        <span className="font-medium">Nova Audiência</span>
                                      </button>
                                      <div className="h-[1px] bg-[var(--color-surface-high)] my-1" />
                                      <button 
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-chumbo)] hover:bg-[var(--color-surface)] transition-colors text-left"
                                      >
                                        <CheckCircle2 size={16} />
                                        <span className="font-medium">Encerrar</span>
                                      </button>
                                      <div className="h-[1px] bg-[var(--color-surface-high)] my-1" />
                                      <button 
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-error)] hover:bg-[var(--color-error-light)] transition-colors text-left"
                                      >
                                        <Trash2 size={16} />
                                        <span className="font-medium">Excluir</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="py-20 text-center">
                          <EmptyState 
                            title="Nenhum processo encontrado" 
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
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredProcessos.length)} de {filteredProcessos.length} processos
                </p>
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
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn(
                          "h-8 w-8 p-0 text-xs font-bold",
                          currentPage === i + 1 ? "bg-[var(--color-gold)] text-white" : ""
                        )}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </Card>

          </div>
        </main>
      </div>

      <NovoProcessoModal 
        isOpen={isNovoProcessoModalOpen} 
        onClose={() => setIsNovoProcessoModalOpen(false)} 
      />
    </div>
  );
}
