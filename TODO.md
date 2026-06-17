# TODO — Projeto Dons Espirituais

## Sprint 1 — Experiência do Resultado

### Sprint 1.1 — Simplificação da ResultsView

**Objetivo:** transformar a tela de resultados em uma experiência mais limpa, objetiva e agradável para o usuário.

#### Interface

* [ ] Simplificar layout geral
* [ ] Reduzir poluição visual
* [ ] Revisar hierarquia das informações
* [ ] Melhorar legibilidade da análise IA
* [ ] Revisar exibição dos dons secundários
* [ ] Revisar apresentação dos recursos e recomendações
* [ ] Revisar uso de chips, alertas e cartões
* [ ] Revisar gráfico de dons
* [ ] Melhorar experiência mobile

---

### Sprint 1.2 — PDF Baseado na Tela

**Objetivo:** eliminar o PDF artesanal e gerar o documento diretamente a partir da tela de resultados.

#### Planejamento

* [ ] Criar container exportável
* [ ] Exportar página completa usando html2canvas
* [ ] Gerar múltiplas páginas automaticamente
* [ ] Garantir boa resolução
* [ ] Remover dependência da montagem manual do PDF
* [ ] Eliminar páginas especiais de recursos
* [ ] Eliminar renderização separada da análise IA
* [ ] Eliminar renderização separada do gráfico
* [ ] Validar resultado em desktop
* [ ] Validar resultado em mobile
* [ ] Comparar tamanho final do PDF

#### Limpeza

* [ ] Simplificar exportPDF()
* [ ] Reduzir código da ResultsView
* [ ] Remover código legado do PDF

---

### Sprint 1.3 — Arquitetura da Análise IA

**Objetivo:** tornar a tela de resultados apenas uma tela de exibição.

#### Fluxo Ideal

Teste → Resultado → IA → E-mail → Visualização

#### Tarefas

* [x] Implementar geração automática da análise
* [x] Implementar recuperação automática de falhas
* [ ] Eliminar dependências da ResultsView na geração da análise
* [ ] Revisar estratégia de envio de e-mail
* [ ] Avaliar fila assíncrona (caso o volume cresça)
* [ ] Avaliar uso de Edge Functions desacopladas

---

## Sprint 2 — Remodelação da UI/UX

### Histórico

* [x] Simplificar tela "Meus Resultados"

### Navegação

* [ ] Revisar menu principal
* [ ] Revisar fluxo Login → Teste → Resultado
* [ ] Revisar estados de carregamento
* [ ] Revisar mensagens de erro

### Consistência Visual

* [ ] Revisar espaçamentos
* [ ] Revisar títulos
* [ ] Revisar uso de chips
* [ ] Revisar excesso de cartões
* [ ] Revisar densidade de informações

### Responsividade

* [ ] Auditoria mobile
* [ ] Auditoria tablet
* [ ] Auditoria desktop

---

## Sprint 3 — Dados e Arquitetura

### Fonte Única de Verdade

**Objetivo:** eliminar duplicação de definições dos dons.

* [ ] Criar módulo compartilhado dos dons
* [ ] Eliminar duplicação entre frontend e backend
* [ ] Revisar estrutura de scoring
* [ ] Revisar geração dos gráficos
* [ ] Revisar geração das análises
* [ ] Padronizar nomes dos dons
* [ ] Padronizar ordenação dos dons

### Banco de Dados

* [ ] Revisar índices do Supabase
* [ ] Revisar consultas frequentes
* [ ] Revisar logs
* [ ] Revisar crescimento da tabela responses

---

## Sprint 4 — Segurança

### Autenticação e Permissões

* [ ] Auditoria de autenticação
* [ ] Revisar políticas RLS
* [ ] Revisar permissões das Edge Functions
* [ ] Revisar uso da Service Role
* [ ] Revisar exposição de dados
* [ ] Revisar variáveis de ambiente
* [ ] Revisar informações sensíveis nos logs

---

## Sprint 5 — Conteúdo Institucional

### Página Sobre

* [ ] História do projeto
* [ ] Objetivo do teste
* [ ] Metodologia utilizada
* [ ] Limitações do teste

### FAQ

* [ ] O que são dons espirituais?
* [ ] O teste é infalível?
* [ ] Como interpretar os resultados?
* [ ] Como desenvolver meus dons?

### Contato

* [ ] Página de contato
* [ ] Formulário
* [ ] Política de privacidade

---

## Sprint 6 — Administração

### Dashboard

* [ ] Dashboard estatístico
* [ ] Distribuição dos dons
* [ ] Evolução dos testes
* [ ] Indicadores gerais

### Exportação

* [ ] Exportação CSV
* [ ] Relatórios administrativos

---

## Sprint 7 — Design System

### Identidade Visual

* [ ] Padronizar espaçamentos
* [ ] Padronizar cartões
* [ ] Padronizar títulos
* [ ] Padronizar botões
* [ ] Padronizar alertas
* [ ] Padronizar tabelas

### Acessibilidade

* [ ] Revisar contraste
* [ ] Navegação por teclado
* [ ] Compatibilidade com leitores de tela

---

## DevOps

### Monitoramento

* [x] Configurar UptimeRobot
* [ ] Criar endpoint healthcheck
* [ ] Monitorar falhas de geração IA
* [ ] Monitorar Edge Functions
* [ ] Monitorar Vercel
* [ ] Monitorar Supabase

### Deploy

* [ ] Revisar variáveis de ambiente
* [ ] Revisar Edge Functions
* [ ] Revisar backups
* [ ] Revisar estratégia de recuperação de falhas

---

## Documentação

### Projeto

* [x] Criar CHANGELOG.md
* [ ] Manter CHANGELOG atualizado
* [ ] Revisar README
* [ ] Documentar arquitetura geral
* [ ] Documentar banco de dados

### IA

* [ ] Documentar prompt atual
* [ ] Documentar fluxo da análise
* [ ] Registrar versões do prompt
* [ ] Documentar estratégia de retry
* [ ] Documentar Edge Functions relacionadas à IA
