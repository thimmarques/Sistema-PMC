import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  EmptyState,
  Select
} from './ui';
import { Search, Filter, Users, ChevronLeft, ChevronRight, Edit, Trash2, X, ChevronDown, Plus, MoreHorizontal, Star, Eye } from 'lucide-react';
import { mockClientes, addClienteToMock, removeClienteFromMock, updateClienteInMock } from '../data/mockData';
import { addProcessoToMock, Processo } from '../data/processosData';
import { addFinanceiroToMock, TransacaoFinanceira } from '../data/financeiroData';
import { NovoClienteModal, Step1Data } from './Modals/NovoClienteModal';
import { Step2Modal } from './Modals/Step2Modal';
import { EditarClienteDrawer } from './Modals/EditarClienteDrawer';
import { DeleteConfirmModal } from './Modals/DeleteConfirmModal';
import { getAreaColor } from '../lib/area-colors';
import { formatCPF_CNPJ, formatPhone } from '../lib/formatters';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
import { useToast } from '../contexts/ToastContext';

export function ClientesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<{ id: string, nome: string } | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [tipoFilter, setTipoFilter] = useState<string>('Todos');
  const [areaFilter, setAreaFilter] = useState<string>('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClientes = useMemo(() => {
    return mockClientes.filter(cliente => {
      const matchesSearch = 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf_cnpj.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'Todos' || cliente.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesTipo = tipoFilter === 'Todos' || cliente.tipo.toLowerCase() === tipoFilter.toLowerCase();
      const matchesArea = areaFilter === 'Todas' || (cliente as any).area === areaFilter;

      return matchesSearch && matchesStatus && matchesTipo && matchesArea;
    });
  }, [searchTerm, statusFilter, tipoFilter, areaFilter, mockClientes.length]);

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'processos' => {
    switch (status.toLowerCase()) {
      case 'ativo': return 'success';
      case 'inativo': return 'warning';
      case 'arquivado': return 'error';
      default: return 'info';
    }
  };

  const getTipoBadgeVariant = (tipo: string): 'success' | 'warning' | 'error' | 'info' | 'processos' => {
    return tipo.toLowerCase() === 'pf' ? 'info' : 'success';
  };

  const handleOpenModal = () => {
    setCurrentStep(1);
    setStep1Data(null);
    setIsModalOpen(true);
  };

  const handleStep1Next = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleSaveCliente = (step2Data: any) => {
    if (step1Data) {
      console.log('Salvando cliente:', { ...step1Data, step2Data });
      
      const newClientId = String(Date.now());
      const nomeCliente = step1Data.tipoCliente === 'pf' 
        ? step2Data.qualificacao.nomeCompleto 
        : step2Data.qualificacao.razaoSocial;
      
      // 1. Criar e Adicionar o Cliente
      const novoCliente = {
        id: newClientId,
        nome: nomeCliente,
        tipo: step1Data.tipoCliente,
        cpf_cnpj: step1Data.tipoCliente === 'pf' ? step2Data.qualificacao.cpf : step2Data.qualificacao.cnpj,
        email: step1Data.tipoCliente === 'pf' ? step2Data.qualificacao.email : step2Data.qualificacao.emailCorporativo,
        telefone: step1Data.tipoCliente === 'pf' ? step2Data.qualificacao.telefone : step2Data.qualificacao.telefoneCorporativo,
        responsavel: step2Data.responsavel || 'Não atribuído', // fallbacks
        status: 'ativo',
        area: step1Data.areasDireito[0] || 'Outros', // Principal
        isVIP: step2Data.isVIP || false,
        dataCadastro: new Date().toISOString().split('T')[0],
        nps: 10,
        processosAtivos: step1Data.areasDireito.length,
        observacoes: step2Data.observacoes || '',
        valorHonorarios: step2Data.valorHonorarios,
        formaPagamento: step2Data.formaPagamento,
        parcelas: step2Data.parcelas,
        temEntrada: step2Data.temEntrada,
        valorEntrada: step2Data.valorEntrada,
        dataPagamento: step2Data.dataPagamento,
        qualificacao: step2Data.qualificacao,
        areaData: step2Data.areaData,
        polo: (() => {
          const area = step1Data.areasDireito[0] || 'Outros';
          const ad = step2Data.areaData[area];
          if (!ad) return 'Ativo';
          
          if (ad.polo) {
            if (ad.polo === 'reu') return 'Passivo';
            return ad.polo; // 'Ativo', 'Passivo'
          }
          
          if (ad.reuAutor) {
            const val = ad.reuAutor.toLowerCase();
            if (val === 'ativo' || val === 'autor') return 'Ativo';
            if (val === 'passivo' || val === 'reu') return 'Passivo';
            return ad.reuAutor;
          }
          
          return 'Ativo';
        })()
      };
      
      addClienteToMock(novoCliente);

      // 2. Criar Processo(s) atrelado(s) à área preenchida
      step1Data.areasDireito.forEach(area => {
        const ad = step2Data.areaData[area];
        if (ad) {
          const valorHonorariosStr = step2Data.valorHonorarios ? `R$ ${step2Data.valorHonorarios}` : 'R$ 0,00';
          
          const currentPolo = ad.polo === 'reu' ? 'Passivo' : (ad.polo || (ad.reuAutor?.toLowerCase().includes('autor') ? 'Ativo' : (ad.reuAutor?.toLowerCase().includes('reu') ? 'Passivo' : 'Ativo')));
          
          const processo: Processo = {
            id: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            numero: `(Aguardando Numeração) - ${area}`,
            titulo: ad.tipoAcao || ad.crimeImputado || ad.tipoReclamacao || ad.tipoBeneficio || ad.tipoTributo || `Novo Caso ${area}`,
            cliente: { nome: nomeCliente },
            area: area,
            tribunal: { nome: ad.orgaoFiscalizador || 'A definir', vara: 'A distribuir' },
            status: 'Ativo',
            responsavel: { nome: novoCliente.responsavel },
            valorCausa: ad.valorDaCausa || ad.valorDebito || 'R$ 0,00',
            financeiroPago: step2Data.temEntrada ? `R$ ${step2Data.valorEntrada}` : 'R$ 0,00',
            dataDistribuicao: ad.dataPropositura || new Date().toLocaleDateString('pt-BR'),
            ultimaMovimentacao: new Date().toLocaleDateString('pt-BR'),
            faseAtual: ad.faseProcessual || 'Atendimento Inicial',
            poloAtivo: currentPolo === 'Ativo' ? nomeCliente : (ad.reuAutor?.toLowerCase().includes('autor') ? nomeCliente : 'A definir'),
            poloPassivo: currentPolo === 'Passivo' ? nomeCliente : (ad.reuAutor?.toLowerCase().includes('reu') ? nomeCliente : (ad.contraparte || ad.empresa || 'A definir')),
            comarca: ad.comarca || ''
          };
          addProcessoToMock(processo);
        }
      });

      // 3. Criar Transação Financeira (Se preenchida honorários)
      if (step2Data.valorHonorarios) {
        const totalAmount = parseFloat(step2Data.valorHonorarios.replace(/[^\d,-]/g, '').replace(',', '.'));
        
        let remainingAmount = totalAmount;
        let baseDate = step2Data.dataPagamento ? new Date(step2Data.dataPagamento + 'T12:00:00') : new Date();

        // 3a. Criar Entrada se houver
        if (step2Data.temEntrada && step2Data.valorEntrada) {
          const entryAmount = parseFloat(step2Data.valorEntrada.replace(/[^\d,-]/g, '').replace(',', '.'));
          remainingAmount -= entryAmount;

          const transacaoEntrada: TransacaoFinanceira = {
            id: `fin_${Date.now()}_entry`,
            cliente: { nome: nomeCliente, area: step1Data.areasDireito[0] || 'Geral' },
            processo: 'A Vincular',
            advogado: { 
              nome: novoCliente.responsavel === 'ricardo-silva' ? 'Dr. Ricardo Silva' : 
                    novoCliente.responsavel === 'ana-paula' ? 'Dra. Ana Paula' : 
                    novoCliente.responsavel === 'carlos-eduardo' ? 'Dr. Carlos Eduardo' : novoCliente.responsavel,
              iniciais: novoCliente.responsavel.substring(0, 2).toUpperCase() 
            },
            tipo: 'Honorário',
            descricao: `Honorários Contratuais - Entrada`,
            vencimento: { 
              data: baseDate.toLocaleDateString('pt-BR'), 
              statusText: 'Pago', 
              isVencido: false, 
              isPago: true 
            },
            valor: { 
              amount: `R$ ${step2Data.valorEntrada}`, 
            },
            status: 'Pago'
          };
          addFinanceiroToMock(transacaoEntrada);
          
          // Increment base date for next installments (30 days from entry)
          baseDate.setMonth(baseDate.getMonth() + 1);
        }

        // 3b. Criar Parcelas do Saldo
        const numParcelas = parseInt(step2Data.parcelas || (step2Data.formaPagamento === 'avista' ? '0' : '1'), 10);
        
        if (numParcelas > 0 && remainingAmount > 0) {
          const parcelValue = (remainingAmount / numParcelas).toFixed(2).replace('.', ',');

          for (let i = 1; i <= numParcelas; i++) {
            const installmentDate = new Date(baseDate);
            installmentDate.setMonth(baseDate.getMonth() + (i - 1));

            const transacao: TransacaoFinanceira = {
              id: `fin_${Date.now()}_${i}`,
              cliente: { nome: nomeCliente, area: step1Data.areasDireito[0] || 'Geral' },
              processo: 'A Vincular',
              advogado: { 
                nome: novoCliente.responsavel === 'ricardo-silva' ? 'Dr. Ricardo Silva' : 
                      novoCliente.responsavel === 'ana-paula' ? 'Dra. Ana Paula' : 
                      novoCliente.responsavel === 'carlos-eduardo' ? 'Dr. Carlos Eduardo' : novoCliente.responsavel,
                iniciais: novoCliente.responsavel.substring(0, 2).toUpperCase() 
              },
              tipo: 'Honorário',
              descricao: `Honorários Contratuais - ${numParcelas > 1 ? 'Parcela ' + i + '/' + numParcelas : 'Saldo Ativo'}`,
              vencimento: { 
                data: installmentDate.toLocaleDateString('pt-BR'), 
                statusText: i === 1 && !step2Data.temEntrada && step2Data.formaPagamento === 'avista' ? 'Pago' : 'A Vencer', 
                isVencido: false, 
                isPago: i === 1 && !step2Data.temEntrada && step2Data.formaPagamento === 'avista'
              },
              valor: { 
                amount: `R$ ${parcelValue}`, 
                parcelas: numParcelas > 1 ? `${i}/${numParcelas}` : undefined 
              },
              status: i === 1 && !step2Data.temEntrada && step2Data.formaPagamento === 'avista' ? 'Pago' : 'Pendente'
            };
            addFinanceiroToMock(transacao);
          }
        } else if (remainingAmount > 0 && step2Data.formaPagamento === 'avista') {
            // Case for À Vista without Entrada (the whole amount is one payment)
            const transacao: TransacaoFinanceira = {
                id: `fin_${Date.now()}_avista`,
                cliente: { nome: nomeCliente, area: step1Data.areasDireito[0] || 'Geral' },
                processo: 'A Vincular',
                advogado: { 
                  nome: novoCliente.responsavel === 'ricardo-silva' ? 'Dr. Ricardo Silva' : 
                        novoCliente.responsavel === 'ana-paula' ? 'Dra. Ana Paula' : 
                        novoCliente.responsavel === 'carlos-eduardo' ? 'Dr. Carlos Eduardo' : novoCliente.responsavel,
                  iniciais: novoCliente.responsavel.substring(0, 2).toUpperCase() 
                },
                tipo: 'Honorário',
                descricao: `Honorários Contratuais - À Vista`,
                vencimento: { 
                  data: baseDate.toLocaleDateString('pt-BR'), 
                  statusText: 'Pago', 
                  isVencido: false, 
                  isPago: true
                },
                valor: { 
                  amount: `R$ ${remainingAmount.toFixed(2).replace('.', ',')}`, 
                },
                status: 'Pago'
              };
              addFinanceiroToMock(transacao);
        }
      }

      setIsModalOpen(false);
      showToast('Cadastro mestre criado: Cliente, Processos e Financeiro vinculados!', 'success');
      setSearchTerm(' '); // Trigger um re-render
      setTimeout(() => setSearchTerm(''), 50);
    }
  };

  const handleEditClick = (cliente: any) => {
    setSelectedCliente(cliente);
    setIsEditDrawerOpen(true);
  };

  const handleUpdateCliente = (data: any) => {
    const success = updateClienteInMock(data);
    if (success) {
      showToast('Cliente atualizado com sucesso!', 'success');
    } else {
      showToast('Erro ao atualizar cliente.', 'error');
    }
    setIsEditDrawerOpen(false);
  };

  const handleDeleteClick = (id: string, nome: string) => {
    setClienteToDelete({ id, nome });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clienteToDelete) {
      const success = removeClienteFromMock(clienteToDelete.id);
      if (success) {
        showToast(`Cliente "${clienteToDelete.nome}" excluído com sucesso.`, 'success');
      } else {
        showToast('Erro ao excluir cliente.', 'error');
      }
      setIsDeleteModalOpen(false);
      setClienteToDelete(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--color-surface)] text-[var(--color-chumbo)] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} title="Clientes" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)]">Clientes</h1>
                <p className="text-xs text-[var(--color-text-secondary)] opacity-70">WebHubPro ERP / Clientes</p>
              </div>
              <Button 
                className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white flex items-center gap-2 px-4 py-2 h-auto"
                onClick={handleOpenModal}
              >
                <Plus size={18} />
                <span>Novo Cliente</span>
              </Button>
            </div>

            {/* Filters */}
            <Card className="p-3 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
                  <Input 
                    placeholder="Buscar por nome, CPF ou CNPJ..." 
                    className="pl-10 pr-10 bg-[var(--color-surface)] border-[var(--color-surface-high)]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-50 hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3">
                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[160px]"
                    options={[
                      { label: 'Tipo: Todos', value: 'Todos' },
                      { label: 'Tipo: PF', value: 'PF' },
                      { label: 'Tipo: PJ', value: 'PJ' }
                    ]}
                    value={tipoFilter}
                    onChange={(e) => {
                      setTipoFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  />

                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[160px]"
                    options={[
                      { label: 'Área: Todas', value: 'Todas' },
                      { label: 'Área: Criminal', value: 'Criminal' },
                      { label: 'Área: Cível', value: 'Cível' },
                      { label: 'Área: Trabalhista', value: 'Trabalhista' },
                      { label: 'Área: Tributário', value: 'Tributário' },
                      { label: 'Área: Previdenciário', value: 'Previdenciário' }
                    ]}
                    value={areaFilter}
                    onChange={(e) => {
                      setAreaFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  />

                  <Select 
                    className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm lg:w-[160px]"
                    options={[
                      { label: 'Status: Todos', value: 'Todos' },
                      { label: 'Status: Ativo', value: 'Ativo' },
                      { label: 'Status: Inativo', value: 'Inativo' },
                      { label: 'Status: Arquivado', value: 'Arquivado' }
                    ]}
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
              {filteredClientes.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[var(--color-surface-low)] hover:bg-[var(--color-surface-low)] border-b border-[var(--color-surface-high)]">
                        <TableHead className="font-bold text-[var(--color-chumbo)] text-[11px] uppercase tracking-wider py-4">CLIENTE <ChevronDown size={12} className="inline ml-1 opacity-50" /></TableHead>
                        <TableHead className="font-bold text-[var(--color-chumbo)] text-[11px] uppercase tracking-wider">TIPO</TableHead>
                        <TableHead className="font-bold text-[var(--color-chumbo)] text-[11px] uppercase tracking-wider">ÁREA</TableHead>
                        <TableHead className="font-bold text-[var(--color-chumbo)] text-[11px] uppercase tracking-wider hidden md:table-cell">TELEFONE</TableHead>
                        <TableHead className="font-bold text-[var(--color-chumbo)] text-[11px] uppercase tracking-wider">STATUS</TableHead>
                        <TableHead className="font-bold text-[var(--color-chumbo)] text-[11px] uppercase tracking-wider hidden lg:table-cell">RESPONSÁVEL</TableHead>
                        <TableHead className="font-bold text-[var(--color-chumbo)] text-[11px] uppercase tracking-wider text-right">AÇÕES</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedClientes.map((cliente) => {
                        const areaColors = getAreaColor(cliente.area || '');
                        return (
                          <TableRow key={cliente.id} className="border-b border-[var(--color-surface-high)] hover:bg-[var(--color-gold)]/5 transition-colors group">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-chumbo)] text-xs font-bold border border-[var(--color-surface-high)] shrink-0">
                                  {getInitials(cliente.nome)}
                                </div>
                                <div className="flex flex-col">
                                  <Link to={`/clientes/${cliente.id}`} className="flex items-center gap-1.5 cursor-pointer">
                                    <span className="font-bold text-[var(--color-chumbo)] text-sm group-hover:text-[var(--color-gold)] transition-colors">
                                      {cliente.nome}
                                    </span>
                                    {(cliente as any).isVIP && <Star size={12} className="text-[#C5B382] fill-[#C5B382]" />}
                                  </Link>
                                  <span className="text-[11px] text-[var(--color-chumbo)] opacity-70">
                                    {formatCPF_CNPJ(cliente.cpf_cnpj)}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="inline-flex items-center px-2 py-0.5 rounded bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-bold text-[10px] border border-[var(--color-gold)]/20 uppercase">
                                {cliente.tipo}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div 
                                className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-semibold"
                                style={{ backgroundColor: `color-mix(in srgb, ${areaColors.bg}, transparent 90%)`, color: areaColors.text }}
                              >
                                {cliente.area}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-[var(--color-chumbo)] opacity-80">
                              {formatPhone(cliente.telefone)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(cliente.status) as any} className="font-bold px-3 py-0.5 text-[10px]">
                                {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center text-[var(--color-success)] text-[10px] font-bold shrink-0">
                                  {getInitials(cliente.responsavel)}
                                </div>
                                <span className="text-sm text-[var(--color-chumbo)] opacity-90 whitespace-nowrap">
                                  {cliente.responsavel}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[var(--color-chumbo)] opacity-70 hover:opacity-100 hover:text-[var(--color-gold)]">
                                    <MoreHorizontal size={18} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem onClick={() => navigate(`/clientes/${cliente.id}`)}>
                                    <Eye size={16} className="mr-2" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditClick(cliente)}>
                                    <Edit size={16} className="mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <div className="h-px bg-[var(--color-surface-high)] my-1" />
                                  <DropdownMenuItem 
                                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                                    onClick={() => handleDeleteClick(cliente.id, cliente.nome)}
                                  >
                                    <Trash2 size={16} className="mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-surface-high)]">
                      <div className="text-sm text-[var(--color-chumbo)] opacity-70">
                        Página {currentPage} de {totalPages} ({filteredClientes.length} clientes)
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={16} className="mr-1" />
                          Anterior
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Próxima
                          <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState 
                  icon={Users}
                  title="Nenhum cliente encontrado"
                  description="Crie seu primeiro cliente clicando em 'Novo Cliente' ou ajuste os filtros da busca."
                />
              )}
            </Card>

          </div>
        </main>
      </div>

      {currentStep === 1 ? (
        <NovoClienteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onNext={handleStep1Next}
        />
      ) : (
        step1Data && (
          <Step2Modal
            isOpen={isModalOpen}
            step1Data={step1Data}
            onBack={handleStep2Back}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveCliente}
          />
        )
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="EXCLUIR CLIENTE"
        itemName={clienteToDelete?.nome || ''}
      />

      <EditarClienteDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        cliente={selectedCliente}
        onSave={handleUpdateCliente}
      />
    </div>
  );
}

