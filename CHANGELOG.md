# Changelog

Todas as alterações relevantes deste projeto serão documentadas aqui.

---

## [1.8.0] - Julho/2026

### Sprint 8 — Consolidação Arquitetural

**Sprint 8 concluída.** Correções de camada, padronização, testes de infrastructure, remoção de código morto, consolidação de sessão e auditoria de desacoplamento.

### Sprint 8.6 — Auditoria de desacoplamento Presentation

* `AiAnalysis.vue` analisado — dependências: `useAuthStore()`, `useAiStore()`, `useResponsesStore()`. Decisão: **manter** — acoplamento aceitável dentro da arquitetura Vue + Pinia.
* `HistoryList.vue` analisado — dependências: `useAuthStore()`, `useResponsesStore()`. Decisão: **manter** — custo de remoção supera benefício atual.
* Nenhuma violação grave encontrada na Presentation Layer.
* Débito técnico registrado como baixa prioridade para futura reavaliação.
* Nenhum arquivo de código fonte alterado nesta sprint.

### Resumo Sprint 8

| Sub-sprint | Entregue |
|---|---|
| 8.1 | Violação de camada UserInfoForm corrigida — `application/auth/user-profile.ts` criado |
| 8.2 | `responseRepository.insert()` e `countByUserId()` padronizados com `runSupabaseQuery` |
| 8.3 | 13 testes de infrastructure — `responseRepository` (10) + `userRepository` (3) |
| 8.4 | `services/aiAnalysis.js` removido — código órfão sem consumidores |
| 8.5 | Duplicação `checkSavedState` eliminada — sessão centralizada em Application Layer |
| 8.6 | Auditoria de desacoplamento Presentation — decisão de manter estado atual |

### Métricas finais Sprint 8

* Testes: **92 → 110** (+18)
* Arquivos de teste: **6 → 9**
* Violações de camada: **1 → 0**
* Inconsistência de timeout: **2 métodos → 0**
* Código órfão: **1 arquivo removido**
* Duplicação de sessão: **eliminada**
* Nenhum Supabase real utilizado nos novos testes
* Build verde (787 módulos)

### Testes

* 110 testes passando (92 existentes + 18 novos)
* 9 arquivos de teste (7 existentes + 2 novos)
* Cobertura adicionada: repositories (responseRepository, userRepository)

### Build

* 787 módulos transformados
* Build verde
* Nenhuma regressão funcional

---

### Sprint 8.1 — Correção de Violação de Camada

* Criação do caso de uso `application/auth/user-profile.ts` — obtenção de dados do usuário autenticado via Application Layer
* Criação de `application/auth/ports.ts` com interface `UserProfile`
* `UserInfoForm.vue` deixou de importar repositories diretamente — passou a consumir `getUserProfile()` da Application Layer
* Eliminação da dependência direta Presentation → Infrastructure

### Sprint 8.2 — Padronização de Acesso ao Supabase

* `responseRepository.insert()` migrado para `runSupabaseQuery()` com timeout de 10s
* `responseRepository.countByUserId()` migrado para `runSupabaseQuery()` com timeout de 10s
* Todos os 7 métodos do responseRepository usam `runSupabaseQuery` consistentemente
* Zero acessos `await supabase.from(...)` sem wrapper nos repositories

### Sprint 8.3 — Testes da Infrastructure

* Criação de `repositories/tests/responseRepository.test.js` com 10 testes:
  - `findById()` — retorno e erro
  - `findByUserId()` — lista e limit
  - `insert()` — persistência com retorno de id
  - `countByUserId()` — contagem e zero
  - `updateField()` — execução sem erro
  - `selectField()` — valor e null
* Criação de `repositories/tests/userRepository.test.js` com 3 testes:
  - `findById()` — encontrado, não encontrado, erro propagado
* Mocks no query builder do Supabase via `vi.hoisted() + vi.mock()` — sem mock em `supabaseQuery.js`
* Zero acesso a Supabase real

### Testes

* 5 novos testes para `application/auth/user-profile.ts`
* 13 novos testes para repositories (10 responseRepository + 3 userRepository)
* `UserInfoForm.vue` validado sem regressão
* Total: **110 testes passando** (92 existentes + 18 novos)
* 9 arquivos de teste (7 existentes + 2 novos)

### Sprint 8.4 — Remoção de código morto

