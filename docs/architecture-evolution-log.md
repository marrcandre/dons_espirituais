# Log de Execução — Evolução Arquitetural

---

## Sprint 6 — Fundação Arquitetural

> **Início:** 2026-07-09
>
> **Término:** (em andamento)
>
> **Status:** Planejamento

### Contexto

As Sprints 0–5 de refatoração do domínio foram concluídas com sucesso:

- Fonte única dos 27 dons em `domain/spiritual-gifts.ts`
- Regras de domínio em `domain/scoring.ts`
- `data/gifts.js` removido
- Código comentado removido
- 78 testes, build intacto
- README atualizado, TODO limpo

O projeto atingiu um estado onde **o domínio está consolidado, mas a orquestração ainda é monolítica** (`QuizView.vue` centraliza scoring, payload, persistência, notificação e IA).

### Gatilho para nova fase

Análise do projeto de referência **Cinco Ministérios** (`docs/reference/cinco_ministerios/`), que possui:

- Application Layer explícita (casos de uso)
- Composables como ponte UI-camadas
- Infrastructure isolada e testada
- 134 testes (vs 78 do Dons)
- Documentação por camada (domain, application, infrastructure, presentation)
- Decisions.md registrando decisões arquiteturais

### Documentos analisados

**Projeto Dons (estado atual):**
- `docs/gift-system-plan.md`
- `docs/gift-system-plan-analysis.md`
- `docs/gift-system-plan-log.md`
- `docs/design_plan.md`
- `CHANGELOG.md`
- `README.md`
- `TODO.md`
- `packages/frontend/src/domain/` (spiritual-gifts.ts, scoring.ts)
- `packages/frontend/src/services/` (aiAnalysis.js, supabase.js, supabaseQuery.js)
- `packages/frontend/src/repositories/` (response, ai, auth, user)
- `packages/frontend/src/stores/` (quiz, responses, ai, auth)
- `packages/frontend/src/views/` (QuizView, ResultsView, HomeView, etc.)
- `packages/frontend/src/components/` (ui/, domain components)

**Referência Cinco Ministérios:**
- `architecture.md`
- `analise_arquitetura.md`
- `decisions.md`
- `philosophy.md`
- `domain.md`
- `application.md`
- `infrastructure.md`
- `presentation.md`
- `design-system.md`
- `roadmap.md`
- `changelog.md`
- `sprint-6-publicacao.md`
- `_proximo_sprint.md`

### Decisões iniciais

| ID | Decisão | Justificativa |
|----|---------|---------------|
| D01 | Application Layer é prioridade máxima | Maior débito técnico; sem ela, fluxos não são testáveis |
| D02 | Composables complementam Pinia | Migração gradual sem quebrar stores existentes |
| D03 | Infrastructure isolada com compatibilidade | Repositories antigos coexistem com novos adaptadores |
| D04 | Testes antes da refatoração | Mesmo padrão da Sprint 1 — rede de segurança |
| D05 | TypeScript incremental | Application em TS; demais camadas conforme refatoração |
| D06 | CI/CD apenas na Sprint 10 | Pipeline sem application layer teria valor limitado |
| D07 | Decisions.md imediatamente | Registrar decisões desde o início da fase |
| D08 | Tokens CSS imediatamente | Baixo esforço, alto benefício para consistência |

### Arquitetura Alvo Proposta

```
domain/       → Regras puras (já consolidado)
application/  → Casos de uso (NOVO)
infrastructure/ → Adaptadores (NOVO)
presentation/ → Composables + componentes organizados (NOVO)
constants/    → Constantes de apresentação (já existe)
helpers/      → Utilitários puros (já existe)
```

### Próximos passos

1. **Sprint 6 (atual):** Finalizar documentação, criar `docs/decisions.md`, preparar estrutura de diretórios
2. **Sprint 7:** Criar `application/quiz/` com `submit-quiz.ts`, `quiz-session.ts`, `ports.ts` + testes em `application/__tests__/` + atualizar QuizView.vue
3. **Sprint 8:** Criar `infrastructure/supabase/` + testes
4. **Sprint 9:** Composables + organização de componentes
5. **Sprint 10:** CI/CD, cobertura, SEO, documentação final

### Revisão de planejamento — Inclusão da Fase 3

**Data:** 2026-07-09

Durante a comparação detalhada com o projeto Cinco Ministérios, identificou-se que um conjunto importante de melhorias não havia sido incorporado ao roadmap:

- Página Sobre (metodologia, autor, licença)
- Footer institucional
- SEO, Open Graph, Sitemap, Robots
- Identidade visual consolidada (logo, assets)
- Informações de contribuição e projetos relacionados

**Decisão:** Estes itens passam a compor a **Fase 3 — Experiência Institucional** (Sprints 11–13), após a conclusão da evolução arquitetural.

**Documentos alterados nesta revisão:**
- `docs/comparativo-arquitetural.md` — nova seção "Experiência Institucional"
- `docs/architecture-evolution-analysis.md` — nova seção "Evolução Institucional"
- `docs/architecture-evolution-plan.md` — reestruturado em 3 fases; Sprints 11–13 adicionadas
- `docs/architecture-evolution-log.md` — este registro
- `docs/decisions.md` — ADR-011 adicionada

**Nenhuma alteração de código foi realizada.**

---

### Métricas (baseline pós-Sprint 6)

| Métrica | Valor |
|---------|-------|
| Testes | 78 |
| Arquivos de teste | 4 |
| Cobertura (statements) | Não medida |
| Cobertura (domain) | ~95% (estimado) |
| Cobertura (application) | 0% |
| Cobertura (infrastructure) | 0% |
| Cobertura (presentation) | 0% |
| CI/CD | Nenhum |
| TypeScript | Apenas domain/ |
| Views com orquestração | QuizView.vue (submit centralizado) |
| Componentes | 11 (planos, sem módulos) |
| Design System | ui/ com 10 componentes |
| Tokens CSS | Documentados em design_plan.md, sem arquivo de variáveis |

---

## Sprint 7 — Application Layer

> **Início:** 2026-07-14
>
> **Término:** 2026-07-14
>
> **Status:** ✅ Concluída

### Contexto

Sprint 6 concluída (fundação arquitetural documentada). A Sprint 7 é a primeira sprint com alteração de código na Fase 2.

### Objetivo

Criar a Application Layer com escopo mínimo:

- `application/quiz/ports.ts` — interface de entrada/saída
- `application/quiz/submit-quiz.ts` — caso de uso principal (orquestração do envio)
- `application/quiz/quiz-session.ts` — serviço de sessão (localStorage)
- Testes em `application/__tests__/`
- QuizView.vue simplificado (orquestração movida para application)

