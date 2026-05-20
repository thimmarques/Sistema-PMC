import React from 'react';
import { FormField, Select, Input } from '../../ui';
import { getAreaColor } from '../../../lib/area-colors';
import { formatCurrencyInput } from '../../../lib/formatters';

interface TrabalhistaFieldsProps {
  data: any;
  onChange: (data: any) => void;
  errors?: any;
  tipoCliente: 'pf' | 'pj';
}

const MOTIVOS = [
  { label: 'Justa Causa', value: 'justa-causa' },
  { label: 'Sem Justa Causa', value: 'sem-justa-causa' },
  { label: 'Pedido Demissão', value: 'pedido-demissao' },
  { label: 'Outros', value: 'Outros' }
];

const TIPOS_RECLAMACAO = [
  { label: 'Reclamação Trabalhista', value: 'reclamação-trabalhista' },
  { label: 'Horas Extras', value: 'horas-extras' },
  { label: 'Assédio', value: 'assedio' },
  { label: 'Consignação em Pagamento', value: 'Consignação-Pagamento' },
  { label: 'Outros', value: 'Outros' }
];

const FASES = [
  { label: 'Reclamação', value: 'reclamacao' },
  { label: 'Audiência UNA', value: 'audiencia-una' },
  { label: 'Instrução', value: 'Instrução' },
  { label: 'Sentença', value: 'sentenca' },
  { label: 'Recurso', value: 'recurso' },
  { label: 'Liquidação', value: 'liquidacao' },
  { label: 'Execução', value: 'execucao' }
];

export function TrabalhistaFields({ data, onChange, errors, tipoCliente }: TrabalhistaFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const colors = getAreaColor('trabalhista');

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold tracking-wider uppercase border-b border-[var(--color-surface-high)] pb-2" style={{ color: colors.text }}>TRABALHISTA ({tipoCliente.toUpperCase()})</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label={tipoCliente === 'pf' ? "CARGO" : "CARGO RESPONSÁVEL"} required error={errors?.cargo || errors?.cargoResponsavel}>
          <Input
            value={(tipoCliente === 'pf' ? data.cargo : data.cargoResponsavel) || ''}
            onChange={(e) => updateField(tipoCliente === 'pf' ? 'cargo' : 'cargoResponsavel', e.target.value)}
            placeholder="Cargo ocupado"
            error={tipoCliente === 'pf' ? errors?.cargo : errors?.cargoResponsavel}
          />
        </FormField>

        <FormField label="EMPRESA" required error={errors?.empresa}>
          <Input
            value={data.empresa || ''}
            onChange={(e) => updateField('empresa', e.target.value)}
            placeholder="Nome da empresa"
            error={errors?.empresa}
          />
        </FormField>

        <FormField label={tipoCliente === 'pf' ? "DATA ADMISSÃO" : "DATA CONTRATAÇÃO"} required error={errors?.dataAdmissao || errors?.dataContratacao}>
          <Input
            type="date"
            value={(tipoCliente === 'pf' ? data.dataAdmissao : data.dataContratacao) || ''}
            onChange={(e) => updateField(tipoCliente === 'pf' ? 'dataAdmissao' : 'dataContratacao', e.target.value)}
            error={tipoCliente === 'pf' ? errors?.dataAdmissao : errors?.dataContratacao}
          />
        </FormField>

        {tipoCliente === 'pf' && (
          <FormField label="DATA DEMISSÃO" error={errors?.dataDemissao}>
            <Input
              type="date"
              value={data.dataDemissao || ''}
              onChange={(e) => updateField('dataDemissao', e.target.value)}
              error={errors?.dataDemissao}
            />
          </FormField>
        )}

        {tipoCliente === 'pf' && (
          <FormField label="MOTIVO DEMISSÃO" error={errors?.motivoDemissao}>
            <Select
              value={data.motivoDemissao || ''}
              onChange={(e) => updateField('motivoDemissao', e.target.value)}
              options={MOTIVOS}
              error={errors?.motivoDemissao}
            />
          </FormField>
        )}

        {tipoCliente === 'pf' && (
          <FormField label="SALÁRIO" required error={errors?.salario}>
            <Input
              leftAddon="R$"
              value={data.salario || ''}
              onChange={(e) => updateField('salario', formatCurrencyInput(e.target.value))}
              placeholder="0,00"
              error={errors?.salario}
            />
          </FormField>
        )}

        <FormField label="TIPO RECLAMAÇÃO" required error={errors?.tipoReclamacao}>
          <Select
            value={data.tipoReclamacao || ''}
            onChange={(e) => updateField('tipoReclamacao', e.target.value)}
            options={TIPOS_RECLAMACAO}
            error={errors?.tipoReclamacao}
          />
        </FormField>

        <FormField label="FASE PROCESSUAL" required error={errors?.faseProcessual}>
          <Select
            value={data.faseProcessual || ''}
            onChange={(e) => updateField('faseProcessual', e.target.value)}
            options={FASES}
            error={errors?.faseProcessual}
          />
        </FormField>

        {tipoCliente === 'pj' && (
          <FormField label="NÚMERO PROCESSO" error={errors?.numeroProcesso}>
            <Input
              value={data.numeroProcesso || ''}
              onChange={(e) => updateField('numeroProcesso', e.target.value)}
              placeholder="0000000-00.0000.0.00.0000"
              error={errors?.numeroProcesso}
            />
          </FormField>
        )}
      </div>
    </div>
  );
}
