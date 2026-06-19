# ResultsView.vue — Layout Refactor (UX FINAL)

## 🎯 Objetivo

Reestruturar o layout do ResultsView.vue para melhorar hierarquia de UX:

- Tornar compartilhamento visível e prioritário
- Separar identidade (nome) de ações do sistema
- Tornar regeneração de IA contextual e não escondida
- Melhorar legibilidade geral da tela

---

## 🚫 REGRAS GERAIS (CRÍTICO)

- NÃO alterar banco de dados
- NÃO alterar autenticação
- NÃO alterar lógica de IA existente
- NÃO criar novos fluxos de backend
- NÃO introduzir novas dependências
- NÃO quebrar componentes existentes
- NÃO usar pasta legacy

---

# 🧱 NOVA ESTRUTURA DE LAYOUT

## 🔹 FASE 1 — HEADER (IDENTIDADE)

Mover para topo do conteúdo:

- Nome do usuário
- Ícone de edição ao lado (apenas owner)
- Subtítulo
- Data do teste

Regra:
- Apenas identidade do resultado
- Nenhuma ação de sistema aqui (exceto editar nome)

---

## 🔹 FASE 2 — AÇÃO PRINCIPAL (SHARE)

Criar bloco destacado logo abaixo do header:

- Botão "Compartilhar resultado"
- Deve ser a ação mais visível da tela
- Pode usar estilo primário grande

Regra:
- Sempre visível
- Não depende de scroll

---

## 🔹 FASE 3 — CONTEÚDO PRINCIPAL

Manter nesta ordem:

- Top 3 dons
- Gráfico
- Análise da IA

Regra:
- IA continua sendo conteúdo central
- Não mover lógica de geração

---

## 🔹 FASE 4 — ALERTA CONTEXTUAL (IA)

Quando nome for alterado:

Exibir bloco:

- Mensagem contextual
- Botão "Atualizar análise"

Regras:
- Não aparece sempre
- Não é botão fixo
- É um “evento visual”

---

## 🔹 FASE 5 — SEÇÕES DE APOIO

Manter abaixo:

- Crescimento
- Recursos

---

## 🔹 FASE 6 — HISTÓRICO (CONDICIONAL)

- Apenas owner
- Mantido abaixo das seções principais

---

## 🔹 FASE 7 — AÇÕES SECUNDÁRIAS

Mover para final discreto:

- Imprimir
- (ou outras ações futuras)

---

## 🧠 PRINCÍPIOS DO LAYOUT

- Identidade primeiro
- Compartilhamento como ação principal
- IA como conteúdo, não botão
- Regeneração como evento contextual
- Ações secundárias nunca competem com share

---

## ⚠️ NÃO FAZER

- Não criar floating button
- Não mover IA para header
- Não transformar regeneração em ação permanente
- Não duplicar ações