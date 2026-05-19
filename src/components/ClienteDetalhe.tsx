import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  MessageCircle, 
  Plus, 
  MoreHorizontal, 
  Briefcase, 
  Calendar, 
  AlertCircle, 
  Smile, 
  Scale,
  FileText, 
  History, 
  Files,
  MapPin,
  Clock,
  User,
  Star,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Card, Button, StatusBadge, cn } from './ui';
import { mockClientes } from '../data/mockData';
import { mockProcessos } from '../data/processosData';
import { getAreaColor } from '../lib/area-colors';

export function ClienteDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'resumo' | 'processos' | 'historico' | 'documentos'>('resumo');

  const cliente = useMemo(() => {
    return mockClientes.find(c => c.id === id);
  }, [id]);

  const processosDoCliente = useMemo(() => {
    if (!cliente) return [];
    return mockProcessos.filter((p) => p.cliente.nome === cliente.nome);
  }, [cliente]);

  if (!cliente) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-chumbo)]">Cliente não encontrado</h2>
          <Button className="mt-4" onClick={() => navigate('/clientes')}>Voltar para Clientes</Button>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const areaColors = getAreaColor(cliente.area || '');

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Detalhes do Cliente" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Nav and Back */}
            <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <Link to="/clientes" className="flex items-center gap-1 hover:text-[var(--color-gold)] transition-colors">
                <ArrowLeft size={14} />
                Clientes
              </Link>
            </nav>

            {/* Header Area */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-chumbo)] text-xl font-bold border border-[var(--color-surface-high)] shrink-0">
                  {cliente.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-[var(--color-chumbo)]">{cliente.nome}</h1>
                    {(cliente as any).isVIP && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--color-warning-light)] text-[var(--color-warning)] text-[10px] font-bold border border-[var(--color-warning)]/20 uppercase">
                        <Star size={10} className="fill-[var(--color-warning)]" />
                        VIP
                      </div>
                    )}
                    <div 
                      className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
                      style={{ 
                        backgroundColor: `color-mix(in srgb, ${areaColors.bg}, transparent 90%)`, 
                        color: areaColors.text,
                        borderColor: `color-mix(in srgb, ${areaColors.bg}, transparent 80%)`
                      }}
                    >
                      {cliente.area}
                    </div>
                    <div className="px-2 py-0.5 rounded bg-[var(--color-info-light)] text-[var(--color-info)] text-[10px] font-bold border border-[var(--color-info)]/20 uppercase">
                      {cliente.tipo}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[var(--color-chumbo)] opacity-70 font-medium">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} />
                      {cliente.cpf_cnpj}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} />
                      {cliente.email}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {cliente.telefone}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {(cliente as any).cidade_estado || '-'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {(cliente as any).dataCadastro || '-'}
                    </div>
                    <div className={cn(
                      "font-bold uppercase",
                      (cliente as any).polo === 'Ativo' ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                    )}>
                      {(cliente as any).polo || '-'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" size="sm" className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] font-semibold flex items-center gap-2 text-[11px]">
                  <Edit size={14} />
                  Editar
                </Button>
                <Button variant="secondary" size="sm" className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] font-semibold flex items-center gap-2 text-[11px]">
                  <Mail size={14} />
                  E-mail
                </Button>
                <Button variant="secondary" size="sm" className="bg-[var(--color-surface-low)] border-[var(--color-surface-high)] font-semibold flex items-center gap-2 text-[11px]">
                  <MessageCircle size={14} className="text-[#25D366]" />
                  WhatsApp
                </Button>
                <Button className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold flex items-center gap-2 text-[11px] px-4 py-2 h-auto shadow-sm">
                  <Plus size={16} />
                  Novo Processo
                </Button>
                <div className="flex items-center gap-2 ml-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full animation-pulse",
                    cliente.status === 'ativo' ? "bg-[var(--color-success)]" : "bg-gray-400"
                  )} />
                  <span className="text-[11px] font-bold text-[var(--color-chumbo)] opacity-60 uppercase">{cliente.status}</span>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="flex items-center gap-4 py-4 px-5 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-info-light)] text-[var(--color-info)]">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-chumbo)] leading-tight">{processosDoCliente.length}</p>
                  <p className="text-[10px] font-medium text-[var(--color-text-secondary)] uppercase">Total de Processos</p>
                </div>
              </Card>

              <Card className="flex items-center gap-4 py-4 px-5 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-processos-light)] text-[var(--color-processos)]">
                  <Scale size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-chumbo)] leading-tight">{processosDoCliente.find(p => p.proximaAudiencia)?.proximaAudiencia?.split(' ')[0] || '—'}</p>
                  <p className="text-[10px] font-medium text-[var(--color-text-secondary)] uppercase">Próxima Audiência</p>
                </div>
              </Card>

              <Card className="flex items-center gap-4 py-4 px-5 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-error-light)] text-[var(--color-error)]">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-error)] leading-tight">{processosDoCliente.find(p => p.prazoFatal)?.prazoFatal || '—'}</p>
                  <p className="text-[10px] font-medium text-[var(--color-text-secondary)] uppercase">Prazo Fatal</p>
                </div>
              </Card>

              <Card className="flex items-center gap-4 py-4 px-5 bg-[var(--color-surface-low)] border-[var(--color-surface-high)] shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-success-light)] text-[var(--color-success)]">
                  <Smile size={20} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-bold text-[var(--color-chumbo)] leading-tight">{(cliente as any).nps || '-'}</p>
                  </div>
                  <p className="text-[10px] font-medium text-[var(--color-success)] uppercase">Excelência</p>
                  <p className="text-[9px] text-[var(--color-text-secondary)] uppercase">Satisfação NPS</p>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--color-surface-high)] pt-2 overflow-x-auto scrollbar-hide">
              <div className="flex gap-8">
                {(['resumo', 'processos', 'historico', 'documentos'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-3 text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap",
                      activeTab === tab 
                        ? "text-[var(--color-gold)]" 
                        : "text-[var(--color-chumbo)] opacity-50 hover:opacity-100"
                    )}
                  >
                    {tab}
                    {tab === 'processos' && processosDoCliente.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px]">{processosDoCliente.length}</span>}
                    {tab === 'documentos' && <span className="ml-2 px-1.5 py-0.5 rounded bg-[var(--color-surface-high)] text-[var(--color-chumbo)] text-[9px] font-normal normal-case opacity-60">Em breve</span>}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-gold)] rounded-full translate-y-px" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'resumo' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Side (Processos Recentes) */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                  <Card className="p-0 overflow-hidden border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b border-[var(--color-surface-high)]">
                      <h3 className="text-sm font-bold text-[var(--color-chumbo)]">Processos Recentes</h3>
                      <Link to="#" className="text-xs font-semibold text-blue-600 hover:underline">Ver todos</Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[var(--color-surface-low)] text-[var(--color-chumbo)] text-[10px] font-bold uppercase tracking-wider border-b border-[var(--color-surface-high)]">
                            <th className="px-4 py-3">Processo</th>
                            <th className="px-4 py-3">Ação</th>
                            <th className="px-4 py-3">Vara</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-surface-high)]">
                          {processosDoCliente.length > 0 ? (
                            processosDoCliente.map(p => (
                              <tr key={p.id} className="hover:bg-[var(--color-gold)]/5 transition-colors text-[var(--color-chumbo)] cursor-pointer" onClick={() => navigate(`/processos/${p.id}`)}>
                                <td className="px-4 py-4">
                                  <span className="font-bold text-sm block">{p.numero}</span>
                                </td>
                                <td className="px-4 py-4">
                                  <p className="text-xs opacity-80 mb-1 truncate max-w-[150px]">{p.titulo}</p>
                                  <div 
                                    className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold"
                                    style={{ backgroundColor: `color-mix(in srgb, ${getAreaColor(p.area).bg}, transparent 90%)`, color: getAreaColor(p.area).text }}
                                  >
                                    {p.area}
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-xs opacity-70 truncate max-w-[150px]">{p.tribunal.vara}</td>
                                <td className="px-4 py-4">
                                  <StatusBadge variant={p.status === 'Ativo' ? 'success' : 'info'} className="text-[9px] px-2 py-0.5 font-bold uppercase">{p.status}</StatusBadge>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <button className="text-[var(--color-chumbo)] opacity-40 hover:opacity-100"><MoreHorizontal size={16} /></button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-10 text-center text-xs text-[var(--color-text-secondary)] opacity-60 italic">Nenhum processo cadastrado para este cliente.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Right Side (Dados Cadastrais) */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                  {/* Dados Cadastrais */}
                  <Card className="border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm p-5 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[var(--color-chumbo)] uppercase tracking-wider">Dados Cadastrais</h3>
                      <button className="text-[11px] font-bold text-blue-600 hover:underline">Editar</button>
                    </div>

                    <div className="grid grid-cols-1 gap-y-5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Tipo</label>
                        <p className="text-sm font-bold text-[var(--color-chumbo)]">{cliente.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Área</label>
                        <div>
                          <div 
                            className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{ backgroundColor: `color-mix(in srgb, ${areaColors.bg}, transparent 90%)`, color: areaColors.text }}
                          >
                            {cliente.area}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Polo</label>
                        <p className={cn(
                          "text-sm font-bold uppercase",
                          (cliente as any).polo === 'Ativo' ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                        )}>
                          {(cliente as any).polo || '-'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Status</label>
                        <div>
                          <StatusBadge variant={cliente.status === 'ativo' ? 'success' : 'info'} className="text-[9px] font-bold uppercase">{cliente.status}</StatusBadge>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Cliente Desde</label>
                        <p className="text-sm font-bold text-[var(--color-chumbo)]">{(cliente as any).dataCadastro || '-'}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Responsável</label>
                        <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-surface-high)]">
                          <div className="h-6 w-6 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center text-[var(--color-success)] text-[9px] font-bold">
                            {cliente.responsavel.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <p className="text-sm font-bold text-[var(--color-chumbo)]">{cliente.responsavel}</p>
                        </div>
                      </div>

                      <div className="pt-2 space-y-5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">{cliente.tipo === 'pj' ? 'CNPJ' : 'CPF'}</label>
                          <p className="text-sm font-bold text-[var(--color-chumbo)]">{cliente.cpf_cnpj}</p>
                        </div>

                        {cliente.tipo === 'pj' && (
                          <>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Representante</label>
                              <p className="text-sm font-bold text-[var(--color-chumbo)]">{(cliente as any).representante || '-'}</p>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Ramo</label>
                              <p className="text-sm font-bold text-[var(--color-chumbo)]">{(cliente as any).ramo || '-'}</p>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Funcionários</label>
                              <p className="text-sm font-bold text-[var(--color-chumbo)]">{(cliente as any).funcionarios || '-'}</p>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Sindicato</label>
                              <p className="text-sm font-bold text-[var(--color-chumbo)]">{(cliente as any).sindicato || '-'}</p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Informações Financeiras */}
                      {((cliente as any).valorHonorarios || (cliente as any).formaPagamento) && (
                        <div className="pt-2 border-t border-[var(--color-surface-high)] space-y-5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Honorários Contratuais</label>
                            <p className="text-sm font-bold text-emerald-600">
                              {(cliente as any).valorHonorarios ? `R$ ${(cliente as any).valorHonorarios}` : '—'}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Forma de Pagamento</label>
                            <p className="text-sm font-bold text-[var(--color-chumbo)] capitalize">
                              {(cliente as any).formaPagamento === 'avista' ? 'À Vista' : 
                               (cliente as any).formaPagamento === 'cartao' ? 'Cartão de Crédito' : 
                               (cliente as any).formaPagamento === 'boleto_parcelado' ? 'Boleto Parcelado' : 
                               (cliente as any).formaPagamento === 'exito' ? 'No Êxito' : (cliente as any).formaPagamento || '—'}
                            </p>
                          </div>

                          {(cliente as any).parcelas && (cliente as any).parcelas !== '1' && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Parcelas</label>
                              <p className="text-sm font-bold text-[var(--color-chumbo)]">{(cliente as any).parcelas}x</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Atividade Recente */}
                  <Card className="border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm p-5 space-y-4">
                    <h3 className="text-sm font-bold text-[var(--color-chumbo)]">Atividade Recente</h3>
                    <div className="space-y-5 relative">
                      <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-[var(--color-surface-high)]"></div>
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[var(--color-success)]"></div>
                        <span className="text-[9px] font-bold text-[var(--color-text-secondary)] uppercase mb-0.5 block tracking-wider">CADASTRO</span>
                        <p className="text-xs font-bold text-[var(--color-chumbo)] leading-relaxed">Cliente cadastrado no sistema e honorários configurados conforme contrato.</p>
                        <div className="flex items-center gap-2 mt-2 opacity-60">
                           <Clock size={10} />
                           <span className="text-[10px] font-medium">{(cliente as any).dataCadastro || '-'}</span>
                           <span className="text-[10px]">•</span>
                           <span className="text-[10px]">{cliente.responsavel}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Observações */}
                  {(cliente as any).observacoes && (
                    <div className="p-4 rounded-lg bg-[var(--color-warning)]/5 border border-[var(--color-warning)]/20 flex gap-3">
                      <FileText size={18} className="text-[var(--color-warning)] shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-[var(--color-warning)] uppercase tracking-wider mb-0.5">Observações internas</p>
                        <p className="text-xs italic text-[var(--color-warning)] opacity-90">"{(cliente as any).observacoes}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'resumo' && (
              <div className="flex items-center justify-center p-20 bg-[var(--color-surface-low)]/50 border border-dashed border-[var(--color-surface-high)] rounded-xl">
                 <div className="text-center space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-high)]">
                       <Files size={24} className="text-[var(--color-chumbo)] opacity-40" />
                    </div>
                    <h4 className="text-base font-bold text-[var(--color-chumbo)] opacity-60">Conteúdo de {activeTab} em desenvolvimento</h4>
                 </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