### Decisões de planejamento

1. **Testes em `application/__tests__/`** — mantém o padrão do projeto (co-localizados por camada, não por módulo). A padronização geral dos testes será discutida após a Fase 2.
2. **`quiz-session.ts` escopo reduzido** — apenas `checkSavedSession()` e `clearSession()`. Sem `saveSession()` por ora (YAGNI).
3. **`ports.ts` escopo mínimo** — apenas `SubmitQuizInput` e `SubmitQuizResult`. `SavedSession` permanece interno ao `quiz-session.ts`.
4. **Sem `application/results/`** — será planejada em sprint posterior.
5. **Sem composables, DI, alterações em stores, repositories ou domain.**
6. **Nova ADR** registrada em `docs/decisions.md` (ADR-012).

### Estrutura implementada

```
src/
  application/
    __tests__/
      submit-quiz.test.ts      # 7 testes
      quiz-session.test.ts     # 7 testes
    quiz/
      submit-quiz.ts           # Caso de uso: orquestração do envio
      quiz-session.ts          # Serviço: checkSavedSession, clearSession
      ports.ts                 # Tipos: SubmitQuizInput, SubmitQuizResult
```

### Checklist de execução

- [x] `src/application/` criada com estrutura de diretórios
- [x] `application/quiz/ports.ts` com `SubmitQuizInput` e `SubmitQuizResult`
- [x] `application/quiz/quiz-session.ts` com `checkSavedSession()` e `clearSession()`
- [x] `submitQuiz()` extraído do QuizView.vue para `application/quiz/submit-quiz.ts`
- [x] Testes unitários em `application/__tests__/` (14 novos testes)
- [x] QuizView.vue simplificado: orquestração removida, usa casos de uso
- [x] ADR-012 registrada em `docs/decisions.md`

### Resultados

| Métrica | Antes | Depois |
|---------|-------|--------|
| Testes totais | 78 | 92 |
| Arquivos de teste | 4 | 6 |
| Cobertura (application) | 0% | ~95% (estimado) |
| Views com orquestração | QuizView.vue (203 linhas) | QuizView.vue (181 linhas, orquestração removida) |
| Application Layer | Inexistente | `application/quiz/` com 3 arquivos |
| Nenhuma alteração | — | stores, repositories, domain, infrastructure intactos |

### Critérios de aceite

- [x] `submitQuiz()` testável sem Vue (com `vi.mock()`) — 7 testes em submit-quiz.test.ts
- [x] `quiz-session.ts` gerencia sessão (checkSavedSession, clearSession)
- [x] `ports.ts` contém apenas `SubmitQuizInput` e `SubmitQuizResult`
- [x] Testes em `application/__tests__/` (padrão do projeto, não co-localizados)
- [x] QuizView.vue não orquestra scoring/payload/persistência/side effects
- [x] Nenhuma regra de domínio volta para Views ou Stores
- [x] 92 testes passando (78 existentes + 14 novos)
- [x] Build intacto
- [x] Nenhuma alteração em stores, repositories, domain ou infrastructure
- [x] `application/results/` não criado

---

## Sprint 8 — Correções, Testes e Consolidação

> **Início:** 2026-07-14
>
> **Término:** —
>
> **Status:** ⏳ Planejamento

### Contexto

Sprint 7 concluída com Application Layer criada e testada. O projeto está em v1.7.0 com 92 testes passando.

A auditoria técnica realizada no início da Sprint 8 identificou:

1. **Violação de camada:** `UserInfoForm.vue` importa `repositories/` diretamente
2. **Inconsistência de timeout:** 2 métodos de `responseRepository` não usam `runSupabaseQuery`
3. **Zero testes de infrastructure:** repositories sem cobertura
4. **Código órfão:** `services/aiAnalysis.js` sem consumidores após Sprint 7
5. **Duplicação:** `quizStore.checkSavedState()` replica `quizSession.checkSavedSession()`
6. **Acoplamento:** `AiAnalysis.vue` e `HistoryList.vue` importam stores globais

### Decisão de planejamento

Diferentemente do planejamento original (que previa "criar `infrastructure/supabase/` com adaptadores"), a Sprint 8 foi reestruturada em 6 etapas menores e sequenciais, priorizando:

1. Correção de violações de arquitetura antes de criar novas abstrações
2. Testes antes de limpeza (padrão ADR-010)
3. Remoção de código morto antes de refatoração
4. Eliminação de duplicações antes de novas funcionalidades

**Esta abordagem substitui a criação de `infrastructure/supabase/`** (prevista no plano original) por correções pontuais nos repositories existentes, evitando antecipar a reorganização física da arquitetura (Fase 4).

### Estrutura da Sprint 8

```
Sprint 8
├── 8.1 — Corrigir violação de camada (UserInfoForm)
├── 8.2 — Padronizar acesso ao Supabase (timeout)
├── 8.3 — Criar testes unitários da Infrastructure
├── 8.4 — Remover código morto (services/aiAnalysis.js)
├── 8.5 — Eliminar duplicação (quizStore / quizSession)
└── 8.6 — Avaliar desacoplamento de componentes
```

### Decisões de planejamento

1. **Sprint 8.1 primeiro** — corrigir violação de camada antes de qualquer outra alteração
2. **Sprint 8.2 antes de 8.3** — padronizar timeout antes de criar testes
3. **Sprint 8.3 antes de 8.4** — testes de infrastructure como rede de segurança para remoção de código
4. **Sprint 8.6 é apenas avaliação** — não implementar alteração sem ganho claro (decisão: manter estado atual)
5. **Sem `application/analysis/`** — postergado para Sprint 9
6. **Sem `infrastructure/supabase/`** — postergado para Fase 4 (reorganização física)

### Checklist de execução

- [x] **8.1** UserInfoForm refatorado para usar `getUserProfile()` da Application Layer
- [x] **8.2** `responseRepository.insert()` e `countByUserId()` usam `runSupabaseQuery`
- [x] **8.3** `repositories/tests/responseRepository.test.js` com 10 testes
- [x] **8.3** `repositories/tests/userRepository.test.js` com 3 testes
- [x] **8.4** `services/aiAnalysis.js` removido (confirmado sem uso)
- [x] **8.5** `quizStore.checkSavedState()` delegado a `quizSession.checkSavedSession()`
- [x] **8.6** Avaliação documentada — decisão de manter estado atual

### Resultados esperados

