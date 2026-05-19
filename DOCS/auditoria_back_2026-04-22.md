# Auditoria e Arquitetura de Backend (API) - LegalTech

**Data da Auditoria:** 22 de Abril de 2026
**Autor:** Especialista Arquiteto Backend Sênior
**Escopo do Relatório:** O projeto atual encontra-se em estágio *Client-Side SPA*, operando com *Mock Data*. Portanto, este documento atua como uma **Análise de Gaps e Especificação de API (Blueprint)**, mapeando as rotas obrigatórias, lógica e requisitos de segurança necessários para substituir os mocks e integrar o frontend ao banco de dados (PostgreSQL/Supabase/Express).

---

## 1. INVENTÁRIO DE ROTAS & ENDPOINTS (Projeção Arquitetural)

Abaixo, a estrutura unificada de rotas RESTful proposta para cobrir 100% da operação do Frontend atual. *Status atual: 0% implementado.*

### Módulo: Auth (`/api/v1/auth`)
| Método | Endpoint | Descrição | Permissão | Implementação |
|:---:|---|---|---|:---:|
| `POST` | `/login` | Gera refresh_token e access_token | Public | 0% |
| `POST` | `/logout` | Invalida o token atual | Authenticated | 0% |
| `GET`  | `/me` | Retorna dados do usuário logado (perfil/role) | Authenticated | 0% |

### Módulo: Clientes e CRM (`/api/v1/clientes`)
| Método | Endpoint | Descrição | Permissão | Implementação |
|:---:|---|---|---|:---:|
| `GET`  | `/` | Lista clientes (com filtros: busca, tipo, status) | Authenticated | 0% |
| `POST` | `/` | Cria um novo cliente (PF/PJ) | Admin / Advogado | 0% |
| `GET`  | `/:id` | Retorna dados completos + métricas (NPS) | Authenticated | 0% |
| `PUT`  | `/:id` | Atualiza cadastro do cliente | Admin / Advogado | 0% |
| `DELETE`| `/:id` | Soft delete do cliente (arquivamento) | Admin apenas | 0% |

### Módulo: Processos Judiciais (`/api/v1/processos`)
| Método | Endpoint | Descrição | Permissão | Implementação |
|:---:|---|---|---|:---:|
| `GET`  | `/` | Lista processos (filtros: status, tribunal, polo) | Authenticated | 0% |
| `POST` | `/` | Cria novo processo vinculado a um cliente | Admin / Advogado | 0% |
| `GET`  | `/:id` | Detalhes do processo + Histórico/Movimentações | Authenticated | 0% |
| `PUT`  | `/:id/status` | Transição de fase/status processual | Admin / Advogado | 0% |

### Módulo: Movimentações e Audiências (`/api/v1/eventos`)
| Método | Endpoint | Descrição | Permissão | Implementação |
|:---:|---|---|---|:---:|
| `GET`  | `/audiencias` | Próximas audiências (Dashboard) | Authenticated | 0% |
| `GET`  | `/atividades` | Atividades recentes / Log de Movimentações | Authenticated | 0% |

### Módulo: Dashboard & Analytics (`/api/v1/dashboard`)
| Método | Endpoint | Descrição | Permissão | Implementação |
|:---:|---|---|---|:---:|
| `GET`  | `/metricas` | KPIs totais (Honorários, Sucesso, Processos Ativos) | Authenticated | 0% |
| `GET`  | `/distribuicao-areas` | Dados p/ gráfico Recharts (Trabalhista, Cível...) | Authenticated | 0% |

---

## 2. ANÁLISE DA LÓGICA DE NEGÓCIO

### Padrão Sugerido: MSC (Model-Service-Controller)
Para organizar o backend futuro em Node.js (Express), a regra de negócio deverá ser separada:
- **Routers:** Definem caminhos e injetam middlewares.
- **Controllers:** Orquestram Request/Response. Exemplo: extrair `req.user.id`.
- **Services:** Onde ocorrerá a avaliação de transição de status processual.

### Regras de Negócio Críticas & Validações
1. **Atribuição de Processos:** Estagiários (`role: 'estagiario'`) não podem criar novos clientes nem arquivar processos, apenas consultar e alimentar peças nas notas internas.
2. **Atualização Financeira:** A rota `/api/v1/processos/:id` nao deve aceitar atualização livre no campo `valorCausa` e `financeiroPago` por usuários comuns.
3. **Cascatas (Cascading):** Se um processo recebe um status "Encerrado" ou "Arquivado", eventos paralelos e audiências futuras devem ser marcados como Inativos ou Concluídos por meio de triggers de API.

