import React from 'react';
import { Star } from 'lucide-react';
import { FormField, Select, Textarea, Toggle, Input } from '../../ui';
import { formatCurrencyInput } from '../../../lib/formatters';

export interface CommonFieldsData {
  isVIP: boolean;
  responsavel: string;
  observacoes?: string;
  valorHonorarios?: string;
  formaPagamento?: string;
  parcelas?: string;
  temEntrada?: boolean;
  valorEntrada?: string;
  dataPagamento?: string;
}

interface CommonFieldsProps {
  data: CommonFieldsData;
  onChange: (data: any) => void;
  errors?: any;
}

const RESPONSAVEIS = [
  { label: 'Dr. Ricardo Silva', value: 'ricardo-silva' },
  { label: 'Dra. Ana Paula', value: 'ana-paula' },
  { label: 'Dr. Carlos Eduardo', value: 'carlos-eduardo' }
];

const FORMAS_PAGAMENTO = [
  { label: 'À Vista (PIX/Boleto)', value: 'avista' },
  { label: 'Parcelado no Cartão', value: 'cartao' },
  { label: 'Boleto Parcelado', value: 'boleto_parcelado' },
  { label: 'Apenas no Êxito', value: 'exito' }
];

export function CommonFields({ data, onChange, errors }: CommonFieldsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-[var(--color-surface-high)]">
      <h3 className="text-base font-bold tracking-wider text-[var(--color-chumbo)] uppercase border-b border-[var(--color-surface-high)] pb-2">FISCAL / FINANCEIRO / ADICIONAIS</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="VALOR HONORÁRIOS TOTAIS" error={errors?.valorHonorarios}>
          <Input
            leftAddon="R$"
            placeholder="0,00"
            value={data.valorHonorarios || ''}
            onChange={(e) => onChange({ ...data, valorHonorarios: formatCurrencyInput(e.target.value) })}
            error={errors?.valorHonorarios}
          />
        </FormField>

        <FormField label="FORMA DE PAGAMENTO" error={errors?.formaPagamento}>
          <Select
            value={data.formaPagamento || ''}
            onChange={(e) => onChange({ ...data, formaPagamento: e.target.value })}
            options={FORMAS_PAGAMENTO}
            error={errors?.formaPagamento}
          />
        </FormField>
        
        {data.formaPagamento && data.formaPagamento !== 'exito' && (
          <div className="sm:col-span-2 space-y-4 pt-2">
            <div className="flex items-center gap-4 bg-[var(--color-surface-high)]/10 p-4 rounded-lg border border-[var(--color-surface-high)]/40">
              <Toggle
                checked={data.temEntrada || false}
                onChange={(checked) => onChange({ ...data, temEntrada: checked })}
                label="Houve pagamento de entrada?"
              />
            </div>

            {(data.temEntrada || (data.formaPagamento !== 'avista' && data.formaPagamento !== 'exito')) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.temEntrada && (
                  <FormField label="VALOR ENTRADA">
                    <Input
                      leftAddon="R$"
                      placeholder="0,00"
                      value={data.valorEntrada || ''}
                      onChange={(e) => onChange({ ...data, valorEntrada: formatCurrencyInput(e.target.value) })}
                    />
                  </FormField>
                )}

                <FormField label={data.temEntrada ? "DATA ENTRADA" : "DATA 1º PAGAMENTO"}>
                  <input
                    type="date"
                    className="w-full bg-[var(--color-surface-high)]/10 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[var(--color-gold)] border-[var(--color-surface-high)] text-[var(--color-chumbo)] font-medium"
                    value={data.dataPagamento || ''}
                    onChange={(e) => onChange({ ...data, dataPagamento: e.target.value })}
                  />
                </FormField>

                {data.formaPagamento !== 'avista' && (
                  <FormField label="Nº PARCELAS">
                    <input
                       type="number"
                       min="1" max="24"
                       className="w-full bg-[var(--color-surface-high)]/10 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-[var(--color-gold)] border-[var(--color-surface-high)] text-[var(--color-chumbo)] font-medium"
                       placeholder="Ex: 6"
                       value={data.parcelas || ''}
                       onChange={(e) => onChange({ ...data, parcelas: e.target.value })}
                    />
                  </FormField>
                )}
              </div>
            )}
          </div>
        )}

        <div className="col-span-1 sm:col-span-2 pt-2">
          <Toggle
            checked={data.isVIP}
            onChange={(checked) => onChange({ ...data, isVIP: checked })}
            label="Marcar como cliente VIP"
            icon={<Star size={16} className={data.isVIP ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-gray-400"} />}
          />
        </div>

        <FormField label="RESPONSÁVEL PELA CONTA" required error={errors?.responsavel} className="col-span-1 sm:col-span-2">
          <Select
            value={data.responsavel || ''}
            onChange={(e) => onChange({ ...data, responsavel: e.target.value })}
            options={RESPONSAVEIS}
            error={errors?.responsavel}
          />
        </FormField>

        <FormField label="OBSERVAÇÕES DO CASO" error={errors?.observacoes} className="col-span-1 sm:col-span-2">
          <Textarea
            value={data.observacoes || ''}
            onChange={(e) => onChange({ ...data, observacoes: e.target.value })}
            placeholder="Informações relevantes sobre o caso..."
            error={errors?.observacoes}
          />
        </FormField>
      </div>
    </div>
  );
}