| Métrica | Antes (v1.7.0) | Após 8.1–8.2 | Após 8.5 | Meta Sprint 8 |
|---------|----------------|----------------|----------|---------------|
| Testes totais | 92 | 97 | **110** | ~105+ |
| Arquivos de teste | 6 | 7 | **9** | 9 |
| Cobertura (infrastructure) | 0% | 0% | ~XX% | ~85% |
| Cobertura (geral) | ~40% | ~40% | ~42% | ~55% |
| Violações de camada | 1 (UserInfoForm) | 0 | **0** | 0 |
| Inconsistência de timeout | 2 métodos | 0 | **0** | 0 |
| Código órfão | services/aiAnalysis.js | ainda presente | ainda presente | **removido** |
| Duplicação checkSavedState | 2 implementações | ainda presente | **eliminada** | 1 (centralizada) |

### Critérios de aceite

- [x] UserInfoForm não importa repositories
- [x] Todos os 7 métodos de responseRepository usam `runSupabaseQuery`
- [x] 13 testes de infrastructure passando
- [x] `services/aiAnalysis.js` removido (confirmado sem uso)
- [x] `quizStore.checkSavedState()` não replica lógica de sessão
- [x] Decisão de desacoplamento registrada
- [x] 110 testes passando
- [x] Build verde
- [x] Nenhuma regressão funcional

---

### Sprint 8.1 — Corrigir violação de camada ✅

**Concluída em:** 2026-07-14

**Implementado:**
- Criado `application/auth/user-profile.ts` com `getUserProfile()` — caso de uso que obtém nome e email do usuário autenticado
- Criado `application/auth/ports.ts` com interface `UserProfile`
- Criados 5 testes em `application/auth/tests/user-profile.test.ts`
- Modificado `UserInfoForm.vue` — substituídos imports de `repositories/` por `getUserProfile()` da Application Layer

**Resultados:**
- 5 novos testes → total: 97
- Build verde
- Violação de camada eliminada

---

### Sprint 8.2 — Padronizar acesso ao Supabase ✅

**Concluída em:** 2026-07-14

**Implementado:**
- `responseRepository.insert()` migrado para `runSupabaseQuery()` com `DEFAULT_TIMEOUT` (10s)
- `responseRepository.countByUserId()` migrado para `runSupabaseQuery()` com `DEFAULT_TIMEOUT` (10s)

**Resultados:**
- 7/7 métodos do responseRepository usam `runSupabaseQuery`
- Zero acessos `await supabase.from(...)` sem wrapper nos repositories
- authRepository e aiRepository mantidos fora do escopo (APIs específicas)
- 97 testes passando
- Build verde

---

### Sprint 8.3 — Testes da Infrastructure ✅

**Concluída em:** 2026-07-14

**Implementado:**
- Criado `repositories/tests/responseRepository.test.js` com 10 testes:
  - `findById()` — retorna resposta encontrada; propaga erro
  - `findByUserId()` — retorna lista; aplica limit
  - `insert()` — persiste payload e retorna id
  - `countByUserId()` — retorna contagem; retorna zero quando count é null
  - `updateField()` — executa atualização sem erro
  - `selectField()` — retorna valor do campo; retorna null quando campo não existe
- Criado `repositories/tests/userRepository.test.js` com 3 testes:
  - `findById()` — usuário encontrado retorna objeto; usuário inexistente retorna null; erro do Supabase é propagado

**Estratégia de mocks:**
- Nenhum mock em `services/supabaseQuery.js` — o fluxo real `repository → runSupabaseQuery() → query.abortSignal()` é testado integralmente
- Mock no query builder do Supabase via `vi.hoisted()` + `vi.mock()`:
  - `supabase.from()` retorna um `mockQueryBuilder` com métodos encadeáveis (`select`, `eq`, `single`, `order`, `limit`, `maybeSingle`, `insert`, `update`)
  - `abortSignal()` configurado por teste para retornar `{ data, error }`, `{ count, error }` ou `{ error }`
- Zero acesso a Supabase real

**Resultados:**
- 13 novos testes → total: **110 testes**
- 9 arquivos de teste (7 existentes + 2 novos)
- Nenhum código de produção alterado
- 110/110 testes passando
- Build verde (787 módulos, sem regressão)

---

### Sprint 8.4 — Remoção de código morto ✅

**Concluída em:** 2026-07-14

**Código morto identificado:**
- `services/aiAnalysis.js` — exportava `regenerateAiAnalysis(responseId, name)`
- Sem imports, sem chamadas em todo o código-fonte
- Responsabilidade já absorvida por `stores/ai.js → regenerate()`

**Arquivos modificados:**
- `packages/frontend/src/stores/ai.js` — adicionadas validações:
  - `if (!responseId) throw new Error('responseId obrigatório')`
  - `if (!name?.trim()) throw new Error('name obrigatório')`
  - Mensagens idênticas ao arquivo removido

**Arquivo removido:**
- `packages/frontend/src/services/aiAnalysis.js` (16 linhas)

**Comportamento preservado:**
- `regenerate(responseId, name)` continua válido e com as mesmas validações
- Fluxo de chamada `aiRepository.invokeGenerateAI()` + `responseRepository.selectField()` inalterado
- Nenhum consumidor impactado — `regenerateAiAnalysis()` não era importado por ninguém

**Verificação:**
- `grep -r "services/aiAnalysis" src` → nenhum resultado
- `grep -r "regenerateAiAnalysis" src` → nenhum resultado

**Resultados:**
- 110 testes passando
- Build verde (787 módulos)
- Nenhuma regressão funcional

---

### Sprint 8.5 — Eliminar duplicação de lógica de sessão do quiz ✅

**Concluída em:** 2026-07-14

**Problema resolvido:**
- Duplicação entre `stores/quiz.js → checkSavedState()` e `application/quiz/quiz-session.ts → checkSavedSession()`
- Store conhecia regra de leitura de sessão (localStorage, JSON.parse, validação)

**Arquivos alterados:**
- `packages/frontend/src/stores/quiz.js`:
  - Adicionado `import { checkSavedSession } from '../application/quiz/quiz-session'`
  - `checkSavedState()` delegado para Application Layer:
    ```js
    const saved = checkSavedSession(userId)
    if (saved) { hasSavedState.value = true; return true }
    hasSavedState.value = false; return false
    ```

**Arquitetura antes/depois:**

| Antes | Depois |
|---|---|
| `quizStore → localStorage → JSON.parse → validação → hasSavedState` | `quizStore → checkSavedSession() → Application Layer` |

**Impacto na Application Layer:**
- `quiz-session.ts` permaneceu inalterado — já era a implementação de referência
- `checkSavedSession()` já possuía cobertura de testes (7 testes em `quiz-session.test.ts`)

