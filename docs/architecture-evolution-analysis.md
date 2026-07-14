# Análise Arquitetural — Dons Espirituais vs Cinco Ministérios

> **Data:** 2026-07-09
>
> **Última atualização:** 2026-07-14 (Sprint 8 — análise após v1.7.0)
>
> **Contexto:** Avaliação da arquitetura atual do Dons Espirituais à luz da referência Cinco Ministérios (v5.2.0, 134 testes, 13 documentos de arquitetura)

---

## 1. Estado Atual do Dons por Camada

### 1.1 Domínio — Nota: 8/10

**Situação:** Consolidado. `domain/spiritual-gifts.ts` + `domain/scoring.ts`. TypeScript, funções puras, sem dependência de framework.

**Pontos fortes:**
- Fonte única dos 27 dons (SSOT)
- Constantes derivadas (`GIFT_COUNT`, `giftNames`, `giftById`)
- Funções puras e testáveis
- `calculateScores`, `rankGifts`, `formatScoresForAI`, `topGift` — coesas e pequenas

**Problemas:**
- `color: '#1B5438'` repetido 27 vezes (poderia ser default/constante)
- Acoplamento posicional `i % 27` entre questions.js e spiritual-gifts.ts — sem verificação runtime
- Domínio não expõe validações (`isValidGiftId`, `isValidQuestionId`)
- Tipos do domínio estão inline nos arquivos (não em `types.ts` separado)

**Riscos:**
- Baixo. O domínio está maduro e testado.

**Oportunidades:**
- Extrair `types.ts` com interfaces compartilhadas
- Adicionar funções de validação no domínio
- Extrair `color` para constante

---

### 1.2 Application Layer — Nota: 7/10

**Situação:** Criada na Sprint 7. `application/quiz/` com `submit-quiz.ts`, `quiz-session.ts`, `ports.ts`. 14 testes. `QuizView.vue` simplificado.

**Pontos fortes:**
- `submitQuiz()` testável sem Vue (com `vi.mock()`) — 7 testes
- `quiz-session.ts` gerencia sessão localStorage (checkSavedSession, clearSession)
- `ports.ts` com `SubmitQuizInput` e `SubmitQuizResult` — contratos claros
- ADR-012 estabelece padrão para todos os casos de uso futuros
- QuizView.vue não orquestra mais scoring/payload/persistência/side effects

**Problemas:**
- `services/aiAnalysis.js` (17 linhas) duplica lógica que deveria estar na application layer — `regenerateAiAnalysis()` faz validação + invoke + selectField
- Application layer cobre apenas submit-quiz; não há casos de uso para regenerate-analysis, calculate-result
- `quiz-session.ts` lê localStorage diretamente — infraestrutura de persistência na application layer

**Riscos:**
- Baixo. Camada estabelecida e testada.

**Oportunidades (Sprint 8):**
- Remover `services/aiAnalysis.js` (código órfão — 8.4)
- Eliminar duplicação entre `quizStore.checkSavedState()` e `quizSession.checkSavedSession()` (8.5)

---

### 1.3 Infrastructure — Nota: 5/10

**Situação:** `repositories/` com acesso direto ao Supabase. 4 arquivos (response, ai, auth, user). Zero testes.

**Pontos fortes:**
- Separado em arquivos por entidade (response, ai, auth, user)
- `services/supabaseQuery.js` fornece `runSupabaseQuery` com timeout (10s)
- 5 dos 7 métodos de `responseRepository` usam `runSupabaseQuery`

**Problemas:**
- Zero testes de infraestrutura
- Inconsistência de timeout: `insert()` e `countByUserId()` não usam `runSupabaseQuery`
- `UserInfoForm.vue` (Presentation) importa `authRepository` e `userRepository` diretamente — violação de camada

**Riscos:**
- Médio. Inconsistência de timeout pode causar hangs em insert.
- Baixo. Falta de testes dificulta refatoração.

**Oportunidades (Sprint 8):**
- Padronizar timeout em todos os métodos (8.2)
- Criar testes de infrastructure com mock Supabase (8.3)
- Corrigir violação de camada no UserInfoForm (8.1)

---

### 1.4 Presentation — Nota: 7/10

**Situação:** Views + Components + Stores (Pinia). Design System em evolução. Application Layer já reduziu orquestração no QuizView.

**Pontos fortes:**
- Design System com componentes reutilizáveis (AppPage, AppCard, AppButton, CollapsibleCard, etc.)
- `design_plan.md` bem documentado (965 linhas)
- Separação clara entre `components/ui/` (DS) e componentes de domínio
- QuizView.vue simplificado (orquestração movida para application layer)

