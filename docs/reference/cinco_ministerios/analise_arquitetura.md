# Auditoria Arquitetural — Domain vs Application

## Escopo

Análise completa da separação de responsabilidades entre as camadas **Domain** (`src/domain/`) e **Application** (`src/application/`) do projeto Cinco Ministérios, à luz dos princípios da Clean Architecture (Robert C. Martin), DDD tático, SOLID e Separation of Concerns.

---

## 1. Inventário completo

### src/domain/

| Arquivo | Responsabilidade atual | Camada correta? | Justificativa |
| ------- | ---------------------- | --------------- | ------------- |
| `types.ts` | Tipos fundamentais do domínio (`Ministry`, `Option`, `Question`, `Answer`, `MinistryScore`) | ✔ Sim | Define a linguagem ubíqua do problema. Nenhuma dependência externa. |
| `ministries.ts` | Dados dos 5 ministérios (`MINISTRIES` array) + função de busca (`getMinistry`) | ✔ Sim | Conhecimento de negócio puro. Descrições ministeriais, nomes e estrutura são inerentes ao domínio. |
| `questions.ts` | Dados das 6 perguntas (`QUESTIONS` array) + função de busca (`getQuestionById`) | ✔ Sim | Conteúdo do teste, mapeamento pergunta→opção→ministério. Núcleo do conhecimento de negócio. |
| `scoring.ts` | Algoritmo de pontuação (`calculateScores`) + desempate (`getTopMinistries`) | ✔ Sim | Regra de negócio central: como respostas viram resultado. Sem efeitos colaterais, sem IO, sem formatação. |

### src/application/

| Arquivo | Responsabilidade atual | Camada correta? | Justificativa |
| ------- | ---------------------- | --------------- | ------------- |
| `test-session.ts` | Gerenciamento de sessão de teste (`createSession`, `addAnswer`, `isCompleted`, `getAnswers`) | ⚠ Parcialmente | Contém validações de negócio (pergunta existe, ministério válido, sem duplicata) que pertencem ao domínio. |
| `calculate-result.ts` | Caso de uso de cálculo de resultado | ✔ Sim | Fina camada de orquestração: recebe answers, delega ao domínio, retorna resultado. |
| `index.ts` | Barrel de exportação | ✔ Sim | Apenas reexporta, sem lógica. |

---

## 2. Análise detalhada por função

### Domain — `scoring.ts`

| Função | Classificação | Justificativa |
| ------ | ------------- | ------------- |
| `calculateScores(answers)` | ✔ Correta | Regra de negócio: contagem por ministério + ordenação. Sem efeitos colaterais, sem dependência externa. Função pura. |
| `getTopMinistries(scores)` | ✔ Correta | Regra de negócio: identificar empates no topo. Função pura, sem dependências. |

### Domain — `ministries.ts`

| Função | Classificação | Justificativa |
| ------ | ------------- | ------------- |
| `MINISTRIES` (constante) | ✔ Correta | Catálogo de entidades do domínio. |
| `getMinistry(id)` | ✔ Correta | Busca simples com validação de existência — regra de negócio (um ministério inválido não pode ser acessado). |

### Domain — `questions.ts`

| Função | Classificação | Justificativa |
| ------ | ------------- | ------------- |
| `QUESTIONS` (constante) | ✔ Correta | Catálogo de perguntas do domínio. |
| `getQuestionById(id)` | ✔ Correta | Busca simples — mesma lógica de `getMinistry`. |

### Application — `test-session.ts`

| Função | Classificação | Justificativa |
| ------ | ------------- | ------------- |
| `createSession()` | ✔ Correta | Fábrica simples para estado da sessão. Anêmica, sem lógica de negócio. |
| `addAnswer(session, questionId, ministry)` | ⚠ Pode melhorar | **Três validações na application que deveriam estar no domain**: (1) question existe, (2) ministry é válido, (3) pergunta não foi respondida. A imutabilidade (retornar novo objeto) é correta. |
| `isCompleted(session)` | ⚠ Pode melhorar | Regra de negócio ("o teste só está completo quando todas as 6 perguntas forem respondidas") → pertence ao domínio. |
| `getAnswers(session)` | ✔ Correta | Defesa de mutabilidade (cópia defensiva). Padrão aceitável. |

### Application — `calculate-result.ts`

| Função | Classificação | Justificativa |
| ------ | ------------- | ------------- |
| `calculateResult(answers)` | ✔ Correta | Caso de uso puro: orquestra chamada ao domínio e empacota resultado. Nenhuma regra de negócio nova. |
| `TestResult` (tipo) | ✔ Correta | DTO implícito — tem a mesma forma de `MinistryScore[]`, mas isola a aplicação de mudanças na representação interna do domínio. |

