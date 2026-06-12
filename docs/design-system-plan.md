# Design System e Padronização Visual

## Objetivo

O projeto de Dons Espirituais cresceu organicamente e apresenta inconsistências visuais entre as telas.

O objetivo desta fase não é adicionar funcionalidades, mas criar uma identidade visual consistente, moderna, legível e mobile-first utilizando Vue 3 e Vuetify.

A prioridade é oferecer uma excelente experiência para usuários em smartphones, sem comprometer a experiência em tablets e computadores.

---

# Princípios

## Mobile First

Toda nova tela deve ser projetada primeiro para smartphones (360px a 430px de largura).

A versão desktop deve ser uma adaptação do layout mobile, e não o contrário.

## Consistência

Todas as telas devem parecer ter sido construídas pela mesma equipe, seguindo os mesmos padrões de tipografia, espaçamento, cores e componentes.

## Reutilização

Sempre reutilizar componentes existentes antes de criar novas estruturas visuais.

## Simplicidade

Evitar excesso de elementos visuais, sombras exageradas, cores excessivas ou layouts complexos.

## Legibilidade

A leitura deve ser confortável tanto para perguntas do teste quanto para análises e resultados.

---

# Stack

* Vue 3
* TypeScript
* Vuetify 3

---

# Estrutura desejada

```text
src/
├── styles/
│   ├── variables.css
│   ├── typography.css
│   ├── spacing.css
│   ├── utilities.css
│   └── index.css
│
├── components/ui/
│   ├── AppPage.vue
│   ├── AppCard.vue
│   ├── PageHeader.vue
│   ├── SectionTitle.vue
│   ├── EmptyState.vue
│   └── LoadingState.vue
```

---

# Tipografia

## Título principal

* 24px
* font-weight: 700

## Título de página

* 22px
* font-weight: 700

## Título de seção

* 18px
* font-weight: 600

## Texto padrão

* 16px
* line-height: 1.6

## Texto auxiliar

* 14px

## Legenda

* 12px

---

# Regras de tipografia

* Evitar definir tamanhos de fonte diretamente nas páginas.
* Utilizar classes globais ou componentes reutilizáveis.
* Evitar mais de três níveis de título na mesma tela.
* Priorizar clareza em vez de impacto visual.

---

# Espaçamentos

Utilizar apenas múltiplos da escala abaixo:

```text
xs = 4px
sm = 8px
md = 16px
lg = 24px
xl = 32px
xxl = 48px
```

---

# Regras de espaçamento

Evitar:

```css
margin-top: 13px;
padding: 27px;
```

Preferir:

```css
var(--space-md)
var(--space-lg)
var(--space-xl)
```

Não utilizar valores arbitrários.

---

# Containers

## Página padrão

```css
max-width: 900px;
margin: 0 auto;
padding: 16px;
```

## Formulários

```css
max-width: 700px;
margin: 0 auto;
```

## Conteúdo de leitura

Para análises e textos longos:

```css
max-width: 700px;
```

Objetivo: evitar linhas excessivamente longas em monitores grandes.

---

# Cards

Todos os cards devem utilizar:

* border-radius: 16px
* padding: 24px
* sombra leve
* espaçamento interno consistente

Criar e reutilizar:

```vue
<AppCard>
```

---

# Botões

## Padrão

```vue
<v-btn
  size="large"
  rounded="lg"
/>
```

## Botão principal

```vue
color="primary"
```

## Botão secundário

```vue
variant="outlined"
```

---

# Regras de usabilidade mobile

Todos os elementos clicáveis devem possuir área mínima de toque próxima de:

```css
min-height: 44px;
```

Objetivo:

* Melhor experiência em smartphones
* Melhor acessibilidade

---

# Cabeçalhos

Todas as páginas devem utilizar:

```vue
<PageHeader />
```

Exemplo:

```vue
<PageHeader
  title="Resultado do Teste"
  subtitle="Veja seus dons predominantes"
/>
```

---

# Tema Vuetify

Criar um tema centralizado.

Sugestão inicial:

```text
primary   #1E40AF
secondary #475569
accent    #0F766E
success   #16A34A
warning   #EA580C
error     #DC2626
```

Todos os componentes devem utilizar cores do tema.

Evitar cores hardcoded.

---

# Componentes obrigatórios

Criar inicialmente:

## Layout

* AppPage

## Estrutura

* AppCard
* PageHeader
* SectionTitle

## Estados

* EmptyState
* LoadingState

---

# Componentes futuros

Avaliar posteriormente:

* GiftScoreCard
* ResultCard
* AnalysisCard
* RankingCard
* ProgressCard

---

# Responsividade

## Breakpoints

```text
xs < 600px
sm 600px - 959px
md 960px - 1279px
lg >= 1280px
```

---

# Tabelas

Evitar tabelas sempre que possível.

Preferir:

* Cards
* Listas
* Blocos empilhados

Exemplo:

Em vez de:

```text
| Dom | Pontuação |
```

Preferir:

```text
Dom: Ensino
Pontuação: 87%
```

Motivo:

* Melhor leitura em celulares
* Menor necessidade de scroll horizontal

---

# Estilos

Evitar:

* estilos inline
* CSS duplicado
* cores hardcoded
* tamanhos de fonte hardcoded
* espaçamentos arbitrários

Centralizar tudo no Design System.

---

# Critérios de revisão

Ao analisar qualquer tela:

## Estrutura

* Usa AppPage?
* Usa AppCard?
* Usa PageHeader?

## Tipografia

* Segue a escala definida?
* Possui hierarquia clara?

## Espaçamento

* Utiliza a escala oficial?
* Há espaçamentos inconsistentes?

## Responsividade

* Funciona bem em 360px?
* Funciona bem em 430px?
* Funciona bem em desktop?

## Código

* Há CSS duplicado?
* Há estilos inline?
* Há componentes reutilizáveis ignorados?

---

# Fluxos prioritários

Os seguintes fluxos devem receber atenção especial durante a revisão:

1. Home
2. Login
3. Cadastro
4. Quiz
5. Resultado
6. Perfil de Dons
7. Histórico
8. Análise por IA
9. Compartilhamento de Resultados

Todos devem ser excelentes em smartphones antes de serem otimizados para desktop.

---

# Objetivo Final

Criar uma experiência visual consistente, moderna, agradável e profissional, onde:

* todas as telas pareçam parte do mesmo sistema;
* a navegação seja natural em smartphones;
* os componentes sejam reutilizáveis;
* a manutenção futura seja simplificada;
* novas funcionalidades sigam automaticamente os padrões definidos.
