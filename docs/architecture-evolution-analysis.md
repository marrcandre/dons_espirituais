# Análise Arquitetural — Dons Espirituais vs Cinco Ministérios

> **Data:** 2026-07-09
>
> **Contexto:** Avaliação da arquitetura atual do Dons Espirituais à luz da referência Cinco Ministérios (v5.2.0, 134 testes, 13 documentos de arquitetura)

---

## 1. Estado Atual do Dons por Camada

### 1.1 Domínio — Nota: 8/10

**Situação:** Consolidado. `domain/spiritual-gifts.ts` + `domain/scoring.ts`. TypeScript, funções puras, sem dependência de framework.

**Pontos fortes:**
- Fonte única dos 27 dons (SSOT)
- Constantes derivadas (`GIFT_COUNT`, `giftNames`, `giftById`)
- Funções puras e testáveis
- `calculateScores`, `rankGifts`, `formatScoresForAI`, `topGift` — coesas e pequenas

**Problemas:**
- `color: '#1B5438'` repetido 27 vezes (poderia ser default/constante)
- Acoplamento posicional `i % 27` entre questions.js e spiritual-gifts.ts — sem verificação runtime
- Domínio não expõe validações (`isValidGiftId`, `isValidQuestionId`)
- Tipos do domínio estão inline nos arquivos (não em `types.ts` separado)

**Riscos:**
- Baixo. O domínio está maduro e testado.

**Oportunidades:**
- Extrair `types.ts` com interfaces compartilhadas
- Adicionar funções de validação no domínio
- Extrair `color` para constante

---

### 1.2 Application Layer — Nota: 0/10

**Situação:** Inexistente. A orquestração está concentrada no `QuizView.vue`.

**Pontos fortes:**
- Nenhum. A inexistência da camada é o problema.

**Problemas:**
- `submitQuiz()` em `QuizView.vue` (167-201) centraliza: validação, scoring, montagem de payload, persistência, notificação admin, geração IA, navegação
- Sem possibilidade de testar o fluxo completo sem montar o componente Vue
- Lógica de retomada de sessão (`checkSavedState`, `restoreSaved`) está na store, misturada com estado
- `handleAnswer` com auto-advance + submit — regra de negócio (timer, navegação) na view

**Riscos:**
- Alto. Qualquer mudança no fluxo de submit exige alteração no componente Vue.
- Médio. A lógica de auto-advance (350ms) é frágil e acoplada ao ciclo de vida do Vue.

**Oportunidades:**
- Extrair `submitQuiz()` para `application/quiz/submit-quiz.ts`
- Extrair gerenciamento de sessão para `application/quiz/resume-session.ts`
- Extrair `calculateResult()` para `application/results/calculate-result.ts`

---

### 1.3 Infrastructure — Nota: 5/10

**Situação:** `repositories/` com acesso direto ao Supabase. Misturado com stores.

**Pontos fortes:**
- Separado em arquivos por entidade (response, ai, auth, user)
- `supabaseQuery.js` fornece `runSupabaseQuery` com timeout

**Problemas:**
- Zero testes de infraestrutura
- Tratamento de erros inconsistente:
  - `responseRepository.insert()` não usa `runSupabaseQuery` (sem timeout)
  - `responseRepository.countByUserId()` também sem timeout
  - `findById` e `findByUserId` usam `DEFAULT_TIMEOUT` (10s), mas `insert` e `countByUserId` não
- Stores (Pinia) importam repositories diretamente e adicionam camada de estado
- Sem isolamento — testes precisariam de Supabase real ou mock manual

**Riscos:**
- Médio. Inconsistência de timeout pode causar hangs.
- Baixo. Falta de testes não causa regressão imediata, mas dificulta refatoração.

**Oportunidades:**
- Mover repositories para `infrastructure/supabase/`
- Padronizar `runSupabaseQuery` em todos os métodos
- Adicionar testes com Supabase mock
- Separar stores (estado) de repositories (persistência)

---

### 1.4 Presentation — Nota: 7/10

**Situação:** Views + Components + Stores (Pinia). Design System em evolução.

**Pontos fortes:**
- Design System com componentes reutilizáveis (AppPage, AppCard, AppButton, CollapsibleCard, etc.)
- `design_plan.md` bem documentado (965 linhas)
- Separação clara entre `components/ui/` (DS) e componentes de domínio
- Pinia stores bem estruturadas

**Problemas:**
- `ResultsView.vue` (285 linhas) — gerencia estado, edição de nome, share, print, todo diretamente
- `HomeView.vue` (não lido, mas mencionado como dependente de `ANSWER_LABELS` via `constants/likert.js`)
- Componentes não organizados por domínio (todos planos em `components/`)
- Sem composables — toda lógica de integração está nas stores ou views
- `stores/quiz.js` (176 linhas) — acumula estado, persistência localStorage, computações, navegação

**Riscos:**
- Médio. Views grandes e com múltiplas responsabilidades dificultam manutenção.
- Baixo. Design System já estabelecido reduz risco de inconsistência visual.

