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
  Mail,
  Edit,
  History,
  Send,
  CheckCircle2,
  AlertCircle,
  Gavel,
  MoreVertical,
  ChevronDown,
  Users2,
  Plus
} from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Button, Card, StatusBadge as Badge, cn, Input } from './ui';
import { mockProcessos } from '../data/processosData';
import { mockFinanceiro } from '../data/financeiroData';
import { mockAudiencias } from '../data/audienciasData';
import { mockNotes, addNoteToMock } from '../data/mockData';
import { getAreaColor } from '../lib/area-colors';
import { formatCurrency } from '../lib/formatters';

type TabType = 'resumo' | 'atividades' | 'financeiro' | 'audiencias' | 'andamento';

export function ProcessoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('resumo');
  const [newNote, setNewNote] = useState('');

  const processo = useMemo(() => {
    return mockProcessos.find(p => p.id === id);
  }, [id]);

  const financeiro = useMemo(() => {
    if (!processo) return [];
    return mockFinanceiro.filter(f => 
      f.processo === processo.numero || 
      (f.processo === 'A Vincular' && f.cliente.nome === processo.cliente.nome)
    );
  }, [processo, mockFinanceiro]);

  const audiencias = useMemo(() => {
    if (!processo) return [];
    return mockAudiencias.filter(a => a.processo === processo.numero);
  }, [processo, mockAudiencias]);

  const andamentos = useMemo(() => {
    return mockNotes.filter(n => n.processoId === id);
  }, [id, mockNotes.length]);

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

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteToMock({
      processoId: id,
      texto: newNote,
      tipo: 'ANOTAÇÃO'
    });
    setNewNote('');
  };

  const tabs = [
    { id: 'resumo', label: 'Informações', icon: Info },
    { id: 'atividades', label: 'Atividades', icon: Activity, count: 1 },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, count: financeiro.length },
    { id: 'audiencias', label: 'Audiências', icon: Gavel, count: audiencias.length },
    { id: 'andamento', label: 'Andamento Processual', icon: History, count: andamentos.length },
  ];

  const totalFinanceiro = financeiro.reduce((acc, current) => {
    const val = parseFloat(current.valor.amount.replace(/[^\d,-]/g, '').replace(',', '.'));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const pagoFinanceiro = financeiro.filter(f => f.status === 'Pago').reduce((acc, current) => {
    const val = parseFloat(current.valor.amount.replace(/[^\d,-]/g, '').replace(',', '.'));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const pendenteFinanceiro = totalFinanceiro - pagoFinanceiro;

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
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-[var(--color-chumbo)] select-all">{processo.numero}</h1>
                  <div className="flex items-center gap-2">
                    <div 
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700"
                    >
                      {processo.area}
                    </div>
                    <Badge 
                      variant="info" 
                      className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-md border-none px-3"
                    >
                      {processo.status}
                    </Badge>
                    <Badge 
                      variant="info" 
                      className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 rounded-md border-none px-3"
                    >
                      Sentença
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-[var(--color-text-secondary)]">{processo.titulo}</h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[var(--color-text-secondary)] font-medium">
                    <div className="flex items-center gap-1.5 grayscale opacity-70">
                      <Building2 size={14} />
                      {processo.tribunal.nome}
                    </div>
                    <div className="flex items-center gap-1.5 grayscale opacity-70">
                      <Scale size={14} />
                      {processo.tribunal.vara}
                    </div>
                    <div className="flex items-center gap-1.5 grayscale opacity-70">
                      <MapPinIcon size={14} />
                      {processo.comarca || 'São Paulo'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button variant="ghost" size="sm" className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 h-auto p-0 mb-1">
                  <Edit size={12} className="mr-1" />
                  EDITAR INFORMAÇÕES
                </Button>
                <Card className="flex items-center p-2 pr-4 bg-gray-50 border-gray-100 gap-3 shadow-none">
                  <div className="h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(processo.responsavel.nome)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-gray-800 leading-tight">{processo.responsavel.nome}</span>
                    <span className="text-[10px] text-gray-500 font-medium">OAB/SP 456.789</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 bg-white border-gray-100 flex items-center gap-4 shadow-sm h-[90px]">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <DollarSign size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">VALOR DA CAUSA</span>
                  <span className="text-xl font-bold text-gray-800 leading-tight">—</span>
                </div>
              </Card>
              <Card className="p-5 bg-white border-gray-100 flex items-center gap-4 shadow-sm h-[90px]">
                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                  <Briefcase size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">PRÓX. AUDIÊNCIA</span>
                  <span className="text-xl font-bold text-gray-800 leading-tight">—</span>
                </div>
              </Card>
              <Card className="p-5 bg-white border-gray-100 flex items-center gap-4 shadow-sm h-[90px]">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <Clock size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">PRAZO FATAL</span>
                  <span className="text-xl font-bold text-gray-800 leading-tight">—</span>
                </div>
              </Card>
              <Card className="p-5 bg-white border-gray-100 flex items-center gap-4 shadow-sm h-[90px]">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <DollarSign size={20} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FINANCEIRO</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800 leading-tight">{formatCurrency(pagoFinanceiro)}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">de {formatCurrency(totalFinanceiro)} total</span>
                </div>
              </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1">
                 {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-[12px] font-bold rounded-md transition-all whitespace-nowrap",
                        activeTab === tab.id 
                          ? "bg-white text-gray-800 shadow-sm border border-gray-200" 
                          : "text-gray-500 hover:text-gray-800"
                      )}
                    >
                      <tab.icon size={16} className={activeTab === tab.id ? "text-gray-800" : "text-gray-400"} />
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold">{tab.count}</span>
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
                  <Card className="p-0 overflow-hidden border-gray-100 bg-white shadow-sm rounded-xl">
                    <div className="px-6 py-5 flex items-center gap-2">
                      <Users2 className="text-gray-400" size={18} />
                      <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">PARTES</h3>
                    </div>
                    <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">POLO ATIVO</span>
                        <span className="text-[14px] font-bold text-gray-800">{processo.poloAtivo || processo.cliente.nome}</span>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">POLO PASSIVO</span>
                        <span className="text-[14px] font-bold text-gray-800">{processo.poloPassivo || 'Delegado da 3ª DP Barra Funda'}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Detalhes do Processo section */}
                  <Card className="p-0 overflow-hidden border-gray-100 bg-white shadow-sm rounded-xl">
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="text-gray-400" size={18} />
                        <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">DETALHES DO PROCESSO</h3>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 h-auto p-0 px-2 py-1">
                        EDITAR
                      </Button>
                    </div>
                    <div className="px-6 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TIPO DE AÇÃO</span>
                          <p className="text-[13px] font-bold text-gray-800">{processo.titulo}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TRIBUNAL</span>
                          <p className="text-[13px] font-bold text-gray-800">{processo.tribunal.nome}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">VARA</span>
                          <p className="text-[13px] font-bold text-gray-800">{processo.tribunal.vara}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">COMARCA</span>
                          <p className="text-[13px] font-bold text-gray-800">{processo.comarca || 'São Paulo'}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FASE ATUAL</span>
                          <p className="text-[13px] font-bold text-gray-800">{processo.faseAtual || 'Sentença'}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">VALOR DA CAUSA</span>
                          <p className="text-[13px] font-bold text-gray-800">—</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CRIADO EM</span>
                          <p className="text-[13px] font-bold text-gray-800">04/10/2025</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ATUALIZADO EM</span>
                          <p className="text-[13px] font-bold text-gray-800">19/10/2025</p>
                       </div>
                    </div>
                  </Card>

                </div>

                {/* Sidebar Information */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Responsável Card */}
                  <Card className="p-6 bg-white border-gray-100 shadow-sm rounded-xl">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">RESPONSÁVEL</h3>
                    <div className="flex items-center gap-4">
                       <div className="h-16 w-16 rounded-full bg-pink-600 flex items-center justify-center text-white text-xl font-bold">
                          {getInitials(processo.responsavel.nome)}
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-gray-800 leading-tight">{processo.responsavel.nome}</span>
                          <span className="text-[12px] text-gray-500 font-medium">OAB/RJ 456.789</span>
                          <Badge variant="info" className="bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-md w-fit px-3 py-1 mb-1">
                            Criminal
                          </Badge>
                          <span className="text-[11px] text-gray-400 font-medium">carlos@webhubpro.com.br</span>
                       </div>
                    </div>
                  </Card>

                  {/* Observações Card */}
                  <Card className="p-6 bg-white border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                       <MessageSquare size={16} className="text-gray-400" />
                       <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">OBSERVAÇÕES</h3>
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed italic">
                       HC concedido. Liberdade provisória garantida em 15/10/2025.
                    </p>
                  </Card>

                  {/* Datas Importantes Card */}
                  <Card className="p-6 bg-white border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center gap-2 mb-6">
                       <Calendar size={16} className="text-gray-400" />
                       <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">DATAS IMPORTANTES</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-gray-500">Próx. Audiência</span>
                        <span className="text-[12px] font-bold text-gray-800">—</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-gray-500">Prazo Fatal</span>
                        <span className="text-[12px] font-bold text-gray-800">—</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-gray-500">Criado em</span>
                        <span className="text-[12px] font-bold text-gray-800">04/10/2025</span>
                      </div>
                    </div>
                  </Card>

                </div>
              </div>
            )}

            {activeTab === 'andamento' && (
              <div className="space-y-6">
                <Card className="p-6 bg-white border-gray-100 shadow-sm rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <Plus size={18} className="text-gray-400" />
                       <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">NOVA ANOTAÇÃO</h3>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Ex: Cliente veio saber sobre o andamento do processo... Documento recebido via e-mail..."
                      className="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 text-[14px] text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
                    />
                    <div className="flex items-center justify-between mt-3 px-1">
                      <span className="text-[11px] text-gray-400 font-medium">Ctrl+Enter para salvar rapidamente</span>
                      <Button onClick={handleAddNote} className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-bold text-[12px] px-6 py-2 flex items-center gap-2 rounded-lg">
                        <Send size={14} />
                        Salvar
                      </Button>
                    </div>
                  </div>
                </Card>

                {andamentos.length === 0 ? (
                  <Card className="p-16 flex flex-col items-center justify-center text-center bg-white border-gray-100 shadow-sm rounded-xl">
                    <p className="text-[14px] font-medium text-gray-400">Nenhuma anotação no diário. Use o campo acima para registrar conversas, ações e observações.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {andamentos.map((note) => (
                      <Card key={note.id} className="p-6 bg-white border-gray-100 shadow-sm rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                              {getInitials(note.usuario || 'Dr. Ricardo Silva')}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-gray-800">{note.usuario || 'Dr. Ricardo Silva'}</span>
                              <span className="text-[11px] text-gray-400 font-medium">{note.data}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {note.texto}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-xl flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">TOTAL</span>
                    <span className="text-2xl font-bold text-gray-800">{formatCurrency(totalFinanceiro)}</span>
                  </Card>
                  <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-xl flex flex-col items-center justify-center text-center border-b-4 border-b-emerald-500">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">PAGO</span>
                    <span className="text-2xl font-bold text-emerald-500">{formatCurrency(pagoFinanceiro)}</span>
                  </Card>
                  <Card className="p-8 bg-white border-gray-100 shadow-sm rounded-xl flex flex-col items-center justify-center text-center border-b-4 border-b-amber-500">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">PENDENTE</span>
                    <span className="text-2xl font-bold text-amber-500">{formatCurrency(pendenteFinanceiro)}</span>
                  </Card>
                </div>

                <Card className="p-0 overflow-hidden border-gray-100 bg-white shadow-sm rounded-xl">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">LANÇAMENTOS</h3>
                    <Button variant="ghost" size="sm" className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 h-auto p-0 px-2 py-1">
                      EDITAR
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">TIPO</th>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">DESCRIÇÃO</th>
                          <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">VALOR</th>
                          <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">VENCIMENTO</th>
                          <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {financeiro.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-[13px] text-gray-400 italic">Nenhum lançamento financeiro vinculado a este processo.</td>
                          </tr>
                        ) : (
                          financeiro.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-5">
                                <Badge variant="info" className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md px-3">
                                  {item.tipo}
                                </Badge>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-[14px] font-medium text-gray-800">{item.descricao}</span>
                              </td>
                              <td className="px-6 py-5 text-right font-bold text-[14px] text-gray-800">
                                {item.valor.amount}
                              </td>
                              <td className="px-6 py-5 text-center text-[14px] text-gray-500 font-medium">
                                {item.vencimento.data}
                              </td>
                              <td className="px-6 py-5 text-right">
                                <Badge variant={item.status === 'Pago' ? 'success' : item.status === 'Vencido' ? 'error' : 'info'} className={cn(
                                  "text-[10px] font-bold uppercase rounded-md px-3",
                                  item.status === 'Pago' && "bg-emerald-50 text-emerald-600",
                                  item.status === 'Pendente' && "bg-blue-50 text-blue-600",
                                  item.status === 'Vencido' && "bg-red-50 text-red-600"
                                )}>
                                  {item.status}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'audiencias' && (
              <div className="space-y-6">
                <Card className="p-0 overflow-hidden border-gray-100 bg-white shadow-sm rounded-xl">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">PRÓXIMAS AUDIÊNCIAS</h3>
                    <Button variant="ghost" size="sm" className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 h-auto p-0 px-2 py-1">
                      EDITAR
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">DATA / HORA</th>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">TÍTULO</th>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">LOCAL</th>
                          <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">RESPONSÁVEL</th>
                          <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {audiencias.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-[13px] text-gray-400 italic">Nenhuma audiência agendada para este processo.</td>
                          </tr>
                        ) : (
                          audiencias.map((aud) => (
                            <tr key={aud.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-5 flex flex-col">
                                <span className="text-[13px] font-bold text-gray-800">{new Date(aud.data).toLocaleDateString('pt-BR')}</span>
                                <span className="text-[11px] text-gray-400 font-medium">{aud.hora_inicio} - {aud.hora_fim}</span>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-[14px] font-medium text-gray-800">{aud.titulo}</span>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-[13px] text-gray-500 font-medium">{aud.local}</span>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                                    {aud.advogado.iniciais}
                                  </div>
                                  <span className="text-[12px] text-gray-600 font-medium">{aud.advogado.nome}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <Badge variant={aud.status === 'Realizada' ? 'success' : aud.status === 'Cancelada' ? 'error' : 'info'} className={cn(
                                  "text-[10px] font-bold uppercase rounded-md px-3",
                                  aud.status === 'Realizada' && "bg-emerald-50 text-emerald-600",
                                  aud.status === 'Agendada' && "bg-blue-50 text-blue-600",
                                  aud.status === 'Cancelada' && "bg-red-50 text-red-600"
                                )}>
                                  {aud.status}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'atividades' && (
              <div className="flex items-center justify-center p-20 bg-white border border-dashed border-gray-200 rounded-xl">
                 <div className="text-center space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                       <Activity size={24} className="text-gray-400 opacity-40" />
                    </div>
                    <h4 className="text-base font-bold text-gray-400 opacity-60">Conteúdo de Atividades em desenvolvimento</h4>
                 </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