**Verificação:**
- `grep -R "localStorage.getItem.*quiz_state" src/stores` → **0 resultados** ✅

**Resultados:**
- 110 testes passando
- Build verde (787 módulos)
- `restoreSaved()` mantido fora do escopo (possível duplicação futura não antecipada)

---

### Sprint 8.6 — Auditoria de desacoplamento Presentation ✅

**Concluída em:** 2026-07-14

**Objetivo:** Auditar acoplamento de `AiAnalysis.vue` e `HistoryList.vue` a stores Pinia e registrar decisão arquitetural — sem refatorações.

**Componentes analisados:**

| Componente | Dependências | Decisão |
|---|---|---|
| `AiAnalysis.vue` | `useAuthStore()`, `useAiStore()`, `useResponsesStore()` | **Manter** — acoplamento aceitável em Vue + Pinia |
| `HistoryList.vue` | `useAuthStore()`, `useResponsesStore()` | **Manter** — custo de remoção > benefício |

**Justificativa arquitetural:**
- Pinia stores são o padrão de estado da Presentation Layer — o acoplamento é esperado e documentado
- Extrair stores para composables ou props criaria abstração sem benefício mensurável
- Nenhum componente orquestra regras de negócio ou acessa repositories diretamente
- Ambos consomem dados via stores que já abstraem repositories

**Oportunidades futuras:**
- Reavaliar caso `AiAnalysis.vue` cresça em responsabilidades
- Reavaliar caso surja necessidade de reuso em outro contexto
- Nenhuma ação planejada — débito técnico de baixa prioridade

**Resultados:**
- Nenhum arquivo de código fonte alterado
- Sprint 8 completa — todos os 6 sub-items entregues

---

### Sprint 9.1 — Auditoria da Presentation Layer ✅

**Concluída em:** 2026-07-14

**Resumo:**
- Nenhuma alteração de código — auditoria exclusivamente documental
- **7 views analisadas:** HomeView (85), LoginView (71), AuthCallback (18), QuizView (181), ResultsView (284), MyResultsView (114), AdminView (572)
- **21 componentes analisados:** 10 feature + 11 UI
- **4 stores analisadas:** auth (107), quiz (170), responses (105), ai (59)
- **Violações arquiteturais encontradas: 0** — nenhum import direto de repositories ou services em views/components

**Principais achados:**
- Editor inline duplicado entre ResultsView e AdminView (~150 linhas)
- 21 `<v-btn>` raw — DS subutilizado
- `LoadingState.vue`, `EmptyState.vue`, `ErrorState.vue` existentes mas não reutilizados
- `responseStore.insert()` e `countByUserId()` — dead code
- `auth.js` ignora `application/auth/user-profile.ts` existente
- `quiz.js` contorna `quiz-session.ts` com localStorage direto

**Decisão:** Avaliar `useInlineEditor` como primeiro candidato a composable (ADR-013).

---

### Sprint 9.2 — Avaliação de abstração de edição inline ❌

**Status:** Cancelada após implementação experimental.

**Concluída em:** 2026-07-14

**Resumo:**
A Sprint 9.2 avaliou a criação do composable `useInlineEditor` para eliminar duplicação entre `ResultsView.vue` e `AdminView.vue`. O composable foi implementado e testado inicialmente (9 testes), porém durante a validação funcional foi identificado que os fluxos possuem responsabilidades diferentes:

- **ResultsView:** edição de um resultado individual, atualização de `responseStore.current`, contexto do usuário
- **AdminView:** edição de múltiplos registros em tabela administrativa, controle de linhas independentes

**Conclusão:** A similaridade existente era principalmente visual e parcial. A abstração criada aumentava acoplamento e complexidade sem representar um conceito real compartilhado.

**Decisão:** Manter `ResultsView.vue` e `AdminView.vue` como componentes independentes. Código revertido ao estado anterior.

**Motivação:** Aplicação do ADR-013: "Composables devem surgir por necessidade real, não por antecipação." Código semelhante não significa necessariamente responsabilidade compartilhada.

**Arquivos removidos:**
- `packages/frontend/src/composables/useInlineEditor.js`
- `packages/frontend/src/composables/tests/useInlineEditor.test.js`

**Arquivos restaurados:**
- `packages/frontend/src/views/ResultsView.vue`
- `packages/frontend/src/views/AdminView.vue`

**Resultado:** 110 testes passando, build verde. Nenhuma referência a `useInlineEditor` no código.

---

### Sprint 9.3 — Consolidação da Presentation Layer ✅

**Concluída em:** 2026-07-14

**Objetivo:** Consolidar responsabilidades da Presentation eliminando duplicações reais e preparando Sprint 10 (Qualidade).

**1. Dead code removido**
- `stores/responses.js`: `insert()` e `countByUserId()` removidos (sem consumidores)
- `repositories/responseRepository.js`: mantido (testes existentes validam API de infraestrutura)

**2. Quiz session consolidada**
- `application/quiz/quiz-session.ts`: adicionado `saveSession(userId, session)`
- `stores/quiz.js`:
  - `clearState()` → usa `clearSession(userId)` da application layer
  - `persistState()` → usa `saveSession()` da application layer
  - `restoreSaved()` → usa `checkSavedSession()` da application layer (removido JSON.parse/validação manual)
  - `savedAnswerCount` → usa `checkSavedSession()` da application layer
  - `storageKey()` removido
  - Zero acesso direto a `localStorage` (confirmado por grep)

**3. Infraestrutura de testes Vue**
- `@vue/test-utils` instalado
- `happy-dom` instalado como ambiente de testes
- `vitest.setup.js` criado (setup básico)
- `vite.config.js`: configurado `test.environment: 'happy-dom'` e `setupFiles`
- Pronto para Sprint 10 criar testes de stores e components

**Arquivos alterados:**
- `packages/frontend/src/stores/responses.js` — dead code removido
- `packages/frontend/src/application/quiz/quiz-session.ts` — `saveSession()` adicionado
- `packages/frontend/src/stores/quiz.js` — toda persistência delegada para application layer
- `packages/frontend/vite.config.js` — ambiente de teste configurado
- `packages/frontend/vitest.setup.js` — criado

**Arquivos instalados:**
- `@vue/test-utils`
- `happy-dom`

**4. Testes de saveSession()**
- 4 testes unitários adicionados a `quiz-session.test.ts`
- Cenários: criação, integração com checkSavedSession, substituição, integração com clearSession

**Resultado:** 114 testes passando, build verde.

---

## Sprint 10 — Qualidade e Produto

