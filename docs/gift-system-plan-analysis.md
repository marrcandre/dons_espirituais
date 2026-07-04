# Análise da Auditoria — Domínio dos Dons Espirituais

> **Sprint:** 0 — Auditoria (revisão complementar)
>
> **Data:** 2026-07-04
>
> **Status:** Concluída

---

## Inventário

### Arquivos que DEFINEM dados dos dons

| # | Arquivo | O que define | Formato |
|---|---|---|---|
| 1 | `packages/frontend/src/data/gifts.js` | 27 dons: `id`, `name`, `icon`, `color` | Array de objetos JS |
| 2 | `supabase/functions/generate-ai/index.ts` | 27 dons: apenas `name` (array `GIFTS_ORDER`) | Array de strings TS |
| 3 | `packages/frontend/src/data/questions.js` | 135 perguntas mapeadas aos 27 dons (`i % 27`) | Array de objetos JS |
| 4 | `supabase/migrations/001_initial.sql` | Schema da tabela `responses` com `scores jsonb` | SQL |

### Arquivos que CONSOMMEM dados dos dons

| # | Arquivo | Como consome | Importa de |
|---|---|---|---|
| 5 | `packages/frontend/src/services/scoring.js` | `calculateScores`, `rankGifts`, `formatScoresForAI` | `data/gifts.js` |
| 6 | `packages/frontend/src/components/GiftBadges.vue` | Exibe top 3 dons (ícone + nome + score) | `data/gifts.js`, `services/scoring.js` |
| 7 | `packages/frontend/src/components/ResultsChart.vue` | Gráfico de barras horizontal com 27 dons | `services/scoring.js` |
| 8 | `packages/frontend/src/helpers/string.js` | `topGift()` — string "Dom principal: {nome}" | `services/scoring.js` |
| 9 | `packages/frontend/src/components/HistoryList.vue` | Exibe dom principal de cada resultado | `helpers/string.js` (via `topGift`) |
| 10 | `packages/frontend/src/views/QuizView.vue` | Orquestra quiz, chama `calculateScores`, monta payload | `services/scoring.js` |
| 11 | `packages/frontend/src/views/ResultsView.vue` | Exibe resultado via GiftBadges + ResultsChart | (delega para componentes) |
| 12 | `packages/frontend/src/stores/quiz.js` | Gerencia estado do questionário (135 perguntas) | `data/questions.js` |
| 13 | `packages/frontend/src/views/HomeView.vue` | Texto estático "27 dons", "135 afirmações", `ANSWER_LABELS` | `data/questions.js` |
| 14 | `packages/frontend/src/components/QuestionStep.vue` | Renderiza opções de resposta Likert | `data/questions.js` |
| 15 | `packages/frontend/src/components/ResourcesSection.vue` | Links externos sobre dons | `data/resources.js` |
| 16 | `packages/frontend/src/stores/responses.js` | CRUD da tabela `responses` (contém scores) | `repositories/responseRepository.js` |

### Consumidores INDIRETOS (sem acesso direto a gift data)

| # | Arquivo | Relação |
|---|---|---|
| 17 | `packages/frontend/src/stores/ai.js` | Invoca AI analysis, que usa gift data server-side |
| 18 | `packages/frontend/src/services/aiAnalysis.js` | Regenera AI analysis via edge function |
| 19 | `packages/frontend/src/repositories/responseRepository.js` | Persiste scores na tabela `responses` |
| 20 | `packages/frontend/src/repositories/aiRepository.js` | Invoca edge function `generate-ai` |
| 21 | `supabase/functions/retry-ai-analysis/index.ts` | Retry de AI analysis para respostas sem análise |
| 22 | `supabase/functions/notify-admin/index.ts` | Notifica admin sobre nova resposta |

### Fluxo de dados (resumido)

