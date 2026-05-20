import React from 'react';
import { FormField, Select, Textarea, Toggle, Input } from '../../ui';
import { getAreaColor } from '../../../lib/area-colors';

interface CriminalFieldsProps {
  data: any;
  onChange: (data: any) => void;
  errors?: any;
}

const POLOS = [
  { label: 'Réu', value: 'reu' },
  { label: 'Vítima', value: 'Vítima' },
  { label: 'Investigado', value: 'Investigado' },
];

const SITUACOES = [
  { label: 'Solto', value: 'Solto' },
  { label: 'Preso Preventivo', value: 'Preso Preventivo' },
  { label: 'Preso Definitivo', value: 'Preso Definitivo' },
  { label: 'Liberdade Provisória', value: 'Liberdade Provisória' },
  { label: 'Monitoramento Eletrónico', value: 'Monitoramento Eletrónico' },
];

const FASES = [
  { label: 'Inquérito', value: 'inquerito' },
  { label: 'Denúncia', value: 'denuncia' },
  { label: 'Instrucao', value: 'instrucao' },
  { label: 'Julgamento', value: 'julgamento' },
  { label: 'Recurso', value: 'recurso' },
  { label: 'Execucao', value: 'execucao' }
];

export function CriminalFields({ data, onChange, errors }: CriminalFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const colors = getAreaColor('criminal');

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold tracking-wider uppercase border-b border-[var(--color-surface-high)] pb-2" style={{ color: colors.text }}>CRIMINAL (PF)</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="POLO" required error={errors?.polo}>
          <Select
            value={data.polo || ''}
            onChange={(e) => updateField('polo', e.target.value)}
            options={POLOS}
            error={errors?.polo}
          />
        </FormField>

        <FormField label="SITUAÇÃO PRISIONAL" required error={errors?.situacaoPrisional}>
          <Select
            value={data.situacaoPrisional || ''}
            onChange={(e) => updateField('situacaoPrisional', e.target.value)}
            options={SITUACOES}
            error={errors?.situacaoPrisional}
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

        <FormField label="CRIME IMPUTADO" required error={errors?.crimeImputado} className="sm:col-span-2">
          <Textarea
            value={data.crimeImputado || ''}
            onChange={(e) => updateField('crimeImputado', e.target.value)}
            placeholder="Descreva o crime..."
            error={errors?.crimeImputado}
          />
        </FormField>

        <FormField label="BOLETIM DE OCORRÊNCIA" error={errors?.boletimOcorrencia}>
          <Input
            value={data.boletimOcorrencia || ''}
            onChange={(e) => updateField('boletimOcorrencia', e.target.value)}
            placeholder="Número do B.O."
            error={errors?.boletimOcorrencia}
          />
        </FormField>

        <FormField label="DELEGACIA RESPONSÁVEL" error={errors?.delegaciaResponsavel}>
          <Input
            value={data.delegaciaResponsavel || ''}
            onChange={(e) => updateField('delegaciaResponsavel', e.target.value)}
            placeholder="Nome da delegacia"
            error={errors?.delegaciaResponsavel}
          />
        </FormField>

        <FormField label="DATA DO FATO" error={errors?.dataDoFato}>
          <Input
            type="date"
            value={data.dataDoFato || ''}
            onChange={(e) => updateField('dataDoFato', e.target.value)}
            error={errors?.dataDoFato}
          />
        </FormField>

        <div className="flex items-end pb-2">
          <Toggle
            checked={data.antecedentesCriminais}
            onChange={(checked) => updateField('antecedentesCriminais', checked)}
            label="Antecedentes Criminais"
          />
        </div>
      </div>
    </div>
  );
}
