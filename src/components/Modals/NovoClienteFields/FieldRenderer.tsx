import React from 'react';
import { CriminalFields } from './CriminalFields';
import { TrabalhistaFields } from './TrabalhistaFields';
import { CivilFields } from './CivilFields';
import { PrevidenciarioFields } from './PrevidenciarioFields';
import { TributarioFields } from './TributarioFields';

interface FieldRendererProps {
  tipoCliente: 'pf' | 'pj';
  area: string;
  data: any;
  onChange: (data: any) => void;
  errors?: any;
}

export function FieldRenderer({ tipoCliente, area, data, onChange, errors }: FieldRendererProps) {
  const areaKey = area.toLowerCase();
  
  switch (areaKey) {
    case 'criminal':
      return tipoCliente === 'pf' ? <CriminalFields data={data} onChange={onChange} errors={errors} /> : null;
    case 'trabalhista':
      return <TrabalhistaFields data={data} onChange={onChange} errors={errors} tipoCliente={tipoCliente} />;
    case 'cível':
    case 'civil':
      return <CivilFields data={data} onChange={onChange} errors={errors} tipoCliente={tipoCliente} />;
    case 'previdenciário':
    case 'previdenciario':
      return tipoCliente === 'pf' ? <PrevidenciarioFields data={data} onChange={onChange} errors={errors} /> : null;
    case 'tributário':
    case 'tributario':
      return <TributarioFields data={data} onChange={onChange} errors={errors} tipoCliente={tipoCliente} />;
    default:
      return null;
  }
}
