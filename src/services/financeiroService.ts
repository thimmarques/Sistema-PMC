import { supabase } from '../lib/supabase';

export const financeiroService = {
  async getAll() {
    const { data, error } = await supabase
      .from('financeiro')
      .select('*, clientes(nome, area)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(transacao: any) {
    const { data, error } = await supabase
      .from('financeiro')
      .insert([transacao])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
