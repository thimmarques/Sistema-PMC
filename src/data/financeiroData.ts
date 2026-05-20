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

export const mockAdvogadosResumo: any[] = [];
