# Análise da Auditoria — Domínio dos Dons Espirituais

> **Sprint:** 0 — Auditoria (revisão complementar)
>
> **Data:** 2026-07-04
>
> **Última atualização:** 2026-07-09 (Sprint 3 concluída)
>
> **Status:** Concluída

---

## Decisões Arquiteturais Aprovadas

As decisões abaixo foram aprovadas para esta refatoração e estão vigentes:

- **Refatoração incremental** em 6 sprints, sem big bang
- **Testes antes da migração** — rede de segurança estabelecida antes de qualquer alteração no domínio
- **Fonte única localizada em `src/domain/`** (Alternativa A), validada por CI contra a Edge Function
- **Migração incremental para TypeScript** — cada arquivo migrado individualmente com testes verdes
- **Compatibilidade funcional preservada** — nenhuma regra de negócio, UX ou banco de dados é alterado
- **`id` numérico mantido** — compatibilidade com dados existentes no banco (chaves 0-26 no JSONB)
- **Legacy excluído do escopo** — código em `legacy/` e `scripts/` não influencia as decisões
- **Vitest como framework de testes** — escolhido por compatibilidade com o ecossistema Vite existente

---

## Premissas

As premissas abaixo foram adotadas durante toda a análise e planejamento:

- O banco de dados (Supabase) permanece inalterado durante toda a refatoração
- As Edge Functions continuam em runtime Deno durante esta refatoração
- O frontend continua utilizando Vue 3 + Vite + Vuetify durante esta refatoração
- A lista de 27 dons espirituais é estática (modelo C. Peter Wagner) — não há necessidade de CRUD dinâmico
- Os testes são implementados no nível de função pura, sem dependência de Vue, navegador ou Supabase
- A migração é incremental: cada sprint mantém o sistema funcionando e os testes verdes
- Nenhuma alteração de layout, UX, regras de negócio ou banco de dados faz parte do escopo

---

## Inventário (constatações)

### Arquivos que definem dados dos dons

| # | Arquivo | O que define | Formato |
|---|---|---|---|
| 1 | `packages/frontend/src/domain/spiritual-gifts.ts` | **27 dons tipados:** `id`, `name`, `icon`, `color` + constantes derivadas | Array de objetos TS | criado na Sprint 2 — **fonte única oficial** |
| 2 | `packages/frontend/src/data/gifts.js` | Apenas re-export: `export { gifts } from '../domain/spiritual-gifts'` | Adapter JS | sem dados próprios — adapter de compatibilidade (removido na Sprint 5) |
| 3 | `supabase/functions/generate-ai/index.ts` | 27 dons: apenas `name` (array `GIFTS_ORDER`) | Array de strings TS |
| 4 | `packages/frontend/src/data/questions.js` | 135 perguntas mapeadas aos 27 dons (`i % 27`) | Array de objetos JS |
| 5 | `supabase/migrations/001_initial.sql` | Schema da tabela `responses` com `scores jsonb` | SQL |

### Arquivos que consomem dados dos dons

| # | Arquivo | Como consome | Importa de |
|---|---|---|---|
| 5 | `packages/frontend/src/services/scoring.ts` | `calculateScores`, `rankGifts`, `formatScoresForAI`, `topGift` | `domain/spiritual-gifts.ts` | migrado na Sprint 2 |
| 6 | `packages/frontend/src/components/GiftBadges.vue` | Exibe top 3 dons (ícone + nome + score) | `domain/spiritual-gifts.ts`, `services/scoring.ts` | **Migrado na Sprint 3** — importa de `domain/spiritual-gifts` |
| 7 | `packages/frontend/src/components/ResultsChart.vue` | Gráfico de barras horizontal com 27 dons | `services/scoring.js` |
| 8 | `packages/frontend/src/helpers/string.js` | `topGift()` — re-exportado de `scoring.ts` | `services/scoring.js` (`topGift` movido na Sprint 2) |
| 9 | `packages/frontend/src/components/HistoryList.vue` | Exibe dom principal de cada resultado | `helpers/string.js` (via `topGift`) |
| 10 | `packages/frontend/src/views/QuizView.vue` | Orquestra quiz, chama `calculateScores`, monta payload | `services/scoring.js` |
| 11 | `packages/frontend/src/views/ResultsView.vue` | Exibe resultado via GiftBadges + ResultsChart | (delega para componentes) |
| 12 | `packages/frontend/src/stores/quiz.js` | Gerencia estado do questionário (135 perguntas) | `data/questions.js` |
| 13 | `packages/frontend/src/views/HomeView.vue` | Texto estático "27 dons", "135 afirmações", `ANSWER_LABELS` | `data/questions.js` |
| 14 | `packages/frontend/src/components/QuestionStep.vue` | Renderiza opções de resposta Likert | `data/questions.js` |
| 15 | `packages/frontend/src/components/ResourcesSection.vue` | Links externos sobre dons | `data/resources.js` |
| 16 | `packages/frontend/src/stores/responses.js` | CRUD da tabela `responses` (contém scores) | `repositories/responseRepository.js` |

