import React, { useState, useEffect } from 'react';
import { X, Save, Search, Gavel, Scale, Briefcase, HeartPulse, Coins, Info, Loader2 } from 'lucide-react';
import { SidePanel } from '../ui/side-panel';
import { Button, Input, Select, Textarea, FormField } from '../ui';
import { clienteService } from '../../services/clienteService';
import { processoService } from '../../services/processoService';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrencyInput } from '../../lib/formatters';
import { mockUsers } from '../../data/mockData';

interface NovoProcessoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (processo: any) => void;
  initialClientId?: string;
}

const TRIBUNAIS = [
  { label: 'TJSP - Tribunal de Justiça de São Paulo', value: 'TJSP' },
  { label: 'TRF3 - Tribunal Regional Federal da 3ª Região', value: 'TRF3' },
  { label: 'TRT2 - Tribunal Regional do Trabalho da 2ª Região', value: 'TRT2' },
  { label: 'STJ - Superior Tribunal de Justiça', value: 'STJ' },
  { label: 'STF - Supremo Tribunal Federal', value: 'STF' },
  { label: 'JF - Justiça Federal', value: 'JF' },
  { label: 'Outro / Não Listado', value: 'Outro' }
];

const FASES = [
  { label: 'Petição Inicial', value: 'Petição Inicial' },
  { label: 'Contestação', value: 'Contestação' },
  { label: 'Instrução', value: 'Instrução' },
  { label: 'Sentença', value: 'Sentença' },
  { label: 'Recurso', value: 'Recurso' },
  { label: 'Cumprimento de Sentença', value: 'Cumprimento de Sentença' },
  { label: 'Arquivado', value: 'Arquivado' }
];

const STATUS_OPCOES = [
  { label: 'Ativo', value: 'Ativo' },
  { label: 'Suspenso', value: 'Suspenso' },
  { label: 'Arquivado', value: 'Arquivado' },
  { label: 'Encerrado', value: 'Encerrado' },
  { label: 'Em Acordo', value: 'Em Acordo' }
];

const AREAS = [
  { name: 'Trabalhista', icon: <Briefcase size={16} />, color: 'var(--color-warning)' },
  { name: 'Civil', icon: <Scale size={16} />, color: 'var(--color-processos)' },
  { name: 'Criminal', icon: <Gavel size={16} />, color: 'var(--color-error)' },
  { name: 'Previdenciário', icon: <HeartPulse size={16} />, color: 'var(--color-success)' },
  { name: 'Tributário', icon: <Coins size={16} />, color: 'var(--color-info)' },
];

