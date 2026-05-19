# Relatório de Auditoria e Arquitetura de Banco de Dados - LegalTech

**Data da Auditoria:** 22 de Abril de 2026
**Autor:** Especialista Arquiteto de Banco de Dados Sênior
**Status Atual:** O sistema encontra-se com implementação baseada em *Mock Data* (JSON estático). Este relatório analisa as entidades existentes nas coleções simuladas e projeta / audita a arquitetura relacional proposta (foco em conformidade com Supabase/PostgreSQL e SQLite).

---

## 1. INVENTÁRIO DE TABELAS (Arquitetura Proposta)

Com base nas interfaces do sistema, as seguintes tabelas e relacionamentos compõem a fundação estrutural do banco de dados:

| Tabela | Propósito | Colunas Principais | Tipos | Constraints | Relacionamentos |
|---|---|---|---|---|---|
| **`users`** | Autenticação e gestão de equipe do escritório | `id` (PK)<br>`email`<br>`password_hash`<br>`role`<br>`name` | UUID<br>VARCHAR<br>VARCHAR<br>VARCHAR<br>VARCHAR | `email` UNIQUE | Relaciona-se com `clientes` (como responsável) e `processos` (como responsável). |
| **`clientes`** | Cadastro de Clientes (PF e PJ) e CRM | `id` (PK)<br>`nome`<br>`tipo` (pf/pj)<br>`cpf_cnpj`<br>`email`<br>`telefone`<br>`responsavel_id` (FK)<br>`is_vip` | UUID<br>VARCHAR<br>ENUM<br>VARCHAR<br>VARCHAR<br>VARCHAR<br>UUID<br>BOOLEAN | `cpf_cnpj` UNIQUE<br>`email` UNIQUE | Has Many `processos`.<br>Belongs To `users`. |
| **`processos`** | Gestão de Processos Judiciais/Extrajudiciais | `id` (PK)<br>`numero`<br>`titulo`<br>`cliente_id` (FK)<br>`area`<br>`status`<br>`valor_causa`<br>`financeiro_pago`<br>`responsavel_id` (FK) | UUID<br>VARCHAR<br>VARCHAR<br>UUID<br>VARCHAR<br>VARCHAR<br>NUMERIC<br>NUMERIC<br>UUID | `numero` UNIQUE | Belongs To `clientes`.<br>Belongs To `users`.<br>Has Many `movimentacoes` e `audiencias`. |
| **`audiencias`** | Gestão de compromissos e agendamentos | `id` (PK)<br>`processo_id` (FK)<br>`data_hora`<br>`tipo`<br>`status` | UUID<br>UUID<br>TIMESTAMP<br>VARCHAR<br>VARCHAR | - | Belongs To `processos`. |
| **`movimentacoes`** | Registro de atividades (Recent Activity) e prazos | `id` (PK)<br>`processo_id` (FK)<br>`descricao`<br>`data_movimentacao`<br>`tipo` | UUID<br>UUID<br>TEXT<br>TIMESTAMP<br>VARCHAR | - | Belongs To `processos`. |

---

## 2. ANÁLISE DE INTEGRIDADE

Considerando o ambiente produtivo em PostgreSQL/Supabase:

*   **Validação de Foreign Keys:** 
    *   No momento (via Mock), relacionamentos como *Responsável* ou *Cliente* são feitos por armazenamento redundante (ex: objeto contendo nome em vez de ID), o que gera risco de anomalia de atualização.
    *   *Ação na Migração:* Integrar restrições rígidas (`FOREIGN KEY`) com o uso restrito de UUIDs. Aplicar `ON DELETE RESTRICT` nas FKs de Clientes para Processos (impedir exclusão de clientes se possuírem processos).
*   **RLS Policies (Row Level Security):** 
    *   Como sistema jurídico, o RLS é **obrigatório**. A política deverá garantir que advogados (`role = 'advogado'`) tenham acesso universal na versão do escritório atual ou que políticas restrinjam a visão com base no `responsavel_id`.
