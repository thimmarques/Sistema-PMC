export const mockUsers = [
  { id: '1', email: 'admin@webhubpro.com', password: 'admin123', role: 'admin', name: 'Admin' },
  { id: '2', email: 'advogado@webhubpro.com', password: 'adv123', role: 'advogado', name: 'Advogado João' },
  { id: '3', email: 'estagiario@webhubpro.com', password: 'est123', role: 'estagiario', name: 'Estagiário Lucas' },
];

export const recentActivityData = [];

export const upcomingHearingsData = [];

export const areaDistributionData = [];

export const mockClientes = [];

export function addClienteToMock(cliente: any) {
  mockClientes.push(cliente);
  return cliente;
}

export function removeClienteFromMock(id: string) {
  const index = mockClientes.findIndex(c => c.id === id);
  if (index !== -1) {
    mockClientes.splice(index, 1);
    return true;
  }
  return false;
}

