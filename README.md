# Dons Espirituais

Aplicação web para descoberta e análise de dons espirituais baseada no modelo de C. Peter Wagner (27 dons, 135 afirmações).

## Stack

- **Frontend:** Vue 3 + Vite + Vuetify 3 + Pinia + Vue Router
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Testes:** Vitest + Vue Test Utils + happy-dom (259 testes)
- **Análise IA:** Gemini via Supabase Edge Functions
- **Qualidade:** ESLint + vue-tsc + CI (GitHub Actions)

## Arquitetura (4 camadas)

```
packages/frontend/src/
  domain/           # Regras de negócio PURAS (TS) — spiritual-gifts, scoring
  application/      # Casos de uso — submit-quiz, quiz-session, user-profile
  infrastructure/   # Repositories — response, ai, auth, user (Supabase)
  presentation/     # Views, Components (ui/ + feature), Stores (Pinia), Router
  helpers/          # Utilitários puros — array, date, validation, string
  constants/        # Constantes — escala Likert
  data/             # Dados estáticos — 135 perguntas
```

## Desenvolvimento

```bash
npm install
npm run dev --workspace=packages/frontend
npm run lint --workspace=packages/frontend
npm run typecheck --workspace=packages/frontend
npm run test --workspace=packages/frontend
npm run test:coverage --workspace=packages/frontend
npm run build --workspace=packages/frontend
```

## API e Autenticação

Variáveis de ambiente necessárias (`.env`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Documentação

- `docs/architecture-evolution-plan.md` — plano de evolução arquitetural (Sprints 6–13)
- `docs/architecture-evolution-analysis.md` — análise arquitetural detalhada
- `docs/architecture-evolution-log.md` — log de execução de todas as sprints
- `docs/decisions.md` — decisões técnicas (ADRs 1–14)
- `docs/design_plan.md` — Design System e tokens CSS
- `docs/gift-system-plan*` — histórico da refatoração do domínio (Sprints 0–5)