*   **Triggers e Functions de Auditoria:** 
    *   Inexistentes. Será fundamental criar funções `update_modified_column()` sendo disparadas `BEFORE UPDATE` para atualizar o `updated_at`.
*   **ENUMs definidos sugeridos:**
    *   `tipo_cliente_enum`: `('pf', 'pj')`
    *   `status_processo_enum`: `('Pendente', 'Ativo', 'Encerrado', 'Em Recurso', 'Acordo')`

---

## 3. SEGURANÇA & COMPLIANCE

*   **Campos de Rastreabilidade:** Nas tabelas propostas deverão constar `created_at` (TIMESTAMP DEFAULT NOW()), `updated_at` (TIMESTAMP) e `created_by` (UUID).
*   **Soft Delete:** O ambiente LegalTech não permite exclusão física acidental. Implementar a coluna `deleted_at (TIMESTAMP NULL)`. Selects padrão devem incluir `WHERE deleted_at IS NULL`.
*   **Logs de auditoria imutáveis:** Processos judiciais e faturamentos requerem histórico de logs ou tabela de eventos (audit log) separada com `user_id`, `action`, `table_name` e `record_id` (append-only).
*   **LGPD Compliance:** CPF/CNPJ, E-mails e Telefone são dados pessoais. Dependendo da política de conformidade, devem ser criptografados At-Rest utilizando ferramentas do Postgres como `pgcrypto` ou transparentes nativos, além de mascaramento no frontend.

---

## 4. PROBLEMAS IDENTIFICADOS (Baseado no estado de Transição Mock > DB)

1.  **Dados Agrupados (Não-Normalizados):** 
    *   Arquivos como `processosData.ts` aninham o `cliente` (com nome e subtítulo) e `responsavel` dentro do objeto do processo de maneira redundante, o que no banco precisa migrar para referências.
2.  **Formatação de Moedas em Strings:** 
    *   O mock armazena `valorCausa: 'R$ 150.000,00'`. Em banco de dados, o tipo deve ser adequadamente definido como `NUMERIC / DECIMAL(15,2)` ou `INTEGER` guardando centavos para precisão financeira.
3.  **Strings Temporais:** 
    *   Datas estão salvas de forma não iso-formatada (`proximaAudiencia: '22/02/2026'`). Requer padronização completa (`TIMESTAMPTZ` em todo lugar).
4.  **Tabelas ou Dados Órfãos:** 
    *   O polo ativo / polo passivo hoje é salvo por processo na forma explícita de nomes. Ideal seria um modelo que referencie partes processuais, mas em âmbito simples, basta consolidar.

---

## 5. RECOMENDAÇÕES

1.  **Otimizações de Performance (Migração Postgres):**
    *   Para garantir que o Dashboard funcione sem delay de TCO (Total Cost of Ownership) e consultas lentas, criar índices B-Tree nas chaves de relacionamento: `CREATE INDEX idx_processo_cliente_id ON processos(cliente_id)`.
    *   Criar um índice no status (para busca de processos "Ativos") e nas Datas Fatais: `CREATE INDEX idx_processos_prazo_fatal ON processos(prazo_fatal)`.
2.  **Melhorias de Segurança Básicas:**
    *   Migrar imediatamente para autenticação via Supabase Auth.
    *   Impedir que `role` de usuário seja editável livremente em operações CRUD abertas (proteger em nível de banco).
3.  **Preparação para Supabase/DB (Próximos Passos):**
    *   Utilizar os dados do `mockData.ts` e `processosData.ts` na criação de *seeds* `.sql` para uma rápida alimentação do projeto na primeira implantação DB.
    *   Tratar as planilhas financeiras dos honorários não só em campo na tabela de processo, mas talvez extrair para tabela de movimentação financeira (`faturas`) permitindo múltiplos pagamentos e acompanhamento real da inadimplência.
