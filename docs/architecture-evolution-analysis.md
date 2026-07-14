# Análise Arquitetural — Dons Espirituais vs Cinco Ministérios

> **Data:** 2026-07-09
>
> **Última atualização:** 2026-07-14 (Sprint 10 concluída — v2.0.0)
>
> **Contexto:** Avaliação da arquitetura atual do Dons Espirituais à luz da referência Cinco Ministérios (v5.2.0, 134 testes, 13 documentos de arquitetura)

---

## 1. Estado Atual do Dons por Camada

### 1.1 Domínio — Nota: 8/10

**Situação:** Consolidado. `domain/spiritual-gifts.ts` + `domain/scoring.ts`. TypeScript, funções puras, sem dependência de framework. 75 testes.

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

### 1.2 Application Layer — Nota: 7/10

**Situação:** Criada na Sprint 7. `application/quiz/` com `submit-quiz.ts`, `quiz-session.ts`, `ports.ts`. 14 testes. `application/auth/` com `user-profile.ts`. 5 testes. `QuizView.vue` simplificado. `checkSavedState` consolidado no application (Sprint 8.5).

**Pontos fortes:**
- `submitQuiz()` testável sem Vue (com `vi.mock()`) — 7 testes
- `quiz-session.ts` gerencia sessão localStorage (checkSavedSession, clearSession)
- `ports.ts` com `SubmitQuizInput` e `SubmitQuizResult` — contratos claros
- ADR-012 estabelece padrão para todos os casos de uso futuros
- QuizView.vue não orquestra mais scoring/payload/persistência/side effects

**Problemas (resolvidos na Sprint 8):**
- `services/aiAnalysis.js` — código órfão removido (8.4)
- Duplicação `quizStore.checkSavedState()` — consolidada em application layer (8.5)

**Riscos:**
- Baixo. Camada estabelecida e testada.

**Oportunidades:**
- Criar casos de uso para regenerate-analysis, calculate-result

---

### 1.3 Infrastructure — Nota: 5/10

**Situação:** `repositories/` com acesso ao Supabase via `runSupabaseQuery()`. 4 arquivos (response, ai, auth, user). 13 testes de infrastructure (Sprint 8.3). Timeout padronizado em todos os métodos de responseRepository (Sprint 8.2).

**Pontos fortes:**
- Separado em arquivos por entidade (response, ai, auth, user)
- `services/supabaseQuery.js` fornece `runSupabaseQuery` com timeout (10s)
- Todos os 7 métodos de `responseRepository` usam `runSupabaseQuery` consistentemente
- 13 testes unitários com mock Supabase (nenhum acesso real)

**Problemas:**
- Nenhum (itens da Sprint 8 resolvidos: timeout padronizado, testes criados, violação corrigida)

**Riscos:**
- Baixo. Infrastructure tests fornecem rede de segurança para refatoração.

**Oportunidades:**
- Expandir cobertura de infrastructure (aiRepository, authRepository)
- Medir cobertura oficialmente

---

### 1.4 Presentation — Nota: 6.5/10

**Situação:** Views + Components + Stores (Pinia). Design System em evolução. Application Layer já reduziu orquestração no QuizView. Auditoria completa da camada concluída na Sprint 9.1.

**Pontos fortes:**
- Design System com componentes reutilizáveis (AppPage, AppCard, AppButton, CollapsibleCard, etc.)
- `design_plan.md` bem documentado (965 linhas)
- Separação clara entre `components/ui/` (DS) e componentes de domínio
- QuizView.vue simplificado (orquestração movida para application layer)
- **Zero violações de camada:** nenhum componente ou view importa repositories ou services diretamente (confirmado por auditoria)

**Problemas (resolvidos na Sprint 8):**
- `UserInfoForm.vue` importava `repositories/` diretamente — violação corrigida (8.1)
- `stores/quiz.js` duplicava `quizSession.checkSavedSession()` — consolidado (8.5)
- `AiAnalysis.vue` e `HistoryList.vue` — acoplamento avaliado: **manter** (8.6)

**Problemas remanescentes (identificados na auditoria 9.1):**
- `AdminView.vue` (572 linhas) — maior view do projeto, múltiplas responsabilidades
- `ResultsView.vue` (284 linhas) — gerencia estado, edição de nome, share, print
- `AiAnalysis.vue` (282 linhas) — polling, subscription, 4 estados, permissões
- 24 `<v-btn>` raw em vez de `<AppButton>` — DS subutilizado
- 6 `<v-alert>` raw em vez de `<AppAlert>` — DS subutilizado
- `LoadingState.vue`, `EmptyState.vue`, `ErrorState.vue` existem mas não são usados por componentes feature
- 0 testes de components ou stores