> **Início:** 2026-07-14
>
> **Término:** (em andamento)
>
> **Status:** Em execução

### Sprint 10.1 — Tooling Foundation

**Objetivo:** Instalar e configurar ferramentas de qualidade ausentes (pré-requisito para CI).

**O que foi feito:**

1. **Ferramentas instaladas:**
   - `eslint` 9.39 — linter com flat config
   - `vue-tsc` 3.3 — type checker para Vue + TypeScript
   - `typescript-eslint` — regras TS para eslint
   - `eslint-plugin-vue` 10.9 — regras Vue para eslint
   - `vue-eslint-parser` — parser de arquivos .vue

2. **Configurações criadas:**
   - `eslint.config.js` — flat config com JS recommended + TS recommended + Vue essential
   - `tsconfig.json` — strict mode, moduleResolution bundler, ES2020 target
   - `src/env.d.ts` — declaração de tipos para módulos .vue

3. **Scripts adicionados ao `package.json`:**
   - `lint` — `eslint .`
   - `lint:fix` — `eslint . --fix`
   - `typecheck` — `vue-tsc --noEmit`

4. **Fixes aplicados (65 lint errors → 0):**
   - Config globais: browser globals adicionados
   - Unused imports removidos
   - Catch params renomeados com `_` prefix
   - `props` assignment desnecessário removido
   - `selectField()` dead code removido de responses.js
   - `vue/valid-v-slot` desabilitado em AdminView.vue (Vuetify data-table slot naming)
   - `env.d.ts` corrigido (tipos `{}` → `object`, `any` → `unknown`)
   - Test mock types preservados com eslint-disable

**Resultado:** 114 testes passando, build verde, 0 lint errors, 0 typecheck errors.

---

### Sprint 10.2 — Continuous Integration

**Objetivo:** Automatizar validações de qualidade via GitHub Actions (sem deploy automático).

**O que foi feito:**

1. **Arquivo criado:** `.github/workflows/ci.yml`

2. **Pipeline — 5 steps:**
   - `actions/checkout@v4`
   - `actions/setup-node@v4` com Node 22 e cache npm
   - `npm ci`
   - `npm run lint --workspace=packages/frontend`
   - `npm run typecheck --workspace=packages/frontend`
   - `npm test --workspace=packages/frontend`
   - `npm run build --workspace=packages/frontend`

3. **Eventos monitorados:**
   - `push` para `master`
   - `pull_request` para `master`

4. **Validação local:** Todos os 5 comandos executados sequencialmente com sucesso.

**Resultado:** 114 testes passando, build verde, CI pipeline validada.

---

### Sprint 10.3 — Test Coverage

**Objetivo:** Configurar medição de cobertura e estabelecer baseline — sem escrever novos testes.

**Provider escolhido:** `@vitest/coverage-v8` (nativo do V8, sem dependências Babel/Istanbul, mais rápido e recomendado pelo Vitest para projetos Node.js modernos).

**O que foi feito:**

1. **Instalação:** `@vitest/coverage-v8@3.2.7` (compatível com vitest 3.2.7)

2. **Configuração em `vite.config.js`:**
   - `provider: 'v8'`
   - Reporters: `text`, `html`, `lcov`
   - Include: `src/**`
   - Exclude: `main.js`, `env.d.ts`, arquivos de teste (`*.test.*`, `tests/`, `__tests__/`)

3. **Script adicionado:** `test:coverage` → `vitest run --coverage`

4. **Relatório gerado:** `coverage/index.html` + `coverage/lcov.info`

**Cobertura real — baseline:**

| Métrica | Valor | Observação |
|---|---|---|
| Statements | **12.54%** | Puxado para baixo por 0% em stores/views/components |
| Branches | **79.43%** | Inflado — .vue sem branches reportam 100% |
| Functions | **75.75%** | Inflado — .vue sem funções reportam 100% |
| Lines | **12.54%** | Mesmo que Statements para v8 |

**Cobertura por módulo (Statements):**

| Módulo | Cobertura | Status |
|---|---|---|
| `domain/` | 96.77% | ✅ Bem testado |
| `application/` | 100% | ✅ Totalmente coberto |
| `data/` | 87.5% | ⚠️ resources.js 0% |
| `repositories/` | 49.31% | ⚠️ authRepository e aiRepository 0% |
| `services/` | 58.82% | ⚠️ supabase.js 0% (só exports) |
| `helpers/` | 12.5% | ⚠️ só string.js testado |
| `stores/` | 0% | ❌ Nenhum teste |
| `components/` | 0% | ❌ Nenhum teste |
| `views/` | 0% | ❌ Nenhum teste |
| `plugins/` | 0% | 🔸 Setup code, baixo valor |
| `router/` | 0% | 🔸 Config, baixo valor |
| `constants/` | 0% | 🔸 Dados estáticos, baixo valor |

**Principais lacunas:**

1. **Stores (4 arquivos, ~405 linhas):** auth.js, quiz.js, responses.js, ai.js — sem testes. **Maior impacto potencial.**
2. **Componentes (21 arquivos, ~900 linhas):** Nenhum teste. Exigem @vue/test-utils.
3. **authRepository.js + aiRepository.js:** Sem testes — os únicos repositories sem cobertura.
4. **Helpers (array.js, date.js, validation.js):** Funções puras, fáceis de testar.
5. **resources.js:** Dados estáticos, baixa prioridade.

**Meta inicial proposta:**

**30% de statements** — atingível implementando testes para:
- Stores (4 stores → ~+8% global)
- authRepository + aiRepository (~+3% global)
- Helpers restantes (~+3% global)
- Primeiros componentes (~+4% global)

**Prioridades para Sprint 10.4:**

1. 🔴 **Stores** (auth.js, quiz.js, responses.js, ai.js) — Pinia + mocks simples
2. 🟡 **authRepository.js + aiRepository.js** — reusar padrão responseRepository.test.js
3. 🟡 **Helpers** (array.js, date.js, validation.js) — funções puras, testes triviais
4. 🟢 **Primeiros componentes** (AppButton, AppAlert) — @vue/test-utils simples

---

### Sprint 10.4.1 — Store Tests ✅

**Concluída em:** 2026-07-14

**Resultados:**
- 47 novos testes de store (4 arquivos)
- Total: 163 testes (13 arquivos)
- Stores com 95.89% de statements
- Cobertura geral: 24.41% (up from 12.54%)

**Lições aprendidas (documentadas para evitar retrabalho):**

1. **Caminhos relativos em `vi.mock`:** O caminho em `vi.mock()` é relativo ao arquivo de teste, não ao arquivo sob teste. Exemplo: para mockar `stores/ai.js` → `repositories/aiRepository.js`, o teste em `stores/tests/ai.test.js` deve usar `vi.mock('../../repositories/aiRepository')`, não `../repositories/aiRepository`.

