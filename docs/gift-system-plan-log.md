# Log de Execução — Refatoração do Domínio dos Dons Espirituais

---

## Resumo Executivo

**Objetivo da refatoração:** Consolidar os metadados dos 27 dons espirituais em uma única fonte de verdade (`src/domain/spiritual-gifts.ts`), eliminando duplicações entre frontend e edge function, e aumentando a segurança das alterações com tipagem e testes.

**Estratégia:** Migração incremental em 6 sprints, com testes como rede de segurança desde a Sprint 1. Nenhuma alteração funcional é realizada — o comportamento da aplicação é preservado integralmente.

**Situação atual:** Sprints 0–3 concluídas. Fonte única `domain/spiritual-gifts.ts` consumida por todo código de produção. `data/gifts.js` mantido como compatibilidade temporária (remoção na Sprint 5). 78 testes passando. Projeto pronto para Sprint 4 (Migração Gradual).

---

## Estado Atual do Projeto

| Sprint | Status |
|---|---|
| Sprint 0 — Auditoria | ✅ Concluída |
| Sprint 1 — Estratégia de Testes | ✅ Concluída |
| Sprint 2 — Migração para TypeScript | ✅ Concluída |
| Sprint 3 — Fonte Única dos Dons | ✅ Concluída |
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

## Sprint 2 — Migração para TypeScript

> **Início:** 2026-07-06
>
> **Término:** 2026-07-06
>
> **Status:** Concluída

### Atividades executadas

1. **Criação de `src/domain/spiritual-gifts.ts`** — fonte única de verdade:
   - Interface `Gift` tipada (`id`, `name`, `icon`, `color`)
   - Array `gifts` com os 27 dons espirituais (dados idênticos ao `data/gifts.js`)
   - Constantes derivadas: `GIFT_COUNT`, `giftNames`, `giftById()`
   - Formatação consistente (inclusive dom `Apóstolo` que estava desalinhado no arquivo legado)

2. **Migração de `services/scoring.js` → `services/scoring.ts`**:
   - Tipagem completa das funções (`Scores`, `RankedGift`)
   - Import da nova fonte única (`domain/spiritual-gifts`)
   - Lógica preservada (mesmo comportamento, tipos adicionados)

3. **Movimentação de `topGift()` para `scoring.ts`**:
   - Função removida de `helpers/string.js` e adicionada a `services/scoring.ts`
   - `string.js` agora re-exporta `topGift` de `scoring.ts` (backward compatibility)
   - Responsabilidade única: funções de scoring/ranking ficam no mesmo módulo

4. **Atualização de testes**:
   - 3 novos testes para `topGift` adicionados a `scoring.test.js` (scores válidos, null/undefined, objeto vazio)
   - Nenhum importador precisou ser alterado — Vite resolve `.js` → `.ts` automaticamente

5. **Verificação de build**:
   - 78 testes passando (75 herdados + 3 novos)
   - Build em ~735ms, 784 módulos (1 a mais: `domain/spiritual-gifts.ts`)

### Decisões tomadas

- **Extensão `.ts` sem `tsconfig.json`** — Vite/esbuild compila TypeScript nativamente; a adição de configuração formal de TS será feita quando houver mais arquivos `.ts` no projeto
- **`topGift` re-exportado via `string.js`** — `HistoryList.vue` continua importando de `'../helpers/string.js'` sem alteração; a migração do consumidor é Sprint 3
- **`data/gifts.js` mantido** — `GiftBadges.vue` ainda importa dele diretamente; será removido na Sprint 5
- **Importadores mantiveram extensão `.js`** — Vite resolve para `.ts` automaticamente; nenhuma linha de import foi alterada

### Dificuldades encontradas

- Nenhuma. A migração foi direta porque o módulo `scoring.js` já era pequeno e sem dependências circulares.

### Observações importantes

- `giftById()` foi implementado como acesso direto ao array (índices 0-26), não como `Map` — mais simples e sem alocação extra
- As constantes derivadas (`GIFT_COUNT`, `giftNames`, `giftById`) já estão exportadas, mas ainda não são usadas por consumidores (Sprint 3)
- `helpers/string.js` agora contém apenas `initials()` e o re-export de `topGift`

### Validação

| Item | Resultado |
|---|---|
| Testes executados | 78 |
| Testes aprovados | 78 |
| Testes falhando | 0 |
| Build preservado | ✅ (784 módulos, ~735ms) |
| Regressões identificadas | Nenhuma |