### Consumidores indiretos (sem acesso direto a gift data)

| # | Arquivo | Relação |
|---|---|---|
| 17 | `packages/frontend/src/stores/ai.js` | Invoca AI analysis, que usa gift data server-side |
| 18 | `packages/frontend/src/services/aiAnalysis.js` | Regenera AI analysis via edge function |
| 19 | `packages/frontend/src/repositories/responseRepository.js` | Persiste scores na tabela `responses` |
| 20 | `packages/frontend/src/repositories/aiRepository.js` | Invoca edge function `generate-ai` |
| 21 | `supabase/functions/retry-ai-analysis/index.ts` | Retry de AI analysis para respostas sem análise |
| 22 | `supabase/functions/notify-admin/index.ts` | Notifica admin sobre nova resposta |

### Fluxo de dados

```
domain/spiritual-gifts.ts  (fonte única — Sprint 2)
  └── services/scoring.ts  (TS, com topGift)
        ├── components/GiftBadges.vue  (via rankGifts)
        ├── components/ResultsChart.vue  (via rankGifts)
        ├── helpers/string.js  (re-export de topGift)
        │     └── components/HistoryList.vue
        └── views/QuizView.vue  (via calculateScores)
              └── (payload → API → responses table)

data/gifts.js  (legado — sem consumidores desde a Sprint 3, removido na Sprint 5)

data/questions.js  (135 perguntas, acoplamento posicional i%27)
  ├── stores/quiz.js
  │     └── views/QuizView.vue
  ├── views/HomeView.vue  (ANSWER_LABELS)
  └── components/QuestionStep.vue  (ANSWER_LABELS)

supabase/functions/generate-ai/index.ts  (GIFTS_ORDER — duplicado)
```

---

## Duplicações Identificadas (constatações)

### Lista dos 27 dons em 4 locais

| Local | Nomes idênticos? | Campos extras |
|---|---|---|
| `data/gifts.js` | Sim | `id`, `icon`, `color` |
| `generate-ai/index.ts` | Sim | Nenhum |
| `import_to_supabase.py` | Sim (fora do escopo) | Nenhum |
| `legacy/main.py` | Sim (fora do escopo) | Nenhum |

Os nomes e a ordem (Peter Wagner) são idênticos entre todos os locais. Os arquivos em `legacy/` e `scripts/` estão fora do escopo desta refatoração.

### Nomes alternativos em CSVs legacy

Os CSVs em `legacy/` usam abreviações diferentes (ex: "Pastoreio" → "Pastor", "Evangelismo Transcultural" → "Missionário"). Esses arquivos não são consumidos pelo frontend em produção — a divergência é apenas histórica e não representa risco para a aplicação atual.

### Metadados repetidos

- `color: '#1B5438'` é o mesmo valor em todos os 27 objetos de `gifts.js` — poderia ser um valor default
- `score / 15` e `max: 15` aparecem em `ResultsChart.vue` e `GiftBadges.vue` — derivam da fórmula (5 perguntas × 3 pontos)

---

## Dependências (constatações)

### Cadeia de dependência de gifts.js

```
spiritual-gifts.ts (fonte única — Sprint 2)
  ← services/scoring.ts (TS, com topGift)
      ← components/GiftBadges.vue (via rankGifts)
      ← components/ResultsChart.vue
      ← helpers/string.js (re-export de topGift)
          ← components/HistoryList.vue
      ← views/QuizView.vue

gifts.js (legado — Sprint 5)
  ← components/GiftBadges.vue (import direto — Sprint 3)
```

### Cadeia de dependência de questions.js

```
questions.js (135 perguntas, acoplamento posicional)
  ← stores/quiz.js
      ← views/QuizView.vue
  ← views/HomeView.vue (ANSWER_LABELS)
  ← components/QuestionStep.vue (ANSWER_LABELS)
```

