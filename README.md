# Dons Espirituais

Aplicação web para descoberta e análise de dons espirituais baseada no modelo de C. Peter Wagner (27 dons, 135 afirmações).

## Stack

- **Frontend:** Vue 3 + Vite + Vuetify + TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Testes:** Vitest (78 testes)
- **Análise IA:** OpenAI via Supabase Edge Functions

## Estrutura

```
packages/frontend/src/
  domain/           # Regras de negócio (fonte única dos dons, scoring)
  constants/        # Constantes de apresentação (escala Likert)
  data/             # Dados estáticos (135 perguntas)
  helpers/          # Utilitários puros
  services/         # Serviços de infraestrutura
  stores/           # Estado (Pinia)
  repositories/     # Camada de dados (Supabase)
  components/       # Componentes Vue
  views/            # Páginas
```

## Desenvolvimento

```bash
npm install
npm run dev --workspace=packages/frontend
npm run test --workspace=packages/frontend
npm run build --workspace=packages/frontend
```

## API e Autenticação

Variáveis de ambiente necessárias (`.env`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Documentação

- `docs/gift-system-plan.md` — plano de refatoração do domínio
- `docs/gift-system-plan-analysis.md` — análise da auditoria
- `docs/gift-system-plan-log.md` — log de execução