* `services/aiAnalysis.js` removido — código órfão sem consumidores
* `stores/ai.js → regenerate()` recebeu validações migradas do arquivo removido:
  - `if (!responseId) throw new Error('responseId obrigatório')`
  - `if (!name?.trim()) throw new Error('name obrigatório')`
* Nenhuma referência restante ao código removido
* 110 testes passando, build verde

### Sprint 8.5 — Eliminar duplicação de lógica de sessão

* `stores/quiz.js → checkSavedState()` delegado a `application/quiz/quiz-session.ts → checkSavedSession()`
* Store deixou de conhecer regra de leitura de sessão (localStorage, JSON.parse, validação)
* `application/quiz/quiz-session.ts` permanece como fonte única de verdade
* Nenhuma ocorrência de `localStorage.getItem('quiz_state')` no store
* `restoreSaved()` mantido fora do escopo
* 110 testes passando, build verde

### Build

* 787 módulos transformados
* Build verde
* Nenhuma regressão funcional

---

## [1.7.0] - Julho/2026

* Criação da camada `src/application/` com estrutura `application/quiz/`
* Criação do caso de uso `application/quiz/submit-quiz.ts` — orquestração do envio do teste (calcular scores, montar payload, persistir, limpar sessão, notificar admin, disparar IA, retornar ID)
* Criação do serviço `application/quiz/quiz-session.ts` — gestão de sessão persistida em localStorage (checkSavedSession, clearSession)
* Criação de `application/quiz/ports.ts` com interfaces `SubmitQuizInput` e `SubmitQuizResult`
* Extração de toda a orquestração do `QuizView.vue` para a Application Layer
* `QuizView.vue` reduzido de 203 para 181 linhas (remoção de imports e lógica de scoring, payload, persistência, notificação admin e geração IA)
* `QuizView.vue` passou a importar apenas de `application/` para fluxos de orquestração — sem imports diretos de domain ou repositories
* Registro da ADR-012 em `docs/decisions.md` estabelecendo o padrão da Application Layer

### Arquitetura

* Introdução oficial da Application Layer na arquitetura do projeto
* O projeto passa a ter quatro camadas explícitas:
  * **Presentation** → `views/`, `components/`, `stores/`, `constants/`
  * **Application** → `application/` (casos de uso e serviços de aplicação)
  * **Domain** → `domain/` (regras de negócio puras)
  * **Infrastructure** → `repositories/`, `services/` (persistência e integração)
* Nenhuma regra de negócio foi movida para Views ou Stores
* Nenhuma alteração em stores, repositories, domain ou infrastructure existentes
* Atualização do roadmap em `docs/architecture-evolution-plan.md`
* Documentação da Sprint 7 em `docs/architecture-evolution-log.md`

### Testes

* 14 novos testes para a Application Layer (7 submit-quiz + 7 quiz-session)
* Testes utilizam `vi.mock()` para isolar dependências de repositórios
* Testes em `application/__tests__/` seguindo padrão do projeto
* Total: **92 testes passando** (78 existentes + 14 novos)
* 6 arquivos de teste (4 existentes + 2 novos)

### Build

* 786 módulos transformados
* Build verde em 861ms
* Nenhuma regressão funcional

---

## [1.6.0] - Julho/2026

### Domínio — Organização Arquitetural (Sprint 4)

* Movimentação de `services/scoring.ts` → `domain/scoring.ts` (regras de negócio no lugar correto).
* Eliminação do re-export de `topGift` em `helpers/string.js` — `HistoryList.vue` importa diretamente de `domain/scoring`.
* Separação de `ANSWER_LABELS` de `data/questions.js` para `constants/likert.js` (escala Likert na camada de apresentação).
* Adoção de `GIFT_COUNT` derivado em vez de `27` literal no `domain/scoring.ts`.
* Revisão de `helpers/` — confirmado que todos são utilitários puros, sem funções de domínio.

### Domínio — Limpeza Final (Sprint 5)

* Remoção definitiva do adapter `data/gifts.js` (consumidores já importavam da fonte única).
* Remoção de ~162 linhas de código comentado (traduções em inglês desatualizadas) de `data/questions.js`.
* README.md reescrito — descreve a aplicação Vue/Supabase real (não mais o pipeline Python legado).
* TODO.md limpo — itens de refatoração concluídos removidos.
* Documentação final da arquitetura atualizada.

### Testes

