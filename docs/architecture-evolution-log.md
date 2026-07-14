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
- [ ] **8.3** `repositories/__tests__/responseRepository.test.js` com 7+ testes
- [ ] **8.3** `repositories/__tests__/userRepository.test.js` com 2+ testes
- [ ] **8.4** `services/aiAnalysis.js` removido (confirmado sem uso)
- [ ] **8.5** `quizStore.checkSavedState()` delegado a `quizSession.checkSavedSession()`
- [ ] **8.6** Avaliação documentada — decisão de manter estado atual

### Resultados esperados

| Métrica | Antes (v1.7.0) | Após 8.1–8.2 | Meta Sprint 8 |
|---------|----------------|----------------|---------------|
| Testes totais | 92 | **97** | ~105+ |
| Arquivos de teste | 6 | **7** | 9 |
| Cobertura (infrastructure) | 0% | 0% | ~85% |
| Cobertura (geral) | ~40% | ~40% | ~55% |
| Violações de camada | 1 (UserInfoForm) | **0** | 0 |
| Inconsistência de timeout | 2 métodos | **0** | 0 |
| Código órfão | services/aiAnalysis.js | ainda presente | removido |
| Duplicação checkSavedState | 2 implementações | ainda presente | 1 (centralizada) |

### Critérios de aceite

- [x] UserInfoForm não importa repositories
- [x] Todos os 7 métodos de responseRepository usam `runSupabaseQuery`
- [ ] 9+ testes de infrastructure passando
- [ ] `services/aiAnalysis.js` removido (se confirmado sem uso)
- [ ] `quizStore.checkSavedState()` não replica lógica de sessão
- [ ] Decisão de desacoplamento registrada
- [ ] 105+ testes passando
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
