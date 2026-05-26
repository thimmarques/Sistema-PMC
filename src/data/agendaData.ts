import { Processo } from './processosData';

export type AgendaType = 'Audiência' | 'Reunião' | 'Prazo' | 'Tarefa' | 'Lembrete';
export type AgendaStatus = 'Pendente' | 'Concluído' | 'Cancelado';

export interface AgendaEvent {
  id: string;
  title: string;
  type: AgendaType;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  description?: string;
  process?: string;
  client?: string;
  status: AgendaStatus;
  user: string;
}

export const mockAgendaEvents: AgendaEvent[] = [];