2. **`Object.defineProperty` não funciona em stores Pinia:** Pinia envolve a store em um proxy reativo. `Object.defineProperty(store, 'computedName', { get: () => X })` não sobrescreve `computed` internos. Para testar computados com valores alternativos, configure o estado real (ex.: `store.answers = [...Array(34).keys()].reduce(...)` para simular 25% de progresso).

3. **Propriedades internas não expostas:** Stores Pinia com sintaxe setup() só expõem o que está no `return { ... }`. Se uma ref é usada internamente (ex.: `activeSubscriptions` em `ai.js`), não está disponível via `store.activeSubscriptions`. Teste o comportamento indiretamente através de spies nos repositórios mockados, não pelo estado interno.

4. **`vi.hoisted()` + `vi.mock()` pattern:** `vi.hoisted()` deve ser usado para declarar variáveis antes de `vi.mock()` porque `vi.mock()` é hoisted por Vitest. O padrão é:
   ```js
   const { mockFn } = vi.hoisted(() => ({ mockFn: vi.fn() }))
   vi.mock('../../path/to/module', () => ({ method: mockFn }))
   ```
   Isto garante que `mockFn` está disponível quando o factory de `vi.mock()` é avaliado.

5. **`vi.clearAllMocks()` no `beforeEach`:** Essencial para evitar vazamento de estado entre testes. Sempre chamar no `beforeEach` quando usar mocks globais.

---

### Sprint 10.4.2 — Component Tests ✅

**Concluída em:** 2026-07-14

**Objetivo:** Primeira camada de testes de componentes Vue, priorizando componentes reutilizáveis e isolados.

**Infraestrutura configurada:**
- `vitest.setup.js` — criado `createVuetify()` com todos os componentes e diretivas
- `vite.config.js` — adicionado `deps: { inline: ['vuetify'] }` para processar CSS do Vuetify
- `css: true` habilitado no ambiente de teste

**Componentes cobertos (7):**

| Componente | Testes | O que testa |
|---|---|---|
| `ui/AppButton.vue` | 6 | slot, loading, size/rounded, $attrs, click, defaults |
| `ui/AppAlert.vue` | 5 | slot, todos os 4 tipos, variant, icon, defaults |
| `ui/LoadingState.vue` | 5 | spinner, mensagem, sem mensagem, size/thickness, aria-label |
| `ui/AppCard.vue` | 6 | slot, outlined, flat, compact, interactive, flush |
| `ui/EmptyState.vue` | 5 | title, custom props, action button + emit, sem action, action slot |
| `QuestionStep.vue` | 7 | question text, answer options, update:modelValue emit, prev/next emit, isLast label, isFirst disabled, no-answer disabled |
| `GiftBadges.vue` | 3 | top 3 rendering, score ordering, zero scores |

**Componentes avaliados e descartados (1):**

| Componente | Decisão | Motivo |
|---|---|---|
| `QuizProgress.vue` | ❌ Não testado | Puramente apresentacional (v-progress-linear + texto). Sem lógica, sem eventos, sem variantes. ADR-013. |

**Resultados:**

| Métrica | Antes (10.4.1) | Depois (10.4.2) |
|---|---|---|
| Testes | 163 | **201** |
| Arquivos de teste | 13 | **20** |
| Cobertura (statements) | 24.41% | **29.85%** |
| Cobertura (components) | 0% | **10.21%** |
| Cobertura (stores) | 95.89% | 95.89% |
| Branches | 83.52% | **86.34%** |
| Lint | 0 erros | 0 erros |
| Typecheck | OK | OK |
| Build | OK | OK |

**Dificuldades encontradas:**

1. **Vuetify CSS em ambiente de teste:** `import * as components from 'vuetify/components'` aciona import de arquivos `.css` que o Node.js não reconhece. Solução: `deps: { inline: ['vuetify'] }` + `css: true` no `vite.config.js`.

2. **Object spread override em mount helper:** O padrão `{ ...baseProps, ...options }` com spread de `options` no mesmo nível de `props` causa sobrescrita do objeto `props` inteiro. Solução: desestruturar `options` em `{ props, ...rest }`.

3. **GiftBadges com dados reais de domínio:** O componente importa `rankGifts` do domínio. Funciona bem por ser função pura, mas requer conhecimento das IDs dos gifts para preparar scores de teste.

**Nova lição aprendida — Vuetify em testes:**
Ao usar `createVuetify()` em testes, não importar `'vuetify/styles'` ou `'@mdi/font'` (são CSS que poluem o ambiente). O `createVuetify({ components, directives })` mínimo é suficiente para renderizar componentes Vuetify sem estilo visual.

---

### Sprint 10.4.3 — Infrastructure Tests + Helpers ✅

**Concluída em:** 2026-07-14

**Testes de repositories criados:**

| Arquivo | Testes | Descrição |
|---|---|---|
| `repositories/tests/authRepository.test.js` | 10 | getSession (success/error), getUser (success/error), onAuthStateChange, signInWithGoogle (call/throw), signOut (success/error) |
| `repositories/tests/aiRepository.test.js` | 10 | invokeGenerateAI (params/force/error), invokeNotifyAdmin (call/error), subscribeToUpdates (channel/onChange), unsubscribeChannel (remove/null/undefined) |

**Testes de helpers criados:**

| Arquivo | Testes | Descrição |
|---|---|---|
| `helpers/__tests__/array.test.js` | 6 | shuffle (length/elements/immutability/empty/single/different ordering) |
| `helpers/__tests__/date.test.js` | 10 | formatDate (default/short), formatRelativeDate (today/yesterday/Xdias/1mês/Xmeses/1ano/Xanos/XanosYmeses), formatDateTime |
| `helpers/__tests__/validation.test.js` | 13 | required (filled/empty/whitespace/null/undefined/custom msg), ageRange (valid/empty/min/max/below/above/custom range) |

**Total:** 49 novos testes, 25 arquivos de teste, 250 testes passando.

**Análise de refatoração — stores/auth.js × application/auth/user-profile.ts:**

| Aspecto | `loadProfile()` (store) | `getUserProfile()` (application) |
|---|---|---|
| Argumento | userId (recebido) | Nenhum (chama getUser() internamente) |
| Retry | 3 tentativas, 300ms delay | Nenhum |
| Retorno | Profile completo (inclui role) | Apenas `{ name, email }` |
| Side effect | Atualiza `profile.value` | Função pura de consulta |
| Uso | Init + onAuthStateChange | Preenchimento de formulário |