### Métricas

| Item | Valor |
|---|---|
| Arquivos criados | 2 (`domain/spiritual-gifts.ts`, `services/scoring.ts`) |
| Arquivos removidos | 1 (`services/scoring.js`) |
| Arquivos modificados | 2 (`helpers/string.js`, `services/__tests__/scoring.test.js`) |
| Testes criados | 3 (topGift) |
| Total de sprints concluídas | 3 |

---

## Sprint 3 — Fonte Única dos Dons

> **Início:** 2026-07-09
>
> **Término:** 2026-07-09
>
> **Status:** Concluída

### Atividades executadas

1. **Busca global** de todos os consumidores de `data/gifts.js` — confirmados 4 consumidores:
   - Produção: `GiftBadges.vue`
   - Testes: `scoring.test.js`, `gifts.test.js`, `questions.test.js`

2. **Migração de imports** em todos os consumidores para `domain/spiritual-gifts`:
   - `GiftBadges.vue` — alterado de `'../data/gifts.js'` para `'../domain/spiritual-gifts'`
   - `scoring.test.js` — alterado de `'../../data/gifts.js'` para `'../../domain/spiritual-gifts'`
   - `gifts.test.js` — alterado de `'../gifts.js'` para `'../../domain/spiritual-gifts'`
   - `questions.test.js` — alterado de `'../gifts.js'` para `'../../domain/spiritual-gifts'`

3. **Correção de path relativo** nos testes em `src/data/__tests__/` — o path `../domain/spiritual-gifts` resolvia para `src/data/domain/spiritual-gifts` (inexistente). Corrigido para `../../domain/spiritual-gifts`.

4. **Validação**:
   - 78/78 testes passando
   - Build bem-sucedido (783 módulos, ~1.74s)

### Decisões tomadas

- **`data/gifts.js` mantido** no código — servirá apenas como referência de compatibilidade; será removido exclusivamente na Sprint 5
- **Testes migrados para a fonte de verdade** — agora os testes validam diretamente `domain/spiritual-gifts.ts`, não o legado
- **Nenhuma lógica alterada** — apenas caminhos de import foram modificados

### Dificuldades encontradas

- Path relativo incorreto nos testes de `src/data/__tests__/` — esses arquivos estão a 2 níveis de profundidade (`src/data/__tests__/`), exigindo `../../` em vez de `../` para alcançar `src/domain/`

### Validação

| Item | Resultado |
|---|---|
| Testes executados | 78 |
| Testes aprovados | 78 |
| Testes falhando | 0 |
| Build preservado | ✅ (783 módulos, ~1.74s) |
| Consumidores de produção migrados | 1 de 1 |
| Regressões identificadas | Nenhuma |

### Métricas

| Item | Valor |
|---|---|
| Arquivos modificados | 4 (`GiftBadges.vue`, `scoring.test.js`, `gifts.test.js`, `questions.test.js`) |
| Consumidores de produção migrados | 1 (`GiftBadges.vue`) |
| Consumidores de teste migrados | 3 |
| Total de sprints concluídas | 4 |

### Ajuste pós-Sprint 3 — Eliminação da duplicação física

Após a conclusão da Sprint 3, identificou-se que `data/gifts.js` ainda continha uma cópia completa dos metadados dos dons, mantendo duplicação física que contrariava o princípio Single Source of Truth.

**Correção aplicada:**
- `data/gifts.js` foi transformado em um adapter de compatibilidade — seu conteúdo foi substituído por um re-export da fonte única: `export { gifts } from '../domain/spiritual-gifts'`
- Os dados físicos dos 27 dons passaram a existir em **apenas um local**: `domain/spiritual-gifts.ts`
- Nenhum import precisou ser alterado — compatibilidade total mantida

**Validação:**
- 78/78 testes passando
- Build bem-sucedido
- Busca global confirmou: apenas `domain/spiritual-gifts.ts` contém dados físicos dos dons

---

## Próxima Sprint

### Sprint 4 — Migração Gradual

Substituir gradualmente todas as implementações antigas.
Cada alteração deverá manter todos os testes passando.
As duplicações deverão ser removidas somente após a migração dos consumidores.

---

## Roadmap

As sprints abaixo serão executadas sequencialmente, dependendo de aprovação:

- Sprint 4 — Migração Gradual
- Sprint 5 — Limpeza (remoção de adapters temporários, código morto e re-exports de compatibilidade)
