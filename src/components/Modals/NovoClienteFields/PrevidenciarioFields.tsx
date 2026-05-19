import React from 'react';
import { FormField, Select, Input, Textarea } from '../../ui';
import { getAreaColor } from '../../../lib/area-colors';

interface PrevidenciarioFieldsProps {
  data: any;
  onChange: (data: any) => void;
  errors?: any;
}

const TIPOS_BENEFICIO = [
  { label: 'Aposentadoria', value: 'aposentadoria' },
  { label: 'Auxílio Doença', value: 'auxilio-doenca' },
  { label: 'Pensão', value: 'pensao' }
];

const FASES = [
  { label: 'Requerimento', value: 'requerimento' },
  { label: 'Análise', value: 'analise' },
  { label: 'Recurso', value: 'recurso' }
];

export function PrevidenciarioFields({ data, onChange, errors }: PrevidenciarioFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const colors = getAreaColor('previdenciario');

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold tracking-wider uppercase border-b border-[var(--color-surface-high)] pb-2" style={{ color: colors.text }}>PREVIDENCIÁRIO (PF)</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="TIPO BENEFÍCIO" required error={errors?.tipoBeneficio}>
           <Select
            value={data.tipoBeneficio || ''}
            onChange={(e) => updateField('tipoBeneficio', e.target.value)}
            options={TIPOS_BENEFICIO}
            error={errors?.tipoBeneficio}
          />
        </FormField>

        <FormField label="DATA REQUERIMENTO" required error={errors?.dataRequerimento}>
          <Input
            type="date"
            value={data.dataRequerimento || ''}
            onChange={(e) => updateField('dataRequerimento', e.target.value)}
            error={errors?.dataRequerimento}
          />
        </FormField>

        <FormField label="NÚMERO PROCESSO INSS" error={errors?.numeroProcessoINSS}>
          <Input
            value={data.numeroProcessoINSS || ''}
            onChange={(e) => updateField('numeroProcessoINSS', e.target.value)}
            placeholder="00000.000000/0000-00"
            error={errors?.numeroProcessoINSS}
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

        <FormField label="MOTIVO NEGAÇÃO" error={errors?.motivoNegacao} className="sm:col-span-2">
          <Textarea
            value={data.motivoNegacao || ''}
            onChange={(e) => updateField('motivoNegacao', e.target.value)}
            placeholder="Descreva o motivo da negação, se houver..."
            error={errors?.motivoNegacao}
          />
        </FormField>
      </div>
    </div>
  );
}