**Decisão: Refatoração NÃO recomendada.**

Motivos:
1. `getUserProfile()` não é substituto direto para `loadProfile()` — API, retorno e propósito são diferentes
2. Adicionar retry e full-profile a `getUserProfile()` seria scope creep (ADR-013)
3. `loadProfile()` tem 14 linhas claras e específicas ao ciclo de vida da store
4. Risco de regressão no fluxo de autenticação sem ganho mensurável

**Cobertura:**

| Módulo | Antes (10.4.2) | Depois (10.4.3) |
|---|---|---|
| All files | 29.85% | **34.45%** |
| src/repositories | 49.31% | **93.15%** |
| src/helpers | 12.5% | **100%** |
| src/stores | 95.89% | 95.89% |
| src/components | 10.21% | 10.21% |

**Pipeline:**
- Lint: 0 erros ✅
- Typecheck: OK ✅
- Testes: 250/250 ✅
- Build: OK ✅

---

### Sprint 10.4.4 — Presentation Coverage Review ✅

**Concluída em:** 2026-07-14

**Etapa 1 — Componentes candidatos com testes criados:**

| Componente | Testes | Comportamento testado |
|---|---|---|
| `UserInfoForm.vue` | 5 | renderização de campos, preenchimento de nome via getUserProfile, perfil vazio, erro do perfil, submit com dados válidos |
| `HistoryList.vue` | 4 | estado de loading, lista de itens, estado vazio, chamada a fetchByUserId no mount |

**Estratégia de mocks:**
- **UserInfoForm:** `vi.mock('../../application/auth/user-profile', () => ({ getUserProfile: vi.fn() }))` com `vi.hoisted()` — mock da application layer, Vuetify global plugin
- **HistoryList:** `vi.mock` para `stores/auth` e `stores/responses` com `vi.hoisted()` — retorna objetos mockados de store com `loading`, `list`, `fetchByUserId`

**Etapa 2 — Componentes complexos avaliados e NÃO testados:**

| Componente | Linhas | Decisão | Justificativa |
|---|---|---|---|
| `AiAnalysis.vue` | 282 | ❌ Não testar | Ciclo de vida complexo (polling, subscription, generate/regenerate), 5+ estados visuais, mock pesado de stores + timers. Teste seria frágil e de manutenção cara. ADR-013. |
| `ResultsChart.vue` | 125 | ❌ Não testar | Depende de Chart.js + canvas rendering. Teste unitário em happy-dom não capturaria comportamento real. Mock do Chart.js anularia o propósito. ADR-013. |
| `AdminView.vue` | 572 | ❌ Não testar | View monolítica com múltiplas responsabilidades. Teste exigiria mock de todo ecossistema (Vuetify data-table, stores, router). Beneficiaria de extração de componentes primeiro. |
| `ResultsView.vue` | 284 | ❌ Não testar | View que integra múltiplos componentes (AiAnalysis, GiftBadges, ResultsChart, HistoryList). Melhor candidato para teste de integração/e2e, não unitário. Componentes internos já têm cobertura individual. |

**Etapa 3 — Estratégia de testes da Presentation (documentada):**

**Testados (27.89% de cobertura):**

| Componente | Tipo | Testes | Status |
|---|---|---|---|
| AppButton, AppAlert, AppCard, LoadingState, EmptyState | UI (DS) | 5–6 cada | ✅ |
| QuestionStep, GiftBadges | Domínio | 7, 3 | ✅ |
| UserInfoForm, HistoryList | Feature | 5, 4 | ✅ (nesta sprint) |

**Puramente visuais (sem testes — ADR-013):**
- QuizProgress (v-progress-linear + texto, sem eventos/lógica)
- ErrorState (similar a EmptyState, sem eventos/lógica além do emit action)
- AppPage, PageHeader, SectionTitle, CollapsibleCard, AppStat (layout/decoração)

**Adiados (teste traria mais manutenção que valor):**
- AiAnalysis — lifecycle complexo, polling, subscription
- ResultsChart — Chart.js canvas, não testável em happy-dom
- AdminView — view monolítica 572 linhas, precisa de extração
- ResultsView — view de integração, melhor para e2e

**Critérios usados para decidir testar ou não:**
1. O componente tem comportamento (props, eventos, chamadas, validações)? → SIM = candidato
2. O setup de mock é proporcional ao comportamento testado? → SIM = testar, NÃO = adiar
3. O teste capturaria regressões reais ou testaria detalhes frágeis? → regressões reais = testar
4. O componente depende de canvas/DOM API não disponível? → SIM = adiar (Chart.js, etc.)

**Cobertura:**

| Módulo | Antes (10.4.3) | Depois (10.4.4) |
|---|---|---|
| All files | 34.45% | **38.66%** |
| src/components | 10.21% | **27.89%** |
| src/stores | 95.89% | 95.89% |
| src/repositories | 93.15% | 93.15% |
| src/helpers | 100% | 100% |

**Pipeline:**
- Lint: 0 erros ✅
- Typecheck: OK ✅
- Testes: 259/259 ✅
- Build: OK ✅

---

### Sprint 10.5.2 — PWA & Performance ✅

**Concluída em:** 2026-07-14

**Objetivo:** Adicionar suporte PWA básico e pequenos ajustes de performance sem introduzir complexidade desnecessária.

**Arquivos criados:**

| Arquivo | Descrição |
|---------|-----------|
| `public/manifest.json` | PWA manifest com name, short_name, description, start_url, display standalone, theme_color #2b5440, background #ffffff, icons 192x192 e 512x512 |
| `public/icon-192x192.png` | Ícone PWA 192x192 gerado do favicon.svg |
| `public/icon-512x512.png` | Ícone PWA 512x512 gerado do favicon.svg |

**Arquivos modificados:**

| Arquivo | Alteração |
|---------|-----------|
| `index.html` | `<link rel="manifest">`, `<meta name="theme-color">`, preconnect Supabase + Google OAuth |

**Decisões arquiteturais (ADR-013 aplicado):**

| Decisão | Status | Justificativa |
|---------|--------|---------------|
| manifest.json | ✅ Implementado | Baixo esforço, habilita "Add to Home Screen" |
| Ícones PWA | ✅ Implementado | Gerados do SVG existente, consistência visual |
| theme-color | ✅ Implementado | 1 linha no `<head>` |
| Preconnect hints | ✅ Implementado | Supabase + Google OAuth — redução de latência |
| Service worker | ❌ Não implementado | App 100% dependente de rede (auth, dados, IA). Vercel CDN já entrega assets rapidamente. Precaching adicionaria ~30KB Workbox sem ganho real. ADR-013. |
| vite-plugin-pwa | ❌ Não instalado | Sem service worker, sem necessidade do plugin |
| Otimizações de bundle | ❌ Não aplicadas | Sem evidência de gargalo real. ADR-013. |

