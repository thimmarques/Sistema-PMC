import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Save } from 'lucide-react';
import { SidePanel } from '../ui/side-panel';
import { Button, StepIndicator } from '../ui';
import { FieldRenderer } from './NovoClienteFields/FieldRenderer';
import { CommonFields } from './NovoClienteFields/CommonFields';
import { QualificationFields } from './NovoClienteFields/QualificationFields';

export interface Step1Data {
  tipoCliente: 'pf' | 'pj';
  areasDireito: string[];
}

interface Step2ModalProps {
  isOpen: boolean;
  step1Data: Step1Data;
  onBack: () => void;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function Step2Modal({ isOpen, step1Data, onBack, onClose, onSave }: Step2ModalProps) {
  const [qualificacao, setQualificacao] = useState<Record<string, any>>({});
  const [areaData, setAreaData] = useState<Record<string, any>>({});
  const [commonData, setCommonData] = useState({
    isVIP: false,
    responsavel: '',
    observacoes: ''
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      setQualificacao({});
      const initialAreaData: Record<string, any> = {};
      step1Data.areasDireito.forEach(area => {
        initialAreaData[area] = {};
      });
      setAreaData(initialAreaData);
      setCommonData({
        isVIP: false,
        responsavel: '',
        observacoes: ''
      });
      setErrors({});
    }
  }, [isOpen, step1Data]);

