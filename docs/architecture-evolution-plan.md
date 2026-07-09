# Plano de Evolução Arquitetural — Dons Espirituais

> **Fase:** Pós-refatoração do domínio (Sprints 0–5 concluídas)
>
> **Data:** 2026-07-09
>
> **Status:** Planejamento

---

## 1. Objetivo da Fase

Evoluir a arquitetura do projeto Dons Espirituais de um estado **monolítico com orquestração na view** para uma arquitetura **em camadas com separação clara de responsabilidades**, incorporando os aprendizados do projeto Cinco Ministérios.

A fase atual cobre Sprints 6–10 e tem como metas:

- Criar a camada de **Application** (casos de uso)
- Isolar **Infrastructure** (repositories com testes)
- Reorganizar **Presentation** (composables + componentes modulares)
- Estabelecer **CI/CD** e métricas de qualidade
- Documentar decisões arquiteturais

---

## 2. Princípios

### Derivados do Dons (mantidos)

| Princípio | Origem |
|-----------|--------|
| Single Source of Truth | Sprint 3 consolidada |
| Domínio puro sem framework | Sprint 2–4 consolidada |
| Testes como rede de segurança | Sprint 1 consolidada |
| Evolução incremental sem big bang | Sprints 0–5 |
| Compatibilidade funcional preservada | Todo o projeto |

### Derivados da Referência Cinco Ministérios (incorporados)

| Princípio | Justificativa |
|-----------|---------------|
| Application Layer explícita | Isola casos de uso da view; permite testar fluxos sem Vue |
| Composables como ponte UI-camadas | Separa estado de apresentação da lógica de orquestração |
| Infrastructure isolada e testada | Repositories devem ser testáveis independentemente do Supabase |
| Decisões documentadas | Decisions.md evita retrabalho e mantém histórico |
| Testes por camada | Cada camada (domain, application, infrastructure, presentation) tem seus próprios testes |

### Aplicáveis de forma adaptada

| Princípio | Adaptação |
|-----------|-----------|
| Offline first | Dons depende de Supabase — não é offline. Mas localStorage é usado para quiz state (já existe) |
| Módulos independentes | Dons tem escopo menor — módulos seriam: quiz, results, admin, auth |
| Tokens CSS puros | Dons já tem design_plan.md — criar arquivo de variáveis CSS |

---

## 3. Arquitetura Alvo

```
packages/frontend/src/
  domain/               # Regras de negócio PURAS (já consolidado)
    spiritual-gifts.ts  # Fonte única dos 27 dons
    scoring.ts          # Cálculo, ranking, topGift
    types.ts            # (opcional) tipos compartilhados do domínio

  application/          # Casos de uso (NOVO)
    quiz/
      submit-quiz.ts    # Orquestra scoring + persistência + notificação
      resume-session.ts # Gerencia retomada de quiz
    results/
      calculate-result.ts # Orquestra cálculo + formatação
    analysis/
      generate-analysis.ts # Orquestra IA + polling
    auth/
      login.ts          # Fluxo de autenticação

  infrastructure/       # Adaptadores de infraestrutura (NOVO)
    storage/
      localStorage.ts   # Quiz state persistence
    supabase/
      response-repo.ts  # CRUD respostas
      ai-repo.ts        # Invocação Edge Functions
      auth-repo.ts      # Autenticação Supabase
      user-repo.ts      # Perfil de usuário

  presentation/         # Tudo que depende de Vue (NOVO)
    composables/        # (NOVO) Lógica reutilizável com estado
      useQuizSession.ts # Integra application + UI
      useResults.ts     # Carrega e gerencia resultado
      useAuth.ts        # Estado de autenticação
    stores/             # Pinia (mantido onde fizer sentido)
      quiz.js           # Estado do quiz (pode evoluir para composable)
      responses.js      # Lista de respostas (pode permanecer Pinia)
      ai.js             # Subscrições IA (pode permanecer Pinia)
      auth.js           # Auth state (pode permanecer Pinia)
    components/
      ui/               # Design System (já existe)
      quiz/             # Componentes de quiz (NOVO)
      results/          # Componentes de resultados (NOVO)
    views/              # Páginas (já existe)

  constants/            # Constantes de apresentação
    likert.js           # Escala Likert (já existe)

  helpers/              # Utilitários puros (já existe)
```

### Fluxo de Dependências

```
Views (Vue)
  ↓ importa/depende
Composables / Stores (Presentation)
  ↓ importa
Application (use cases)
  ↓ importa
Domain (regras puras) ↔ Infrastructure (adaptadores)
```

### Dependências Proibidas

- **Views** não podem importar Domain diretamente (devem passar por Application)
- **Domain** não pode importar Infrastructure, Application ou Presentation
- **Application** não pode importar Presentation
- **Infrastructure** não pode importar Domain (apenas tipos)

---

## 4. Roadmap

