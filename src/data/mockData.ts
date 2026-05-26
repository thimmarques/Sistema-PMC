import { mockFinanceiro, addFinanceiroToMock } from './financeiroData';
import { mockProcessos } from './processosData';

export const mockUsers = [
  { id: '1', email: 'admin@webhubpro.com', password: 'admin123', role: 'admin', name: 'Admin' },
  { id: '2', email: 'advogado@webhubpro.com', password: 'adv123', role: 'advogado', name: 'Advogado João' },
  { id: '3', email: 'estagiario@webhubpro.com', password: 'est123', role: 'estagiario', name: 'Estagiário Lucas' },
];

export const recentActivityData = [];

export const upcomingHearingsData = [];

export const areaDistributionData = [];

export const mockClientes: any[] = [];

export const mockHistoricoClientes: any[] = [];

export const mockNotes: any[] = [];

export function addClienteToMock(cliente: any) {
  mockClientes.push(cliente);
  
  // Record history
  addHistoryToMock({
    clienteId: cliente.id,
    usuario: cliente.responsavel || 'Sistema',
    tipo: 'CADASTRO',
    descricao: 'Cliente cadastrado no sistema.',
    detalhes: null
  });
  
  return cliente;
}

export function addHistoryToMock(historyEntry: any) {
  const newEntry = {
    id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data: new Date().toLocaleString('pt-BR', { hour12: false }).replace(',', ''),
    ...historyEntry
  };
  mockHistoricoClientes.push(newEntry);
  return newEntry;
}

export function addNoteToMock(note: any) {
  const newNote = {
    id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data: new Date().toLocaleString('pt-BR', { hour12: false }).replace(',', ''),
    usuario: 'Dr. Ricardo Silva', // Mocked user for now
    ...note
  };
  mockNotes.push(newNote);
  
  // Also add to timeline history
  addHistoryToMock({
    clienteId: note.clienteId,
    usuario: newNote.usuario,
    tipo: note.tipo === 'LIGAÇÃO' ? 'CONTATO' : 'ANOTAÇÃO',
    descricao: note.tipo === 'LIGAÇÃO' ? 'Registro de ligação telefônica.' : 'Nova anotação registrada.',
    detalhes: null
  });
  
  return newNote;
}

export function removeClienteFromMock(id: string) {
  const index = mockClientes.findIndex(c => c.id === id);
  if (index !== -1) {
    mockClientes.splice(index, 1);
    return true;
  }
  return false;
}

