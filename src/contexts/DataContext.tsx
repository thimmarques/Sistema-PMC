import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { clienteService } from '../services/clienteService';
import { processoService } from '../services/processoService';
import { financeiroService } from '../services/financeiroService';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface DataContextType {
  clientes: any[];
  processos: any[];
  financeiro: any[];
  isLoading: boolean;
  refreshClientes: () => Promise<void>;
  refreshProcessos: () => Promise<void>;
  refreshFinanceiro: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [clientes, setClientes] = useState<any[]>([]);
  const [processos, setProcessos] = useState<any[]>([]);
  const [financeiro, setFinanceiro] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshClientes = async () => {
    if (!user) return;
    try {
      const data = await clienteService.getAll();
      setClientes(data || []);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const refreshProcessos = async () => {
    if (!user) return;
    try {
      const data = await processoService.getAll();
      setProcessos(data || []);
    } catch (error) {
      console.error('Error fetching processos:', error);
    }
  };

  const refreshFinanceiro = async () => {
    if (!user) return;
    try {
      const data = await financeiroService.getAll();
      setFinanceiro(data || []);
    } catch (error) {
      console.error('Error fetching financeiro:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchAll = async () => {
        setIsLoading(true);
        await Promise.all([
          refreshClientes(),
          refreshProcessos(),
          refreshFinanceiro()
        ]);
        setIsLoading(false);
      };
      fetchAll();
    } else {
      setClientes([]);
      setProcessos([]);
      setFinanceiro([]);
      setIsLoading(false);
    }
  }, [user]);

  // Optionally add Supabase Realtime listeners here

  return (
    <DataContext.Provider value={{ 
      clientes, 
      processos, 
      financeiro, 
      isLoading,
      refreshClientes,
      refreshProcessos,
      refreshFinanceiro
    }}>
      {children}
    </DataContext.Provider>
  );
}
