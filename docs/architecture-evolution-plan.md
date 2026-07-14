# Plano de Evolução — Dons Espirituais

> **Fase:** Planejamento geral (Sprints 0–5 de refatoração do domínio concluídas)
>
> **Data:** 2026-07-09
>
> **Última atualização:** 2026-07-14 (Sprint 8 — revisão de planejamento)
>
> **Status:** Planejamento

---

## 1. Estrutura Geral do Projeto

O projeto está organizado em 3 fases:

| Fase | Sprints | Status |
|------|---------|--------|
| **Fase 1 — Refatoração do Domínio** | Sprints 0–5 | ✅ Concluída |
| **Fase 2 — Evolução Arquitetural** | Sprints 6–10 | ⏳ Planejamento |
| **Fase 3 — Experiência Institucional** | Sprints 11–13 | 📋 Planejado |

---

## 2. Objetivo da Fase 2

Evoluir a arquitetura do projeto Dons Espirituais de um estado **monolítico com orquestração na view** para uma arquitetura **em camadas com separação clara de responsabilidades**, incorporando os aprendizados do projeto Cinco Ministérios.

A Fase 2 cobre Sprints 6–10 e tem como metas:

- Criar a camada de **Application** (casos de uso)
- Isolar **Infrastructure** (repositories com testes)
- Reorganizar **Presentation** (composables + componentes modulares)
- Estabelecer **CI/CD** e métricas de qualidade
- Documentar decisões arquiteturais

---

## 3. Objetivo da Fase 3

Transformar o Dons Espirituais de "aplicação funcional" para "produto público completo", incorporando elementos institucionais e de publicação que transmitam credibilidade, facilitem o compartilhamento e melhorem a descoberta orgânica.

A Fase 3 cobre Sprints 11–13 e tem como metas:

- Página institucional (Sobre, metodologia, autor)
- Header e footer definitivos com navegação institucional
- SEO, Open Graph, Sitemap, Robots e metadados
- Identidade visual consolidada (logo, cores, assets)
- Informações de licença, contribuição e projetos relacionados

---

## 4. Princípios

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

## 5. Arquitetura Alvo

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

## 6. Roadmap

```
FASE 1 — Refatoração do Domínio ✅
  Sprint 0  — Auditoria
  Sprint 1  — Estratégia de Testes
  Sprint 2  — Migração para TypeScript
  Sprint 3  — Fonte Única dos Dons
  Sprint 4  — Organização Arquitetural
  Sprint 5  — Limpeza e Remoção de Compatibilidade

FASE 2 — Evolução Arquitetural ⏳
  Sprint 6  — Fundação Arquitetural
  Sprint 7  — Application Layer
  Sprint 8  — Correções, Testes e Consolidação
  Sprint 9  — Presentation
  Sprint 10 — Qualidade e Produto

FASE 3 — Experiência Institucional 📋
  Sprint 11 — Identidade Institucional
  Sprint 12 — Layout Institucional
  Sprint 13 — SEO e Publicação
```

---

## 7. Sprints Planejadas — Fase 2 (Detalhamento)

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
- [x] Criar `src/application/` com estrutura de diretórios
- [x] Criar `application/quiz/ports.ts` com `SubmitQuizInput` e `SubmitQuizResult`
- [x] Criar `application/quiz/quiz-session.ts` com `checkSavedSession()` e `clearSession()`
- [x] Extrair `submitQuiz()` do QuizView.vue para `application/quiz/submit-quiz.ts`
- [x] Testes unitários para `submit-quiz` e `quiz-session` em `application/__tests__/`
- [x] Atualizar QuizView.vue para usar a nova camada
- [x] Registrar ADR-012 em `docs/decisions.md`

**Critérios de aceite:**
- `submitQuiz()` testável sem Vue (com `vi.mock()`)
- `quiz-session.ts` gerencia sessão (checkSavedSession, clearSession)
- `ports.ts` contém apenas `SubmitQuizInput` e `SubmitQuizResult`
- Testes em `application/__tests__/` (padrão do projeto, não co-localizados)
- QuizView.vue não orquestra scoring/payload/persistência/side effects
- Nenhuma regra de domínio volta para Views ou Stores
- 78+ testes passando (testes existentes + novos)
- Build intacto
- Nenhuma alteração em stores, repositories, domain ou infrastructure
- `application/results/` não criado

---

### Sprint 8 — Correções, Testes e Consolidação

**Objetivo:** Eliminar violações de camada, padronizar acesso ao Supabase, criar testes de infrastructure, remover código morto, eliminar duplicações e avaliar desacoplamento de componentes.