```
data/gifts.js  (SSOT atual do frontend)
  ├── services/scoring.js  (calculateScores, rankGifts)
  │     ├── components/GiftBadges.vue
  │     ├── components/ResultsChart.vue
  │     ├── helpers/string.js → topGift()
  │     │     └── components/HistoryList.vue
  │     └── views/QuizView.vue
  │           └── (payload → API → responses table)
  └── (consumido diretamente por)
        └── components/GiftBadges.vue

data/questions.js  (135 perguntas, acoplamento posicional i%27)
  ├── stores/quiz.js
  │     └── views/QuizView.vue
  ├── views/HomeView.vue  (ANSWER_LABELS)
  └── components/QuestionStep.vue  (ANSWER_LABELS)

supabase/functions/generate-ai/index.ts  (GIFTS_ORDER — duplicado)
```

---

## 1. Arquitetura Compartilhada

### Alternativa A — `packages/frontend/src/domain/`

**Vantagens:**
- Caminho mais curto dentro do frontend (`src/domain/` vs `../../shared/`)
- Sem mudanças na estrutura do monorepo
- Vite compila TypeScript nativamente
- Separação arquitetural clara (domínio independente de UI/infra)
- A maioria dos consumidores (11 de 12) está no frontend

**Desvantagens:**
- Inacessível para Edge Functions (Deno runtime, importa via `https://esm.sh/`)
- Scripts Python não podem importar (mas estão fora do escopo)

**Impacto build:** Nenhum. Vite já compila `src/`.

**Impacto manutenção:** Baixo. Um único arquivo TS para manter.

**Compatibilidade Vite:** ✅ Nativo.

**Compatibilidade Deno:** ❌ Impossível importar diretamente.

**Compatibilidade Python:** ❌ Mas fora do escopo.

**Princípios:**
- SSOT: ✅ (para o frontend; edge function precisaria de validação)
- Clean Architecture: ✅ (domínio separado)
- Clean Code: ✅
- DRY: ✅ (elimina duplicação no frontend)
- KISS: ✅ (mais simples de implementar)
- YAGNI: ✅ (não adiciona infraestrutura desnecessária)

---

### Alternativa B — `packages/shared/` (novo workspace npm)

Criar `packages/shared/package.json` com a lista de dons em TS/JSON, publicado como workspace npm interno.

**Vantagens:**
- Separação explícita de responsabilidades
- Potencial para compartilhar com outros pacotes futuros
- Pode ser versionado independentemente

**Desvantagens:**
- Edge Functions continuam sem poder importar (Deno não acessa node_modules)
- Novo workspace = mais complexidade de build
- `packages/shared/` precisaria ser publicado ou referenciado via `file:` dependecy
- Atualmente só existe `packages/frontend/` — adicionar um workspace para ~30 linhas de dados é desproporcional
- O frontend precisaria de `"@dons/shared": "workspace:*"` no package.json

**Impacto build:** Novo workspace, novo `tsconfig.json`, novo `package.json`, `npm install` adicional.

**Impacto manutenção:** Médio. Um arquivo a mais para gerenciar, com a complexidade de linking entre workspaces.

**Compatibilidade Vite:** ✅ (com alias ou import de workspace)

**Compatibilidade Deno:** ❌

**Compatibilidade Python:** ❌

**Princípios:**
- SSOT: ✅ (teoricamente)
- Clean Architecture: ✅
- Clean Code: ~ (desproporcional para a necessidade)
- DRY: ✅
- KISS: ❌ (mais complexo que Alternativa A)
- YAGNI: ❌ (não há necessidade de versionamento independente)

---

### Alternativa C — Geração automática de artefato compartilhado (JSON)

Um script de build gera `packages/shared/gifts.json` a partir da fonte única. O JSON é consumido pelo frontend (Vite importa JSON nativamente) e pela Edge Function (via `Deno.readTextFile` ou HTTP fetch).

**Vantagens:**
- SSOT real — o JSON é o artefato compartilhado
- Qualquer runtime pode ler JSON
- Edge Function pode importar com `import` assertions (Deno 2+ suporta JSON imports)
- Geração automática elimina erro humano

