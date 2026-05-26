import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Button, Card, Input, Select, StatusBadge as Badge, Toggle } from './ui';
import { User, Bell, Shield, Palette, Building2, CreditCard } from 'lucide-react';
import { cn } from './ui';
import { useAuth } from '../hooks/useAuth';

type TabType = 'perfil' | 'empresa' | 'aparencia' | 'notificacoes' | 'seguranca' | 'assinatura';

export function ConfiguracoesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('perfil');
  const { user } = useAuth();
  
  // Fake states for form inputs
  const [themeParams, setThemeParams] = useState('system');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const tabs = [
    { id: 'perfil', label: 'Meu Perfil', icon: User },
    { id: 'empresa', label: 'Dados do Escritório', icon: Building2 },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'assinatura', label: 'Assinatura', icon: CreditCard },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Configurações" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)]">Configurações</h1>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium opacity-70">WebHubPro ERP / Preferências do Sistema</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Settings Navigation */}
              <aside className="lg:w-64 shrink-0">
                <Card className="p-2 border-[var(--color-surface-high)] shadow-sm bg-[var(--color-surface-low)]">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as TabType)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                            isActive 
                              ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]" 
                              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)]/50 hover:text-[var(--color-chumbo)]"
                          )}
                        >
                          <Icon size={18} className={isActive ? "text-[var(--color-gold)]" : "opacity-70"} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </Card>
              </aside>

              {/* Settings Content */}
              <div className="flex-1 space-y-6">
                
                {activeTab === 'perfil' && (
                  <Card className="p-6 border-[var(--color-surface-high)] shadow-sm bg-[var(--color-surface-low)]">
                     <h2 className="text-lg font-bold text-[var(--color-chumbo)] mb-6 border-b border-[var(--color-surface-high)] pb-4">Informações Pessoais</h2>
                     
                     <div className="flex items-center gap-6 mb-8">
                       <div className="h-20 w-20 rounded-full bg-[var(--color-surface-high)] flex items-center justify-center text-2xl font-bold text-[var(--color-chumbo)] border-2 border-white shadow-sm">
                          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                       </div>
                       <div>
                         <Button className="bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-sm text-[var(--color-chumbo)] hover:bg-[var(--color-surface-high)]/50 px-4 py-2">
                           Alterar Foto
                         </Button>
                         <p className="text-xs text-[var(--color-text-secondary)] mt-2">JPG, GIF ou PNG. Tamanho máximo 2MB.</p>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Nome Completo</label>
                          <Input defaultValue={user?.name || ''} className="bg-[var(--color-surface)]" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">E-mail</label>
                          <Input defaultValue={user?.email || ''} type="email" className="bg-[var(--color-surface)]" readOnly />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Telefone</label>
                          <Input defaultValue="(11) 98888-7777" className="bg-[var(--color-surface)]" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">OAB (Opcional)</label>
                          <Input defaultValue="OAB/SP 123456" className="bg-[var(--color-surface)]" />
                        </div>
                     </div>
                     
                     <div className="mt-8 flex justify-end">
                       <Button className="bg-[var(--color-gold)] text-white hover:opacity-90 px-6 py-2 shadow-sm font-semibold">Salvar Alterações</Button>
                     </div>
                  </Card>
                )}

                {activeTab === 'aparencia' && (
                  <Card className="p-6 border-[var(--color-surface-high)] shadow-sm bg-[var(--color-surface-low)]">
                    <h2 className="text-lg font-bold text-[var(--color-chumbo)] mb-6 border-b border-[var(--color-surface-high)] pb-4">Aparência do Sistema</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--color-chumbo)] mb-3">Tema</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {['light', 'dark', 'system'].map((theme) => (
                            <div 
                              key={theme}
                              onClick={() => setThemeParams(theme)}
                              className={cn(
                                "border rounded-lg p-4 cursor-pointer transition-all",
                                themeParams === theme 
                                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/5 ring-1 ring-[var(--color-gold)]/50" 
                                  : "border-[var(--color-surface-high)] hover:border-[var(--color-chumbo)]/30 bg-[var(--color-surface)]"
                              )}
                            >
                               <div className="flex items-center gap-2 mb-2">
                                 <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", themeParams === theme ? "border-[var(--color-gold)]" : "border-gray-300")}>
                                   {themeParams === theme && <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />}
                                 </div>
                                 <span className="text-sm font-semibold capitalize">{theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Escuro'}</span>
                               </div>
                               {/* Mock UI for preview */}
                               <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded p-2 h-16 flex flex-col gap-2 opacity-60">
                                  <div className="h-2 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                  <div className="h-8 w-full bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"></div>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                       <Button className="bg-[var(--color-gold)] text-white hover:opacity-90 px-6 py-2 shadow-sm font-semibold">Salvar</Button>
                    </div>
                  </Card>
                )}

                {activeTab === 'notificacoes' && (
                  <Card className="p-6 border-[var(--color-surface-high)] shadow-sm bg-[var(--color-surface-low)]">
                    <h2 className="text-lg font-bold text-[var(--color-chumbo)] mb-6 border-b border-[var(--color-surface-high)] pb-4">Preferências de Notificação</h2>
                    
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                         <div>
                           <div className="font-bold text-[var(--color-chumbo)] text-sm mb-1">Novos Processos</div>
                           <div className="text-xs text-[var(--color-text-secondary)]">Receber um e-mail quando um novo processo for atribuído a você.</div>
                         </div>
                         <Toggle checked={true} onChange={() => {}} />
                       </div>
                       
                       <div className="flex items-center justify-between pt-4 border-t border-[var(--color-surface-high)]/50">
                         <div>
                           <div className="font-bold text-[var(--color-chumbo)] text-sm mb-1">Prazos e Audiências</div>
                           <div className="text-xs text-[var(--color-text-secondary)]">Notificações diárias sobre compromissos das próximas 48 horas.</div>
                         </div>
                         <Toggle checked={true} onChange={() => {}} />
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-[var(--color-surface-high)]/50">
                         <div>
                           <div className="font-bold text-[var(--color-chumbo)] text-sm mb-1">Mensagens do Sistema</div>
                           <div className="text-xs text-[var(--color-text-secondary)]">Atualizações e avisos importantes da plataforma WebHubPro.</div>
                         </div>
                         <Toggle checked={false} onChange={() => {}} />
                       </div>
                    </div>
                  </Card>
                )}

                {activeTab === 'assinatura' && (
                  <Card className="p-6 border-[var(--color-surface-high)] shadow-sm bg-[var(--color-surface-low)] min-h-[400px]">
                    <h2 className="text-lg font-bold text-[var(--color-chumbo)] mb-6 border-b border-[var(--color-surface-high)] pb-4">Meu Plano</h2>
                    
                    <div className="bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-lg p-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <Badge variant="warning" className="mb-2">Plano Profissional</Badge>
                          <h3 className="text-2xl font-bold text-[var(--color-chumbo)] tracking-tight">R$ 299,00<span className="text-sm text-[var(--color-text-secondary)] font-normal">/mês</span></h3>
                          <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1">Próxima cobrança em 15 de Junho de 2026.</p>
                        </div>
                        <Button className="bg-[var(--color-gold)] text-white hover:opacity-90 px-4 py-2 shadow-sm font-semibold whitespace-nowrap">
                          Gerenciar Assinatura
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {(activeTab === 'empresa' || activeTab === 'seguranca') && (
                  <Card className="flex flex-col items-center justify-center p-12 text-center border-[var(--color-surface-high)] shadow-sm bg-[var(--color-surface-low)] min-h-[400px]">
                     <div className="h-16 w-16 rounded-full bg-[var(--color-surface-high)] mb-4 flex items-center justify-center opacity-50">
                       {activeTab === 'empresa' ? <Building2 size={32} /> : <Shield size={32} />}
                     </div>
                     <h3 className="text-lg font-bold text-[var(--color-chumbo)] mb-2">Em Desenvolvimento</h3>
                     <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
                       As configurações de {activeTab === 'empresa' ? 'Dados do Escritório' : 'Segurança'} estarão disponíveis na próxima atualização do sistema.
                     </p>
                  </Card>
                )}

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