---

## 3. Identificação de responsabilidades

### O Domain está assumindo responsabilidades que não lhe pertencem?

**Não.** O domínio contém exclusivamente:
- Definições de tipos (`types.ts`)
- Dados estáticos de negócio (`ministries.ts`, `questions.ts`)
- Algoritmos de regra de negócio (`scoring.ts`)

Nenhuma função no domínio:
- Formata dados para apresentação
- Cria DTOs para a interface
- Orquestra múltiplas regras
- Toma decisões de fluxo
- Acessa IO ou infraestrutura
- Depende de framework ou biblioteca externa

### A Application está apenas orquestrando?

**Quase.** A application orquestra corretamente em `calculate-result.ts`. O problema está em `test-session.ts`, onde **regras de validação de negócio** (pergunta existe, ministério válido, sem duplicata, completude) foram implementadas na application em vez de no domínio.

### Existe inversão de responsabilidade?

**Não.** As dependências seguem a direção correta:

```
Presentation (composables + views)
  → Application (test-session.ts, calculate-result.ts)
    → Domain (types, ministries, questions, scoring)
    → Infrastructure (local-storage)
```

Nenhuma camada superior depende de concreto de camada inferior de forma inadequada.

### Existem acoplamentos desnecessários?

**Não.** O acoplamento existente é natural e mínimo:
- `test-session.ts` importa `QUESTIONS` e `MINISTRIES` do domínio (necessário para validação — poderia ser via funções do domínio em vez de acesso direto aos arrays).
- `local-storage.ts` importa `Session` e `TestResult` da application (necessário para serialização).

### Existe duplicação entre as camadas?

**Não.** As responsabilidades são distintas e sem sobreposição:
- `scoring.ts` calcula → `calculate-result.ts` orquestra
- `questions.ts` define → `test-session.ts` gerencia estado

### Existem responsabilidades híbridas?

**Sim, `test-session.ts`.** Ela acumula:
1. **Gerenciamento de estado** (criação, cópia defensiva) — application ✅
2. **Validação de negócio** (existência, validade, unicidade) — domain ❌
3. **Verificação de completude** — domain ❌

### Há violações da Clean Architecture?

**Violação leve: regras de validação de negócio na camada de application.**

Detalhamento:

1. `addAnswer` valida `!question` — isso é uma regra de negócio: "só se pode responder perguntas que existem". O domínio deveria expor `isValidQuestion(id): boolean` ou a validação deveria estar em uma função de domínio `validateAnswer(answer, questions, existingAnswers)`.

2. `addAnswer` valida `!VALID_MINISTRIES.includes(ministry)` — regra: "o ministério deve ser um dos 5 válidos". O domínio já tem o tipo `Ministry`, mas não expõe uma função `isValidMinistry(value): value is Ministry`.

3. `addAnswer` valida `alreadyAnswered` — regra: "não é permitido responder a mesma pergunta duas vezes". Esta é uma invariante do processo de teste.

4. `isCompleted` — regra: "6 perguntas respondidas = teste completo". Esta é uma regra de negócio: "o teste tem 6 perguntas e todas precisam ser respondidas".

A violação é **real**, mas **leve**. A motivação provável foi pragmática: manter o `Session` auto-contido como um agregado na própria application. Na prática, isso funciona, mas cria uma zona cinzenta onde regras de negócio vivem fora do domínio.

---

## 4. Impacto das alterações

Caso se decida mover as validações para o domínio:

| Aspecto | Avaliação |
| ------- | --------- |
| Prioridade | **Baixa** — não afeta funcionalidade, testabilidade, ou manutenibilidade atual |
| Benefício esperado | Pureza do domínio ligeiramente maior; application mais orquestração pura |
| Risco da alteração | Mínimo — mudança puramente refatorial, sem efeito colateral |
| Complexidade | Baixa — criar `validateAnswer` ou `isValidQuestion`/`isValidMinistry` no domínio |
| Possibilidade de regressão | Muito baixa — a interface da application não muda, os testes existentes continuam válidos |
| Impacto na cobertura de testes | Nenhum — os testes já cobrem os cenários; seriam apenas realocados |
| Impacto na documentação | Mínimo — poucas linhas mudam |

**Não há necessidade de fazer essa alteração antes da v1.0.0.**

---

## 5. Recomendação final

### Opção A — A arquitetura está correta. Não vale a pena alterar nada antes da versão 1.0.0.

**Justificativa técnica:**

1. **O domínio está puro** — nenhuma dependência externa, nenhum efeito colateral, nenhuma formatação de apresentação. As regras centrais de negócio (scoring, ministérios, perguntas) estão corretamente isoladas.

