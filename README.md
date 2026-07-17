# Dons Espirituais

Aplicação web para descoberta e análise de dons espirituais baseada no modelo de C. Peter Wagner (27 dons, 135 afirmações).

## Stack

- **Frontend:** Vue 3 + Vite + Vuetify 3 + Pinia + Vue Router
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Testes:** Vitest + Vue Test Utils + happy-dom (348 testes)
- **Análise IA:** Gemini via Supabase Edge Functions
- **Qualidade:** ESLint + vue-tsc + CI (GitHub Actions)
- **Deploy:** Vercel (integração nativa GitHub)

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

## Variáveis de ambiente

### Frontend

| Variável | Obrigatória | Descrição |
|----------|:-----------:|-----------|
| `VITE_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave anônima do Supabase |

### Edge Functions (Supabase)

| Variável | Descrição |
|----------|-----------|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (não expor no frontend) |
| `GEMINI_API_KEY` | Chave da API Gemini |
| `RESEND_API_KEY` | Chave da API Resend (e-mail) |
| `ADMIN_EMAIL` | E-mail do administrador |

## CI/CD

### Continuous Integration (GitHub Actions)

Push/PR na `master` executa automaticamente:

```
lint → typecheck → test → build
```

Workflow: `.github/workflows/ci.yml`

### Continuous Deployment (Vercel)

O deploy é feito via integração nativa Vercel + GitHub:

| Evento | Ação | Ambiente |
|--------|------|----------|
| Push na `master` | Deploy automático | Produção |
| PR aberto/atualizado | Deploy automático | Preview |

**URL de produção:** [https://dons-espirituais.vercel.app](https://dons-espirituais.vercel.app)

## Monitoramento

| Ferramenta | Status | Função |
|------------|--------|--------|
| UptimeRobot | ✅ Ativo | Disponibilidade das Edge Functions |
| Vercel Analytics | ✅ Ativo | Métricas de uso e performance |
| Vercel Speed Insights | ✅ Ativo | Core Web Vitals (LCP, CLS, INP) |
| Sentry | ✅ Implementado | Error tracking (condicional ao DSN) |

Veja `docs/monitoring.md` para detalhes e recomendações.

## Documentação

- `docs/deploy.md` — fluxo de deploy, variáveis de ambiente, checklist
- `docs/monitoring.md` — monitoramento atual e recomendações
- `docs/architecture-evolution-plan.md` — plano de evolução arquitetural (Sprints 6–13)
- `docs/architecture-evolution-analysis.md` — análise arquitetural detalhada
- `docs/architecture-evolution-log.md` — log de execução de todas as sprints
- `docs/decisions.md` — decisões técnicas (ADRs 1–16)
- `docs/design_plan.md` — Design System e tokens CSS
- `docs/gift-system-plan*` — histórico da refatoração do domínio (Sprints 0–5)