### Acoplamento entre questions.js e gifts.js

Atualmente não há import direto. O acoplamento é posicional (comentário: `questão i % 27`):
- Alterar a ordem de `gifts.js` sem reordenar `questions.js` → scores incorretos
- Adicionar ou remover um dom → quebra o mapeamento silenciosamente

---

## Riscos (constatações)

### Risco alto

1. **Acoplamento posicional `i % 27`** — mapeamento entre perguntas e dons é implícito. Nenhuma verificação runtime ou compile-time existe.
2. **`GIFTS_ORDER` na Edge Function** — duplicado manualmente. Se o frontend mudar e a edge function não for atualizada, a análise de IA fica inconsistente.
3. **QuizView como orquestrador monolítico** — a função `submitQuiz()` centraliza scoring, payload, persistência e notificação. Qualquer mudança no formato dos dados propaga-se diretamente para a view.

### Risco médio

4. Componentes `GiftBadges.vue` e `ResultsChart.vue` acessam campos específicos (`gift.id`, `gift.name`, `gift.icon`, `gift.color`).
5. `ResultsChart.vue` hardcoda `max: 15` e `stepSize: 3`.
6. Schema de scores no banco (`jsonb` com chaves 0-26) não tem constraint — definido apenas por convenção.

### Risco baixo

7. Scripts Python com `GIFT_NAMES` duplicado (fora do escopo).
8. CSVs legacy com nomes alternativos (não consumidos pelo frontend).

---

## Recomendações

### Localização da fonte única

**Recomendação para esta refatoração:** `packages/frontend/src/domain/spiritual-gifts.ts`

Justificativa: a maioria dos consumidores (11 de 12) está no frontend; o diretório `src/domain/` ainda não existe e sua criação reforça a separação Clean Architecture; Vite compila TypeScript nativamente.

Alternativas consideradas e rejeitadas:
- `packages/shared/` — desproporcional para 27 entradas estáticas; Edge Functions continuam sem acesso
- Geração automática de JSON — complexidade de build injustificada; perda de type safety

### Tratamento da duplicação com a Edge Function

**Decisão para esta refatoração:** a duplicação de 31 linhas (`GIFTS_ORDER`) não será eliminada tecnicamente. Será gerenciada por validação em CI:

1. A fonte única oficial fica em `src/domain/spiritual-gifts.ts`
2. `GIFTS_ORDER` na Edge Function é mantido como cache local
3. Um script de validação compara as duas listas e falha se divergirem

Isso atende ao SSOT sem adicionar complexidade desnecessária (KISS, YAGNI).

### Organização dos testes

**Recomendação adotada na Sprint 1:** testes unitários puros (sem Vue/Supabase) usando Vitest, co-localizados com os módulos em diretórios `__tests__/`.

### Extração de constantes

**Recomendação para esta refatoração:** as constantes do domínio (`GIFT_COUNT`, `QUESTIONS_PER_GIFT`, `MAX_SCORE`, `TOTAL_QUESTIONS`) devem ser derivadas automaticamente da fonte única, nunca definidas manualmente.

### Inversão de dependência

**Recomendação adotada na Sprint 2:** `topGift()` foi movido de `helpers/string.js` para `services/scoring.ts` (responsabilidade única). `string.js` mantém re-export para compatibilidade com `HistoryList.vue`.

---

## Arquitetura Compartilhada — Comparação

As três alternativas abaixo foram analisadas durante a auditoria. A recomendação final está documentada na seção anterior.

### Alternativa A — `packages/frontend/src/domain/` ✅ Adotada

| Aspecto | Avaliação |
|---|---|
| SSOT | ✅ (com validação CI) |
| KISS | ✅ Mais simples |
| YAGNI | ✅ Sem infra desnecessária |
| Vite | ✅ Nativo |
| Deno | ❌ (gerenciado por validação) |
| Build | Sem impacto |

### Alternativa B — `packages/shared/` (novo workspace)

| Aspecto | Avaliação |
|---|---|
| SSOT | ✅ |
| KISS | ❌ Desproporcional |
| YAGNI | ❌ Versionamento não necessário |
| Deno | ❌ Continua sem acesso |
| Build | Novo workspace, linking |

### Alternativa C — Geração automática de JSON