A Sprint 8 é dividida em 6 etapas sequenciais, cada uma com escopo pequeno e verificação obrigatória (testes + build) antes de avançar.

---

#### Sprint 8.1 — Corrigir violação de camada (Alta)

**Objetivo:** Eliminar a dependência direta de `repositories/` dentro de `UserInfoForm.vue`, fazendo a comunicação ocorrer exclusivamente através da camada Application.

**Justificativa arquitetural:** `UserInfoForm.vue` (Presentation) importa `repositories/authRepository` e `repositories/userRepository` diretamente (linhas 58-59), violando o fluxo de dependências da Clean Architecture. Um componente de UI não deve conhecer detalhes de infraestrutura.

**Arquivos envolvidos:**
- `components/UserInfoForm.vue` — remover imports de repositories; receber `initialData` por prop
- `views/QuizView.vue` — passar `authStore.user` como `initialData` para UserInfoForm

**Estratégia de testes:**
- Testar UserInfoForm com props mockadas (mount + assert rendering)
- Verificar que o formulário emite `submit` com dados corretos
- Executar todos os 92+ testes existentes para garantir zero regressão

**Riscos:**
- Perda de preenchimento automático do nome se QuizView não passar os dados corretamente → mitigado por validação no UserInfoForm

**Complexidade:** Média (~3h)

**Critérios de aceite:**
- [ ] UserInfoForm não importa `repositories/authRepository.js` nem `repositories/userRepository.js`
- [ ] UserInfoForm recebe `initialData` por prop
- [ ] QuizView.vue usa `authStore.user` para preencher `initialData`
- [ ] Todos os 92+ testes passam
- [ ] Build verde
- [ ] Nenhuma regressão funcional no fluxo de quiz

---

#### Sprint 8.2 — Padronizar acesso ao Supabase (Alta)

**Objetivo:** Garantir que todos os métodos dos repositories utilizem o mesmo mecanismo (`runSupabaseQuery`), eliminando inconsistências de timeout e comportamento.

**Justificativa arquitetural:** Atualmente `responseRepository.insert()` e `responseRepository.countByUserId()` não usam `runSupabaseQuery`, ao contrário dos outros 5 métodos do mesmo repository. Essa inconsistência pode causar hangs em produção se a conexão com o Supabase ficar lenta.

**Arquivos envolvidos:**
- `repositories/responseRepository.js` — envolver `insert()` e `countByUserId()` com `runSupabaseQuery` + `DEFAULT_TIMEOUT`

**Estratégia de testes:**
- Testes unitários (Item 8.3) validarão que todos os métodos usam timeout
- Executar build para confirmar comportamento idêntico

**Riscos:**
- Baixo — mudança encapsulada no método, sem alteração de interface

**Complexidade:** Baixa (~30min)

**Critérios de aceite:**
- [ ] `responseRepository.insert()` usa `runSupabaseQuery` com `DEFAULT_TIMEOUT`
- [ ] `responseRepository.countByUserId()` usa `runSupabaseQuery` com `DEFAULT_TIMEOUT`
- [ ] Todos os 7 métodos do repository têm tratamento de timeout consistente
- [ ] Build verde
- [ ] Comportamento funcional idêntico (insert e count continuam funcionando)

---

#### Sprint 8.3 — Criar testes unitários da Infrastructure (Alta)

**Objetivo:** Adicionar cobertura de testes para os repositories antes de realizar novas limpezas de código. Priorizar `responseRepository` e `userRepository`.

**Justificativa arquitetural:** Zero testes de infrastructure atualmente (ADR-005). Sem rede de segurança, qualquer refatoração nos repositories é arriscada. Seguir o padrão ADR-010 (testes antes da refatoração).

**Arquivos envolvidos:**
- `repositories/__tests__/responseRepository.test.js` (criar) — 7+ testes
- `repositories/__tests__/userRepository.test.js` (criar) — 2+ testes

**Estratégia de testes:**
- Mock global do cliente Supabase via `vi.mock('../../services/supabase')`
- Cada teste mocka a chamada específica (`supabase.from().select().eq().single()`, etc.)
- Testar: findById, findByUserId, listAll, insert, updateField, countByUserId, selectField, userRepository.findById

**Riscos:**
- Médio — mock do Supabase pode ser complexo; começar com mock simples (`vi.fn()`) e evoluir

**Complexidade:** Média (~4h)

