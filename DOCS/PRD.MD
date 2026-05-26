# Product Requirements Document (PRD) - WebHubPro ERP

## 1. Visão Geral do Projeto
O **WebHubPro ERP** é um sistema de gestão jurídica (Legal ERP) desenvolvido para automatizar e otimizar a rotina de escritórios de advocacia. O sistema centraliza o controle de clientes, processos judiciais, agenda de audiências e fluxo financeiro em uma interface moderna, profissional e de alta performance.

---

## 2. Objetivos Principais
*   **Centralização**: Reunir todas as informações críticas em um único local.
*   **Automação**: Reduzir o trabalho manual através da criação automática de processos e parcelas financeiras a partir do cadastro de clientes.
*   **Precisão**: Garantir a integridade dos dados através de formulários inteligentes adaptados para cada área do direito.
*   **Visibilidade**: Fornecer métricas claras de performance e saúde financeira do escritório.

---

## 3. Público-Alvo
*   Advogados autônomos.
*   Escritórios de advocacia de pequeno e médio porte.
*   Gestores jurídicos que buscam controle financeiro rigoroso.

---

## 4. Módulos do Sistema

### 4.1 Dashboard
Painel principal com métricas em tempo real:
*   Contadores de processos ativos, audiências do dia e prazos fatais.
*   Gráficos de distribuição por área do direito.
*   Resumo financeiro (Receitas vs. Despesas).
*   Lista de atividades recentes e notificações.

### 4.2 Gestão de Clientes (CRM)
*   **Cadastro Multietapa**: Fluxo guiado para captura de dados pessoais e financeiros.
*   **Campos Dinâmicos**: Formulários específicos para as áreas Cível, Trabalhista, Criminal, Previdenciária e Tributária.
*   **Perfil do Cliente**: Visão 360º contendo dados de contato, hitórico de atendimentos, processos vinculados e extrato financeiro.

### 4.3 Gestão de Processos
*   **Criação Automática**: Vinculação imediata de um processo ao finalizar o cadastro de um cliente.
*   **Novo Processo Manual**: Modal inteligente que autopreenche dados ao selecionar um cliente existente.
*   **Controle de Prazos**: Gestão de prazos fatais e próximas audiências.
*   **Detalhes Processuais**: Histórico de movimentações, partes (Polo Ativo/Passivo), tribunais e varas.

### 4.4 Financeiro
*   **Controle de Honorários**: Gestão de contratos, entradas e parcelamentos.
*   **Autogeração de Parcelas**: Cálculo automático de vencimentos e valores com base na data da entrada ou assinatura.
*   **Visão Agrupada**: Tabela financeira que agrupa lançamentos por cliente/contrato para facilitar a conciliação.
*   **Status de Pagamento**: Controle rigoroso de Pendente, Pago e Vencido.

### 4.5 Agenda e Audiências
*   Calendário integrado para visualização de audiências e compromissos.
*   Listagem cronológica de eventos por responsável.

---

## 5. Especificações Técnicas
*   **Linguagem**: TypeScript.
*   **Framework**: React 18+ com Vite.
*   **Estilização**: Tailwind CSS.
*   **Animações**: Framer Motion.
*   **Ícones**: Lucide React.
*   **Dados**: Mock Data System (Preparado para integração com Backend/Firebase).

---

## 6. Diferenciais e Regras de Negócio
*   **Inteligência de Polo**: O sistema identifica automaticamente se o cliente é Autor ou Réu com base na "Qualificação" informada, ajustando os cards de visualização.
*   **Regra de Entrada Financeira**: Se houver pagamento de entrada, o sistema gera o primeiro registro como "Pago" e distribui o saldo remanescente nas parcelas futuras.
*   **Acessibilidade Visual**: Utilização da paleta "Cosmic Slate" para reduzir a fadiga ocular em uso prolongado.

---

## 7. Roadmap Futuro
*   Integração com API de Tribunais para captura automática de andamentos.
*   Módulo de Gerenciamento de Documentos (GED) com upload para nuvem.
*   Gerador de Relatórios em PDF/Excel customizados.
*   Aplicativo Mobile para consultas rápidas de campo.