  const handleAreaChange = (area: string, data: any) => {
    setAreaData(prev => ({ ...prev, [area]: data }));
    if (errors[area]) {
      const newErrors = { ...errors };
      delete newErrors[area];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, any> = {};
    let isValid = true;

    // Validate Qualification
    const qualErrors: Record<string, string> = {};
    if (step1Data.tipoCliente === 'pf') {
      if (!qualificacao.nomeCompleto) qualErrors.nomeCompleto = 'Campo obrigatório';
      if (!qualificacao.cpf) qualErrors.cpf = 'Campo obrigatório';
      if (!qualificacao.email) qualErrors.email = 'Campo obrigatório';
      if (!qualificacao.telefone) qualErrors.telefone = 'Campo obrigatório';
    } else {
      if (!qualificacao.razaoSocial) qualErrors.razaoSocial = 'Campo obrigatório';
      if (!qualificacao.cnpj) qualErrors.cnpj = 'Campo obrigatório';
      if (!qualificacao.emailCorporativo) qualErrors.emailCorporativo = 'Campo obrigatório';
      if (!qualificacao.telefoneCorporativo) qualErrors.telefoneCorporativo = 'Campo obrigatório';
      if (!qualificacao.enderecoComercial) qualErrors.enderecoComercial = 'Campo obrigatório';
      if (!qualificacao.numeroComercial) qualErrors.numeroComercial = 'Campo obrigatório';
      if (!qualificacao.bairroComercial) qualErrors.bairroComercial = 'Campo obrigatório';
      if (!qualificacao.cepComercial) qualErrors.cepComercial = 'Campo obrigatório';
      if (!qualificacao.representanteLegal) qualErrors.representanteLegal = 'Campo obrigatório';
      if (!qualificacao.cpfRepresentante) qualErrors.cpfRepresentante = 'Campo obrigatório';
    }

    if (Object.keys(qualErrors).length > 0) {
      newErrors.qualificacao = qualErrors;
      isValid = false;
    }

    // Validate each area
    step1Data.areasDireito.forEach(area => {
      const data = areaData[area] || {};
      const areaErrors: Record<string, string> = {};
      const areaLower = area.toLowerCase();

      if (areaLower === 'criminal') {
        if (!data.polo) areaErrors.polo = 'Campo obrigatório';
        if (!data.situacaoPrisional) areaErrors.situacaoPrisional = 'Campo obrigatório';
        if (!data.crimeImputado) areaErrors.crimeImputado = 'Campo obrigatório';
        if (!data.faseProcessual) areaErrors.faseProcessual = 'Campo obrigatório';
      } else if (areaLower === 'trabalhista') {
        if (step1Data.tipoCliente === 'pf') {
          if (!data.cargo) areaErrors.cargo = 'Campo obrigatório';
          if (!data.empresa) areaErrors.empresa = 'Campo obrigatório';
          if (!data.dataAdmissao) areaErrors.dataAdmissao = 'Campo obrigatório';
          if (!data.salario) areaErrors.salario = 'Campo obrigatório';
          if (!data.tipoReclamacao) areaErrors.tipoReclamacao = 'Campo obrigatório';
          if (!data.faseProcessual) areaErrors.faseProcessual = 'Campo obrigatório';
        } else {
          if (!data.cargoResponsavel) areaErrors.cargoResponsavel = 'Campo obrigatório';
          if (!data.empresa) areaErrors.empresa = 'Campo obrigatório';
          if (!data.dataContratacao) areaErrors.dataContratacao = 'Campo obrigatório';
          if (!data.tipoReclamacao) areaErrors.tipoReclamacao = 'Campo obrigatório';
          if (!data.faseProcessual) areaErrors.faseProcessual = 'Campo obrigatório';
        }
      } else if (areaLower === 'cível' || areaLower === 'civil') {
        if (!data.tipoAcao) areaErrors.tipoAcao = 'Campo obrigatório';
        if (!data.valorDaCausa) areaErrors.valorDaCausa = 'Campo obrigatório';
        if (step1Data.tipoCliente === 'pf') {
          if (!data.reuAutor) areaErrors.reuAutor = 'Campo obrigatório';
          if (!data.descricaoDoCaso) areaErrors.descricaoDoCaso = 'Campo obrigatório';
        } else {
          if (!data.contraparte) areaErrors.contraparte = 'Campo obrigatório';
          if (!data.descricao) areaErrors.descricao = 'Campo obrigatório';
        }
        if (!data.dataPropositura) areaErrors.dataPropositura = 'Campo obrigatório';
        if (!data.faseProcessual) areaErrors.faseProcessual = 'Campo obrigatório';
      } else if (areaLower === 'previdenciário' || areaLower === 'previdenciario') {
        if (!data.tipoBeneficio) areaErrors.tipoBeneficio = 'Campo obrigatório';
        if (!data.dataRequerimento) areaErrors.dataRequerimento = 'Campo obrigatório';
        if (!data.faseProcessual) areaErrors.faseProcessual = 'Campo obrigatório';
      } else if (areaLower === 'tributário' || areaLower === 'tributario') {
        if (!data.tipoTributo) areaErrors.tipoTributo = 'Campo obrigatório';
        if (!data.periodoFiscal) areaErrors.periodoFiscal = 'Campo obrigatório';
        if (!data.valorDebito) areaErrors.valorDebito = 'Campo obrigatório';
        if (!data.orgaoFiscalizador) areaErrors.orgaoFiscalizador = 'Campo obrigatório';
        if (!data.faseProcessual) areaErrors.faseProcessual = 'Campo obrigatório';
      }

      if (Object.keys(areaErrors).length > 0) {
        newErrors[area] = areaErrors;
        isValid = false;
      }
    });

    // Validate common fields
    if (!commonData.responsavel) {
      newErrors.common = { responsavel: 'Selecione um responsável' };
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      const finalData = {
        ...commonData,
        qualificacao,
        areaData
      };
      onSave(finalData);
    }
  };

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} className="max-w-[800px]">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-chumbo)] leading-tight">DADOS DO CLIENTE</h2>
              <StepIndicator currentStep={2} totalSteps={2} title="DETALHAMENTO" className="mt-1" />
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-[var(--color-surface-high)] p-2 text-[var(--color-chumbo)] opacity-70 transition-colors hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Section 1: Qualification */}
            <QualificationFields
              tipoCliente={step1Data.tipoCliente}
              data={qualificacao}
              onChange={setQualificacao}
              errors={errors.qualificacao}
            />

            {/* Section 2: Dynamic Area Fields */}
            {step1Data.areasDireito.map((area) => (
              <div key={area} className="pt-6 border-t border-[var(--color-surface-high)]">
                <FieldRenderer
                  tipoCliente={step1Data.tipoCliente}
                  area={area}
                  data={areaData[area] || {}}
                  onChange={(data) => handleAreaChange(area, data)}
                  errors={errors[area]}
                />
              </div>
            ))}

            {/* Section 3: Common Fields */}
            <CommonFields
              data={commonData}
              onChange={setCommonData}
              errors={errors.common}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-surface-high)] bg-[var(--color-surface)] p-6 sm:px-10">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={onBack} className="px-6 font-semibold text-[var(--color-chumbo)]/70 hover:text-[var(--color-chumbo)] hover:bg-transparent flex items-center gap-2">
              <ArrowLeft size={18} />
              VOLTAR
            </Button>
            
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onClose} className="px-6 font-semibold text-[var(--color-chumbo)]/70 hover:text-[var(--color-chumbo)] hover:bg-transparent">
                CANCELAR
              </Button>
              <Button 
                className="bg-[#C5B382] hover:bg-[#C5B382]/90 text-white px-8 font-semibold flex items-center gap-2"
                onClick={handleSave}
              >
                SALVAR CADASTRO
                <Save size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