---

## 3. INTEGRAÇÃO DB + FRONTEND (Gaps Atuais)

*   **Problema de Inconsistência:** O Front faz cáculos brutais usando `.reduce()` em Arrays. (Ex: Somar todos os honorários arrecadados no Dashboard).
    *   **Solução Backend:** O backend **deve** expor o endpoint `/dashboard/metricas` que realiza esse cálculo via SQL: `SELECT SUM(financeiro_pago) FROM processos WHERE responsavel_id = user_id;` para economizar banda do cliente.
*   **Falta de Rotas para Funcionalidades Atuais:** A busca global não tem endpoint projetado para buscas multi-tabela (ElasticSearch ou PostgreSQL Full Text Search). Recomendação: criar `/api/v1/search?q={termo}`, buscando com `UNION` em Clientes, Processos e Anotações.

---

## 4. SEGURANÇA

A arquitetura sendo implementada do zero deve obrigatoriamente prever:

*   **Autenticação JWT (Stateless):** Emissão de `AccessToken` (15m validade) e `RefreshToken` (7 dias HTTP-Only Cookie).
*   **RBAC Middleware:** Criação de decoradores ou functions `requireRole(['admin', 'advogado'])` nas rotas do Express. O Frontend já se veda, mas APIs externas também necessitam proteção.
*   **Data Validation (Input Sanitization):** Utilização estrita de `Zod` no Express Controller. Ex: Rejeitar um `POST /clientes` se `cpf_cnpj` contiver injeção ou formatação ilógica.
*   **Segurança HTTP:**
    *   Uso de `helmet` para headers.
    *   CORS configurado estritamente para `https://app.legaltech.com`.
    *   **Rate Limiting:** Módulo `express-rate-limit` contra ataques de força-bruta na rota `/auth/login`.

---

## 5. PROBLEMAS IDENTIFICADOS (E Mapeados para o Futuro DB)

1.  **"Falsas Associações" do Mock:** Atualmente um Processo guarda `cliente: { nome: 'Pedro' }`. No Back isso quebraria. A API precisará suportar retornos estruturados (Nested Queries/JOINs), de forma que GET `/processos` retorne chaves estrangeiras populadas (ex: PostgreSQL -> ORM Prisma/Drizzle).
2.  **Valores Financeiros Float vs Integer:** O padrão no Backend é enviar dinheiro estruturado em centavos (Integer) ao invés de string `R$ 4.500,00` ou Float para evitar perda de precisão flutuante matemática no backend.
3.  **Auditoria Invisível (Logs):** A API não possui desenho para Logs. Quando um advogado fechar um acordo processual, deve ser registrado quem executou o `PUT /processos/:id/status` para fins de Rastreio Legal (Log Table).

---

## 6. RECOMENDAÇÕES PARA IMPLEMENTAÇÃO BACKEND

1. **Escolha da Stack (Next Steps):**
   - Transicionar o repositório de `react-router-dom` Client-Side para **Fullstack Express+Vite** ou utilizar as bordas Edge do Supabase para Serverless Functions. (O Express já está instalado no `package.json`, precisa de `server.ts` de bootstrap).
2. **Implementação OpenAPI (Swagger):**
   - Antes de iniciar a troca dos mocks no Frontend, construir a documentação swagger (`swagger.yaml`) definindo estritamente os contratos de requests (DTOs), como propriedades obrigatórias e status codes HTTP 200, 400, 401 e 404.
3. **Padrão de Resposta de Error Handling:**
   - Padronizar Global Error Handler (Middleware Express) que retorne:
   ```json
   {
     "status": "error",
     "statusCode": 403,
     "message": "Permissão negada. Requer nível [Administrador].",
     "timestamp": "2026-04-22T16:45:00Z"
   }
   ```
4. **Implementação Gradual (Estrangulamento):**
   - Não refatorar todo o app de uma vez. Começar montando a `/api/auth`. Atualizar o frontend para consumi-lo. Depois `/api/clientes`, depois processos. Assim o App continua rodando e sendo visualizado via os Mockings enquanto certas telas se tornam reais.
