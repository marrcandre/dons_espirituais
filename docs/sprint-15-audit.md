# Sprint 15 — Auditoria Técnica

> **Início:** 2026-07-17
> **Branch:** `sprint-15-ux-performance`
> **Release:** v2.7.0
> **Objetivo:** UX & Performance (Phase 5: Product Polish)

---

## Estado Inicial (v2.7.0)

### Qualidade

| Métrica | Valor |
|---------|-------|
| Testes | 317 passando (33 arquivos) |
| Lint | 0 erros (2 warnings em coverage/) |
| Typecheck | 0 erros |
| Build | OK (warning chunk >500 kB) |
| CI | Funcionando |

### Arquitetura

```
packages/frontend/src/
  domain/           # TS puro, SSOT consolidado
  application/      # Casos de uso (quiz, auth)
  infrastructure/   # (vazio — repositories em src/repositories/)
  presentation/     # Views, Components, Stores, Router
  services/         # Legacy: supabase.js, supabaseQuery.js
  repositories/     # 4 repositórios (response, ai, auth, user)
  helpers/          # Utilitários puros
  constants/        # Escala Likert
  data/             # 135 perguntas, resources
  config/           # Metadados centralizados
```

### Débitos Identificados

| # | Débito | Local | Severidade |
|---|--------|-------|------------|
| D01 | `stores/auth.js` replica lógica de `user-profile.ts` | stores/auth.js | Alta |
| D02 | `services/` com acesso Supabase fora da infrastructure | services/ | Alta |
| D03 | Test directory naming inconsistente (`tests` vs `__tests__`) | Vários | Alta |
| D04 | `scoring.test.js` em `services/__tests__/` em vez de `domain/` | services/__tests__ | Alta |
| D05 | 24+ `<v-btn>` raw sem AppButton | Vários componentes | Média |
| D06 | 6+ `<v-alert>` raw sem AppAlert | Vários | Média |
| D07 | LoadingState/EmptyState/ErrorState não utilizados | HistoryList, AiAnalysis | Média |
| D08 | Legibilidade análise IA comprometida | ResultsView | Média |
| D09 | Bundle sem code splitting (chunk >500 kB) | Router | Média |
| D10 | Vercel Analytics não configurado | monitoring.md | Baixa |
| D11 | Sentry não configurado | monitoring.md | Baixa |
| D12 | Responsividade não auditada formalmente | Todas as views | Baixa |

---

## Decisões Arquiteturais da Sprint

### ADR-S15-001: Auth store deve delegar para application layer

**Decisão:** `stores/auth.js` não deve conter lógica de busca/atualização de perfil. Toda regra de negócio relacionada a perfil de usuário reside em `application/auth/user-profile.ts`. A store mantém apenas estado global e ações de alto nível.

**Arquivos afetados:**
- `stores/auth.js` — remover duplicação
- `application/auth/user-profile.ts` — inalterado (fonte única)

### ADR-S15-002: Infrastructure é a camada oficial de acesso ao Supabase

**Decisão:** Os arquivos `services/supabase.js` e `services/supabaseQuery.js` são movidos para `infrastructure/supabase/`. A camada `services/` é eliminada. Nenhum acesso direto ao Supabase fora da infrastructure.

**Estrutura alvo:**
```
infrastructure/supabase/
  client.ts        # Cliente Supabase (ex-services/supabase.js)
  queries.ts       # Utilitário de query (ex-services/supabaseQuery.js)
```

**Arquivos afetados:**
- `services/supabase.js` → `infrastructure/supabase/client.ts`
- `services/supabaseQuery.js` → `infrastructure/supabase/queries.ts`
- `repositories/*.js` — ajustar imports
- `services/` — removido após migração

### ADR-S15-003: Testes organizados por camada arquitetural

**Decisão:** Todo teste deve estar no diretório `__tests__/` da camada correspondente. Padronizar `tests` → `__tests__` onde existir inconsistência. `scoring.test.js` move de `services/__tests__/` para `domain/__tests__/`.

**Arquivos afetados:**
- `services/__tests__/scoring.test.js` → `domain/__tests__/scoring.test.js`
- Diretórios `tests/` renomeados para `__tests__/`

### ADR-S15-004: Componentes próprios não usam Vuetify diretamente

**Decisão:** Todo componente próprio deve usar `<AppButton>` em vez de `<v-btn>` e `<AppAlert>` em vez de `<v-alert>`. A regra é documentada em `CONTRIBUTING.md`. Exceção: componentes Vuetify estruturais (v-app, v-main, v-card, v-list, etc.) continuam permitidos conforme ADR-009.

---

## Arquivos Modificados

