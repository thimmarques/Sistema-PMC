export interface Processo {
  id: string;
  numero: string;
  titulo: string;
  cliente: {
    nome: string;
    subtitulo?: string;
    avatar?: string;
  };
  area: string;
  tribunal: {
    nome: string;
    vara: string;
  };
  status: string;
  proximaAudiencia?: string;
  prazoFatal?: string;
  responsavel: {
    nome: string;
    avatar?: string;
    oab?: string;
    email?: string;
  };
  valorCausa?: string;
  financeiroPago?: string;
  dataDistribuicao?: string;
  ultimaMovimentacao?: string;
  comarca?: string;
  faseAtual?: string;
  poloAtivo?: string;
  poloPassivo?: string;
  observacoesInternas?: string;
}

export const mockProcessos: Processo[] = [];

export function addProcessoToMock(processo: Processo) {
  mockProcessos.unshift(processo); // Add at the beginning
  return processo;
}
