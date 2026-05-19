# Auditoria Frontend e Análise de Arquitetura - LegalTech

**Data da Auditoria:** 22 de Abril de 2026
**Autor:** Analista Frontend Sênior
**Escopo:** Aplicação React / TypeScript com Tailwind CSS e Vite.

---

## 1. INVENTÁRIO DE COMPONENTES

### Estrutura de Pastas
```text
src/
├── components/          # Componentes de página e layout
│   ├── Modals/          # Modais e Drawers de sistema
│   └── ui/              # Design System (Botões, Inputs, Cards, etc)
├── contexts/            # React Contexts (Global State)
├── data/                # Mock Data (Simulação de banco de dados e APIs)
├── hooks/               # Custom Hooks
├── lib/                 # Utilitários (ex: utils.ts, tailwind-merge)
└── types/               # Definições de Tipos Transversais
```

### Componentes Principais (Por Módulo)

| Módulo | Componentes | Status de Implementação |
|---|---|---|
| **Auth** | `Login.tsx`, `ProtectedRoute.tsx` | 100% |
| **Dashboard** | `Dashboard.tsx`, `Topbar.tsx`, `Sidebar.tsx` | 100% |
| **Clientes** | `ClientesPage.tsx`, `ClienteDetalhe.tsx`, `NovoClienteModal.tsx`, `EditarClienteDrawer.tsx` | 90% |
| **Processos** | `ProcessosPage.tsx`, `ProcessoDetalhe.tsx` | 85% |
| **Eventos/Aud.** | `AudienciasPage.tsx` | 80% |
| **Financeiro** | `FinanceiroPage.tsx` | 75% |
| **Design System** | `/ui/button.tsx`, `/ui/input.tsx`, `table.tsx`, etc. | 95% |

**Observações (Duplicados / Órfãos):**
- A pasta `Modals/NovoClienteFields/` aparentemente segmenta sub-stages, mas os fluxos de Drawer às vezes replicam estruturas do Modal. Uma abstração para um componente genérico de formulário de clientes ("ClientForm") unificaria as funcionalidades de criação e edição.
- O componente `Step2Modal.tsx` deve ser verificado para garantir que não se tornou órfão caso o fluxo de wizard tenha mudado para abas normais.

---

## 2. ANÁLISE DE HOOKS & LÓGICA

*   **Gerenciamento de Estado:** A aplicação atualmente adota **React Context API** (`AuthContext`, `ToastContext`) para controle de estados de sessão e notificações. Não há presença de Redux ou Zustand no momento, e estados locais estão contidos com `useState` e `useReducer` simples (ex: Modais).
*   **Hooks Customizados:**
    *   `useAuth`: Controla login, logout e injeta permissões baseadas em "role" (`user.role === 'admin'`). É bem implementado, mas dependente do Contexto.
*   **Integração e Chamadas à API:**
    *   **Atual:** 100% *Mockada* através da pasta `src/data/`. As listas chamam varreduras nativas do JS como arr.map e arr.filter.
    *   **Gaps:** Não há React Query (`@tanstack/react-query`) ou SWR instalados. Quando o projeto engatar uma API real, toda as páginas sentirão a refatoração.
*   **Validações de Formulário:** 
    *   Não há bibliotecas puras (como Zod + React Hook Form). O estado do formulário de criação em modals (ex: CPF/CNPJ, e-mail) precisa de validações mais avançadas.  

---

## 3. DESIGN & UX

*   **Paleta de Cores e Tipografia (Design System):** A aplicação obedece às customizações rigorosas e exigidas:
    *   Cores: `--chumbo`, `--gold`, `--surface`. Tudo convertido adequadamente para suporte Dark/Light mode pelo Vite/Tailwind.
    *   Fontes: `Inter` (global) e `JetBrains Mono` (código/dados).