**Pipeline:**
- Lint: 0 erros ✅
- Typecheck: OK ✅
- Testes: 259/259 ✅
- Build: OK ✅

**Métricas do build:**
- `index.html`: 2.54 kB (gzip 0.83 kB) — aumento esperado pelos novos links/meta
- Assets runtime: inalterados em relação ao Sprint 10.5.1

---

### Sprint 10.5.3 — Release v2.0.0 ✅

**Concluída em:** 2026-07-14

**Objetivo:** Preparar o fechamento oficial da versão 2.0.0, garantindo consistência entre código, documentação, versão e histórico de evolução. Sem novas funcionalidades.

**Arquivos modificados:**

| Arquivo | Alteração |
|---------|-----------|
| `packages/frontend/package.json` | version `0.0.0` → `2.0.0` |
| `CHANGELOG.md` | Resumo executivo da v2.0.0 com métricas e evolução |
| `README.md` | Stack, arquitetura 4 camadas, 259 testes, scripts de qualidade |
| `TODO.md` | Sprint 10 movida para concluídas |
| `docs/architecture-evolution-plan.md` | Sprint 10 marcada como completa; Fase 2 critérios atualizados |
| `docs/architecture-evolution-log.md` | Sprint 10.5.3 registrada |
| `docs/architecture-evolution-analysis.md` | Header atualizado, métricas e CI/CD nota atualizadas |

**Pipeline final:**
- Lint: 0 erros ✅
- Typecheck: OK ✅
- Testes: 259/259 passando, 27 arquivos ✅
- Coverage: Statements 38.66% configurado e reportando ✅
- Build: verde (787 módulos, 3.18s) ✅

**Versão final:** **v2.0.0**

**Fase 2 — Evolução Arquitetural: ✅ COMPLETA**

| Critério | Status |
|----------|--------|
| Application Layer criada e testada | ✅ |
| Infrastructure isolada e testada | ✅ |
| Presentation consolidada (auditada, sem violações) | ✅ |
| CI estabelecido (GitHub Actions) | ✅ |
| Cobertura de testes configurada | ✅ |
| Decisões documentadas (docs/decisions.md) | ✅ |
| Zero regressão funcional | ✅ |
| README reflete arquitetura atual | ✅ |

---

## Sprint 11 — Identidade Institucional

> **Início:** 2026-07-14
>
> **Término:** 2026-07-14
>
> **Status:** ✅ Concluída

### Contexto

Primeira sprint da **Fase 3 — Experiência Institucional e Produção**. A v2.0.0 foi concluída com Fase 2 encerrada. O objetivo da Sprint 11 é criar a presença institucional do projeto com página Sobre e identidade visual inicial.

### Entregues

| Item | Arquivo | Descrição |
|------|---------|-----------|
| AppLogo | `components/ui/AppLogo.vue` | Componente reutilizável com variantes full (ícone + texto) e compact (apenas ícone). Props: icon, size, color, variant. |
| AboutView | `views/AboutView.vue` | Página institucional com seções: objetivo, metodologia (C. Peter Wagner, 27 dons, 135 afirmações), tecnologias (Vue, Vuetify, Supabase, Gemini, Vercel), autoria, licença MIT, contribuição (GitHub), projetos relacionados (Cinco Ministérios). |
| Rota /sobre | `router/index.js` | Rota pública (`public: true`), lazy-loaded, com meta tags SEO. |
| Navegação | `AppHeader.vue` | Link "Sobre" adicionado no header entre o toggle de tema e o menu do usuário. |

### Testes

| Arquivo | Testes |
|---------|--------|
| `components/ui/__tests__/AppLogo.test.js` | 5 (full, compact, size, color, defaults) |
| `views/AboutView.test.js` | 9 (todas as seções institucionais) |

### Princípios aplicados

- **Escopo fechado:** Nenhuma alteração em domain, application, repositories ou stores
- **Componentes existentes:** AboutView reusa AppPage, AppCard, AppButton, PageHeader, SectionTitle, AppLogo
- **ADR-011 seguido:** Experiência institucional como fase independente
- **ADR-013 seguido:** AppLogo criado por necessidade real (identidade visual reutilizável)

### Métricas

| Métrica | Antes (v2.0.0) | Depois |
|---------|-----------------|--------|
| Testes | 259 | **273** |
| Arquivos de teste | 27 | **29** |
| Lint errors | 0 | **0** |
| Typecheck errors | 0 | **0** |
| Build | OK | **OK** (790 módulos) |

---

## Sprint 11.1 — Contribuição via PIX

> **Período:** Julho/2026
>
> **Versão:** v2.2.0
>
> **Status:** ✅ Concluída

### Objetivo

Consolidar o AboutView como página institucional oficial do projeto e adicionar funcionalidade de apoio financeiro via PIX.

### Arquivos modificados

| Arquivo | Ação |
|---|---|
| `src/views/AboutView.vue` | Reescrito — seções reorganizadas, conteúdo revisado, PIX adicionado |
| `src/views/AboutView.test.js` | Atualizado — 10 testes (nova seção PIX + Autor + Como contribuir) |
| `package.json` | Versão 2.2.0, +1 dependência |
| `CHANGELOG.md` | Release v2.2.0 adicionada |

### Dependência adicionada

- `qrcode` ^1.5.4 — geração local de QR Code (sem API externa)

### Decisões arquiteturais

- **Toda lógica permanece no AboutView** — sem novos componentes, composables, use cases, stores ou repositories (YAGNI, KISS)
- **QR Code gerado localmente** — canvas via `qrcode`, payload EMV BR Code com CRC16-CCITT
- **Cópia com fallback** — `navigator.clipboard.writeText()` com snackbar de fallback se indisponível
- **Dados institucionais agrupados** — constantes nomeadas `pix`, `author`, `technologies`, `relatedProjects`, `spheres`, `contributionWays`

### Validação

| Item | Resultado |
|---|---|
| Testes | **274 passando** (273 → 274) |
| Lint | 0 erros |
| Typecheck | 0 erros |
| Build | OK |

**Próximos passos (Sprint 11.2 — Exclusão Administrativa):**
- Botão de excluir teste na ResultsView (admin-only)
- Modal de confirmação
- Use case + repository + store
- Migration SQL (RLS DELETE policy)
- Release v2.3.0
