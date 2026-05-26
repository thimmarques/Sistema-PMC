import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Save } from 'lucide-react';
import { SidePanel } from '../ui/side-panel';
import { Button } from '../ui';
import { QualificationFields } from './NovoClienteFields/QualificationFields';
import { FieldRenderer } from './NovoClienteFields/FieldRenderer';
import { CommonFields } from './NovoClienteFields/CommonFields';
import { formatCPF_CNPJ, formatPhone, formatCurrencyInput } from '../../lib/formatters';

interface EditarClienteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: any;
  onSave: (data: any) => void;
}

export function EditarClienteDrawer({ isOpen, onClose, cliente, onSave }: EditarClienteDrawerProps) {
  const [qualificacao, setQualificacao] = useState<Record<string, any>>({});
  const [areaData, setAreaData] = useState<Record<string, any>>({});
  const [commonData, setCommonData] = useState({
    isVIP: false,
    responsavel: '',
    observacoes: '',
    valorHonorarios: '',
    formaPagamento: '',
    parcelas: '',
    temEntrada: false,
    valorEntrada: '',
    dataPagamento: ''
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen && cliente) {
      // Map basic fields from client object to the structured state used in registration
      const isPF = cliente.tipo === 'pf';
      
      const qual = cliente.qualificacao || {};

      setQualificacao({
        nomeCompleto: isPF ? cliente.nome : (qual.nomeCompleto || ''),
        razaoSocial: !isPF ? cliente.nome : (qual.razaoSocial || ''),
        cpf: isPF ? formatCPF_CNPJ(cliente.cpf_cnpj) : (formatCPF_CNPJ(qual.cpf) || ''),
        cnpj: !isPF ? formatCPF_CNPJ(cliente.cpf_cnpj) : (formatCPF_CNPJ(qual.cnpj) || ''),
        email: isPF ? cliente.email : (qual.email || ''),
        emailCorporativo: !isPF ? cliente.email : (qual.emailCorporativo || ''),
        telefone: isPF ? formatPhone(cliente.telefone) : (formatPhone(qual.telefone) || ''),
        telefoneCorporativo: !isPF ? formatPhone(cliente.telefone) : (formatPhone(qual.telefoneCorporativo) || ''),
        // PF Fields
        rg: qual.rg || '',
        dataNascimento: qual.dataNascimento || '',
        estadoCivil: qual.estadoCivil || '',
        endereco: qual.endereco || '',
        numero: qual.numero || '',
        bairro: qual.bairro || '',
        cep: qual.cep || '',
        complemento: qual.complemento || '',
        // PJ Fields
        nomeFantasia: qual.nomeFantasia || '',
        dataConstituicao: qual.dataConstituicao || '',
        atividadePrincipal: qual.atividadePrincipal || '',
        enderecoComercial: qual.enderecoComercial || '',
        numeroComercial: qual.numeroComercial || '',
        bairroComercial: qual.bairroComercial || '',
        cepComercial: qual.cepComercial || '',
        complementoComercial: qual.complementoComercial || '',
        representanteLegal: qual.representanteLegal || '',
        cpfRepresentante: formatCPF_CNPJ(qual.cpfRepresentante) || ''
      });

      // Initialize area data based on client area
      const initialAreaData: Record<string, any> = {};
      if (cliente.area) {
        initialAreaData[cliente.area] = cliente.areaData?.[cliente.area] || {};
      }
      setAreaData(initialAreaData);

      setCommonData({
        isVIP: cliente.isVIP || false,
        responsavel: cliente.responsavel || '',
        observacoes: cliente.observacoes || '',
        valorHonorarios: formatCurrencyInput(cliente.valorHonorarios) || '',
        formaPagamento: cliente.formaPagamento || '',
        parcelas: cliente.parcelas || '',
        temEntrada: cliente.temEntrada || false,
        valorEntrada: formatCurrencyInput(cliente.valorEntrada) || '',
        dataPagamento: cliente.dataPagamento || ''
      });
      
      setErrors({});
    }
  }, [isOpen, cliente]);

  const handleAreaChange = (area: string, data: any) => {
    setAreaData(prev => ({ ...prev, [area]: data }));
  };

  const handleSave = () => {
    const finalData = {
      ...cliente,
      nome: cliente.tipo === 'pf' ? qualificacao.nomeCompleto : qualificacao.razaoSocial,
      cpf_cnpj: cliente.tipo === 'pf' ? qualificacao.cpf : qualificacao.cnpj,
      email: cliente.tipo === 'pf' ? qualificacao.email : qualificacao.emailCorporativo,
      telefone: cliente.tipo === 'pf' ? qualificacao.telefone : qualificacao.telefoneCorporativo,
      responsavel: commonData.responsavel,
      qualificacao,
      areaData,
      ...commonData
    };
    onSave(finalData);
  };

  if (!cliente) return null;

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} className="max-w-[800px]">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-surface-high)] p-6">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-[var(--color-chumbo)]">Editar Cliente</h2>
            <p className="text-sm text-[var(--color-text-secondary)] opacity-70">
              {cliente.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'} — {cliente.area}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-[var(--color-surface-high)] p-2 text-[var(--color-chumbo)] opacity-70 transition-colors hover:opacity-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:px-10 space-y-8 scrollbar-hide">
          <QualificationFields 
            tipoCliente={cliente.tipo}
            data={qualificacao}
            onChange={setQualificacao}
            errors={errors.qualificacao}
          />

          {cliente.area && (
            <div className="pt-6 border-t border-[var(--color-surface-high)]">
              <FieldRenderer 
                tipoCliente={cliente.tipo}
                area={cliente.area}
                data={areaData[cliente.area] || {}}
                onChange={(data) => handleAreaChange(cliente.area, data)}
                errors={errors[cliente.area]}
              />
            </div>
          )}

          <CommonFields 
            data={commonData}
            onChange={setCommonData}
            errors={errors.common}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-surface-high)] bg-[var(--color-surface)] p-6 sm:px-10">
          <div className="flex justify-between items-center">
            <button 
              onClick={onClose}
              className="text-sm font-semibold text-[var(--color-chumbo)] opacity-70 hover:opacity-100 flex items-center gap-2 transition-all"
            >
              <ArrowLeft size={16} />
              VOLTAR
            </button>
            <div className="flex gap-4">
              <Button 
                variant="ghost"
                onClick={onClose}
                className="text-sm font-semibold text-[var(--color-chumbo)] opacity-70 hover:opacity-100 transition-all hover:bg-transparent"
              >
                CANCELAR
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white px-8 font-bold flex items-center gap-2 rounded-md transition-all shadow-md active:scale-95"
              >
                SALVAR ALTERAÇÕES
                <Save size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