*   **Componentes UI:** Estão bem estruturados em `src/components/ui`. O padrão inclui botões semânticos (Primary, Secondary, Danger), inputs unificados, e Cards reutilizáveis.
*   **Responsividade:** O uso das grids do Tailwind (`sm:grid-cols-2`, `lg:grid-cols-4`, etc) estão devidamente alocados. O `Sidebar` é responsivo com fechamento automático em telas pequenas (mobile-first behavior).
*   **Acessibilidade (WCAG):** Faltam algumas tags "aria-labels" nos modais e focos (trapping de focus na tela de Novo Cliente), algo comum em protótipos de alta fidelidade que transitam para produção. O contraste (ouro sob chumbo) está ótimo.

---

## 4. SEGURANÇA & PERFORMANCE

*   **Autenticação e RBAC:** `ProtectedRoute` avalia e intercepta acessos negados, e o hook `useAuth` é muito usado em condicionais visuais como `{isAdmin && <CardAdmin/>}`. Isso provê uma segurança na UX incialmente madura.
*   **Performance:**
    *   **Pontos Positivos:** Foi detectada grande adoção de `useMemo` (No `Dashboard.tsx`, no processamento das listas) para evitar recálculos massivos durante renderizações comuns.
    *   **A Melhorar (Bundle Size e Carregamento):** O uso do `React.lazy()` e Suspense para as páginas de navegação principal (Rotas em `App.tsx`) não está implementado (arquitetura SPA com download massivo de entrada).
*   **Limpeza (Debug):** Muitos métodos dependem das constantes `mockProcessos` globalmente invocadas (o que não gera garbage colllection e mantém a heap altíssima se a massa de simulação crescer).

---

## 5. PROBLEMAS IDENTIFICADOS

1.  **Tratamento de Estado Assíncrono Inexistente:** As visões atuais acreditam que tudo em Javascript está em memória instantânea. Quando refatoradas para "fetch" (ex: buscar os clientes no Supabase), vão quebrar bruscamente porque não existem "Skeleton Loaders" nem flags `isLoading` nas Lists/Tables (exceto algumas genéricas).
2.  **Duplicidade de Regras de Negócio:**
    *   O cálculo total de Processos / Inadimplência está restrito ao JSX nas linhas finais (Exemplo: `totalCausa` mapeado no próprio dashboard). Lógicas numéricas e agrupamentos não devem ficar no Front-End e deviam vir prontas por rotas consolidadas do Back-End.
3.  **Inputs "Controlled" vs "Uncontrolled":** Já aparecem riscos nos modals pela passagem de propriedades undefined/nulls a formulários.
4.  **Mock Mutável:** Funções como `addClienteToMock` mutam os blocos do módulo global com arrays como `mockClientes.push(cliente)`. Num roteamento severo isso se perde (se o HMR reiniciar ou recarregar a tela, a memória reseta). 

---

## 6. RECOMENDAÇÕES PARA REFATORAÇÃO E ROADMAP

### Roadmap Imediato (Preparação Módulos)
1.  **State Management Assíncrono:** Adotar _React Hook Form_ com estado integrado e `zod` para schema das propriedades (Cliente e Processos), validando de forma rigorosa antes do envio.
2.  **Custom Hooks de Dados:** Encapsular todas referências aos arrays locais em hooks, ex: `useGetClients()`. Hoje retorna a Promise `Promise.resolve(mock)`, mas amanhã fará a requisição real, tornando a refatoração indolor sem tocar nas Pages.
3.  **Melhoria de UX Dinâmica:** Adicionar Loading States nos componentes `<Table />` preenchendo as tabelas com "Shimmer Effects".

### Otimizações de Codebase e Performance
1.  **Formulários Comuns** Mesclar as lógicas de Adição e Edição de Cliente/Processo, exportando a forma bruta como `<FormularioCliente data={cliente} />` e acionando PUT ou POST com base na passagem (Dry code).
2.  **Lazy Loading das Páginas:** Implementar o `React.lazy` para as `Routes` no react-router-dom de forma a deixar seu First Contentful Paint < 1.0s.
3.  **Testes (Jest / Cypress):** É altamente recomendado testar as permissões de roteamento RBAC com jest para ter certeza de que Estagiários nunca visualizem seções "Financeiras" (`isAdmin`).