**Desvantagens:**
- Complexidade adicional: script de geração, sync, validação
- Edge Function precisaria do JSON no bundle (precisa estar dentro do diretório da função ou acessível via URL)
- Cold start da Edge Function pode ter latência se fizer fetch HTTP
- O JSON não carrega tipos — consumidores precisam de typescript duplicados ou inferidos
- Manutenção de script de geração + tipos derivados

**Impacto build:** Novo script de geração, nova etapa no build. O frontend precisaria importar JSON em vez de TS (perde type safety).

**Impacto manutenção:** Médio-Alto. Script de geração, sincronização com deploy da edge function.

**Compatibilidade Vite:** ✅ (importa JSON nativamente)

**Compatibilidade Deno:** ✅ (JSON imports com `assert { type: 'json' }` ou `Deno.readTextFile`)

**Compatibilidade Python:** ✅ (`json.load()`)

**Princípios:**
- SSOT: ✅ (real)
- Clean Architecture: ✅
- Clean Code: ~ (complexidade do script de geração)
- DRY: ✅
- KISS: ❌ (mais complexo que as alternativas)
- YAGNI: ❌ (a lista de 27 dons é estática — não precisa de geração dinâmica)

---

### Recomendação: Alternativa A + CI validation

**`packages/frontend/src/domain/spiritual-gifts.ts`** como fonte única, combinado com:

1. **Validação em CI** que verifica se `GIFTS_ORDER` na Edge Function corresponde à fonte única
2. **Script opcional** `scripts/validate-gifts.js` que extrai os nomes de ambos os locais e compara

**Justificativa técnica:**

| Critério | Alt A | Alt B | Alt C |
|---|---|---|---|
| Simplicidade | ★★★ | ★★ | ★ |
| SSOT | ★★ (com validação: ★★★) | ★★★ | ★★★ |
| Sem infraestrutura nova | ✅ | ❌ | ❌ |
| Type safety | ✅ | ✅ | ❌ (JSON perde tipos) |
| Manutenção futura | ✅ | ~ | ❌ |
| Compatibilidade Deno | ~ (via validação) | ❌ | ✅ |
| Compatibilidade Vite | ✅ | ✅ | ✅ |

A Alternativa A é a mais simples (KISS), mais adequada ao tamanho do projeto (YAGNI), e a que exige menos infraestrutura nova. A duplicação com a Edge Function de 31 linhas é gerenciada por validação em CI — não justifica a complexidade de uma geração automática de artefatos.

---

## 2. Eliminação Completa da Duplicação

### Limitação do runtime Deno

As Edge Functions do Supabase rodam em Deno e são bundladas pelo Supabase CLI. Cada função é bundlada separadamente a partir de seu diretório. Não há uma maneira nativa de compartilhar código entre o frontend (npm/Vite) e Deno.

As opções para eliminar totalmente a duplicação seriam:

**Opção A: JSON embutido no diretório da Edge Function + deploy script**
- Colocar `gifts.json` em `supabase/functions/shared/gifts.json`
- Script de deploy copia `gifts.json` para `supabase/functions/generate-ai/gifts.json`
- Frontend importa o JSON via Vite (caminho relativo)
- **Problema:** O caminho `supabase/functions/shared/` não é acessível ao Vite sem configurar alias; o JSON não teria types inferidos

**Opção B: Fetch HTTP na Edge Function (cold start)**
- JSON hospedado no Supabase Storage ou no próprio frontend
- Edge Function faz fetch na inicialização e cacheia
- **Problema:** Adiciona latência a cada cold start (~200-500ms), complexidade de cache, ponto de falha adicional

**Opção C: Script de geração + inlining**
- Script TypeScript lê a fonte única e gera o código da Edge Function substituindo `GIFTS_ORDER`
- **Problema:** Adiciona complexidade significativa de build para um ganho marginal

### Decisão

A duplicação de 31 linhas (`GIFTS_ORDER`) não será **eliminada tecnicamente** — seria antieconômico para o tamanho do projeto. Em vez disso, será **gerenciada por validação**:

1. A fonte única oficial fica em `src/domain/spiritual-gifts.ts`
2. `GIFTS_ORDER` na Edge Function é mantido como cache local
3. Um script de validação (CI ou pre-commit) compara as duas listas
4. Se divergirem, o build/deploy falha

Isso atende ao espírito do SSOT sem adicionar complexidade desnecessária (KISS, YAGNI).

---

## 3. Estratégia de Testes

### Situação atual

**Zero testes** em todo o projeto. Nenhum framework de teste instalado. Nenhum arquivo `.test.*` ou `.spec.*` existe.

### Lacunas identificadas

Todas as regras de negócio do domínio estão sem cobertura:

| Regra de negócio | Arquivo | Risco sem teste |
|---|---|---|
| `calculateScores(answers)` | `services/scoring.js` | Score errado silenciosamente |
| `rankGifts(scores)` | `services/scoring.js` | Ordem incorreta |
| `formatScoresForAI(scores)` | `services/scoring.js` | Prompt mal formatado |
| `topGift(scores)` | `helpers/string.js` | Label incorreta |
| Mapeamento `i % 27` | `data/questions.js` → `stores/quiz.js` | Pergunta errada para o dom |
| Payload de submissão | `views/QuizView.vue` | Dados inconsistentes no banco |
| Consistência dos nomes dos dons | `data/gifts.js` vs Edge Function | AI analysis com nomes errados |
| Serialização dos scores no backend | `responseRepository.js` | Scores corrompidos no banco |

### Proposta de testes

Os testes devem ser implementados antes de qualquer refatoração (Sprint 1).

#### Testes Unitários — Prioridade Alta

| # | Teste | Objetivo | Arquivos envolvidos |
|---|---|---|---|
| 1 | `calculateScores` com answers válidas | Score correto para cada dom (0-15) | `services/scoring.js`, `data/gifts.js` |
| 2 | `calculateScores` com answers vazias | Score zero para todos os dons | `services/scoring.js` |
| 3 | `calculateScores` com 135 answers | Verifica total de 135 entradas | `services/scoring.js` |
| 4 | `calculateScores` usando o mapeamento `i % 27` | Cada grupo de 5 perguntas mapeia para o dom correto | `services/scoring.js`, `data/questions.js` |
| 5 | `rankGifts` ordenação decrescente | Primeiro = maior score, último = menor | `services/scoring.js` |
| 6 | `rankGifts` com empates | Ordem consistente para scores iguais | `services/scoring.js` |
| 7 | `rankGifts` com scores vazios | Todos os dons com score 0, ordenados por id | `services/scoring.js` |
| 8 | `formatScoresForAI` | String formatada corretamente (`nome: X/15`) | `services/scoring.js` |
| 9 | `formatScoresForAI` ordenação | Linhas em ordem decrescente de score | `services/scoring.js` |
| 10 | `topGift` | Retorna "Dom principal: {nome}" correto | `helpers/string.js`, `services/scoring.js` |
| 11 | `topGift` com scores vazios | Retorna string vazia | `helpers/string.js` |

#### Testes de Domínio — Prioridade Alta

| # | Teste | Objetivo | Arquivos envolvidos |
|---|---|---|---|
| 12 | IDs dos dons (0-26 contínuos) | Nenhum ID ausente ou duplicado | `data/gifts.js` |
| 13 | Nomes dos dons únicos | Nenhum nome duplicado | `data/gifts.js` |
| 14 | Ordem dos dons consistente | Ordem igual ao Wagner test | `data/gifts.js` |
| 15 | Quantidade de perguntas (135) | 5 perguntas por dom × 27 dons | `data/questions.js`, `data/gifts.js` |
| 16 | Mapeamento pergunta→dom | `questions[i]` mede `gifts[i % 27]` | `data/questions.js`, `data/gifts.js` |
| 17 | Consistência com Edge Function | `GIFTS_ORDER` contém os mesmos 27 nomes na mesma ordem | `supabase/functions/generate-ai/index.ts` |

#### Testes de Integração — Prioridade Média