**Oportunidades:**
- Criar `composables/useQuizSession` (encapsula estado + persistência + navegação)
- Modularizar componentes em `quiz/` e `results/`
- Extrair lógica de `ResultsView.vue` para composable

---

### 1.5 Testes — Nota: 6/10

**Situação:** 78 testes, Vitest, 4 arquivos de teste.

**Pontos fortes:**
- Domínio bem testado (75 testes)
- Testes rápidos (~210ms)
- Sem dependência de Vue ou Supabase

**Problemas:**
- 0 testes de application (camada não existe)
- 0 testes de infrastructure (repositories sem teste)
- 0 testes de composable/stores
- Cobertura não medida

**Riscos:**
- Alto. Refatorar a orquestração sem testes de application é arriscado.
- Médio. Qualquer mudança em repositories pode quebrar sem alerta.

**Oportunidades:**
- Application tests (Sprint 7)
- Infrastructure tests (Sprint 8)
- Composable tests (Sprint 9)
- Configurar cobertura (Sprint 10)

---

### 1.6 Documentação — Nota: 6/10

**Situação:** `docs/gift-system-plan*` (refatoração concluída), `docs/design_plan.md`, CHANGELOG.md, README.md.

**Pontos fortes:**
- Plano de refatoração bem documentado (3 documentos, Sprints 0–5)
- Design System documentado
- CHANGELOG versionado

**Problemas:**
- Sem `docs/decisions.md` — decisões arquiteturais não registradas
- Sem `docs/application.md`, `docs/infrastructure.md`, `docs/presentation.md`
- `docs/gift-system-plan*` descreve o passado (refatoração concluída) — não cobre a nova fase

**Oportunidades:**
- Criar `docs/decisions.md`
- Criar documentação por camada

---

### 1.7 Design System — Nota: 7/10

**Situação:** Componentes base em `components/ui/`, tokens definidos em `design_plan.md`.

**Pontos fortes:**
- Componentes reutilizáveis: AppPage, AppCard, AppButton, CollapsibleCard, PageHeader, SectionTitle, LoadingState, ErrorState, EmptyState, AppStat
- Tema claro/escuro via Vuetify `useTheme()`
- Documentação em `design_plan.md`

**Problemas:**
- Tokens não materializados em arquivo de variáveis CSS (estão apenas no `design_plan.md`)
- Tema Vuetify em `plugins/` (não junto dos tokens)
- Alguns componentes ainda usam `v-btn` raw (21 ocorrências no TODO)

**Oportunidades:**
- Criar `src/styles/tokens/` com variáveis CSS
- Mover tema Vuetify para `styles/theme/`
- Substituir `v-btn` raw por AppButton

---

### 1.8 CI/CD — Nota: 0/10

**Situação:** Inexistente. Não há pipeline automatizada.

**Riscos:**
- Alto. Sem validação automática em commits/PRs.
- Médio. Build e testes só são executados manualmente.

**Oportunidades:**
- GitHub Actions com lint + typecheck + test + build (Sprint 10)

---

### 1.9 TypeScript — Nota: 4/10

**Situação:** Apenas `domain/` está em TypeScript. Todo o resto é JavaScript.

**Pontos fortes:**
- Domínio tipado e seguro
- Interface `Gift`, tipos `Scores`, `RankedGift`

**Problemas:**
- Stores, repositories, services, helpers, views, components — todos `.js`
- Sem `tsconfig.json` formal (Vite compila TS nativamente, mas sem checagem rigorosa)
- Sem type-check no CI

**Oportunidades:**
- Migração incremental, começando por application layer (Sprint 7)
- Configurar `tsconfig.json` com `strict: true`
- Type-check no CI (Sprint 10)

---

## 2. Comparação com a Referência Cinco Ministérios

### Práticas que DEVEM ser incorporadas

| Prática | Como aplicar no Dons |
|---------|---------------------|
| Application Layer explícita | Criar `application/` com casos de uso |
| Composables como ponte | `useQuizSession`, `useResults` |
| Infrastructure tests | Mock Supabase, testar cada adaptador |
| Decisions.md | Registrar decisões arquiteturais |
| Documentação por camada | `docs/application.md`, `docs/infrastructure.md` |
| Testes por camada | Application + Infrastructure + Composable tests |
| Validação no domínio | `isValidGiftId()`, `isValidQuestionId()` |
| Tokens CSS como variáveis | Arquivo `tokens.css` com cores, espaçamentos |

### Práticas que NÃO fazem sentido para o Dons

| Prática | Motivo |
|---------|--------|
| localStorage como persistência principal | Dons usa Supabase (backend real) |
| Offline first | Dons tem autenticação e dados no servidor |
| Tailwind CSS | Dons já usa Vuetify — adicionar Tailwind aumentaria complexidade sem benefício |
| Módulos independentes como pastas separadas | Dons é menor — componentes planos em `components/quiz/` e `components/results/` são suficientes |
| `@/` alias | Dons já deve ter (Vite padrão) — verificar se está configurado |

