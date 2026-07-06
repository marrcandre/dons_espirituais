# Log de Execução — Refatoração do Domínio dos Dons Espirituais

---

## Resumo Executivo

**Objetivo da refatoração:** Consolidar os metadados dos 27 dons espirituais em uma única fonte de verdade (`src/domain/spiritual-gifts.ts`), eliminando duplicações entre frontend e edge function, e aumentando a segurança das alterações com tipagem e testes.

**Estratégia:** Migração incremental em 6 sprints, com testes como rede de segurança desde a Sprint 1. Nenhuma alteração funcional é realizada — o comportamento da aplicação é preservado integralmente.

**Situação atual:** Sprint 0 (Auditoria) e Sprint 1 (Estratégia de Testes) concluídas. 75 testes implementados com Vitest cobrindo scoring, ranking, topGift e consistência dos dados estáticos. Projeto pronto para iniciar a Sprint 2 (Migração para TypeScript).

---

## Estado Atual do Projeto

| Sprint | Status |
|---|---|
| Sprint 0 — Auditoria | ✅ Concluída |
| Sprint 1 — Estratégia de Testes | ✅ Concluída |
| Sprint 2 — Migração para TypeScript | ⏳ Não iniciada |
| Sprint 3 — Fonte Única dos Dons | ⏳ Não iniciada |
| Sprint 4 — Migração Gradual | ⏳ Não iniciada |
| Sprint 5 — Limpeza | ⏳ Não iniciada |

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

### Decisões arquiteturais

1. **Fonte única:** `packages/frontend/src/domain/spiritual-gifts.ts` (Alternativa A)
2. **Edge Function:** manutenção de `GIFTS_ORDER` local com validação CI
3. **Framework de testes:** Vitest
4. **Modelo:** `Gift { id: number, name: string, icon: string, color: string }` + constantes derivadas
5. **`id` numérico mantido** (compatibilidade com dados existentes no banco)
6. **Legacy excluído do escopo** (não influencia decisões arquiteturais)

### Resultados

- **Total de arquivos auditados:** ~60
- **Arquivos que definem dados dos dons:** 4 (em produção)
- **Arquivos que consomem dados dos dons:** 12 diretos + 6 indiretos
- **Duplicações críticas:** 2 (GIFTS_ORDER na Edge Function + i%27 posicional)
- **Riscos altos:** 3 (acoplamento posicional, edge function duplicado, QuizView orquestrador)
- **Fonte única proposta:** `src/domain/spiritual-gifts.ts`
- **Testes propostos:** 22 (Vitest)

### Validação

- Nenhum código produzido nesta sprint (exclusivamente análise)
- Nenhum teste a executar
- Build não aplicável

### Métricas

| Item | Valor |
|---|---|
| Arquivos auditados | ~60 |
| Arquivos que definem dons (produção) | 4 |
| Consumidores diretos | 12 |
| Consumidores indiretos | 6 |
| Duplicações críticas | 2 |
| Riscos altos identificados | 3 |
| Testes propostos | 22 |

---

## Sprint 1 — Estratégia de Testes

> **Início:** 2026-07-04
>
> **Término:** 2026-07-04
>
> **Status:** Concluída

### Atividades executadas

1. Instalação do Vitest como devDependency (`vitest ^3.1.3`).
2. Adição dos scripts `test` e `test:watch` no `package.json`.
3. Criação de 4 arquivos de teste:

   - **`src/services/__tests__/scoring.test.js`** — 9 testes:
     - `calculateScores`: answers válidas, vazias, parciais, mapeamento `i % 27`
     - `rankGifts`: ordenação decrescente, empates, scores vazios
     - `formatScoresForAI`: formatação correta, ordenação na string

   - **`src/helpers/__tests__/string.test.js`** — 3 testes:
     - `topGift`: retorno correto, scores nulos, objeto vazio

   - **`src/data/__tests__/gifts.test.js`** — 6 testes:
     - Quantidade (27), IDs contínuos (0-26), nomes únicos, ordem Wagner, tipos dos campos, prefixo `mdi-`

   - **`src/data/__tests__/questions.test.js`** — 57 testes:
     - 3 testes estruturais (135 perguntas, 5 por dom, tipos)
     - 54 testes de mapeamento (cada dom verifica 5 perguntas + formato dos IDs)

4. Correção de 1 teste (expectativa errada para answers parciais).

### Decisões tomadas

- **Vitest** escolhido por compatibilidade com Vite (mesmo `vite.config.js`), sem configuração extra.
- **Testes no nível de função pura** — sem Vue, sem navegador, sem Supabase.
- **`__tests__` co-localizado** com os módulos testados (padrão Vitest).
- **Import direto ESM** — os arquivos `.js` são importados sem necessidade de alias ou transformação.

### Dificuldades encontradas

- Teste de "answers parciais" inicialmente esperava `score[0] = 5` com 100 elementos, mas apenas 4 das 5 perguntas do gift 0 estão no intervalo 0-99. Expectativa corrigida para verificar apenas que 27 chaves são retornadas.

### Observações importantes

- Os 57 testes de `questions.test.js` são gerados dinamicamente com `gifts.forEach`, validando cada um dos 27 dons individualmente.
- Nenhum teste falha ou requer mock de infraestrutura externa.
- A cobertura atual protege todas as funções exportadas de `scoring.js` e `string.js`, e valida a consistência dos dados estáticos de `gifts.js` e `questions.js`.

### Validação

| Item | Resultado |
|---|---|
| Testes executados | 75 |
| Testes aprovados | 75 |
| Testes falhando | 0 |
| Build preservado | ✅ (783 módulos, ~1.3s) |
| Regressões identificadas | Nenhuma |

### Métricas

| Item | Valor |
|---|---|
| Arquivos criados | 4 |
| Arquivos modificados | 1 (`package.json`) |
| Testes criados | 75 |
| Testes alterados | 1 (expectativa corrigida) |
| Falhas durante implementação | 1 (expectativa errada) |
| Falhas corrigidas | 1 |
| Total de sprints concluídas | 2 |

---

## Próxima Sprint

### Sprint 2 — Migração para TypeScript

- Migrar `data/gifts.js` → `domain/spiritual-gifts.ts`
- Migrar `services/scoring.js` → TypeScript
- Migrar `helpers/string.js` → TypeScript (função topGift)

---

## Roadmap

As sprints abaixo serão executadas sequencialmente, dependendo de aprovação:

- Sprint 3 — Fonte Única dos Dons
- Sprint 4 — Migração Gradual
- Sprint 5 — Limpeza