| # | Teste | Objetivo | Arquivos envolvidos |
|---|---|---|---|
| 18 | Ciclo completo: answers → scores → payload | Dados consistentes antes da submissão | `views/QuizView.vue`, `services/scoring.js` |
| 19 | Serialização/deserialização dos scores | Scores salvos e lidos do banco são consistentes | `responseRepository.js` |
| 20 | edge function `formatScores` | A edge function produz o mesmo output que o frontend | `supabase/functions/generate-ai/index.ts` |

#### Testes de Regressão — Prioridade Baixa

| # | Teste | Objetivo | Arquivos envolvidos |
|---|---|---|---|
| 21 | Compatibilidade com respostas existentes | Scores antigos (0-26) ainda funcionam após refatoração | Todos |
| 22 | Quiz completo (135 perguntas) | Navegação, respostas, submissão | `stores/quiz.js`, `views/QuizView.vue` |

### Ordem recomendada

```
Sprint 1:
  1-4   calculateScores (básico, vazio, 135, mapeamento)
  5-7   rankGifts (ordenacão, empates, vazio)
  8-9   formatScoresForAI
  10-11 topGift
  12-16 Domínio (IDs, nomes, ordem, perguntas, mapeamento)

Sprint 2:
  17     Consistência Edge Function (script validação)

Sprint 3-4 (durante migração):
  18-20 Integração

Sprint 5 (após migração):
  21-22 Regressão
```

### Framework

Usar **Vitest** — já está no ecossistema Vite, zero configuração extra, compatível com o `vite.config.js` existente. Instalar como devDependency:

```bash
npm install -D vitest --workspace=packages/frontend
```

Os testes de domínio (12-16) rodam sem Vue — apenas JS puro. Testes de integração (18-20) podem usar `@vue/test-utils` se necessário mockar componentes, mas o ideal é manter os testes no nível de serviço/função pura.

---

## 4. Dívida Técnica

### Alta

| Item | Descrição | Arquivo |
|---|---|---|
| Acoplamento posicional `i % 27` | Mapeamento entre perguntas e dons é implícito (comentário, não código). Quebra silenciosamente se a ordem mudar. | `data/questions.js`, `data/gifts.js` |
| Orquestração centralizada em QuizView | `submitQuiz()` monta payload manualmente, chama scoring, persiste, dispara AI. Qualquer mudança no formato de dados impacta este ponto. | `views/QuizView.vue:165-202` |
| Sem validação de input | `calculateScores()` não verifica `answers.length === 135`. Answers com tamanho errado produzem scores silenciosamente incorretos. | `services/scoring.js` |
| GIFTS_ORDER duplicado | Edge function mantém lista manual sem validação automática. Pode divergir do frontend. | `supabase/functions/generate-ai/index.ts` |
| Sem testes | Zero cobertura. Qualquer refatoração é feita sem rede de segurança. | (projeto inteiro) |

### Média

| Item | Descrição | Arquivo |
|---|---|---|
| Hardcode `score / 15` | ResultadosChart e GiftBadges hardcodam o max score (15). Se a fórmula mudar (ex: 0-4 por pergunta), ambos quebram. | `ResultsChart.vue`, `GiftBadges.vue` |
| Hardcode `stepSize: 3` | Gráfico assume escala 0-15 com step 3. | `ResultsChart.vue:115` |
| `topGift()` em helpers/string.js | Função de domínio misturada com utilitário de string. Deveria estar perto de `scoring.js`. | `helpers/string.js` |
| `color: '#1B5438'` repetido 27x | Mesmo valor em todos os objetos. Poderia ser valor default. | `data/gifts.js` |
| `ANSWER_LABELS` em data/questions.js | Dado de apresentação (escala Likert) misturado com dados de domínio (perguntas). | `data/questions.js` |
| `insert()` e `countByUserId()` sem timeout | Inconsistência: outros métodos do repositório usam timeout de 10s, estes dois não. | `repositories/responseRepository.js` |
| `selectField()` lê registro inteiro | Consulta N+1 evitável se usasse `.select(field)` diretamente. | `repositories/responseRepository.js` |

