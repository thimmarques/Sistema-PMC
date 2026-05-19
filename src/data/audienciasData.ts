export interface Audiencia {
  id: string;
  data: string; // ISO format or YYYY-MM-DD
  data_formatada: string; // "23 DE FEVEREIRO DE 2026"
  dia: string;
  mes: string;
  ano: string;
  hora_inicio: string;
  hora_fim: string;
  processo: string;
  titulo: string;
  area: string;
  cliente: string;
  local: string;
  advogado: {
    nome: string;
    iniciais: string;
    cor: string;
  };
  tipo: string;
  status: 'Agendada' | 'Realizada' | 'Cancelada';
}

export const mockAudiencias: Audiencia[] = [];

export function addAudienciaToMock(audiencia: Audiencia) {
  mockAudiencias.unshift(audiencia);
  return audiencia;
}
