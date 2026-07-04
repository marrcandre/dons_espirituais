# Log de Execução — Refatoração do Domínio dos Dons Espirituais

---

## Sprint 0 — Auditoria

> **Início:** 2026-07-04
>
> **Término:** 2026-07-04
>
> **Status:** Concluída

### Atividades executadas

1. Leitura dos documentos de planejamento (`gift-system-plan.md`, `gift-system-plan-analysis.md`, `gift-system-plan-log.md`).

2. Auditoria completa dos diretórios:
   - `packages/frontend/src/data/` — 3 arquivos (gifts.js, questions.js, resources.js)
   - `packages/frontend/src/services/` — 4 arquivos (scoring.js, aiAnalysis.js, supabase.js, supabaseQuery.js)
   - `packages/frontend/src/stores/` — 4 arquivos (quiz.js, responses.js, ai.js, auth.js)
   - `packages/frontend/src/helpers/` — 4 arquivos (string.js, array.js, validation.js, date.js)
   - `packages/frontend/src/components/` — 21 arquivos (10 domain + 11 ui/)
   - `packages/frontend/src/views/` — 7 arquivos
   - `packages/frontend/src/repositories/` — 4 arquivos
   - `packages/frontend/src/` — App.vue, main.js, plugins/, router/, styles/

3. Auditoria dos diretórios fora do frontend:
   - `supabase/` — migrations, edge functions (generate-ai, retry-ai-analysis, notify-admin)
   - `scripts/` — import_to_supabase.py, backfill-ai.js
   - `legacy/` — main.py, CSV files, prompt.txt

4. Identificação de todas as ocorrências de dados dos dons espirituais.

5. Mapeamento de dependências entre módulos.

6. Identificação de duplicações (4 listas de 27 dons + CSVs legacy com nomes alternativos).

7. Identificação de riscos (acoplamento posicional i%27, GIFTS_ORDER duplicado no edge function, QuizView como ponto único de orquestração).

8. Elaboração da proposta de fonte única (`src/domain/spiritual-gifts.ts`).

### Revisão complementar

1. Análise comparativa de 3 alternativas arquiteturais (domain/, shared/, geração automática).

2. Decisão arquitetural: **Alternativa A** (`src/domain/spiritual-gifts.ts`) + CI validation para Edge Function.

3. Estratégia de testes: 22 testes propostos (17 alta prioridade, 3 média, 2 baixa) usando Vitest.

4. Dívida técnica classificada (5 alta, 7 média, 4 baixa).

5. Modelo do domínio reavaliado: `id` numérico mantido, `slug`/`category`/`description` rejeitados (YAGNI), `icon`/`color` mantidos pragmaticamente.

6. Documentos atualizados: `gift-system-plan-analysis.md` e `gift-system-plan-log.md`.

### Resultados

- **Total de arquivos auditados:** ~60
- **Arquivos que definem dados dos dons:** 4 (em produção)
- **Arquivos que consomem dados dos dons:** 12 diretos + 6 indiretos
- **Duplicações críticas:** 2 (GIFTS_ORDER na Edge Function + i%27 posicional)
- **Riscos altos:** 3 (acoplamento posicional, edge function duplicado, QuizView orquestrador)
- **Fonte única proposta:** `src/domain/spiritual-gifts.ts`
- **Testes propostos:** 22 (Vitest)

### Decisões arquiteturais

1. **Fonte única:** `packages/frontend/src/domain/spiritual-gifts.ts` (Alternativa A)
2. **Edge Function:** manutenção de `GIFTS_ORDER` local com validação CI
3. **Framework de testes:** Vitest
4. **Modelo:** `Gift { id: number, name: string, icon: string, color: string }` + constantes derivadas
5. **`id` numérico mantido** (compatibilidade com dados existentes no banco)
6. **Legacy excluído do escopo** (não influencia decisões arquiteturais)

### Próximos passos

- [ ] Sprint 1 — Estratégia de Testes:
  - Instalar Vitest (`npm install -D vitest --workspace=packages/frontend`)
  - Criar testes 1-4: `calculateScores`
  - Criar testes 5-7: `rankGifts`
  - Criar testes 8-9: `formatScoresForAI`
  - Criar testes 10-11: `topGift`
  - Criar testes 12-16: Domínio (IDs, nomes, ordem, perguntas, mapeamento)
- [ ] Sprint 2 — Migração para TypeScript (após aprovação)
- [ ] Sprint 3 — Fonte Única dos Dons
- [ ] Sprint 4 — Migração Gradual
- [ ] Sprint 5 — Limpeza