**Problemas:**
- `UserInfoForm.vue` importa `repositories/` diretamente — violação de camada (Sprint 8.1)
- `AiAnalysis.vue` e `HistoryList.vue` importam stores globais — acoplamento a ser avaliado (Sprint 8.6)
- `stores/quiz.js` duplica lógica de `quizSession.checkSavedSession()` (Sprint 8.5)
- `ResultsView.vue` (285 linhas) — gerencia estado, edição de nome, share, print, tudo diretamente
- `AdminView.vue` (572 linhas) — maior view do projeto, múltiplas responsabilidades

**Riscos:**
- Baixo. Violações identificadas têm plano de correção na Sprint 8.

**Oportunidades (Sprint 8):**
- Corrigir violação UserInfoForm (8.1)
- Eliminar duplicação quizStore/quizSession (8.5)
- Avaliar desacoplamento de AiAnalysis e HistoryList (8.6)

---

### 1.5 Testes — Nota: 6.5/10

**Situação:** 92 testes, Vitest, 6 arquivos de teste.

**Pontos fortes:**
- Domínio bem testado (75 testes)
- Application layer com 14 testes
- Testes rápidos (~210ms)
- Application tests isolados com `vi.mock()` (sem Vue)

**Problemas:**
- 0 testes de infrastructure (repositories sem teste)
- 0 testes de stores/composables
- Testes de domínio (`scoring`) localizados em `services/__tests__/` em vez de `domain/__tests__/`
- Cobertura não medida oficialmente

**Riscos:**
- Médio. Refatorar repositories sem testes é arriscado.
- Baixo. Application layer já tem rede de segurança.

**Oportunidades (Sprint 8):**
- Infrastructure tests com mock Supabase (8.3) — 7+ testes para responseRepository, 2+ para userRepository
- Cobertura estimada de infrastructure: 0% → ~85%
- Estimativa total após Sprint 8: ~105+ testes

---

### 1.6 Documentação — Nota: 6/10

**Situação:** `docs/gift-system-plan*` (refatoração concluída), `docs/design_plan.md`, CHANGELOG.md, README.md.

**Pontos fortes:**
- Plano de refatoração bem documentado (3 documentos, Sprints 0–5)
- Design System documentado
- CHANGELOG versionado

**Problemas:**
- Sem `docs/decisions.md` — decisões arquiteturais não registradas
- Sem `docs/application.md`, `docs/infrastructure.md`, `docs/presentation.md`
- `docs/gift-system-plan*` descreve o passado (refatoração concluída) — não cobre a nova fase

**Oportunidades:**
- Criar `docs/decisions.md`
- Criar documentação por camada

---

### 1.7 Design System — Nota: 7/10

**Situação:** Componentes base em `components/ui/`, tokens definidos em `design_plan.md`.

**Pontos fortes:**
- Componentes reutilizáveis: AppPage, AppCard, AppButton, CollapsibleCard, PageHeader, SectionTitle, LoadingState, ErrorState, EmptyState, AppStat
- Tema claro/escuro via Vuetify `useTheme()`
- Documentação em `design_plan.md`

**Problemas:**
- Tokens não materializados em arquivo de variáveis CSS (estão apenas no `design_plan.md`)
- Tema Vuetify em `plugins/` (não junto dos tokens)
- Alguns componentes ainda usam `v-btn` raw (21 ocorrências no TODO)

**Oportunidades:**
- Criar `src/styles/tokens/` com variáveis CSS
- Mover tema Vuetify para `styles/theme/`
- Substituir `v-btn` raw por AppButton

---

### 1.8 CI/CD — Nota: 0/10

**Situação:** Inexistente. Não há pipeline automatizada.

**Riscos:**
- Alto. Sem validação automática em commits/PRs.
- Médio. Build e testes só são executados manualmente.

**Oportunidades:**
- GitHub Actions com lint + typecheck + test + build (Sprint 10)

---

### 1.9 TypeScript — Nota: 4/10

**Situação:** Apenas `domain/` está em TypeScript. Todo o resto é JavaScript.

**Pontos fortes:**
- Domínio tipado e seguro
- Interface `Gift`, tipos `Scores`, `RankedGift`

**Problemas:**
- Stores, repositories, services, helpers, views, components — todos `.js`
- Sem `tsconfig.json` formal (Vite compila TS nativamente, mas sem checagem rigorosa)
- Sem type-check no CI

**Oportunidades:**
- Migração incremental, começando por application layer (Sprint 7)
- Configurar `tsconfig.json` com `strict: true`
- Type-check no CI (Sprint 10)

---

## 2. Comparação com a Referência Cinco Ministérios

