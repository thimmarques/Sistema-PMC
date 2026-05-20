import React from 'react';
import { FormField, Select, Input } from '../../ui';
import { formatCPF_CNPJ, formatPhone } from '../../../lib/formatters';

interface QualificationFieldsProps {
  tipoCliente: 'pf' | 'pj';
  data: any;
  onChange: (data: any) => void;
  errors?: any;
}

const ESTADOS_CIVIS = [
  { label: 'Solteiro(a)', value: 'solteiro' },
  { label: 'Casado(a)', value: 'casado' },
  { label: 'Divorciado(a)', value: 'divorciado' },
  { label: 'Viúvo(a)', value: 'viuvo' }
];

export function QualificationFields({ tipoCliente, data, onChange, errors }: QualificationFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  if (tipoCliente === 'pf') {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold tracking-wider text-[var(--color-chumbo)] uppercase border-b border-[var(--color-surface-high)] pb-2">QUALIFICAÇÃO - PESSOA FÍSICA</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <FormField label="NOME COMPLETO" required className="sm:col-span-2" error={errors?.nomeCompleto}>
            <Input
              value={data.nomeCompleto || ''}
              onChange={(e) => updateField('nomeCompleto', e.target.value)}
              placeholder="Digite o nome completo"
              error={errors?.nomeCompleto}
            />
          </FormField>

          <FormField label="CPF" required className="sm:col-span-2" error={errors?.cpf}>
            <Input
              value={data.cpf || ''}
              onChange={(e) => updateField('cpf', formatCPF_CNPJ(e.target.value))}
              placeholder="000.000.000-00"
              error={errors?.cpf}
            />
          </FormField>

          <FormField label="RG" className="sm:col-span-2" error={errors?.rg}>
            <Input
              value={data.rg || ''}
              onChange={(e) => updateField('rg', e.target.value)}
              placeholder="Digite o RG"
              error={errors?.rg}
            />
          </FormField>

          <FormField label="DATA DE NASCIMENTO" className="sm:col-span-2" error={errors?.dataNascimento}>
            <Input
              type="date"
              value={data.dataNascimento || ''}
              onChange={(e) => updateField('dataNascimento', e.target.value)}
              error={errors?.dataNascimento}
            />
          </FormField>

          <FormField label="ESTADO CIVIL" className="sm:col-span-2" error={errors?.estadoCivil}>
            <Select
              value={data.estadoCivil || ''}
              onChange={(e) => updateField('estadoCivil', e.target.value)}
              options={ESTADOS_CIVIS}
              error={errors?.estadoCivil}
            />
          </FormField>

          <FormField label="EMAIL" required className="sm:col-span-2" error={errors?.email}>
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="exemplo@email.com"
              error={errors?.email}
            />
          </FormField>

          <FormField label="TELEFONE" required className="sm:col-span-2" error={errors?.telefone}>
            <Input
              value={data.telefone || ''}
              onChange={(e) => updateField('telefone', formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              error={errors?.telefone}
            />
          </FormField>

          <div className="hidden sm:block sm:col-span-2" />

          <FormField label="ENDEREÇO" className="sm:col-span-3" error={errors?.endereco}>
            <Input
              value={data.endereco || ''}
              onChange={(e) => updateField('endereco', e.target.value)}
              placeholder="Rua, Av, etc."
              error={errors?.endereco}
            />
          </FormField>

          <FormField label="NÚMERO" className="sm:col-span-1" error={errors?.numero}>
            <Input
              value={data.numero || ''}
              onChange={(e) => updateField('numero', e.target.value)}
              placeholder="Nº"
              error={errors?.numero}
            />
          </FormField>

          <FormField label="CEP" className="sm:col-span-2" error={errors?.cep}>
            <Input
              value={data.cep || ''}
              onChange={(e) => updateField('cep', e.target.value)}
              placeholder="00000-000"
              error={errors?.cep}
            />
          </FormField>

          <FormField label="BAIRRO" className="sm:col-span-2" error={errors?.bairro}>
            <Input
              value={data.bairro || ''}
              onChange={(e) => updateField('bairro', e.target.value)}
              placeholder="Bairro"
              error={errors?.bairro}
            />
          </FormField>

          <FormField label="COMPLEMENTO" className="sm:col-span-4" error={errors?.complemento}>
            <Input
              value={data.complemento || ''}
              onChange={(e) => updateField('complemento', e.target.value)}
              placeholder="Apto, Bloco, etc."
              error={errors?.complemento}
            />
          </FormField>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold tracking-wider text-[var(--color-chumbo)] uppercase border-b border-[var(--color-surface-high)] pb-2">QUALIFICAÇÃO - PESSOA JURÍDICA</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <FormField label="RAZÃO SOCIAL" required className="sm:col-span-2" error={errors?.razaoSocial}>
          <Input
            value={data.razaoSocial || ''}
            onChange={(e) => updateField('razaoSocial', e.target.value)}
            placeholder="Digite a razão social"
            error={errors?.razaoSocial}
          />
        </FormField>

        <FormField label="CNPJ" required className="sm:col-span-2" error={errors?.cnpj}>
          <Input
            value={data.cnpj || ''}
            onChange={(e) => updateField('cnpj', formatCPF_CNPJ(e.target.value))}
            placeholder="00.000.000/0000-00"
            error={errors?.cnpj}
          />
        </FormField>

        <FormField label="NOME FANTASIA" className="sm:col-span-2" error={errors?.nomeFantasia}>
          <Input
            value={data.nomeFantasia || ''}
            onChange={(e) => updateField('nomeFantasia', e.target.value)}
            placeholder="Digite o nome fantasia"
            error={errors?.nomeFantasia}
          />
        </FormField>

        <FormField label="DATA CONSTITUIÇÃO" className="sm:col-span-2" error={errors?.dataConstituicao}>
          <Input
            type="date"
            value={data.dataConstituicao || ''}
            onChange={(e) => updateField('dataConstituicao', e.target.value)}
            error={errors?.dataConstituicao}
          />
        </FormField>

        <FormField label="ATIVIDADE PRINCIPAL" className="sm:col-span-2" error={errors?.atividadePrincipal}>
          <Input
            value={data.atividadePrincipal || ''}
            onChange={(e) => updateField('atividadePrincipal', e.target.value)}
            placeholder="Ex: Comércio varejista"
            error={errors?.atividadePrincipal}
          />
        </FormField>

        <FormField label="EMAIL CORPORATIVO" required className="sm:col-span-2" error={errors?.emailCorporativo}>
          <Input
            type="email"
            value={data.emailCorporativo || ''}
            onChange={(e) => updateField('emailCorporativo', e.target.value)}
            placeholder="contato@empresa.com"
            error={errors?.emailCorporativo}
          />
        </FormField>

        <FormField label="TELEFONE CORPORATIVO" required className="sm:col-span-2" error={errors?.telefoneCorporativo}>
          <Input
            value={data.telefoneCorporativo || ''}
            onChange={(e) => updateField('telefoneCorporativo', formatPhone(e.target.value))}
            placeholder="(00) 0000-0000"
            error={errors?.telefoneCorporativo}
          />
        </FormField>

        <div className="hidden sm:block sm:col-span-2" />

        <FormField label="ENDEREÇO COMERCIAL" required className="sm:col-span-3" error={errors?.enderecoComercial}>
          <Input
            value={data.enderecoComercial || ''}
            onChange={(e) => updateField('enderecoComercial', e.target.value)}
            placeholder="Rua, Av, etc."
            error={errors?.enderecoComercial}
          />
        </FormField>

        <FormField label="NÚMERO" required className="sm:col-span-1" error={errors?.numeroComercial}>
          <Input
            value={data.numeroComercial || ''}
            onChange={(e) => updateField('numeroComercial', e.target.value)}
            placeholder="Nº"
            error={errors?.numeroComercial}
          />
        </FormField>

        <FormField label="CEP" required className="sm:col-span-2" error={errors?.cepComercial}>
          <Input
            value={data.cepComercial || ''}
            onChange={(e) => updateField('cepComercial', e.target.value)}
            placeholder="00000-000"
            error={errors?.cepComercial}
          />
        </FormField>

        <FormField label="BAIRRO" required className="sm:col-span-2" error={errors?.bairroComercial}>
          <Input
            value={data.bairroComercial || ''}
            onChange={(e) => updateField('bairroComercial', e.target.value)}
            placeholder="Bairro"
            error={errors?.bairroComercial}
          />
        </FormField>

        <FormField label="COMPLEMENTO" className="sm:col-span-4" error={errors?.complementoComercial}>
          <Input
            value={data.complementoComercial || ''}
            onChange={(e) => updateField('complementoComercial', e.target.value)}
            placeholder="Sala, Andar, etc."
            error={errors?.complementoComercial}
          />
        </FormField>

        <FormField label="REPRESENTANTE LEGAL" required className="sm:col-span-2" error={errors?.representanteLegal}>
          <Input
            value={data.representanteLegal || ''}
            onChange={(e) => updateField('representanteLegal', e.target.value)}
            placeholder="Nome do representante"
            error={errors?.representanteLegal}
          />
        </FormField>

        <FormField label="CPF REPRESENTANTE" required className="sm:col-span-2" error={errors?.cpfRepresentante}>
          <Input
            value={data.cpfRepresentante || ''}
            onChange={(e) => updateField('cpfRepresentante', formatCPF_CNPJ(e.target.value))}
            placeholder="000.000.000-00"
            error={errors?.cpfRepresentante}
          />
        </FormField>
      </div>
    </div>
  );
}