2. **A violação é leve e autocontida** — as validações em `test-session.ts` são regras de negócio aplicadas na camada errada, mas estão concentradas em um único arquivo de 42 linhas. O acoplamento é apenas com tipagens do domínio (`Ministry`, `QUESTIONS`, `MINISTRIES`), não com infraestrutura.

3. **Risco-benefício desfavorável para v1.0.0** — refatorar agora introduz risco de regressão (mesmo que baixo) em troca de um ganho marginal de pureza arquitetural. O projeto é pequeno, a equipe conhece o código, e a arquitetua atual é compreensível e testada.

4. **Testabilidade não é prejudicada** — `test-session.ts` é testado com 15 testes que cobrem todas as validações. Mudar a localização das regras não melhora a cobertura nem a qualidade dos testes.

5. **Separação real existe** — a linha divisória mais importante (domínio sem IO, sem framework, sem apresentação) está perfeitamente respeitada. A application faz orquestração. A presentation faz interface com o usuário.

6. **Custo de manutenção futuro é baixo** — se o projeto crescer, a refatoração de `test-session.ts` continuará sendo uma operação simples e isolada.

---

## 6. Notas por camada

### Domain — 10/10

| Critério | Nota | Comentário |
| -------- | ---- | ---------- |
| Pureza | 10 | Nenhuma dependência externa, sem IO, sem efeitos colaterais |
| Coesão | 10 | Cada arquivo tem responsabilidade única e clara |
| Acoplamento | 10 | Só depende de `types.ts`, que é do próprio domínio |
| Linguagem ubíqua | 10 | Tipos refletem o vocabulário do problema |
| Testabilidade | 10 | Funções puras, fáceis de testar isoladamente |

### Application — 7/10

| Critério | Nota | Comentário |
| -------- | ---- | ---------- |
| Pureza de orquestração | 7 | `calculate-result.ts` é puro; `test-session.ts` contém validações de negócio |
| Acoplamento | 8 | Depende do domínio e não da infraestrutura (correto), mas acessa dados do domínio diretamente |
| Coesão | 8 | Cada arquivo tem responsabilidade definida, mas `test-session.ts` acumula estado + validação |
| Testabilidade | 10 | Fácil de testar, sem mocks necessários |

### Infrastructure — 9/10

| Critério | Nota | Comentário |
| -------- | ---- | ---------- |
| Isolamento | 9 | Separada e autocontida. Importa tipos da application (necessário para serialização) |
| Robustez | 10 | Tratamento de erros em todas as operações (safeGetItem, safeSetItem, safeRemoveItem) |

### Presentation (composables + views) — 8/10

| Critério | Nota | Comentário |
| -------- | ---- | ---------- |
| Separação | 9 | Composables isolam lógica de estado; views focam em renderização |
| Acoplamento | 8 | `useTestSession` importa do domínio (`QUESTIONS`) — poderia ser via application, mas é aceitável |
| Coesão | 8 | `useTestSession` gerencia navegação, estado, persistência — coeso para um composable de UI |

### Arquitetura geral — 8.5/10

**Pontos fortes:**
- Dependências fluem na direção correta (presentation → application → domain ← infrastructure)
- Domínio puro e testável
- Regras de negócio isoladas em funções puras
- Separação clara entre dados, algoritmo e UI
- Sem over-engineering — a arquitetura é robusta sem ser prolixa

**Pontos a evoluir:**
- Validações de negócio em `test-session.ts` (application) que deveriam estar no domínio
- `useTestSession` importa diretamente do domínio (`QUESTIONS`) — quebra sutil do fluxo de dependências
- Ausência de DTOs explícitos na fronteira application/presentation (aceitável para o tamanho do projeto)

---

## 7. Anexo: diagrama de dependências

```
┌────────────────────────────────────────────────────┐
│ Presentation (views, composables)                   │
│  src/composables/useTestSession.ts                  │
│  src/views/*.vue                                    │
└──────────┬─────────────────────────────┬───────────┘
           │                             │
           ▼                             ▼
┌──────────────────────┐    ┌─────────────────────────┐
│ Application           │    │ Infrastructure           │
│  test-session.ts      │    │  storage/local-storage.ts│
│  calculate-result.ts  │    └──────────┬──────────────┘
└──────────┬───────────┘               │
           │                           │
           ▼                           │
┌──────────────────────┐               │
│ Domain                │◄──────────────┘
│  types.ts             │  (apenas tipos)
│  ministries.ts        │
│  questions.ts         │
│  scoring.ts           │
└──────────────────────┘
```

---

*Auditoria realizada em julho de 2026.*
*Próxima auditoria recomendada: após a introdução de novas funcionalidades que expandam o domínio.*
