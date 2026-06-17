# Changelog

Todas as alterações relevantes deste projeto serão documentadas aqui.

---

## [1.3.0] - Em desenvolvimento

### Experiência do Resultado

#### PDF Baseado na Tela

* Gerar PDF diretamente a partir da tela de resultados.
* Eliminar montagem manual do PDF.
* Exportação multipágina automática.
* Simplificação do fluxo de geração.

#### Arquitetura da Análise IA

* Tornar a ResultsView apenas uma tela de exibição.
* Eliminar dependências de geração de análise na interface.
* Avaliar fila assíncrona para crescimento futuro.
* Avaliar desacoplamento adicional das Edge Functions.

#### UI/UX

* Continuidade da remodelação visual da aplicação.
* Simplificação adicional da tela de resultados.
* Auditoria completa de responsividade.
* Consolidação do Design System.

#### Segurança

* Auditoria de autenticação.
* Revisão das políticas RLS.
* Revisão das permissões das Edge Functions.
* Revisão de exposição de dados e variáveis sensíveis.

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