export function NovoProcessoModal({ isOpen, onClose, onSave, initialClientId }: NovoProcessoModalProps) {
  const { clientes, refreshProcessos } = useData();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    area: '',
    tipoAcao: '',
    numeroCnj: '',
    tribunal: '',
    vara: '',
    comarca: '',
    valorCausa: '',
    poloPassivo: '',
    faseAtual: 'Petição Inicial',
    status: 'Ativo',
    proximaAudiencia: '',
    prazoFatal: '',
    responsavel: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fillFromClient = (clientId: string) => {
    const client = clientes.find(c => c.id === clientId);
    if (!client) return;

    // Check if client has areaData and get the first area available
    const areas = Object.keys(client.area_data || {});
    const primaryArea = areas.length > 0 ? areas[0] : '';
    const ad = primaryArea ? client.area_data[primaryArea] : null;

    setFormData(prev => ({
      ...prev,
      clienteId: clientId,
      area: primaryArea || prev.area,
      tipoAcao: ad?.tipoAcao || ad?.tipoReclamacao || ad?.beneficio || ad?.tributo || prev.tipoAcao,
      numeroCnj: ad?.numeroProcesso || prev.numeroCnj,
      comarca: ad?.comarca || prev.comarca,
      valorCausa: ad?.valorDaCausa || ad?.beneficioValor || ad?.valorDebito || ad?.salario || prev.valorCausa,
      poloPassivo: ad?.contraparte || ad?.empresa || ad?.orgaoPagador || prev.poloPassivo,
      faseAtual: ad?.faseProcessual || prev.faseAtual,
      responsavel: client.responsavel || prev.responsavel
    }));
  };

  useEffect(() => {
    if (isOpen) {
      if (initialClientId) {
        fillFromClient(initialClientId);
      } else {
        setFormData({
          clienteId: '',
          area: '',
          tipoAcao: '',
          numeroCnj: '',
          tribunal: '',
          vara: '',
          comarca: '',
          valorCausa: '',
          poloPassivo: '',
          faseAtual: 'Petição Inicial',
          status: 'Ativo',
          proximaAudiencia: '',
          prazoFatal: '',
          responsavel: '',
          observacoes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, initialClientId, clientes.length]);

  const handleChange = (field: string, value: any) => {
    if (field === 'clienteId') {
      fillFromClient(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clienteId) newErrors.clienteId = 'Selecione um cliente';
    if (!formData.area) newErrors.area = 'Selecione a área do direito';
    if (!formData.tipoAcao) newErrors.tipoAcao = 'Informe o tipo de ação';
    if (!formData.tribunal) newErrors.tribunal = 'Selecione o tribunal';
    if (!formData.vara) newErrors.vara = 'Informe a vara';
    if (!formData.comarca) newErrors.comarca = 'Informe a comarca';
    if (!formData.poloPassivo) newErrors.poloPassivo = 'Informe o polo passivo';
    if (!formData.responsavel) newErrors.responsavel = 'Selecione um responsável';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const selectedCliente = clientes.find(c => c.id === formData.clienteId);
        const selectedResp = mockUsers.find(u => u.id === formData.responsavel) || { name: formData.responsavel };

        const novoProcessoData = {
          numero: formData.numeroCnj || '(Aguardando Distribuição)',
          titulo: formData.tipoAcao,
          cliente_id: formData.clienteId,
          area: formData.area,
          tribunal_nome: formData.tribunal,
          tribunal_vara: formData.vara,
          status: formData.status,
          proxima_audiencia: formData.proximaAudiencia,
          prazo_fatal: formData.prazoFatal,
          responsavel_nome: typeof selectedResp === 'string' ? selectedResp : selectedResp.name,
          valor_causa: formData.valorCausa,
          comarca: formData.comarca,
          fase_atual: formData.faseAtual,
          polo_ativo: selectedCliente?.nome || '',
          polo_passivo: formData.poloPassivo,
          observacoes_internas: formData.observacoes,
          ultima_movimentacao: new Date().toLocaleDateString('pt-BR'),
          data_distribuicao: formData.numeroCnj ? new Date().toLocaleDateString('pt-BR') : undefined
        };

        const created = await processoService.create(novoProcessoData);
        await refreshProcessos();
        
        showToast('Processo cadastrado com sucesso!', 'success');
        if (onSave) onSave(created);
        onClose();
      } catch (err: any) {
        showToast(`Erro ao salvar processo: ${err.message}`, 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} className="max-w-[800px]">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-surface-high)]">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[var(--color-surface-high)]/20 rounded-lg">
                <Briefcase size={20} className="text-[var(--color-chumbo)]" />
             </div>
             <h2 className="text-xl font-bold text-[var(--color-chumbo)] uppercase tracking-tight">Novo Processo</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-6">
            <FormField label="Cliente *" error={errors.clienteId}>
              <div className="relative">
                <Select
                  value={formData.clienteId}
                  onChange={(e) => handleChange('clienteId', e.target.value)}
                  options={clientes.map(c => ({ label: c.nome, value: c.id }))}
                  className="pl-2"
                />
              </div>
            </FormField>

            <FormField label="Área do Direito *" error={errors.area}>
              <div className="flex flex-wrap gap-3 pt-1">
                {AREAS.map((area) => (
                  <button
                    key={area.name}
                    type="button"
                    onClick={() => handleChange('area', area.name)}
                    className={`
                      px-6 py-2 rounded-lg text-sm font-medium border transition-all
                      ${formData.area === area.name 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    {area.name}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Tipo de Ação *" error={errors.tipoAcao}>
              <Input
                placeholder="Tipo de ação..."
                value={formData.tipoAcao}
                onChange={(e) => handleChange('tipoAcao', e.target.value)}
              />
            </FormField>

            <FormField label="Número CNJ" helpText="Deixe em branco se ainda não distribuído" error={errors.numeroCnj}>
              <Input
                placeholder="0000000-00.0000.0.00.0000"
                value={formData.numeroCnj}
                onChange={(e) => handleChange('numeroCnj', e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Tribunal *" error={errors.tribunal}>
                <Select
                  value={formData.tribunal}
                  onChange={(e) => handleChange('tribunal', e.target.value)}
                  options={TRIBUNAIS}
                />
              </FormField>

              <FormField label="Vara *" error={errors.vara}>
                <Input
                  placeholder="Ex: 3ª Vara do Trabalho de SP"
                  value={formData.vara}
                  onChange={(e) => handleChange('vara', e.target.value)}
                />
              </FormField>

              <FormField label="Comarca *" error={errors.comarca}>
                <Input
                  placeholder="Ex: São Paulo"
                  value={formData.comarca}
                  onChange={(e) => handleChange('comarca', e.target.value)}
                />
              </FormField>

              <FormField label="Valor da Causa" helpText="Informe 0 para ações sem valor de causa (criminal/previdenciário)" error={errors.valorCausa}>
                <Input
                  leftAddon="R$"
                  placeholder="R$ 0,00"
                  value={formData.valorCausa}
                  onChange={(e) => handleChange('valorCausa', formatCurrencyInput(e.target.value))}
                />
              </FormField>
            </div>

            <FormField label="Polo Passivo *" helpText="Empresa, pessoa ou órgão contra quem a ação é movida" error={errors.poloPassivo}>
              <Input
                placeholder="Nome da parte contrária..."
                value={formData.poloPassivo}
                onChange={(e) => handleChange('poloPassivo', e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Fase Atual *" error={errors.faseAtual}>
                <Select
                  value={formData.faseAtual}
                  onChange={(e) => handleChange('faseAtual', e.target.value)}
                  options={FASES}
                />
              </FormField>

              <FormField label="Status *" error={errors.status}>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  options={STATUS_OPCOES}
                />
              </FormField>

              <FormField label="Próxima Audiência (Opcional)">
                <input
                  type="datetime-local"
                  className="w-full bg-[var(--color-surface-high)]/10 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[var(--color-gold)] border-[var(--color-surface-high)] text-[var(--color-chumbo)] font-medium"
                  value={formData.proximaAudiencia}
                  onChange={(e) => handleChange('proximaAudiencia', e.target.value)}
                />
              </FormField>

              <FormField label="Prazo Fatal (Opcional)">
                <input
                  type="date"
                  className="w-full bg-[var(--color-surface-high)]/10 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[var(--color-gold)] border-[var(--color-surface-high)] text-[var(--color-chumbo)] font-medium"
                  value={formData.prazoFatal}
                  onChange={(e) => handleChange('prazoFatal', e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Responsável *" error={errors.responsavel}>
              <Select
                value={formData.responsavel}
                onChange={(e) => handleChange('responsavel', e.target.value)}
                options={mockUsers.map(u => ({ label: u.name, value: u.id }))}
              />
            </FormField>

            <FormField label="Observações">
              <Textarea
                placeholder="Anotações internas sobre este processo..."
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                rows={3}
              />
            </FormField>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
              <span className="text-[10px] italic">i</span>
            </div>
            <span>Campos marcados com * são obrigatórios</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-gray-600 hover:bg-gray-50 font-medium">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSubmitting} 
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 h-11 rounded-lg font-bold min-w-[160px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Salvando...</span>
                </div>
              ) : 'Salvar Processo'}
            </Button>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
