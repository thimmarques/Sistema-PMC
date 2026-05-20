import React from 'react';
import { FormField, Select, Input, Textarea } from '../../ui';
import { getAreaColor } from '../../../lib/area-colors';
import { formatCurrencyInput } from '../../../lib/formatters';

interface CivilFieldsProps {
  data: any;
  onChange: (data: any) => void;
  errors?: any;
  tipoCliente: 'pf' | 'pj';
}

const TIPOS_ACAO_PF = [
  { label: 'Ação de Indenização', value: 'Ação de Indenização' },
  { label: 'Ação de Cobrança', value: 'Ação de Cobrança' },
  { label: 'Ação de Alimentos', value: 'Ação de Alimentos' },
  { label: 'Ação de Divórcio/União Estável', value: 'Ação de Divórcio/União Estável' },
  { label: 'Ação de Usucapião', value: 'Ação de Usucapião' },
  { label: 'Ação de Despejo', value: 'Ação de Despejo' },
  { label: 'Ação de Execução de Alimentos', value: 'Ação de Execução de Alimentos' },
  { label: 'Outros', value: 'Outros' }
];

const TIPOS_ACAO_PJ = [
  { label: 'Ação de Cobrança', value: 'Ação de Cobrança' },
  { label: 'Ação Monitória', value: 'Ação Monitória' },
  { label: 'Execução de Título Extrajudicial', value: 'Execução de Título Extrajudicial' },
  { label: 'Ação de Despejo', value: 'Ação de Despejo' },
  { label: 'Busca e Apreensão', value: 'Busca e Apreensão' },
  { label: 'Revisional de Contrato', value: 'Revisional de Contrato' },
  { label: 'Consignação em Pagamento', value: 'Consignação em Pagamento' },
  { label: 'Ação de Indenização', value: 'Ação de Indenização' },
  { label: 'Outros', value: 'Outros'}
];

const POLOS = [
  { label: 'Ativo', value: 'Ativo' },
  { label: 'Passivo', value: 'Passivo' },
  { label: 'Terceiro interessado', value: 'Terceiro interessado' }
];

const FASES = [
  { label: 'Petição', value: 'peticao' },
  { label: 'Contestação', value: 'contestacao' },
  { label: 'Sentença', value: 'sentenca' },
  { label: 'Recurso', value: 'Recurso' },
  { label: 'Cumprimento Sentença / Execução', value: 'Cumprimento Sentença / Execução' },
];

export function CivilFields({ data, onChange, errors, tipoCliente }: CivilFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const colors = getAreaColor('civil');

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold tracking-wider uppercase border-b border-[var(--color-surface-high)] pb-2" style={{ color: colors.text }}>CÍVEL ({tipoCliente.toUpperCase()})</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="TIPO AÇÃO" required error={errors?.tipoAcao}>
          <Select
            value={data.tipoAcao || ''}
            onChange={(e) => updateField('tipoAcao', e.target.value)}
            options={tipoCliente === 'pf' ? TIPOS_ACAO_PF : TIPOS_ACAO_PJ}
            error={errors?.tipoAcao}
          />
        </FormField>

        <FormField label="VALOR DA CAUSA" required error={errors?.valorDaCausa}>
          <Input
            leftAddon="R$"
            value={data.valorDaCausa || ''}
            onChange={(e) => updateField('valorDaCausa', formatCurrencyInput(e.target.value))}
            placeholder="0,00"
            error={errors?.valorDaCausa}
          />
        </FormField>

        <FormField label={tipoCliente === 'pf' ? "RÉU/AUTOR" : "CONTRAPARTE"} required error={errors?.reuAutor || errors?.contraparte}>
          {tipoCliente === 'pf' ? (
            <Select
              value={data.reuAutor || ''}
              onChange={(e) => updateField('reuAutor', e.target.value)}
              options={POLOS}
              error={errors?.reuAutor}
            />
          ) : (
            <Input
              value={data.contraparte || ''}
              onChange={(e) => updateField('contraparte', e.target.value)}
              placeholder="Nome da contraparte"
              error={errors?.contraparte}
            />
          )}
        </FormField>

        <FormField label="DATA PROPOSITURA" required error={errors?.dataPropositura}>
          <Input
            type="date"
            value={data.dataPropositura || ''}
            onChange={(e) => updateField('dataPropositura', e.target.value)}
            error={errors?.dataPropositura}
          />
        </FormField>

        <FormField label="FASE PROCESSUAL" required error={errors?.faseProcessual} className="sm:col-span-2">
          <Select
            value={data.faseProcessual || ''}
            onChange={(e) => updateField('faseProcessual', e.target.value)}
            options={FASES}
            error={errors?.faseProcessual}
          />
        </FormField>

        <FormField label={tipoCliente === 'pf' ? "DESCRIÇÃO DO CASO" : "DESCRIÇÃO"} required error={errors?.descricaoDoCaso || errors?.descricao} className="sm:col-span-2">
          <Textarea
            value={(tipoCliente === 'pf' ? data.descricaoDoCaso : data.descricao) || ''}
            onChange={(e) => updateField(tipoCliente === 'pf' ? 'descricaoDoCaso' : 'descricao', e.target.value)}
            placeholder="Descreva os detalhes do caso..."
            error={tipoCliente === 'pf' ? errors?.descricaoDoCaso : errors?.descricao}
          />
        </FormField>
      </div>
    </div>
  );
}