export function updateClienteInMock(updatedCliente: any) {
  const index = mockClientes.findIndex(c => c.id === updatedCliente.id);
  if (index !== -1) {
    const oldCliente = mockClientes[index];
    
    // Detect changes for history
    const detalhes: any[] = [];
    
    // Helper to compare values and add to detalhes
    const trackChange = (label: string, oldVal: any, newVal: any) => {
      const normalizedOld = (oldVal === null || oldVal === undefined || oldVal === '' || oldVal === '0,00') ? '-' : String(oldVal);
      const normalizedNew = (newVal === null || newVal === undefined || newVal === '' || newVal === '0,00') ? '-' : String(newVal);
      
      if (normalizedOld !== normalizedNew) {
        detalhes.push({ campo: label, de: normalizedOld, para: normalizedNew });
      }
    };

    // Top level fields
    trackChange('Nome', oldCliente.nome, updatedCliente.nome);
    trackChange('E-mail', oldCliente.email, updatedCliente.email);
    trackChange('Telefone', oldCliente.telefone, updatedCliente.telefone);
    trackChange('CPF/CNPJ', oldCliente.cpf_cnpj, updatedCliente.cpf_cnpj);
    trackChange('Status', oldCliente.status, updatedCliente.status);
    trackChange('Área', oldCliente.area, updatedCliente.area);
    trackChange('Honorários', oldCliente.valorHonorarios, updatedCliente.valorHonorarios);
    trackChange('Responsável', oldCliente.responsavel, updatedCliente.responsavel);

    // Qualificacao fields (nested)
    const oldQual = (oldCliente as any).qualificacao || {};
    const newQual = updatedCliente.qualificacao || {};

    trackChange('Data de Nascimento', oldQual.dataNascimento, newQual.dataNascimento);
    trackChange('Estado Civil', oldQual.estadoCivil, newQual.estadoCivil);
    trackChange('RG', oldQual.rg, newQual.rg);
    trackChange('Endereço', oldQual.endereco, newQual.endereco);

    // Create Financeiro if honorarios changed from 0 to a value, and none exist for this client
    const getNumeric = (val: any) => {
      if (!val) return 0;
      const num = parseFloat(String(val).replace(/[^\d,-]/g, '').replace(',', '.'));
      return isNaN(num) ? 0 : num;
    };

    const newHon = getNumeric(updatedCliente.valorHonorarios);
    const oldHon = getNumeric(oldCliente.valorHonorarios);

    if (newHon > 0 && oldHon === 0) {
        const hasFinanceiro = mockFinanceiro.some(f => f.cliente.nome === updatedCliente.nome && f.tipo === 'Honorário');
        if (!hasFinanceiro) {
            const totalAmount = newHon;
            let remainingAmount = totalAmount;
            let baseDate = updatedCliente.dataPagamento ? new Date(updatedCliente.dataPagamento + 'T12:00:00') : new Date();

            // Try to find an existing process for this client to link to
            const relatedProcess = mockProcessos.find(p => p.cliente.nome === updatedCliente.nome);
            const processoLink = relatedProcess ? relatedProcess.numero : 'A Vincular';

            // Format lawyer name properly from slugs like "ricardo-silva"
            let lawyerName = updatedCliente.responsavel || 'Sistema';
            if (lawyerName === 'ricardo-silva') lawyerName = 'Dr. Ricardo Silva';
            else if (lawyerName === 'ana-paula') lawyerName = 'Dra. Ana Paula';
            else if (lawyerName === 'carlos-eduardo') lawyerName = 'Dr. Carlos Eduardo';
            else if (lawyerName === 'marcos-ferreira') lawyerName = 'Dr. Marcos Ferreira';

            // 1. Create Entry if exists
            if (updatedCliente.temEntrada && updatedCliente.valorEntrada) {
              const entryAmount = getNumeric(updatedCliente.valorEntrada);
              remainingAmount -= entryAmount;

              addFinanceiroToMock({
                id: `fin_${Date.now()}_entry`,
                cliente: { nome: updatedCliente.nome, area: updatedCliente.area || 'Geral' },
                processo: processoLink,
                advogado: { 
                  nome: lawyerName,
                  iniciais: lawyerName.substring(0, 2).toUpperCase() 
                },
                tipo: 'Honorário',
                descricao: `Honorários Contratuais - Entrada`,
                vencimento: { 
                  data: baseDate.toLocaleDateString('pt-BR'), 
                  statusText: 'Pago', 
                  isVencido: false, 
                  isPago: true 
                },
                valor: { 
                  amount: `R$ ${updatedCliente.valorEntrada}`, 
                },
                status: 'Pago'
              });
              
              baseDate.setMonth(baseDate.getMonth() + 1);
            }

            // 2. Create installments
            const numParcelas = parseInt(updatedCliente.parcelas || (updatedCliente.formaPagamento === 'avista' ? '0' : '1'), 10);
            
            if (numParcelas > 0 && remainingAmount > 0) {
              const parcelValue = (remainingAmount / numParcelas).toFixed(2).replace('.', ',');

              for (let i = 1; i <= numParcelas; i++) {
                const installmentDate = new Date(baseDate);
                installmentDate.setMonth(baseDate.getMonth() + (i - 1));

                addFinanceiroToMock({
                  id: `fin_${Date.now()}_${i}`,
                  cliente: { nome: updatedCliente.nome, area: updatedCliente.area || 'Geral' },
                  processo: processoLink,
                  advogado: { 
                    nome: lawyerName,
                    iniciais: lawyerName.substring(0, 2).toUpperCase() 
                  },
                  tipo: 'Honorário',
                  descricao: `Honorários Contratuais - ${numParcelas > 1 ? 'Parcela ' + i + '/' + numParcelas : 'Saldo Ativo'}`,
                  vencimento: { 
                    data: installmentDate.toLocaleDateString('pt-BR'), 
                    statusText: i === 1 && !updatedCliente.temEntrada && updatedCliente.formaPagamento === 'avista' ? 'Pago' : 'A Vencer', 
                    isVencido: false, 
                    isPago: i === 1 && !updatedCliente.temEntrada && updatedCliente.formaPagamento === 'avista'
                  },
                  valor: { 
                    amount: `R$ ${parcelValue}`, 
                    parcelas: numParcelas > 1 ? `${i}/${numParcelas}` : undefined 
                  },
                  status: i === 1 && !updatedCliente.temEntrada && updatedCliente.formaPagamento === 'avista' ? 'Pago' : 'Pendente'
                });
              }
            } else if (remainingAmount > 0 && updatedCliente.formaPagamento === 'avista') {
                addFinanceiroToMock({
                    id: `fin_${Date.now()}_avista`,
                    cliente: { nome: updatedCliente.nome, area: updatedCliente.area || 'Geral' },
                    processo: processoLink,
                    advogado: { 
                      nome: lawyerName,
                      iniciais: lawyerName.substring(0, 2).toUpperCase() 
                    },
                    tipo: 'Honorário',
                    descricao: `Honorários Contratuais - À Vista`,
                    vencimento: { 
                      data: baseDate.toLocaleDateString('pt-BR'), 
                      statusText: 'Pago', 
                      isVencido: false, 
                      isPago: true
                    },
                    valor: { 
                      amount: `R$ ${remainingAmount.toFixed(2).replace('.', ',')}`, 
                    },
                    status: 'Pago'
                  });
            }
        }
    }

    mockClientes[index] = { ...mockClientes[index], ...updatedCliente };
    
    // Record history if anything changed
    if (detalhes.length > 0) {
      addHistoryToMock({
        clienteId: updatedCliente.id,
        usuario: updatedCliente.responsavel || 'Sistema',
        tipo: 'ALTERACAO',
        descricao: 'Alteração nos dados cadastrais.',
        detalhes: detalhes
      });
    }

    return true;
  }
  return false;
}