* 78/78 testes passando (inalterado, sem regressões).
* Build validado (784 módulos, ~847ms).

---

## [1.5.0] - Julho/2026

### Domínio — Migração para TypeScript (Sprint 2)

* Criação do módulo `domain/spiritual-gifts.ts` como fonte única de verdade.
* Criação da interface `Gift` tipada (`id`, `name`, `icon`, `color`).
* Constantes derivadas automáticas: `GIFT_COUNT`, `giftNames`, `giftById()`.
* Migração de `services/scoring.js` → `services/scoring.ts` com tipagem completa.
* Movimentação de `topGift()` de `helpers/string.js` para `services/scoring.ts`.

### Domínio — Fonte Única (Sprint 3)

* Migração de todos os consumidores para importar de `domain/spiritual-gifts.ts`.
* `GiftBadges.vue` alterado para importar da fonte única (único consumidor de produção que ainda usava `data/gifts.js`).
* `data/gifts.js` transformado em adapter de compatibilidade (re-export da fonte única), eliminando duplicação física de dados.
* Testes migrados para validar diretamente o domínio (`domain/spiritual-gifts.ts`).

### Testes

* Suíte expandida para 78 testes (Vitest).
* Todos os testes importam da fonte única de domínio.

### Documentação

* Atualização dos documentos de planejamento (`gift-system-plan.md`).
* Atualização da análise arquitetural (`gift-system-plan-analysis.md`).
* Atualização do log de execução (`gift-system-plan-log.md`).

---

## [1.4.0] - Julho/2026

### Design System

* Criação da infraestrutura do Design System (tokens CSS, estilos globais).
* Implementação dos componentes base: AppPage, AppCard, AppButton, CollapsibleCard, PageHeader, SectionTitle, LoadingState, ErrorState, EmptyState, AppStat.
* Criação da variante `interactive` no AppCard com efeito hover (translateY + shadow).
* Suporte a `layout` prop no AppPage (`default`, `reading`, `form`).
* Criação do componente CollapsibleCard com título, ícone, v-model e slot de ações.
* Atualização do `design-plan.md` como documentação oficial do Design System.

### Migração de Componentes

* Substituição de `v-card` raw por AppCard em 7 componentes de domínio: AiAnalysis, GiftBadges, GrowthSection, HistoryList, ResourcesSection, ResultsChart, UserInfoForm.
* Substituição de `v-card` raw por AppCard no AdminView.
* Migração completa da HomeView para AppPage, AppCard, AppButton e CollapsibleCard.
* Eliminação de ~80 linhas de CSS hover duplicado.
* Remoção de títulos duplicados nos componentes de domínio.

### CollapsibleCard

* Aplicação do CollapsibleCard na ResultsView envolvendo as seções: gráfico, análise, desenvolvimento e recursos.
* Aplicação do CollapsibleCard na HomeView nas seções "Sobre o teste" e "Preparação".
* Botão de refresh do AiAnalysis movido para o início do conteúdo.

### AdminView

* Padronização do layout com AppCard.
* Otimização para mobile: densidade compacta, margens reduzidas, stats compactos, input adaptável.
* Datetime com ano de 4 dígitos em todas as situações.
* Substituição de `mb-6` por `mb-3 mb-sm-4` nas seções.
* Inline editors com layout horizontal e input adaptável ao mobile.
* Remoção da seção de ações informativas (substituída por alerta compacto).

### ResultsView

* Banner de regeneração de análise ao alterar o nome do resultado.
* Feedback de sucesso/erro na edição inline do nome.
* Ajuste de margens e espaçamentos entre seções.

### MyResultsView

* Redesign completo: cada item como AppCard variant="interactive" com data, data relativa e chip "Último".
* Uso de LoadingState, ErrorState e EmptyState.
* Remoção de CSS scoped.
* Remoção de pontuação e campo "top gift" dos cards.

### Temas

* Implementação do botão de alternância entre tema claro e escuro.
* Persistência da preferência no localStorage.
* Cores do gráfico (ResultsChart) reativas ao tema via `useTheme()`.
* Definição das cores do tema dark no Vuetify.

### QuizView

* Correção do `finishTestNow()` (range 0-3 em vez de 0-5).
* Uso do `layout="reading"` no AppPage.

### Geral

