import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Button, Card, Input, Select, StatusBadge as Badge } from './ui';
import { Plus, Search, Mail, Phone, MoreHorizontal, Users, Briefcase, Scale, LayoutGrid, FileText } from 'lucide-react';
import { cn } from './ui';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
  oab?: string;
  areas: string[];
  stats: {
    processos: number;
    clientes: number;
    audiencias: number;
  };
  isCurrentUser?: boolean;
}

const mockTeam: TeamMember[] = [];

export function EquipePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [roleFilter, setRoleFilter] = useState('Todos');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const filteredTeam = mockTeam.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (member.oab && member.oab.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = areaFilter === 'Todas' || member.areas.includes(areaFilter);
    
    // Simplistic role matching, checking if role string contains the filter string
    const roleTerm = roleFilter === 'Todos' ? '' : roleFilter === 'Advogados' ? 'Advogad' : roleFilter === 'Estagiários' ? 'Estagiári' : roleFilter;
    const matchesRole = roleFilter === 'Todos' || member.role.includes(roleTerm);
    
    return matchesSearch && matchesArea && matchesRole;
  });

  // Extract unique areas for the filter
  const allAreas = Array.from(new Set(mockTeam.flatMap(m => m.areas)));

  const totalMembers = mockTeam.length;
  const totalLawyers = mockTeam.filter(m => m.role.includes('Advogad') || m.role.includes('Sócio')).length;
  const totalActiveProcesses = mockTeam.reduce((acc, curr) => acc + curr.stats.processos, 0);
  const totalAreas = allAreas.length;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} title="Equipe" />
        
        <main className="flex-1 overflow-y-auto p-6 md:px-10 md:py-6 scrollbar-hide">
          <div className="max-w-[1700px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[var(--color-chumbo)]">Equipe</h1>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium opacity-70">WebHubPro ERP / Gestão de Usuários</p>
              </div>
              <Button className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold flex items-center gap-2 px-4 py-2 h-auto shadow-sm">
                <Plus size={18} />
                <span>Convidar Membro</span>
              </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-surface-high)] flex items-center justify-center text-[var(--color-text-secondary)]">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--color-chumbo)] leading-none mb-1">{totalMembers}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-medium tracking-wide">membros</div>
                </div>
              </Card>
              <Card className="p-4 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-info-light)] flex items-center justify-center text-[var(--color-info)]">
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--color-chumbo)] leading-none mb-1">{totalLawyers}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-medium tracking-wide">advogados</div>
                </div>
              </Card>
              <Card className="p-4 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-error-light)]/50 flex items-center justify-center text-[var(--color-error)] border border-[var(--color-error-light)]">
                  <Scale size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--color-chumbo)] leading-none mb-1">{totalActiveProcesses}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-medium tracking-wide">processos ativos</div>
                </div>
              </Card>
              <Card className="p-4 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-success-light)] flex items-center justify-center text-[var(--color-success)]">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--color-chumbo)] leading-none mb-1">{totalAreas}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] font-medium tracking-wide">áreas do direito</div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Buscar por nome, OAB ou área..." 
                  className="pl-10 bg-[var(--color-surface)] border-[var(--color-surface-high)] shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 md:flex gap-3">
                <Select 
                  className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm md:w-[160px] shadow-sm"
                  options={[
                    { label: 'Todas Áreas', value: 'Todas' },
                    ...allAreas.map(area => ({ label: area, value: area }))
                  ]}
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                />
                <Select 
                  className="bg-[var(--color-surface)] border-[var(--color-surface-high)] text-sm md:w-[160px] shadow-sm"
                  options={[
                    { label: 'Todos Cargos', value: 'Todos' },
                    { label: 'Advogados', value: 'Advogados' },
                    { label: 'Estagiários', value: 'Estagiários' },
                  ]}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeam.map(member => (
                <Card key={member.id} className="p-5 border-[var(--color-surface-high)] bg-[var(--color-surface-low)] shadow-sm relative flex flex-col h-full hover:shadow-md transition-shadow">
                  
                  {/* Context Menu Icon */}
                  <div className="absolute top-4 right-4">
                    <button className="p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)]/50 rounded-md transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Member Info */}
                  <div className="flex items-start gap-4 mb-4">
                     <div className={cn(
                       "h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold shadow-sm shrink-0",
                       member.isCurrentUser ? "bg-[var(--color-gold)] text-white" : "bg-[var(--color-chumbo)] text-white"
                     )}>
                       {member.name.split(' ').filter(n => n.length > 2).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                     </div>
                     <div className="pt-1 overflow-hidden pr-6">
                       <h3 className="font-bold text-[var(--color-chumbo)] text-lg truncate flex items-center gap-2">
                         {member.name}
                         {member.isCurrentUser && (
                           <span className="text-[10px] bg-[var(--color-info-light)] text-[var(--color-info)] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Você</span>
                         )}
                       </h3>
                       {member.oab && (
                         <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">{member.oab}</p>
                       )}
                       <div className="mt-2 flex flex-wrap gap-1.5">
                         <span className="inline-block text-[10px] bg-[var(--color-info-light)]/50 border border-[var(--color-info)]/20 text-[var(--color-info)] px-2 py-0.5 rounded-full font-bold">
                           {member.role}
                         </span>
                       </div>
                     </div>
                  </div>

                  {/* Areas */}
                  {member.areas.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {member.areas.map(area => (
                        <span key={area} className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          area === 'Criminal' ? "bg-[var(--color-error-light)]/30 border-[var(--color-error)]/20 text-[var(--color-error)]" :
                          area === 'Trabalhista' ? "bg-[var(--color-info-light)]/30 border-[var(--color-info)]/20 text-[var(--color-info)]" :
                          area === 'Cível' ? "bg-purple-100 border-purple-200 text-purple-700" :
                          area === 'Previdenciário' ? "bg-[var(--color-success-light)]/30 border-[var(--color-success)]/20 text-[var(--color-success)]" :
                          "bg-[var(--color-surface-high)]/30 border-[var(--color-surface-high)]/60 text-[var(--color-text-secondary)]"
                        )}>
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-5 h-6"></div> // Spacer
                  )}

                  {/* Contact */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)] font-medium">
                      <Mail size={14} className="opacity-70" /> {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)] font-medium">
                      <Phone size={14} className="opacity-70" /> {member.phone}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 border-t border-[var(--color-surface-high)] pt-4 pb-5">
                      <div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider mb-1">Processos</div>
                        <div className="text-xl font-bold text-[var(--color-chumbo)] tracking-tight">{member.stats.processos}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider mb-1">Clientes</div>
                        <div className="text-xl font-bold text-[var(--color-chumbo)] tracking-tight">{member.stats.clientes}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider mb-1">Audiências</div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-bold text-[var(--color-chumbo)] tracking-tight">{member.stats.audiencias}</span>
                          <span className="text-[9px] text-[var(--color-text-secondary)] lowercase">este mês</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-chumbo)] hover:bg-[var(--color-surface-high)]/40 text-xs font-bold py-2 h-auto rounded-lg">
                        Ver Perfil
                      </Button>
                      <Button className="w-full bg-[var(--color-surface)] border border-[var(--color-surface-high)] text-[var(--color-chumbo)] hover:bg-[var(--color-surface-high)]/40 text-xs font-bold py-2 h-auto flex items-center justify-center gap-2 rounded-lg">
                        <FileText size={14} className="opacity-70" />
                        Ver Processos
                      </Button>
                    </div>
                  </div>

                </Card>
              ))}
            </div>

            {filteredTeam.length === 0 && (
              <div className="text-center py-20 text-[var(--color-text-secondary)]">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">Nenhum membro encontrado com os filtros atuais.</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
