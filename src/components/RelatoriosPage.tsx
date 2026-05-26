import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Card, Button, Select } from './ui';
import { BarChart3, BarChart2, Download, TrendingUp, Users, Briefcase, DollarSign, Calendar, PieChart as PieChartIcon, Award, AlertTriangle, ArrowRight } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const revenueData: any[] = [];

const processData: any[] = [];
const COLORS = ['#162839', '#735c00', '#16a34a', '#0891b2'];

const clientGrowthData: any[] = [];

export function RelatoriosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [periodo, setPeriodo] = useState('6meses');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Relatórios" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)]">Relatórios e Análises</h1>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium opacity-70">WebHubPro ERP / Métricas de Desempenho</p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  options={[
                    { label: 'Últimos 30 dias', value: '30dias' },
                    { label: 'Últimos 6 meses', value: '6meses' },
                    { label: 'Este Ano', value: 'ano' },
                  ]}
                  className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm shadow-sm"
                />
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                    <DollarSign className="text-[var(--color-gold)]" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-success)] bg-[var(--color-success-light)] px-2 py-0.5 rounded-full">+12.5%</span>
                </div>
                <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Receita Total</h3>
                <p className="text-2xl font-bold text-[var(--color-chumbo)] tracking-tight">R$ 0</p>
              </Card>
              
               <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-chumbo)]/10 flex items-center justify-center">
                    <Briefcase className="text-[var(--color-chumbo)]" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] bg-[var(--color-surface-high)] px-2 py-0.5 rounded-full">0</span>
                </div>
                <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Novos Processos</h3>
                <p className="text-2xl font-bold text-[var(--color-chumbo)] tracking-tight">0</p>
              </Card>

              <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-info)]/10 flex items-center justify-center">
                    <Users className="text-[var(--color-info)]" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] bg-[var(--color-surface-high)] px-2 py-0.5 rounded-full">0</span>
                </div>
                <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Novos Clientes</h3>
                <p className="text-2xl font-bold text-[var(--color-chumbo)] tracking-tight">0</p>
              </Card>

              <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--color-error)]/10 flex items-center justify-center">
                    <Calendar className="text-[var(--color-error)]" size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-text-secondary)] bg-[var(--color-surface-high)] px-2 py-0.5 rounded-full">-</span>
                </div>
                <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Prazos Cumpridos</h3>
                <p className="text-2xl font-bold text-[var(--color-chumbo)] tracking-tight">0%</p>
              </Card>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Financial Chart */}
              <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                <h3 className="text-sm font-bold text-[var(--color-chumbo)] mb-6 flex items-center gap-2">
                  <BarChart3 size={16} className="text-[var(--color-gold)]" />
                  Fluxo de Caixa (Mensal)
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-high)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dx={-10} tickFormatter={(val) => `R$ ${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-high)', borderRadius: '8px', fontSize: '13px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Bar dataKey="receitas" name="Receitas" fill="var(--color-success)" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="despesas" name="Despesas" fill="var(--color-error)" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Processes Distribution */}
              <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm">
                <h3 className="text-sm font-bold text-[var(--color-chumbo)] mb-6 flex items-center gap-2">
                  <PieChartIcon size={16} className="text-[var(--color-gold)]" />
                  Processos por Área
                </h3>
                <div className="h-[300px] w-full flex items-center">
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={processData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {processData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-high)', borderRadius: '8px', fontSize: '13px' }}
                          itemStyle={{ fontWeight: 'bold', color: 'var(--color-chumbo)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col justify-center space-y-4 pl-4">
                    {processData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">{item.name}</span>
                        </div>
                        <span className="text-[13px] font-bold text-[var(--color-chumbo)]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* New Clients Growth */}
              <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm lg:col-span-2">
                <h3 className="text-sm font-bold text-[var(--color-chumbo)] mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-[var(--color-gold)]" />
                  Aquisição de Novos Clientes
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clientGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-high)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dx={-10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-high)', borderRadius: '8px', fontSize: '13px' }}
                        itemStyle={{ fontWeight: 'bold', color: 'var(--color-gold)' }}
                      />
                      <Line type="monotone" dataKey="novos" name="Novos Clientes" stroke="var(--color-gold)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-surface)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
            </div>
            
            {/* Relatórios do Escritório */}
            <div className="pt-4">
              <h2 className="text-xl font-bold text-[var(--color-chumbo)] mb-6">Relatórios do Escritório</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1 */}
                <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[var(--color-info-light)] flex items-center justify-center text-[var(--color-info)]">
                      <BarChart2 size={24} />
                    </div>
                    <Button className="bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] text-[11px] font-bold py-1 px-3 h-auto rounded-md flex items-center gap-1.5 shadow-sm">
                      <Download size={12} />
                      Gerar
                    </Button>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-chumbo)] mb-2 tracking-tight">Processos por Status</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                    Visão geral de todos os processos agrupados por status atual
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mb-5">
                    Ativos: 5 <span className="mx-2 opacity-50">|</span> Pendentes: 3 <span className="mx-2 opacity-50">|</span> Encerrados: 1
                  </p>
                  <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] font-bold flex items-center gap-2 rounded-lg py-2 h-auto text-[13px] shadow-sm">
                    Ver Relatório <ArrowRight size={14} className="opacity-70" />
                  </Button>
                </Card>

                {/* 2 */}
                <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-fuchsia-100 flex items-center justify-center text-fuchsia-600">
                      <PieChartIcon size={24} />
                    </div>
                    <Button className="bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] text-[11px] font-bold py-1 px-3 h-auto rounded-md flex items-center gap-1.5 shadow-sm">
                      <Download size={12} />
                      Gerar
                    </Button>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-chumbo)] mb-2 tracking-tight">Distribuição por Área do Direito</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                    Porcentagem de processos em cada área de atuação do escritório
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mb-5">
                    Trabalhista: 4 <span className="mx-2 opacity-50">|</span> Cível: 3 <span className="mx-2 opacity-50">|</span> Criminal: 3 <span className="mx-2 opacity-50">|</span> Prev: 2
                  </p>
                  <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] font-bold flex items-center gap-2 rounded-lg py-2 h-auto text-[13px] shadow-sm">
                    Ver Relatório <ArrowRight size={14} className="opacity-70" />
                  </Button>
                </Card>

                {/* 3 */}
                <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[var(--color-success-light)] flex items-center justify-center text-[var(--color-success)]">
                      <TrendingUp size={24} />
                    </div>
                    <Button className="bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] text-[11px] font-bold py-1 px-3 h-auto rounded-md flex items-center gap-1.5 shadow-sm">
                      <Download size={12} />
                      Gerar
                    </Button>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-chumbo)] mb-2 tracking-tight">Financeiro Mensal</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                    Receitas, despesas e inadimplência dos últimos 6 meses
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mb-5 tracking-tight line-clamp-1">
                    Recebido: R$ 28k <span className="mx-2 opacity-50">|</span> A receber: R$ 54k <span className="mx-2 opacity-50">|</span> Inadimpl: 14.7%
                  </p>
                  <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] font-bold flex items-center gap-2 rounded-lg py-2 h-auto text-[13px] shadow-sm">
                    Ver Relatório <ArrowRight size={14} className="opacity-70" />
                  </Button>
                </Card>

                {/* 4 */}
                <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[#fff7ed] flex items-center justify-center text-[#ea580c]">
                      <Award size={24} />
                    </div>
                    <Button className="bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] text-[11px] font-bold py-1 px-3 h-auto rounded-md flex items-center gap-1.5 shadow-sm">
                      <Download size={12} />
                      Gerar
                    </Button>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-chumbo)] mb-2 tracking-tight">Produtividade por Advogado</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                    Processos ativos, audiências e prazos por advogado do escritório
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mb-5">
                    Dr. Marcos Ferreira — 4 processos ativos
                  </p>
                  <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] font-bold flex items-center gap-2 rounded-lg py-2 h-auto text-[13px] shadow-sm">
                    Ver Relatório <ArrowRight size={14} className="opacity-70" />
                  </Button>
                </Card>

                {/* 5 */}
                <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <Calendar size={24} />
                    </div>
                    <Button className="bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] text-[11px] font-bold py-1 px-3 h-auto rounded-md flex items-center gap-1.5 shadow-sm">
                      <Download size={12} />
                      Gerar
                    </Button>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-chumbo)] mb-2 tracking-tight">Audiências do Período</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                    Audiências realizadas, agendadas e canceladas por período
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mb-5">
                    Realizadas: 0 <span className="mx-2 opacity-50">|</span> Agendadas: 5 <span className="mx-2 opacity-50">|</span> Canceladas: 0
                  </p>
                  <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] font-bold flex items-center gap-2 rounded-lg py-2 h-auto text-[13px] shadow-sm">
                    Ver Relatório <ArrowRight size={14} className="opacity-70" />
                  </Button>
                </Card>

                {/* 6 */}
                <Card className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[var(--color-error-light)] flex items-center justify-center text-[var(--color-error)]">
                      <AlertTriangle size={24} />
                    </div>
                    <Button className="bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] text-[11px] font-bold py-1 px-3 h-auto rounded-md flex items-center gap-1.5 shadow-sm">
                      <Download size={12} />
                      Gerar
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-base font-bold text-[var(--color-chumbo)] tracking-tight">Análise de Inadimplência</h3>
                    <span className="bg-[var(--color-error-light)] text-[var(--color-error)] text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                      <AlertTriangle size={10} /> Atenção
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                    Clientes com valores em atraso e taxa de inadimplência por advogado
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mb-5">
                    Total vencido: R$ 14.300,00 <span className="mx-2 opacity-50">|</span> Taxa: 14.7%
                  </p>
                  <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)] hover:text-[var(--color-chumbo)] font-bold flex items-center gap-2 rounded-lg py-2 h-auto text-[13px] shadow-sm">
                    Ver Relatório <ArrowRight size={14} className="opacity-70" />
                  </Button>
                </Card>

              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