### Baixa

| Item | Descrição | Arquivo |
|---|---|---|
| Código comentado em questions.js | Comentários grandes (original inglês, rascunhos) poluem o arquivo. | `data/questions.js` |
| Alinhamento inconsistente | Gifts `id: 25` (Apóstolo) com formatação diferente dos demais. | `data/gifts.js:30` |
| Sem paginação em listAll() | Pode ser problema com muitas respostas. | `repositories/responseRepository.js` |
| README desatualizado | Descreve o pipeline Python legado, não o app atual. | `README.md` |

---

## 5. Modelo do Domínio

### Proposta de estrutura para a fonte única

```typescript
export interface Gift {
  /** ID numérico 0-26, usado como chave no JSONB scores do banco */
  id: number
  /** Nome completo em português (ex: "Discernimento de Espíritos") */
  name: string
  /** Ícone Material Design para exibição (mdi-*) */
  icon: string
  /** Cor hexadecimal para exibição (ex: "#1B5438") */
  color: string
}

export const GIFT_COUNT = 27
export const QUESTIONS_PER_GIFT = 5
export const MAX_SCORE = 15
export const TOTAL_QUESTIONS = 135

export const gifts: readonly Gift[]
```

### Decisões sobre cada campo

**`id: number` (0-26)**
- ✅ **Manter numérico.** É o identificador usado em todo o sistema:
  - Chave no objeto `scores` salvo no banco (`scores jsonb` com chaves `"0"`, `"1"`, etc.)
  - Indexador do mapeamento `i % 27` para perguntas
  - Propriedade `gift.id` acessada por componentes e serviços
- Mudar para string ou UUID quebraria: (a) dados existentes no banco, (b) o cálculo de scores no frontend, (c) `formatScores` no edge function
- Se `id` for alterado, todos os registros existentes no banco com scores keyed por ID numérico ficam inconsistentes

**`slug?: string`**
- ❌ **Não adicionar agora (YAGNI).** Não há funcionalidade que precise de slug (URLs amigáveis, rotas). O projeto usa IDs de resposta (UUID), não IDs de gift.

**`category?: string`** (ex: "Revelação", "Poder", "Ministério")
- ❌ **Não adicionar agora (YAGNI).** O modelo Wagner classifica dons em categorias, mas a aplicação atual não usa essa classificação em lugar nenhum.

**`description?: string`**
- ❌ **Não adicionar agora (YAGNI).** Não há tela de detalhes do dom nem tooltip. O conteúdo descritivo está nos recursos externos (links).

**`icon: string`**
- ✅ **Manter no domínio.** Embora seja um dado de apresentação (MDI icon), não há uma camada de apresentação separada. Remover do domínio exigiria criar um mapping paralelo, violando KISS.

**`color: string`**
- ✅ **Manter no domínio** pela mesma razão do `icon`. Extrair o valor `'#1B5438'` como constante default em vez de repeti-lo 27 vezes.

### Derivadas automáticas

As seguintes constantes devem ser DERIVADAS da fonte única, não definidas manualmente:

```typescript
export const GIFT_COUNT = gifts.length
export const giftNames: readonly string[] = gifts.map(g => g.name)
export const giftById: ReadonlyMap<number, Gift>
```

Isso garante que se a lista mudar, as constantes acompanham — sem chance de divergência.

### O que NÃO pertence ao domínio

| Dado | Motivo | Deve ficar em |
|---|---|---|
| `ANSWER_LABELS` | Escala Likert (apresentação) | `data/questions.js` ou mover para `config/answerScale.js` |
| `resources` | Links externos (conteúdo) | `data/resources.js` |
| `questions` (perguntas) | Dado de questionário, não de gift. Mas tem acoplamento posicional que precisa ser resolvido | `data/questions.js` (mantido, com validação) |

---

## 6. Conclusão Arquitetural

### Qual é a melhor arquitetura?