| Fase | Arquivo | Ação | Status |
|------|---------|------|--------|
| 0 | docs/sprint-15-audit.md | Criado | ✅ |
| 1.1 | application/auth/ports.ts | Expandido: UserProfile com id, role | ✅ |
| 1.1 | application/auth/user-profile.ts | Refatorado: retry, retorna role | ✅ |
| 1.1 | application/auth/tests/user-profile.test.ts | Atualizado: 6 testes (retry, role) | ✅ |
| 1.1 | stores/auth.js | Refatorado: usa application layer, remove userRepository | ✅ |
| 1.1 | stores/tests/auth.test.js | Atualizado: mocks application layer | ✅ |
| 1.2 | infrastructure/supabase/client.ts | Criado (TS, ex-services/supabase.js) | ✅ |
| 1.2 | infrastructure/supabase/queries.ts | Criado (TS, ex-services/supabaseQuery.js) | ✅ |
| 1.2 | repositories/authRepository.js | Import atualizado → infrastructure/supabase | ✅ |
| 1.2 | repositories/aiRepository.js | Import atualizado → infrastructure/supabase | ✅ |
| 1.2 | repositories/userRepository.js | Import atualizado → infrastructure/supabase | ✅ |
| 1.2 | repositories/responseRepository.js | Import atualizado → infrastructure/supabase | ✅ |
| 1.2 | repositories/tests/*.test.js (4) | Mock paths atualizados | ✅ |
| 1.2 | services/supabase.js | Removido | ✅ |
| 1.2 | services/supabaseQuery.js | Removido | ✅ |
| 1.3 | services/__tests__/scoring.test.js | Movido → domain/__tests__/scoring.test.js | ✅ |
| 1.3 | repositories/tests/ (4 arquivos) | Renomeado → __tests__/ | ✅ |
| 1.3 | stores/tests/ (4 arquivos) | Renomeado → __tests__/ | ✅ |
| 1.3 | application/auth/tests/ | Renomeado → __tests__/ | ✅ |
| 1.3 | services/ | Removido (vazio após migrações) | ✅ |
| 2.4 | AppHeader.vue | 5 v-btn → AppButton | ✅ |
| 2.4 | CollapsibleCard.vue | 1 v-btn → AppButton | ✅ |
| 2.4 | UserInfoForm.vue | 1 v-btn → AppButton | ✅ |
| 2.4 | QuestionStep.vue | 3 v-btn → AppButton | ✅ |
| 2.4 | AiAnalysis.vue | 3 v-btn → AppButton, 3 v-alert → AppAlert | ✅ |
| 2.4 | ResultsView.vue | 8 v-btn → AppButton, 1 v-alert → AppAlert | ✅ |
| 2.4 | AdminView.vue | 4 v-btn → AppButton, 1 v-alert → AppAlert | ✅ |
| 2.4 | LoginView.vue | 1 v-alert → AppAlert | ✅ |

---

## Impactos

### 1.1 — Auth store migrada para application layer

**Mudanças:**
- `UserProfile` expandido com `id` e `role` (ports.ts)
- `getUserProfile()` agora inclui retry (3 tentativas, 300ms delay) para lidar com propagação assíncrona do perfil
- `stores/auth.js` não importa mais `userRepository` — delega profile para `getUserProfile()` da application layer
- `stores/auth.js` não contém mais `loadProfile()` — lógica de retry movida para application layer

**Risco:** Nenhum. Retry com `catch(() => null)` em vez de `try/catch` individual por tentativa → mais resiliente que a implementação anterior.

**Testes:** 318 passando (+1 novo teste de retry).

### 1.2 — Infrastructure Supabase criada

**Mudanças:**
- `services/supabase.js` → `infrastructure/supabase/client.ts` (convertido para TypeScript)
- `services/supabaseQuery.js` → `infrastructure/supabase/queries.ts` (convertido para TypeScript)
- 4 repositórios e 4 arquivos de teste com imports ajustados
- Camada `services/` eliminada (resta apenas `__tests__/scoring.test.js` — será movido na Fase 1.3)
- Nenhum acesso direto ao Supabase fora da infrastructure

**Impacto arquitetural:** A camada `infrastructure/` agora contém todo o acesso ao Supabase, alinhado ao fluxo de dependências da arquitetura em 4 camadas. O diretório `services/` foi eliminado como camada.

### 1.3 — Testes organizados por camada

**Mudanças:**
- `scoring.test.js` movido de `services/__tests__/` para `domain/__tests__/` — testa `domain/scoring.ts`, agora está na camada correta
- 3 diretórios padronizados: `tests` → `__tests__` (repositories, stores, application/auth)
- `services/` removido por completo (vazio após movimentações)

**Estrutura final de testes:**
```
src/
  __tests__/                     # App.test.js
  domain/__tests__/              # scoring.test.js (corrigido)
  application/__tests__/         # quiz-session, submit-quiz
  application/auth/__tests__/    # user-profile (padronizado)
  components/__tests__/          # 5 feature components
  components/ui/__tests__/       # 7 DS components
  data/__tests__/                # gifts, questions
  helpers/__tests__/             # array, date, string, validation
  infrastructure/                # repository tests em __tests__/ (padronizado)
  stores/__tests__/              # 4 stores (padronizado)
  views/                         # co-located .test.js (mantido)
```

**Critério de aceite:** 100% dos diretórios de teste usam `__tests__`. Nenhum arquivo de teste fora da camada correspondente.

---

## Histórico de Execução

| Fase | Data | Status |
|------|------|--------|
| 0 — Preparação | 2026-07-17 | ✅ |
| 1 — Correções arquiteturais | — | ⏳ |
| 2 — Design System | — | ⏳ |
| 3 — UX | — | ⏳ |
| 4 — Performance | — | ⏳ |
| 5 — Observabilidade | — | ⏳ |
| 6 — Auditoria final | — | ⏳ |
