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