**Critérios de aceite:**
- [ ] `repositories/__tests__/responseRepository.test.js` com 7+ testes passando
- [ ] `repositories/__tests__/userRepository.test.js` com 2+ testes passando
- [ ] Cobertura estimada de infrastructure: de 0% para ~85%
- [ ] Todos os testes existentes continuam passando

---

#### Sprint 8.4 — Remover código morto (Média)

**Objetivo:** Verificar se `services/aiAnalysis.js` está completamente sem uso. Caso confirmado, remover o arquivo, imports e referências.

**Justificativa arquitetural:** Após a criação da Application Layer (Sprint 7), a camada `services/` perdeu sua razão de existir. O arquivo `services/aiAnalysis.js` contém `regenerateAiAnalysis()` que não é importado por nenhum consumidor — `AiAnalysis.vue` chama stores diretamente.

**Arquivos envolvidos:**
- `services/aiAnalysis.js` — remover (se confirmado sem uso)

**Estratégia de testes:**
- Antes: verificar com `grep -r "aiAnalysis"` se há imports
- Após remoção: executar todos os testes
- Verificar build

**Riscos:**
- Baixo — confirmar com busca textual antes de remover

**Complexidade:** Baixa (~15min)

**Critérios de aceite:**
- [ ] Confirmado que `services/aiAnalysis.js` não é importado por nenhum arquivo
- [ ] `services/aiAnalysis.js` removido
- [ ] Nenhum import quebrado
- [ ] Todos os 95+ testes passam
- [ ] Build verde

---

#### Sprint 8.5 — Eliminar duplicação (Média)

**Objetivo:** Remover duplicações entre `quizStore.checkSavedState()` e `quizSession.checkSavedSession()`. Centralizar a responsabilidade em apenas um local.

**Justificativa arquitetural:** Tanto a store quanto a application layer validam sessão salva em localStorage. Se o formato da sessão mudar, é necessário alterar em 2 lugares. A responsabilidade de validar sessão deve pertencer à Application Layer (ADR-012).

**Decisão arquitetural:** Manter `quizSession.checkSavedSession()` como fonte única. Refatorar `quizStore.checkSavedState()` para delegar a `checkSavedSession()` em vez de replicar a lógica.

**Arquivos envolvidos:**
- `stores/quiz.js` — refatorar `checkSavedState()` para chamar `checkSavedSession()` da application layer em vez de replicar lógica
- `application/quiz/quiz-session.ts` — inalterado (fonte única mantida)

**Estratégia de testes:**
- Testes existentes de `quiz-session.test.ts` (7 testes) validam `checkSavedSession`
- Testes de QuizView.vue (indiretamente) validam que `checkSavedState` continua funcionando
- Executar todos os testes

**Riscos:**
- Médio — `quizStore.checkSavedState()` é chamado por `QuizView.vue`; refatorar requer cuidado com o fluxo de inicialização

**Complexidade:** Baixa (~1h)

**Critérios de aceite:**
- [ ] `quizStore.checkSavedState()` não replica lógica de `quizSession.checkSavedSession()`
- [ ] `quizStore.checkSavedState()` usa `checkSavedSession()` da application layer
- [ ] Fluxo de retomada de sessão continua funcionando
- [ ] Todos os testes passam
- [ ] Build verde

---

#### Sprint 8.6 — Avaliar desacoplamento de componentes (Baixa)

**Objetivo:** Avaliar se `AiAnalysis.vue` e `HistoryList.vue` realmente se beneficiam de receber dados via props em vez de importar stores globais.

**Justificativa arquitetural:** O TODO.md atual lista esses componentes como candidatos a refatoração ("receber dados por props"). No entanto, a decisão não deve ser automática — é necessário avaliar se há ganho claro em reutilização, testabilidade e redução de acoplamento.

**Decisão arquitetural:** Não alterar sem comprovação de benefício. Realizar análise e registrar a decisão.

**Análise de cada componente:**

| Componente | Stores importadas | Beneficiaria de props? | Justificativa |
|---|---|---|---|
| `AiAnalysis.vue` | `authStore`, `aiStore`, `responsesStore` | Parcialmente | O componente gerencia ciclo de vida de geração de IA, polling e subscrição real-time — lógica que exige acesso a stores. Props reduziriam acoplamento, mas aumentariam a complexidade de `ResultsView.vue` que precisaria passar todos os dados e callbacks. |
| `HistoryList.vue` | `authStore`, `responsesStore` | Sim, mas ganho marginal | O componente é usado apenas em `ResultsView.vue`. A refatoração para props traria testabilidade, mas o componente tem apenas 63 linhas e escopo limitado. |