* Ajuste de margens e espaçamentos em todas as views para otimizar espaço vertical.
* Redução de ~120px no AdminView, ~60px na ResultsView, ~28px no MyResultsView, ~24px na HomeView.
* Correção de overflow em nomes longos no GiftBadges.
---

## [1.2.1] - Junho/2026

### Inteligência Artificial

* Criação da Edge Function `retry-ai-analysis`.
* Recuperação automática de análises pendentes.
* Processamento em lote de respostas sem análise.
* Tratamento automático de falhas por indisponibilidade ou limite de quota do Gemini.
* Simplificação da estratégia de recuperação de falhas.
* Remoção da função temporária `teste-generate-ai`.

### Infraestrutura

* Integração com UptimeRobot para execução periódica da recuperação de análises.
* Monitoramento contínuo das Edge Functions.
* Limpeza de artefatos temporários do Supabase.
* Organização da estrutura de deploy das funções.

### Manutenção

* Revisão da arquitetura de geração da análise.
* Redução da necessidade de intervenção manual em falhas de processamento.
* Preparação da base para futura fila assíncrona de processamento.

---

## [1.2.0] - Junho/2026

### Experiência do Usuário

* Simplificação completa da tela de resultados.
* Criação da seção unificada "Desenvolvendo seus dons".
* Integração de reflexão e próximos passos em uma única experiência.
* Remoção dos componentes ReflectionGuide.
* Remoção dos componentes NextStepsSection.
* Remoção das ações administrativas da tela principal de resultados.
* Reorganização visual priorizando:
  * Top 3 dons
  * Gráfico
  * Análise dos dons
  * Crescimento espiritual
  * Recursos
* Renomeação de "Perfil Ministerial" para "Análise dos Dons".

### Histórico de Resultados

* Criação da página "Meus Resultados".
* Histórico pessoal de aplicações do teste.
* Redesenho completo da tela.
* Interface simplificada e menos poluída.
* Remoção de indicadores de baixo valor visual.
* Inclusão de datas relativas ("há X dias", "há X meses", "há X anos e Y meses").
* Melhor experiência mobile.

### Inteligência Artificial

* Integração completa com Gemini.
* Geração automática da análise após a conclusão do teste.
* Diversas revisões e refinamentos do prompt.
* Linguagem mais pastoral, acolhedora e objetiva.
* Redução do tamanho das análises.
* Inclusão de botão para atualização manual da análise.
* Melhorias de timeout e tratamento de erros.
* Inclusão de fallback automático entre modelos Gemini.

### Administração

* Evolução significativa do painel administrativo.
* Busca por participantes.
* Filtros avançados.
* Edição inline de informações.
* Compactação visual da interface.
* Melhor organização dos dados.
* Criação do papel Supervisor com acesso somente leitura.

### Autenticação

* Correções no fluxo de login Google.
* Estabilização do processo OAuth.
* Melhor tratamento de sessão.
* Vinculação automática de respostas históricas ao usuário autenticado.

### Backend

* Correções na geração das análises.
* Melhorias no fluxo de notificações administrativas.
* Ajustes de CORS das Edge Functions.
* Importação e consolidação do histórico legado.
* Inclusão de idade, GP e data original nos registros importados.
* Ajustes em consultas e persistência de dados.

### Infraestrutura

* Organização das Edge Functions.
* Implementação das funções:
  * generate-ai
  * notify-admin
* Configuração do Vercel para SPA.
* Documentação inicial da arquitetura.
* Estruturação dos scripts SQL do projeto.

---

## [1.1.0] - Junho/2026

### Interface

* Melhorias na Home.
* Melhorias na AppBar.
* Padronização visual da interface.
* Aprimoramento da navegação.

### IA

* Primeiras iterações de refinamento do prompt Gemini.

### Backend

* Estrutura inicial de geração automática das análises.
* Fluxo inicial de notificações por e-mail.

---

## [1.0.0] - Maio/2026

### Funcionalidades

* Aplicação inicial do teste de dons espirituais.
* Teste completo com 135 perguntas.
* Cálculo dos dons espirituais.
* Exibição dos resultados.
* Geração de gráficos.
* Exportação PDF.
* Recursos complementares.
* Estrutura inicial Vue.js + Supabase.

---

## [0.1.0] - Protótipo Inicial

### Base do Projeto

* Estrutura inicial da aplicação.
* Primeiras versões do questionário.
* Modelagem inicial dos dons espirituais.
* Primeiros experimentos de interface.
