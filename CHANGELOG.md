# Changelog

Todas as alterações relevantes deste projeto serão documentadas aqui.

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