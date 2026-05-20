import React from 'react';
import { FormField, Select, Input, Textarea } from '../../ui';
import { getAreaColor } from '../../../lib/area-colors';
import { formatCurrencyInput } from '../../../lib/formatters';

interface TributarioFieldsProps {
  data: any;
  onChange: (data: any) => void;
  errors?: any;
  tipoCliente: 'pf' | 'pj';
}

const TIPOS_TRIBUTO = [
  { label: 'ICMS', value: 'icms' },
  { label: 'IPI', value: 'ipi' },
  { label: 'ISS', value: 'iss' },
  { label: 'IRPJ', value: 'irpj' },
  { label: 'IPTU', value: 'iptu' },
  { label: 'IPVA', value: 'ipva' },
  { label: 'IRPF', value: 'irpf' }
];

const ORGAOS = [
  { label: 'Receita Federal', value: 'receita-federal' },
  { label: 'SEFAZ', value: 'sefaz' },
  { label: 'Prefeitura', value: 'prefeitura' }
];

const FASES = [
  { label: 'Postulatória', value: 'Postulatória' },
  { label: 'Saneadora', value: 'Saneadora' },
  { label: 'Instrutória', value: 'Instrutória' },
  { label: 'Alegações Finais', value: 'Alegações-Finais' },
  { label: 'Sentença', value: 'Sentença' },
  { label: 'Recursos', value: 'Recursos' },
  { label: 'Execução/Cumprimento', value: 'execucao-cumprimento' }
  
];

export function TributarioFields({ data, onChange, errors, tipoCliente }: TributarioFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const colors = getAreaColor('tributario');

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold tracking-wider uppercase border-b border-[var(--color-surface-high)] pb-2" style={{ color: colors.text }}>TRIBUTÁRIO ({tipoCliente.toUpperCase()})</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="TIPO TRIBUTO" required error={errors?.tipoTributo}>
          <Select
            value={data.tipoTributo || ''}
            onChange={(e) => updateField('tipoTributo', e.target.value)}
            options={TIPOS_TRIBUTO}
            error={errors?.tipoTributo}
          />
        </FormField>

        <FormField label="PERÍODO FISCAL" required error={errors?.periodoFiscal}>
          <Input
            value={data.periodoFiscal || ''}
            onChange={(e) => updateField('periodoFiscal', e.target.value)}
            placeholder="MM/AAAA"
            error={errors?.periodoFiscal}
          />
        </FormField>

        <FormField label="VALOR DÉBITO" required error={errors?.valorDebito}>
          <Input
            leftAddon="R$"
            value={data.valorDebito || ''}
            onChange={(e) => updateField('valorDebito', formatCurrencyInput(e.target.value))}
            placeholder="0,00"
            error={errors?.valorDebito}
          />
        </FormField>

        <FormField label="ÓRGÃO FISCALIZADOR" required error={errors?.orgaoFiscalizador}>
          <Select
            value={data.orgaoFiscalizador || ''}
            onChange={(e) => updateField('orgaoFiscalizador', e.target.value)}
            options={ORGAOS}
            error={errors?.orgaoFiscalizador}
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

        <FormField label="DESCRIÇÃO" error={errors?.descricao} className="sm:col-span-2">
          <Textarea
            value={data.descricao || ''}
            onChange={(e) => updateField('descricao', e.target.value)}
            placeholder="Descreva os detalhes do débito..."
            error={errors?.descricao}
          />
        </FormField>
      </div>
    </div>
  );
}