| Aspecto | Avaliação |
|---|---|
| SSOT | ✅ (real, runtime-agnóstico) |
| KISS | ❌ Script + CI + distribuição |
| YAGNI | ❌ Complexidade excessiva |
| Deno | ✅ |
| Type safety | ❌ JSON não carrega tipos |

---

## Estratégia de Testes

A estratégia abaixo foi definida durante a auditoria e implementada na Sprint 1.

### Cobertura atual (Sprint 2)

78 testes implementados com Vitest, divididos em 4 arquivos:

| Arquivo | Testes | O que cobre |
|---|---|---|
| `src/services/__tests__/scoring.test.js` | 12 | `calculateScores`, `rankGifts`, `formatScoresForAI`, `topGift` |
| `src/helpers/__tests__/string.test.js` | 3 | `topGift` (via re-export) |
| `src/data/__tests__/gifts.test.js` | 6 | IDs, nomes, ordem, tipos, ícones |
| `src/data/__tests__/questions.test.js` | 57 | 135 perguntas, mapeamento `i % 27` |

### Testes propostos para sprints futuras

| # | Teste | Prioridade | Tipo | Sprint |
|---|---|---|---|---|
| 17 | Consistência Edge Function vs fonte única | Alta | Script validação | Futura (não implementado na Sprint 2) |
| 18 | Ciclo completo answers → scores → payload | Média | Integração | 3-4 |
| 19 | Serialização/deserialização dos scores | Média | Integração | 3-4 |
| 20 | Edge function `formatScores` vs frontend | Média | Integração | 3-4 |
| 21 | Compatibilidade com respostas existentes | Baixa | Regressão | 5 |
| 22 | Quiz completo (135 perguntas) | Baixa | Regressão | 5 |

---

## Dívida Técnica (constatações)

### Alta

| Item | Descrição | Arquivo | Status |
|---|---|---|---|
| Acoplamento posicional `i % 27` | Mapeamento implícito entre perguntas e dons | `data/questions.js` ↔ `domain/spiritual-gifts.ts` | Pendente |
| QuizView orquestrador monolítico | `submitQuiz()` centraliza scoring, payload, persistência, notificação | `views/QuizView.vue` | Pendente |
| Sem validação de input | `calculateScores()` não verifica `answers.length === 135` | `services/scoring.ts` | Pendente |
| GIFTS_ORDER duplicado | Edge function mantém lista manual sem validação automática | `supabase/functions/generate-ai/index.ts` | Pendente |
| Zero testes | Projeto sem nenhum teste antes da Sprint 1 | Projeto inteiro | **Resolvido** (75 testes) |

### Média

| Item | Descrição | Arquivo | Status |
|---|---|---|---|
| Hardcode `score / 15` | Max score fixo em componentes de exibição | `ResultsChart.vue`, `GiftBadges.vue` | Pendente |
| `topGift()` em local inadequado | Função de domínio misturada com utilitário de string | `helpers/string.js` → `scoring.ts` | **Resolvido** (Sprint 2) |
| `color` repetido 27x | Mesmo valor poderia ser default | `domain/spiritual-gifts.ts` | Pendente |
| `ANSWER_LABELS` misturado | Escala Likert (apresentação) junto com dados de domínio | `data/questions.js` | Pendente |
| Inconsistência de timeout | `insert()` e `countByUserId()` sem timeout, diferindo dos demais | `repositories/responseRepository.js` | Pendente |

### Baixa

| Item | Descrição | Arquivo | Status |
|---|---|---|---|
| Código comentado | Comentários grandes poluindo o arquivo | `data/questions.js` | Pendente |
| Formatação inconsistente | Gift id:25 com alinhamento diferente | `data/gifts.js` | **Resolvido na Sprint 2** (fonte única consistente; legado removido na Sprint 5) |
| README desatualizado | Descreve pipeline legado, não o app atual | `README.md` | Pendente |

---

## Modelo do Domínio

A estrutura abaixo foi implementada na Sprint 2 e é a versão atual do código.

```typescript
export interface Gift {
  id: number     // 0-26, chave no JSONB scores do banco
  name: string   // Nome completo em português
  icon: string   // Ícone Material Design (mdi-*)
  color: string  // Cor hexadecimal para exibição
}
```

### Decisões sobre cada campo

