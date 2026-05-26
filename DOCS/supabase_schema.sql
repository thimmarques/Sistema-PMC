-- PRONTUÁRIO SQL PARA SUPABASE
-- Copie e cole no Editor SQL do Supabase

-- 1. Habilitar ramdom_uuid se necessário
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Perfis (Extensão do Auth.Users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT DEFAULT 'advogado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS em profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Tabela de Clientes
CREATE TABLE public.clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf_cnpj TEXT,
  status TEXT DEFAULT 'Ativo',
  area TEXT,
  valor_honorarios TEXT, -- Mantendo como TEXT para compatibilidade com o front que usa formatação
  responsavel TEXT,
  qualificacao JSONB DEFAULT '{}'::jsonb,
  area_data JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total aos próprios clientes" ON public.clientes
  FOR ALL USING (auth.uid() = user_id);

-- 4. Tabela de Processos
CREATE TABLE public.processos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT,
  titulo TEXT,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  area TEXT,
  tribunal_nome TEXT,
  tribunal_vara TEXT,
  status TEXT DEFAULT 'Ativo',
  proxima_audiencia TEXT, -- Usando TEXT para facilitar compatibilidade com datas formatadas do front
  prazo_fatal TEXT,
  responsavel_nome TEXT,
  valor_causa TEXT,
  data_distribuicao TEXT,
  ultima_movimentacao TEXT,
  comarca TEXT,
  fase_atual TEXT,
  polo_ativo TEXT,
  polo_passivo TEXT,
  observacoes_internas TEXT,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total aos próprios processos" ON public.processos
  FOR ALL USING (auth.uid() = user_id);

-- 5. Tabela Financeira
CREATE TABLE public.financeiro (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  processo_numero TEXT, -- Referência amigável ao número do processo
  tipo TEXT NOT NULL, -- 'Honorário' | 'Repasse' | 'Despesa' | 'Custas'
  descricao TEXT,
  vencimento_data TEXT,
  vencimento_status TEXT,
  is_pago BOOLEAN DEFAULT FALSE,
  is_vencido BOOLEAN DEFAULT FALSE,
  valor_amount TEXT NOT NULL,
  parcelas TEXT, -- Ex: "1/12"
  status TEXT DEFAULT 'Pendente',
  advogado_nome TEXT,
  advogado_iniciais TEXT,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total aos próprios registros financeiros" ON public.financeiro
  FOR ALL USING (auth.uid() = user_id);

-- 6. Histórico de Clientes
CREATE TABLE public.historico_clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  usuario TEXT,
  tipo TEXT,
  descricao TEXT,
  detalhes JSONB,
  data TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

ALTER TABLE public.historico_clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total ao próprio histórico" ON public.historico_clientes
  FOR ALL USING (auth.uid() = user_id);

-- 7. Notas
CREATE TABLE public.notas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  processo_id UUID, -- Opcional
  usuario TEXT,
  tipo TEXT, -- 'ANOTAÇÃO' | 'LIGAÇÃO'
  conteudo TEXT,
  data TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total às próprias notas" ON public.notas
  FOR ALL USING (auth.uid() = user_id);

-- Trigger para criar perfil automaticamente no SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', COALESCE(new.raw_user_meta_data->>'role', 'advogado'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