**Alternativa A** — fonte única em `packages/frontend/src/domain/spiritual-gifts.ts` com validação CI para a Edge Function. É a mais simples (KISS), mais adequada ao tamanho do projeto (YAGNI), e que atende ao SSOT com o mínimo de infraestrutura nova.

### Qual será a fonte única definitiva?

```
packages/frontend/src/domain/spiritual-gifts.ts
```

Tipo `Gift` com campos `id`, `name`, `icon`, `color`.
Constantes derivadas automaticamente.
Gifts exportados como `readonly` array.

### Como eliminar totalmente as duplicações?

A duplicação com a Edge Function (`GIFTS_ORDER`) não será eliminada tecnicamente — o custo de infraestrutura para compartilhar dados entre Vite e Deno é desproporcional para 27 nomes estáticos. Em vez disso, será **gerenciada por validação**:

- Script `scripts/validate-gifts.js` (ou task npm) que extrai os nomes de `gifts.js` e do `generate-ai/index.ts` e compara
- CI ou pre-commit hook impede deploy se divergirem
- Também valida a consistência entre `gifts.js` e `questions.js` (quantidade, mapeamento)

No frontend, a duplicação atual entre `data/gifts.js`, `scoring.js`, e `helpers/string.js` será eliminada pela migração:
- `data/gifts.js` → `domain/spiritual-gifts.ts` (única fonte)
- `helpers/string.js` tem `topGift()` movido para junto de `scoring.js`
- `data/gifts.js` original removido

### Quais são os maiores riscos restantes?

1. **Acoplamento posicional `i % 27`** — o risco mais alto. `questions.js` e `gifts.js` não têm ligação programática. Uma validação runtime ou compile-time precisa ser adicionada.
2. **Dados existentes no banco** — scores com chaves 0-26. Qualquer mudança no esquema de IDs quebra registros históricos.
3. **QuizView como orquestrador monolítico** — a função `submitQuiz()` faz tudo: scoring, payload, persistência, notificação. Precisa ser desacoplada.

### O projeto está pronto para iniciar a Sprint 1?

**Sim, com ressalvas.** Os pré-requisitos para Sprint 1 são:

1. ✅ Auditoria completa (Sprint 0 concluída)
2. ✅ Decisão arquitetural tomada (Alternativa A + CI validation)
3. ⬜ **Instalar Vitest** como devDependency
4. ⬜ **Validar a decisão** com o usuário (esta análise)

Após aprovação, Sprint 1 pode começar: criar testes unitários para `calculateScores`, `rankGifts`, `formatScoresForAI`, `topGift`, e validações de domínio.

---

## 7. Dívida Técnica

| Prioridade | Item | Arquivo | Impacto |
|---|---|---|---|
| **Alta** | Acoplamento posicional `i % 27` | `data/questions.js` | Scores errados se ordem mudar |
| **Alta** | QuizView orquestrador monolítico | `views/QuizView.vue` | Mudanças no domínio propagam para view |
| **Alta** | Sem validação de input em calculateScores | `services/scoring.js` | Answers inválidas geram scores silenciosamente incorretos |
| **Alta** | GIFTS_ORDER duplicado sem validação | `supabase/functions/generate-ai/index.ts` | AI analysis inconsistente |
| **Alta** | Zero testes | Projeto inteiro | Refatoração sem rede de segurança |
| **Média** | Hardcode max score (15) | `ResultsChart.vue`, `GiftBadges.vue` | Quebra se fórmula mudar |
| **Média** | topGift() em local errado | `helpers/string.js` | Violação de responsabilidade única |
| **Média** | color repetido 27x | `data/gifts.js` | Ruído, propenso a erro |
| **Média** | ANSWER_LABELS misturado com domínio | `data/questions.js` | Coesão baixa |
| **Média** | insert/count sem timeout | `repositories/responseRepository.js` | Comportamento inconsistente |
| **Baixa** | Código comentado poluindo arquivo | `data/questions.js` | Legibilidade |
| **Baixa** | Formatação inconsistente (gift 25) | `data/gifts.js` | Estética |
| **Baixa** | README desatualizado | `README.md` | Documentação enganosa |