**Débitos técnicos (Sprint 9.3):**
- `stores/responses.js`: `insert()` e `countByUserId()` — **removidos**
- `stores/quiz.js`: `restoreSaved()` e `persistState()` acessavam localStorage direto — **consolidados em `application/quiz/quiz-session.ts`**
- `stores/auth.js`: `loadProfile()` com retry manual, ignora `application/auth/user-profile.ts` existente — **pendente**

**Infraestrutura de testes Vue (Sprint 9.3):**
- `@vue/test-utils` + `happy-dom` instalados
- `vitest.setup.js` criado
- Ambiente configurado em `vite.config.js`
- Pronto para Sprint 10 criar testes de stores e components

**Cobertura de testes:** 259 testes (Sprint 10.4 — 145 novos testes de stores, componentes, infrastructure e helpers)

**Riscos:**
- Baixo. Presentation Layer sem violações graves. Nenhum componente acessa Infrastructure diretamente.

**Próximo gargalo arquitetural:** Editor inline com lógica similar entre ResultsView e AdminView, mas com fluxos de negócio distintos (individual vs tabela). Avaliado na Sprint 9.2 — decisão de manter componentes independentes.

**Oportunidades:**
- Substituir `<v-btn>` raw por `<AppButton>` (Sprint 10+)
- Reutilizar `LoadingState`, `EmptyState`, `ErrorState` em HistoryList e AiAnalysis (Sprint 9+)
- Extrair componentes de AdminView (dashboard, tabela, filtros) em sprints futuras

---

### 1.5 Testes — Nota: 7/10

**Situação:** 114 testes, Vitest, 9 arquivos de teste. Infrastructure tests criados (Sprint 8.3).

**Pontos fortes:**
- Domínio bem testado (75 testes)
- Application layer com 23 testes (14 quiz + 5 auth + 4 saveSession)
- Infrastructure com 13 testes (10 responseRepository + 3 userRepository)
- Testes rápidos (~500ms)
- Application tests isolados com `vi.mock()` (sem Vue)
- Infrastructure tests com mock Supabase (sem acesso real)

**Problemas remanescentes:**
- 0 testes de stores/composables
- Testes de domínio (`scoring`) localizados em `services/__tests__/` em vez de `domain/__tests__/`
- Cobertura global: 12.54% statements (Sprint 10.3 baseline)

**Riscos:**
- Baixo. Infrastructure tests fornecem rede de segurança para refatoração de repositories.

**Oportunidades:**
- Testes de stores (Sprint 10.4)
- Cobertura configurada (Sprint 10.3): `vitest --coverage` com relatório HTML
- Meta inicial: 30% statements (atingível com stores + authRepository + helpers)

**Cobertura por módulo (baseline Sprint 10.3):**

| Módulo | Stmts | Status |
|---|---|---|
| `domain/` | 96.77% | ✅ Bem testado |
| `application/` | 100% | ✅ Totalmente coberto |
| `data/` | 87.5% | ⚠️ resources.js 0% |
| `repositories/` | 49.31% | ⚠️ 2 de 4 repositories sem testes |
| `services/` | 58.82% | ⚠️ supabase.js 0% (só exports) |
| `helpers/` | 12.5% | ⚠️ só string.js testado |
| `stores/` | 0% | ❌ Nenhum teste |
| `components/` | 0% | ❌ Nenhum teste |
| `views/` | 0% | ❌ Nenhum teste |

**Meta:** 30% statements — baseline realista para Sprint 10.4 focando stores + repositories + helpers.

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

### 1.8 CI/CD — Nota: 6/10

**Situação:** CI implementado na Sprint 10.2 (GitHub Actions — lint, typecheck, test, build). CD planejado para Sprint 13.

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

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| Application Layer inexistente | N/A | Impossibilidade de testar fluxos | 7 | ✅ Resolvido |
| Violação de camada: Presentation → Infrastructure | UserInfoForm.vue | Componente acessa repositories diretamente | 8.1 | ✅ Resolvido |
| Zero testes de infrastructure | repositories/ | Refatoração arriscada | 8.3 | ✅ Resolvido |
| Sem CI/CD | N/A | Risco de regressão não detectada | 10 | ⏳ Futuro |

### Altos

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| `submitQuiz()` na view | QuizView.vue | Orquestrador monolítico | 7 | ✅ Resolvido |
| Tratamento de erros inconsistente | repositories/ | Possíveis hangs (insert sem timeout) | 8.2 | ✅ Resolvido |
| Duplicação checkSavedSession | stores/quiz.js + application/quiz/quiz-session.ts | Duas validações de sessão | 8.5 | ✅ Resolvido |
| Código órfão services/aiAnalysis.js | services/ | Camada services sem propósito | 8.4 | ✅ Resolvido |
| Stores sem testes | stores/ | Refatoração de stores sem rede de segurança | 9 | ⏳ Futuro |
| Sem type-check | Projeto inteiro | Erros de tipo só aparecem em runtime | 10 | ⏳ Futuro |