```
Sprint 6 — Fundação Arquitetural (atual)
  docs/architecture-evolution-plan.md
  docs/architecture-evolution-analysis.md
  docs/architecture-evolution-log.md
  docs/decisions.md
  Nenhuma alteração de código

Sprint 7 — Application Layer
  application/quiz/submit-quiz.ts
  application/quiz/resume-session.ts
  application/results/calculate-result.ts
  Testes dos casos de uso

Sprint 8 — Infrastructure
  infrastructure/supabase/response-repo.ts
  infrastructure/supabase/ai-repo.ts
  Testes de infraestrutura
  Tratamento de erros padronizado

Sprint 9 — Presentation
  Composables (useQuizSession, useResults)
  Modularização de componentes (quiz/, results/)
  Redução de acoplamento views-stores

Sprint 10 — Qualidade e Produto
  CI/CD (GitHub Actions)
  Cobertura de testes (target: 90%+ statements)
  SEO, PWA, Open Graph
  Documentação final
```

---

## 5. Sprints Planejadas (Detalhamento)

### Sprint 6 — Fundação Arquitetural

**Objetivo:** Documentação, decisões e preparação. Sem alteração de código.

**Atividades:**
- [ ] Criar docs/architecture-evolution-plan.md
- [ ] Criar docs/architecture-evolution-analysis.md
- [ ] Criar docs/architecture-evolution-log.md
- [ ] Criar docs/decisions.md
- [ ] Revisar e aprovar arquitetura alvo
- [ ] Preparar estrutura de diretórios (vazia) para sprints seguintes

**Critérios de aceite:**
- Documentos aprovados pela equipe
- Arquitetura alvo revisada
- Riscos identificados

---

### Sprint 7 — Application Layer

**Objetivo:** Extrair casos de uso reais da apresentação.

**Atividades:**
- [ ] Criar `src/application/` com estrutura de diretórios
- [ ] Extrair `submitQuiz()` do QuizView.vue para `application/quiz/submit-quiz.ts`
- [ ] Extrair lógica de retomada para `application/quiz/resume-session.ts`
- [ ] Criar `application/results/calculate-result.ts`
- [ ] Testes unitários para cada caso de uso
- [ ] Atualizar QuizView.vue para usar a nova camada

**Critérios de aceite:**
- `submitQuiz()` testável sem Vue
- QuizView.vue reduzido em ~50 linhas
- 78+ testes passando (testes existentes + novos)
- Build intacto

---

### Sprint 8 — Infrastructure

**Objetivo:** Melhorar isolamento e testes dos repositories.

**Atividades:**
- [ ] Criar `src/infrastructure/supabase/` com adaptadores
- [ ] Padronizar tratamento de erros (timeout, fallback, logging)
- [ ] Testes de unidade para cada adaptador (com mock Supabase)
- [ ] Manter compatibilidade com consumidores existentes

**Critérios de aceite:**
- Cada repository tem testes
- Tratamento de erros consistente
- Zero regressão nos consumidores

---

### Sprint 9 — Presentation

**Objetivo:** Organização de componentes, composables e stores.

**Atividades:**
- [ ] Criar `src/presentation/composables/`
- [ ] Criar `useQuizSession` (encapsula quiz store + application)
- [ ] Criar `useResults` (encapsula responses store + application)
- [ ] Modularizar componentes (quiz/, results/)
- [ ] Reduzir imports diretos de domain nas views

**Critérios de aceite:**
- Composables testáveis
- Views importam preferencialmente de composables ou application
- Componentes organizados por domínio

---

### Sprint 10 — Qualidade e Produto

**Objetivo:** CI/CD, cobertura, SEO, documentação.

**Atividades:**
- [ ] CI/CD via GitHub Actions (lint + typecheck + test + build)
- [ ] Target coverage 90%+ statements
- [ ] SEO (meta tags, sitemap, Open Graph)
- [ ] PWA (manifest, service worker)
- [ ] Documentação final atualizada
- [ ] CHANGELOG.md preparado para v2.0.0

**Critérios de aceite:**
- Pipeline CI/CD funcional
- Cobertura ≥ 90%
- Lighthouse ≥ 80 em todas as categorias
- Documentação completa

---

## 6. Critérios de Aceite (Fase Completa)

A fase de evolução arquitetural será considerada concluída quando:

- [ ] Application Layer criada e testada
- [ ] Infrastructure isolada e testada
- [ ] Presentation organizada com composables
- [ ] CI/CD estabelecido
- [ ] Cobertura de testes ≥ 90%
- [ ] Decisões documentadas em docs/decisions.md
- [ ] Zero regressão funcional
- [ ] README.md reflete arquitetura atual

---

## 7. Fora do Escopo (Desta Fase)

- Migração do Supabase para outro backend
- Substituição do Vuetify
- Migração completa para TypeScript (será incremental)
- Refatoração do AdminView
- Novas funcionalidades (FAQ, páginas institucionais)
- Internacionalização (i18n)