### Diferenças Tecnológicas

| Aspecto | Dons | Cinco Ministérios |
|---------|------|-------------------|
| Framework | Vue 3 + Vuetify | Vue 3 + Vuetify + Tailwind |
| Persistência | Supabase (online) | localStorage (offline) |
| Autenticação | Supabase Auth (Google OAuth) | Nenhuma |
| Estado | Pinia stores | Composables |
| IA | OpenAI via Edge Functions | N/A |
| Admin | AdminView com CRUD | N/A |
| Testes | 78 (Vitest) | 134 (Vitest) |
| Tipo | Multi-usuário com roles | Single usuário, sem auth |

### Diferenças de Contexto

- O Dons é uma aplicação **multi-usuário com backend real** (Supabase) — logo, tem mais complexidade de infraestrutura que o Cinco Ministérios
- O Cinco Ministérios é um **teste pequeno (6 perguntas, 5 ministérios)** enquanto o Dons tem **135 perguntas, 27 dons** — escala diferente
- O Cinco Ministérios tem **134 testes** para uma base de código menor; o Dons tem **78 testes** para uma base maior
- O Dons tem **IA generativa** como funcionalidade core — camada adicional que o Cinco Ministérios não tem

---

## 3. Débitos Técnicos

### Críticos

| Item | Local | Impacto | Sprint |
|------|-------|---------|--------|
| Application Layer inexistente | N/A | Impossibilidade de testar fluxos | 7 |
| Sem CI/CD | N/A | Risco de regressão não detectada | 10 |
| Zero testes de infrastructure | repositories/ | Refatoração arriscada | 8 |

### Altos

| Item | Local | Impacto | Sprint |
|------|-------|---------|--------|
| `submitQuiz()` na view | QuizView.vue | Orquestrador monolítico | 7 |
| Stores sem testes | stores/ | Refatoração de stores sem rede de segurança | 9 |
| Tratamento de erros inconsistente | repositories/ | Possíveis hangs (insert sem timeout) | 8 |
| Sem type-check | Projeto inteiro | Erros de tipo só aparecem em runtime | 10 |

### Médios

| Item | Local | Impacto | Sprint |
|------|-------|---------|--------|
| Acoplamento posicional i%27 | questions.js ↔ spiritual-gifts.ts | Mudança na ordem quebra scores | 7 |
| `color` repetido 27x | spiritual-gifts.ts | Ruim, mas sem risco funcional | 6 |
| Tokens sem variáveis CSS | N/A | Inconsistência visual potencial | 6 |
| 21 v-btn raw no código | Vários | Inconsistência de Design System | 9 |

### Baixos

| Item | Local | Impacto | Sprint |
|------|-------|---------|--------|
| Components planos (sem módulos) | components/ | Dificuldade de navegação | 9 |
| Views grandes | ResultsView (285 linhas) | Manutenibilidade | 9 |
| Sem decisions.md | N/A | Perda de histórico de decisões | 6 |

---

## 4. Riscos

| Risco | Prob | Impacto | Mitigação |
|-------|:----:|:-------:|-----------|
| Quebrar submit ao extrair application layer | Média | Alto | Manter código original funcionando durante extração; testes antes da migração |
| Regressão em repositories ao refatorar | Média | Alto | Testes de infrastructure com mock Supabase |
| Perder estado de quiz ao refatorar stores | Baixa | Alto | Migração incremental com compatibilidade |
| Application layer virar "garbage can" | Média | Médio | Definir responsabilidades claras; casos de uso pequenos |
| Aumento de complexidade sem benefício | Baixa | Médio | Seguir YAGNI — só criar o que for usado imediatamente |
| TypeScript migration lenta | Alta | Baixo | Incremental, sem bloqueio |

---

## 5. Decisões Recomendadas

### D01 — Application Layer é prioridade máxima
Criar `application/` antes de qualquer outra mudança. A inexistência desta camada é o maior débito técnico.

### D02 — Composables complementam Pinia, não substituem
Pinia stores existentes continuam funcionando. Composables são adicionados para novos casos de uso ou quando houver refatoração clara.

### D03 — Infrastructure isolada mas compatível
Repositories existentes não são removidos. Novos adaptadores em `infrastructure/` são adicionados progressivamente.

### D04 — Testes antes da refatoração (padrão Sprint 1)
Seguir o mesmo padrão da Sprint 1: criar testes para a camada existente antes de refatorar. Garantir que os testes passam antes e depois.

### D05 — TypeScript incremental
Sprint 7 (application) já em TS. Infrastructure e Presentation migram gradualmente. Sem meta de 100% nesta fase.

### D06 — CI/CD só na Sprint 10
Não antecipar. Pipeline sem application layer testada teria valor limitado.

### D07 — Decisions.md imediatamente
Criar na Sprint 6 para registrar decisões desde o início da fase.

### D08 — Tokens CSS imediatamente
Criar variáveis CSS na Sprint 6 — baixo esforço, alto benefício.