**Resultado da avaliação:** Manter o estado atual para ambos os componentes. Os ganhos potenciais não justificam o risco de regressão no fluxo de análise IA e histórico de resultados neste momento. Reavaliar na Sprint 9 (Presentation) quando composables forem introduzidos.

**Arquivos envolvidos:** Nenhum (decisão de manter)

**Complexidade:** Muito Baixa (~15min, apenas documentação)

**Critérios de aceite:**
- [ ] Análise documentada neste plano
- [ ] Decisão registrada
- [ ] Nenhuma alteração de código
- [ ] Todos os testes existentes passam

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

---

### Sprint 11 — Identidade Institucional

**Objetivo:** Criar a presença institucional do projeto.

**Atividades:**
- [ ] Criar `views/AboutView.vue` com:
  - Objetivo do projeto
  - Metodologia do teste (C. Peter Wagner)
  - Base utilizada (27 dons, 135 afirmações)
  - Tecnologias utilizadas
  - Informações do autor
  - Licença
  - Como contribuir (link para GitHub)
  - Outros projetos relacionados
- [ ] Criar `components/ui/AppLogo.vue` (componente reutilizável do logotipo)
- [ ] Configurar rota `/sobre`
- [ ] Adicionar link para página Sobre no header existente
- [ ] Testes do componente

**Critérios de aceite:**
- Página Sobre completa e responsiva
- Logo componente reutilizável
- Rota `/sobre` funcional
- Navegação a partir do header

---

### Sprint 12 — Layout Institucional

**Objetivo:** Consolidar header, footer e navegação institucional.

**Atividades:**
- [ ] Criar `components/ui/AppFooter.vue` com:
  - Navegação institucional (Sobre, Teste, Resultados)
  - Informações de copyright
  - Versão da aplicação
  - Link para GitHub
  - Informações do autor
- [ ] Revisar `components/ui/AppHeader.vue` para versão definitiva:
  - Logo institucional
  - Navegação completa
  - Toggle de tema (já existe)
  - Links para Sobre e GitHub
- [ ] Integrar footer ao layout principal (DefaultLayout ou App.vue)
- [ ] Garantir consistência visual (cores, tipografia, espaçamentos)
- [ ] Testes dos componentes

**Critérios de aceite:**
- Header e footer presentes em todas as páginas
- Navegação funcional entre todas as rotas
- Informações de copyright e versão visíveis
- Responsivo (mobile e desktop)

---

### Sprint 13 — SEO e Publicação

**Objetivo:** Preparar o projeto para descoberta orgânica e compartilhamento em redes sociais.

**Atividades:**
- [ ] Meta tags HTML (`<title>`, `<meta name="description">`, etc.) em todas as páginas
- [ ] Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) no layout principal
- [ ] Imagem/card para compartilhamento social
- [ ] `sitemap.xml` gerado ou estático
- [ ] `robots.txt` configurado
- [ ] `manifest.json` configurado (avaliar PWA — service worker + ícones)
- [ ] `favicon.ico` e `apple-touch-icon`
- [ ] Revisão de performance (Lighthouse)

**Critérios de aceite:**
- Lighthouse ≥ 80 em todas as categorias
- Open Graph funcional (testar com facebook/twitter debugger)
- Sitemap e robots acessíveis
- Manifest configurado
- Links de compartilhamento com preview enriquecido

---

## 9. Critérios de Aceite

### Fase 2 — Evolução Arquitetural

A Fase 2 será considerada concluída quando:

- [ ] Application Layer criada e testada
- [ ] Infrastructure isolada e testada
- [ ] Presentation organizada com composables
- [ ] CI/CD estabelecido
- [ ] Cobertura de testes ≥ 90%
- [ ] Decisões documentadas em docs/decisions.md
- [ ] Zero regressão funcional
- [ ] README.md reflete arquitetura atual

### Fase 3 — Experiência Institucional

A Fase 3 será considerada concluída quando:

- [ ] Página Sobre completa com metodologia, autor, licença e contribuição
- [ ] Logo componente reutilizável criado
- [ ] Header definitivo com navegação institucional
- [ ] Footer institucional em todas as páginas
- [ ] Open Graph funcional em páginas compartilháveis
- [ ] Sitemap e robots configurados
- [ ] Lighthouse ≥ 80 em todas as categorias
- [ ] Identidade visual consolidada

---

## 10. Fora do Escopo (Desta Fase)

- Migração do Supabase para outro backend
- Substituição do Vuetify
- Migração completa para TypeScript (será incremental)
- Refatoração do AdminView
- FAQ
- Internacionalização (i18n)
