import { supabase } from '../lib/supabase';

export const processoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('processos')
      .select('*, clientes(nome)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('processos')
      .select('*, clientes(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(processo: any) {
    const { data, error } = await supabase
      .from('processos')
      .insert([processo])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