### Médios

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| Acoplamento posicional i%27 | questions.js ↔ spiritual-gifts.ts | Mudança na ordem quebra scores | 7 | ⚠️ Identificado |
| `color` repetido 27x | spiritual-gifts.ts | Ruim, mas sem risco funcional | — | 📋 Backlog |
| 21 v-btn raw no código | Vários | Inconsistência de Design System | 9 | ⏳ Futuro |

### Baixos

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| Components planos (sem módulos) | components/ | Dificuldade de navegação | 9 | ⏳ Futuro |
| Views grandes | ResultsView (285 linhas) | Manutenibilidade | 9 | ⏳ Futuro |
| AiAnalysis/HistoryList acoplados a stores | components/ | Reutilização limitada | 8.6 | 📋 Avaliado — manter |

---

## 4. Riscos

| Risco | Prob | Impacto | Mitigação |
|-------|:----:|:-------:|-----------|
| Quebrar submit ao extrair application layer | Média | Alto | Manter código original funcionando durante extração; testes antes da migração |
| Regressão em repositories ao refatorar | Média | Alto | Testes de infrastructure com mock Supabase (Sprint 8.3) |
| Perder estado de quiz ao refatorar stores | Baixa | Alto | Migração incremental com compatibilidade |
| Application layer virar "garbage can" | Média | Médio | Definir responsabilidades claras; casos de uso pequenos |
| Aumento de complexidade sem benefício | Baixa | Médio | Seguir YAGNI — só criar o que for usado imediatamente |
| TypeScript migration lenta | Alta | Baixo | Incremental, sem bloqueio |
| **UserInfoForm perder preenchimento automático** (8.1) | Baixa | Alto | ✅ Resolvido — QuizView.vue usa `authStore.user` para initialData |
| **Mock do Supabase complexo** (8.3) | Média | Médio | ✅ Resolvido — mock simples `vi.fn()` + chain methods |
| **Duplicação checkSavedState quebrar retomada** (8.5) | Baixa | Alto | ✅ Resolvido — testes existentes validam fluxo |
| **Remover aiAnalysis.js e algo importá-lo** (8.4) | Baixa | Médio | ✅ Resolvido — grep confirmou 0 referências |

---

## 5.1 Evolução Institucional

### Por que essa fase agrega valor ao projeto

O projeto Dons Espirituais está em produção (usuários reais fazendo o teste), mas não possui os elementos institucionais mínimos esperados por uma aplicação pública:

- Não há página Sobre explicando o propósito, a metodologia ou o autor
- Não há footer com informações institucionais, licença ou links
- Não há SEO, Open Graph ou metadados de compartilhamento
- A identidade visual não está consolidada em um componente de logotipo reutilizável

A implementação desses elementos transforma a aplicação de "projeto funcional" para "produto público completo".

### Por que deve acontecer após a consolidação arquitetural

1. **Dependência de infraestrutura:** A página Sobre e o footer não dependem de Application Layer ou Infrastructure — são componentes de apresentação puros
2. **Momento adequado:** Após a reorganização da Presentation (Sprint 9), os padrões de componente e composable já estarão estabelecidos
3. **Sem risco de retrabalho:** Se feita antes, a institucionalização poderia precisar de refatoração quando a estrutura de componentes mudar
4. **Paralelismo potencial:** Sprints institucionais tem escopo bem isolado da arquitetura — baixo risco de conflito

### Benefícios para usuários

- Entendem o propósito e a metodologia do teste
- Sabem quem desenvolveu e como contribuir
- Compartilham resultados com preview enriquecido (Open Graph)
- Navegação institucional consistente (header + footer)

### Benefícios para novos desenvolvedores

- Encontram contexto do projeto (readme + página Sobre)
- Entendem a licença e as diretrizes de contribuição
- Identificam outros projetos relacionados
- Documentação institucional como porta de entrada

### Benefícios para manutenção do projeto

- SEO melhora o ranqueamento e a descoberta orgânica
- Open Graph enriquece o compartilhamento em redes sociais
- Identidade visual consolidada reduz decisões de design futuras
- Header e footer reutilizáveis centralizam navegação

---

## 6. Decisões Recomendadas

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

### D06 — CI na Sprint 10, CD na Sprint 13
Pipeline sem application layer testada teria valor limitado. CI (validação) e CD (deploy) foram separados: CI na Sprint 10.2, CD na Sprint 13. ADR-007 e ADR-014 documentam a decisão.

### D07 — Decisions.md imediatamente
Criar na Sprint 6 para registrar decisões desde o início da fase.

### D08 — Tokens CSS imediatamente
Criar variáveis CSS na Sprint 6 — baixo esforço, alto benefício.
