import React, { useState, useEffect } from 'react';
import { X, User, FileText, ChevronRight, Gavel, Scale, Briefcase, HeartPulse, Coins } from 'lucide-react';
import { SidePanel } from '../ui/side-panel';
import { Button, Input } from '../ui';
import { CardSelector } from '../ui/card-selector';
import { StepIndicator } from '../ui/step-indicator';

export interface Step1Data {
  tipoCliente: 'pf' | 'pj';
  areasDireito: string[];
}

interface NovoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (data: Step1Data) => void;
}

export function NovoClienteModal({ isOpen, onClose, onNext }: NovoClienteModalProps) {
  const [tipo, setTipo] = useState<'pf' | 'pj' | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ tipo?: string; areas?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setTipo(null);
      setSelectedArea(null);
      setErrors({});
    }
  }, [isOpen]);

  const handleTipoChange = (newTipo: 'pf' | 'pj') => {
    setTipo(newTipo);
    if (errors.tipo) {
      setErrors(e => ({ ...e, tipo: undefined }));
    }
    
    // Clear selected area if it's not valid for the new type
    if (newTipo === 'pj' && selectedArea && !['Cível', 'Trabalhista', 'Tributário'].includes(selectedArea)) {
      setSelectedArea(null);
    }
  };

  const isSaveButtonEnabled = 
    selectedArea !== null &&
    tipo !== null;

  const handleSave = () => {
    if (isSaveButtonEnabled && tipo) {
      onNext({ 
        tipoCliente: tipo, 
        areasDireito: selectedArea ? [selectedArea] : []
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  const areas: { name: string; pfOnly: boolean; icon: React.ReactNode; color: string; description: string }[] = [
    { 
      name: 'Criminal', 
      pfOnly: true, 
      icon: <Gavel />, 
      color: 'var(--color-error)', 
      description: 'Crimes, penal e defesa criminal' 
    },
    { 
      name: 'Cível', 
      pfOnly: false, 
      icon: <Scale />, 
      color: 'var(--color-processos)', 
      description: 'Família, contratos e direitos civis' 
    },
    { 
      name: 'Trabalhista', 
      pfOnly: false, 
      icon: <Briefcase />, 
      color: 'var(--color-warning)', 
      description: 'Relações de trabalho e emprego' 
    },
    { 
      name: 'Previdenciário', 
      pfOnly: true, 
      icon: <HeartPulse />, 
      color: 'var(--color-success)', 
      description: 'Aposentadoria e benefícios INSS' 
    },
    { 
      name: 'Tributário', 
      pfOnly: false, 
      icon: <Coins />, 
      color: 'var(--color-info)', 
      description: 'Impostos, taxas e relações fiscais' 
    },
  ];

  const filteredAreas = tipo === 'pj' 
    ? areas.filter(a => !a.pfOnly)
    : areas;

  return (
    <SidePanel isOpen={isOpen} onClose={handleClose} className="max-w-[700px]">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-chumbo)] leading-tight">NOVO CLIENTE</h2>
              <StepIndicator currentStep={1} totalSteps={2} title="TIPO E ÁREA" className="mt-1" />
            </div>
            <button
              onClick={handleClose}
              style={{ cursor: 'pointer' }}
              className="rounded-full bg-[var(--color-surface-high)] p-2 text-[var(--color-chumbo)] opacity-70 transition-colors hover:opacity-100"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tipo de Cliente */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold tracking-wider text-[var(--color-chumbo)] uppercase border-b border-[var(--color-surface-high)] pb-2">TIPO DE CLIENTE</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CardSelector
                selected={tipo === 'pf'}
                onClick={() => handleTipoChange('pf')}
                icon={<User size={20} />}
                title="Pessoa Física"
                description="CPF, dados pessoais e documentos"
              />
              <CardSelector
                selected={tipo === 'pj'}
                onClick={() => handleTipoChange('pj')}
                icon={<FileText size={20} />}
                title="Pessoa Jurídica"
                description="CNPJ, razão social e representantes"
              />
            </div>
            {errors.tipo && <p className="mt-2 text-sm text-[var(--color-error)]">{errors.tipo}</p>}
          </div>

          {/* Área do Direito */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold tracking-wider text-[var(--color-chumbo)] uppercase border-b border-[var(--color-surface-high)] pb-2">ÁREA DO DIREITO</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAreas.map((area) => (
                <CardSelector
                  key={area.name}
                  selected={selectedArea === area.name}
                  onClick={() => setSelectedArea(area.name)}
                  icon={area.icon}
                  title={area.name}
                  description={area.description}
                  color={area.color}
                  size="sm"
                />
              ))}
            </div>
            {errors.areas && <p className="mt-2 text-sm text-[var(--color-error)]">{errors.areas}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-surface-high)] bg-[var(--color-surface)] p-6 sm:px-10">
          <div className="flex justify-end gap-4">
            <Button 
              variant="ghost" 
              onClick={handleClose} 
              style={{ cursor: 'pointer' }}
              className="px-6 font-semibold text-[var(--color-chumbo)]/70 hover:text-[var(--color-chumbo)] hover:bg-transparent"
            >
              CANCELAR
            </Button>
            <Button 
              className="bg-[#C5B382] hover:bg-[#C5B382]/90 text-white px-8 font-semibold flex items-center gap-2"
              onClick={handleSave}
              disabled={!isSaveButtonEnabled}
              style={{ 
                opacity: isSaveButtonEnabled ? 1 : 0.5,
                cursor: isSaveButtonEnabled ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                if (isSaveButtonEnabled) {
                  e.currentTarget.style.opacity = '0.9'
                }
              }}
              onMouseLeave={(e) => {
                if (isSaveButtonEnabled) {
                  e.currentTarget.style.opacity = '1'
                }
              }}
            >
              PRÓXIMO
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