### Práticas que DEVEM ser incorporadas

| Prática | Como aplicar no Dons |
|---------|---------------------|
| Application Layer explícita | Criar `application/` com casos de uso |
| Composables como ponte | `useQuizSession`, `useResults` |
| Infrastructure tests | Mock Supabase, testar cada adaptador |
| Decisions.md | Registrar decisões arquiteturais |
| Documentação por camada | `docs/application.md`, `docs/infrastructure.md` |
| Testes por camada | Application + Infrastructure + Composable tests |
| Validação no domínio | `isValidGiftId()`, `isValidQuestionId()` |
| Tokens CSS como variáveis | Arquivo `tokens.css` com cores, espaçamentos |

### Práticas que NÃO fazem sentido para o Dons

| Prática | Motivo |
|---------|--------|
| localStorage como persistência principal | Dons usa Supabase (backend real) |
| Offline first | Dons tem autenticação e dados no servidor |
| Tailwind CSS | Dons já usa Vuetify — adicionar Tailwind aumentaria complexidade sem benefício |
| Módulos independentes como pastas separadas | Dons é menor — componentes planos em `components/quiz/` e `components/results/` são suficientes |
| `@/` alias | Dons já deve ter (Vite padrão) — verificar se está configurado |

### Diferenças Tecnológicas

| Aspecto | Dons | Cinco Ministérios |
|---------|------|-------------------|
| Framework | Vue 3 + Vuetify | Vue 3 + Vuetify + Tailwind |
| Persistência | Supabase (online) | localStorage (offline) |
| Autenticação | Supabase Auth (Google OAuth) | Nenhuma |
| Estado | Pinia stores | Composables |
| IA | OpenAI via Edge Functions | N/A |
| Admin | AdminView com CRUD | N/A |
| Testes | 78 (Vitest) | 134 (Vitest) |
| Tipo | Multi-usuário com roles | Single usuário, sem auth |

### Diferenças de Contexto

- O Dons é uma aplicação **multi-usuário com backend real** (Supabase) — logo, tem mais complexidade de infraestrutura que o Cinco Ministérios
- O Cinco Ministérios é um **teste pequeno (6 perguntas, 5 ministérios)** enquanto o Dons tem **135 perguntas, 27 dons** — escala diferente
- O Cinco Ministérios tem **134 testes** para uma base de código menor; o Dons tem **78 testes** para uma base maior
- O Dons tem **IA generativa** como funcionalidade core — camada adicional que o Cinco Ministérios não tem

---

## 3. Débitos Técnicos

### Críticos

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| Application Layer inexistente | N/A | Impossibilidade de testar fluxos | 7 | ✅ Resolvido |
| Violação de camada: Presentation → Infrastructure | UserInfoForm.vue | Componente acessa repositories diretamente | 8.1 | 🔴 Pendente |
| Zero testes de infrastructure | repositories/ | Refatoração arriscada | 8.3 | 🔴 Pendente |
| Sem CI/CD | N/A | Risco de regressão não detectada | 10 | ⏳ Futuro |

### Altos

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| `submitQuiz()` na view | QuizView.vue | Orquestrador monolítico | 7 | ✅ Resolvido |
| Tratamento de erros inconsistente | repositories/ | Possíveis hangs (insert sem timeout) | 8.2 | 🔴 Pendente |
| Duplicação checkSavedSession | stores/quiz.js + application/quiz/quiz-session.ts | Duas validações de sessão | 8.5 | 🟡 Pendente |
| Código órfão services/aiAnalysis.js | services/ | Camada services sem propósito | 8.4 | 🟡 Pendente |
| Stores sem testes | stores/ | Refatoração de stores sem rede de segurança | 9 | ⏳ Futuro |
| Sem type-check | Projeto inteiro | Erros de tipo só aparecem em runtime | 10 | ⏳ Futuro |

### Médios

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| Acoplamento posicional i%27 | questions.js ↔ spiritual-gifts.ts | Mudança na ordem quebra scores | 7 | ⚠️ Identificado |
| `color` repetido 27x | spiritual-gifts.ts | Ruim, mas sem risco funcional | — | 📋 Backlog |
| 21 v-btn raw no código | Vários | Inconsistência de Design System | 9 | ⏳ Futuro |

### Baixos

| Item | Local | Impacto | Sprint | Status |
|------|-------|---------|--------|--------|
| Components planos (sem módulos) | components/ | Dificuldade de navegação | 9 | ⏳ Futuro |
| Views grandes | ResultsView (285 linhas) | Manutenibilidade | 9 | ⏳ Futuro |
| AiAnalysis/HistoryList acoplados a stores | components/ | Reutilização limitada | 8.6 | 📋 Avaliado — manter |

