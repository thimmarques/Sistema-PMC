export interface TransacaoFinanceira {
  id: string;
  cliente: {
    nome: string;
    area: string;
  };
  processo: string;
  advogado: {
    nome: string;
    iniciais: string;
  };
  tipo: 'Honorário' | 'Repasse' | 'Despesa' | 'Custas';
  descricao: string;
  vencimento: {
    data: string;
    statusText: string;
    isVencido: boolean;
    isPago: boolean;
  };
  valor: {
    amount: string;
    parcelas?: string;
  };
  status: 'Pendente' | 'Parcelado' | 'Vencido' | 'Pago';
}

export const mockFinanceiro: TransacaoFinanceira[] = [];

export function addFinanceiroToMock(transacao: TransacaoFinanceira) {
  mockFinanceiro.unshift(transacao); // Add at the beginning
  return transacao;
}

export const mockAdvogadosResumo = [
  {
    iniciais: 'PL', 
    nome: 'Dra. Patrícia Lima',
    areas: ['Trabalhista', 'Civil'],
    aReceber: 'R$ 0,00',
    recebido: 'R$ 0,00',
    taxa: '0%',
    colorBase: '#6B21A8' // Purple
  },
  {
    iniciais: 'MF', 
    nome: 'Dr. Marcos Ferreira',
    areas: ['Trabalhista', 'Civil'],
    aReceber: 'R$ 0,00',
    recebido: 'R$ 0,00',
    taxa: '0%',
    colorBase: '#059669' // Emerald
  },
  {
    iniciais: 'CM', 
    nome: 'Dr. Carlos Mendes',
    areas: ['Criminal'],
    aReceber: 'R$ 0,00',
    recebido: 'R$ 0,00',
    taxa: '0%',
    colorBase: '#DC2626' // Red
  },
  {
    iniciais: 'SC', 
    nome: 'Dra. Sandra Costa',
    areas: ['Previdenciário'],
    aReceber: 'R$ 0,00',
    recebido: 'R$ 0,00',
    taxa: '0%',
    colorBase: '#D97706' // Amber
  }
];