| Campo | Decisão | Justificativa |
|---|---|---|
| `id: number` | Mantido numérico | Chave no JSONB do banco, indexador `i % 27`, acessado por componentes. Mudar quebraria dados existentes |
| `slug` | Não adicionado (YAGNI) | Nenhuma funcionalidade atual precisa |
| `category` | Não adicionado (YAGNI) | Modelo Wagner não é usado pela aplicação |
| `description` | Não adicionado (YAGNI) | Sem tela de detalhes ou tooltip |
| `icon` | Mantido pragmaticamente | Dado de apresentação, mas não há camada separada. Remover exigiria mapping paralelo |
| `color` | Mantido pragmaticamente | Mesma razão do `icon`. Valor `#1B5438` pode ser extraído como default |

### Derivadas automáticas

As constantes devem ser derivadas, nunca definidas manualmente:

```typescript
export const GIFT_COUNT = gifts.length          // = 27
export const giftNames: readonly string[] = gifts.map(g => g.name)
export function giftById(id: number): Gift | undefined  // acesso direto ao array (0-26)
```

### O que não pertence à fonte única

| Dado | Motivo | Local atual |
|---|---|---|
| `ANSWER_LABELS` | Escala Likert (apresentação) | `data/questions.js` |
| `resources` | Links externos (conteúdo) | `data/resources.js` |
| `questions` | Dado do questionário, não do gift | `data/questions.js` |

---

## Arquitetura Alvo

Estado atual após a Sprint 3. A organização abaixo reflete o momento presente do código:

```
packages/frontend/src/
  domain/
    spiritual-gifts.ts       # ✅ Fonte única: tipo Gift + lista + constantes derivadas (Sprint 2) — consumida por toda a produção (Sprint 3)
  services/
    scoring.ts               # ✅ calculateScores, rankGifts, formatScoresForAI, topGift (Sprint 2)
    __tests__/
      scoring.test.js        # ✅ 12 testes — importa da fonte única (Sprint 3)
  helpers/
    string.js                # ✅ Apenas initials (topGift re-exportado de scoring) (Sprint 2)
    __tests__/
      string.test.js
  data/
    gifts.js                 # ✅ Apenas re-export: export { gifts } from '../domain/spiritual-gifts' — sem dados próprios (Sprint 3)
    questions.js             # Mantido, com validação de consistência
    __tests__/
      gifts.test.js          # ✅ Importa da fonte única (Sprint 3)
      questions.test.js      # ✅ Importa da fonte única (Sprint 3)
```

Características da arquitetura após Sprint 3:
- **Única definição física** dos 27 dons em `domain/spiritual-gifts.ts` ✅ (Sprint 2 + ajuste Sprint 3)
- **Fonte única consumida por toda a produção** ✅ (Sprint 3 — GiftBadges.vue migrado)
- **Testes validam a fonte de verdade** ✅ (Sprint 3 — todos os 4 arquivos de teste importam de `domain/spiritual-gifts`)
- **`data/gifts.js` é apenas um adapter de compatibilidade** (re-export), sem dados próprios ✅ (ajuste Sprint 3)
- **`data/gifts.js` será removido** na Sprint 5, juntamente com os demais adapters temporários ⏳
- **Validação CI** da Edge Function ⏳ (pendente)
- **`topGift()` movido** para junto de `scoring.ts` ✅ (Sprint 2)
- **78 testes** protegendo scoring, ranking, topGift, consistência dos dados ✅
- **Constantes derivadas** automaticamente (`GIFT_COUNT`, `giftNames`, `giftById`) ✅ (Sprint 2)
- **Zero alteração funcional** — comportamento da aplicação preservado ✅

---

## Questões em Aberto

Os assuntos abaixo foram propositalmente adiados para etapas futuras e **não fazem parte do escopo desta refatoração**:

- **Sprint 5** — terá como escopo a remoção de adapters temporários (`data/gifts.js`), código morto e re-exports de compatibilidade, e não mais a consolidação da fonte única (já concluída)
- **Migração do frontend para Nuxt** ou outro framework — não há plano atual
- **Adoção de ORM** no lugar do Supabase client direto — fora do escopo
- **CI/CD** — pipeline de validação automática será definido futuramente
- **Internacionalização** (i18n) dos metadados dos dons — melhoria futura
- **Persistência dos metadados dos dons em banco de dados** — não justificado para lista estática
- **Geração automática de documentação do domínio** — pós-refatoração
- **Fortalecimento DDD** com agregados, repositórios de domínio, etc. — avaliação futura
- **Eliminação técnica da duplicação com Edge Functions** — a validação CI foi considerada suficiente para esta etapa
- **Reorganização completa da aplicação** além do domínio dos dons — fora do escopo