---

## 4. Riscos

| Risco | Prob | Impacto | Mitigação |
|-------|:----:|:-------:|-----------|
| Quebrar submit ao extrair application layer | Média | Alto | Manter código original funcionando durante extração; testes antes da migração |
| Regressão em repositories ao refatorar | Média | Alto | Testes de infrastructure com mock Supabase (Sprint 8.3) |
| Perder estado de quiz ao refatorar stores | Baixa | Alto | Migração incremental com compatibilidade |
| Application layer virar "garbage can" | Média | Médio | Definir responsabilidades claras; casos de uso pequenos |
| Aumento de complexidade sem benefício | Baixa | Médio | Seguir YAGNI — só criar o que for usado imediatamente |
| TypeScript migration lenta | Alta | Baixo | Incremental, sem bloqueio |
| **UserInfoForm perder preenchimento automático** (8.1) | Baixa | Alto | QuizView.vue usa `authStore.user` para initialData |
| **Mock do Supabase complexo** (8.3) | Média | Médio | Começar com mock simples (`vi.fn()`); evoluir gradualmente |
| **Duplicação checkSavedState quebrar retomada** (8.5) | Baixa | Alto | Testes existentes validam fluxo de retomada |
| **Remover aiAnalysis.js e algo importá-lo** (8.4) | Baixa | Médio | Verificar com grep antes de remover |

---

## 5.1 Evolução Institucional

### Por que essa fase agrega valor ao projeto

O projeto Dons Espirituais está em produção (usuários reais fazendo o teste), mas não possui os elementos institucionais mínimos esperados por uma aplicação pública:

- Não há página Sobre explicando o propósito, a metodologia ou o autor
- Não há footer com informações institucionais, licença ou links
- Não há SEO, Open Graph ou metadados de compartilhamento
- A identidade visual não está consolidada em um componente de logotipo reutilizável

A implementação desses elementos transforma a aplicação de "projeto funcional" para "produto público completo".

### Por que deve acontecer após a consolidação arquitetural

1. **Dependência de infraestrutura:** A página Sobre e o footer não dependem de Application Layer ou Infrastructure — são componentes de apresentação puros
2. **Momento adequado:** Após a reorganização da Presentation (Sprint 9), os padrões de componente e composable já estarão estabelecidos
3. **Sem risco de retrabalho:** Se feita antes, a institucionalização poderia precisar de refatoração quando a estrutura de componentes mudar
4. **Paralelismo potencial:** Sprints institucionais tem escopo bem isolado da arquitetura — baixo risco de conflito

### Benefícios para usuários

- Entendem o propósito e a metodologia do teste
- Sabem quem desenvolveu e como contribuir
- Compartilham resultados com preview enriquecido (Open Graph)
- Navegação institucional consistente (header + footer)

### Benefícios para novos desenvolvedores

- Encontram contexto do projeto (readme + página Sobre)
- Entendem a licença e as diretrizes de contribuição
- Identificam outros projetos relacionados
- Documentação institucional como porta de entrada

### Benefícios para manutenção do projeto

- SEO melhora o ranqueamento e a descoberta orgânica
- Open Graph enriquece o compartilhamento em redes sociais
- Identidade visual consolidada reduz decisões de design futuras
- Header e footer reutilizáveis centralizam navegação

---

## 6. Decisões Recomendadas

### D01 — Application Layer é prioridade máxima
Criar `application/` antes de qualquer outra mudança. A inexistência desta camada é o maior débito técnico.

### D02 — Composables complementam Pinia, não substituem
Pinia stores existentes continuam funcionando. Composables são adicionados para novos casos de uso ou quando houver refatoração clara.

### D03 — Infrastructure isolada mas compatível
Repositories existentes não são removidos. Novos adaptadores em `infrastructure/` são adicionados progressivamente.

### D04 — Testes antes da refatoração (padrão Sprint 1)
Seguir o mesmo padrão da Sprint 1: criar testes para a camada existente antes de refatorar. Garantir que os testes passam antes e depois.

### D05 — TypeScript incremental
Sprint 7 (application) já em TS. Infrastructure e Presentation migram gradualmente. Sem meta de 100% nesta fase.

### D06 — CI/CD só na Sprint 10
Não antecipar. Pipeline sem application layer testada teria valor limitado.

### D07 — Decisions.md imediatamente
Criar na Sprint 6 para registrar decisões desde o início da fase.

### D08 — Tokens CSS imediatamente
Criar variáveis CSS na Sprint 6 — baixo esforço, alto benefício.
