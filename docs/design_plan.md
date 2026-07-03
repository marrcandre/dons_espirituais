# Design Plan

> Documento oficial de arquitetura visual e Design System do projeto Dons Espirituais.

> Este documento define os padrões visuais, componentes reutilizáveis e regras de implementação. Toda alteração de interface deve seguir este documento.

---

# Objetivo

O projeto **Dons Espirituais** evoluiu organicamente ao longo do desenvolvimento. Como consequência, algumas telas passaram a apresentar diferenças de layout, tipografia, espaçamentos e componentes visuais.

O objetivo deste documento é definir um **Design System** consistente que oriente toda a interface da aplicação.

Esta fase **não tem como objetivo adicionar novas funcionalidades**, mas sim:

- padronizar toda a experiência visual;
- melhorar a legibilidade;
- facilitar a manutenção;
- incentivar a reutilização de componentes;
- reduzir código CSS duplicado;
- tornar futuras evoluções mais rápidas e consistentes.

Este documento deve ser considerado a referência oficial para qualquer alteração visual no projeto.

---

# Princípios

## Mobile First

Todo componente deve ser projetado inicialmente para smartphones.

A versão desktop deve ser apenas uma adaptação do layout mobile.

Sempre considerar inicialmente larguras entre:

- 360 px
- 390 px
- 412 px
- 430 px

Somente após validar essas larguras deve-se ajustar a experiência para tablets e desktops.

---

## Consistência

Todas as páginas devem transmitir a sensação de terem sido construídas pela mesma equipe.

Isso inclui:

- tipografia;
- espaçamentos;
- bordas;
- cores;
- componentes;
- comportamento visual.

---

## Reutilização

Antes de criar qualquer componente novo, verificar se já existe algum equivalente.

Sempre preferir:

```
reutilizar → adaptar → criar novo
```

---

## Simplicidade

Evitar:

- excesso de informações;
- sombras pesadas;
- muitas cores;
- excesso de bordas;
- componentes complexos.

A interface deve priorizar clareza.

---

## Legibilidade

O sistema possui grande quantidade de leitura:

- perguntas;
- análises;
- textos bíblicos;
- explicações.

Por isso, a leitura deve ser confortável tanto em celulares quanto em monitores grandes.

---

## Manutenibilidade

Alterações visuais devem ocorrer preferencialmente em apenas um local.

Evitar repetição de:

- CSS;
- estilos inline;
- componentes semelhantes.

---

# Stack

Frontend:

- Vue 3 com `<script setup>`
- TypeScript
- Vuetify 3 (com `useDisplay`, `useTheme`)
- Pinia (stores)
- Chart.js (vue-chartjs)

Toda padronização deve utilizar os recursos do Vuetify antes de criar soluções personalizadas.

---

# Arquitetura

A estrutura atual do frontend:

```text
src/

├── styles/
│   ├── tokens.css          # Design tokens (cores, espaçamento, bordas, etc.)
│   ├── variables.css        # Variáveis complementares (motion, containers)
│   ├── typography.css       # Escala tipográfica e classes utilitárias
│   ├── spacing.css          # Classes de espaçamento reutilizáveis
│   ├── utilities.css        # Utilitários diversos
│   ├── animations.css       # Animações e transições
│   └── index.css            # Importação centralizada

├── components/ui/           # Componentes base (sem regras de negócio)
│   ├── AppPage.vue
│   ├── AppCard.vue
│   ├── AppButton.vue
│   ├── CollapsibleCard.vue
│   ├── PageHeader.vue
│   ├── SectionTitle.vue
│   ├── AppStat.vue
│   ├── EmptyState.vue
│   ├── LoadingState.vue
│   └── ErrorState.vue

├── components/              # Componentes de domínio
│   ├── AiAnalysis.vue
│   ├── GiftBadges.vue
│   ├── GrowthSection.vue
│   ├── HistoryList.vue
│   ├── QuestionStep.vue
│   ├── QuizProgress.vue
│   ├── ResourcesSection.vue
│   ├── ResultsChart.vue
│   └── UserInfoForm.vue

├── views/                   # Páginas da aplicação
├── stores/                  # Pinia stores (estado + side effects)
├── services/                # Lógica de negócio pura (scoring)
├── repositories/            # Camada de acesso a dados (Supabase)
├── helpers/                 # Funções utilitárias puras
├── data/                    # Dados estáticos (perguntas, recursos)
├── router/                  # Configuração de rotas
└── plugins/                 # Configuração Vuetify
```

---

# Hierarquia de Componentes

Os componentes são divididos em três níveis:

## Componentes Base

Componentes genéricos reutilizados em todo o sistema. Localizados em `components/ui/`.

- **AppPage** — container principal da página (com suporte a `layout` prop)
- **AppCard** — card padrão com variantes visuais
- **CollapsibleCard** — card colapsável com título, ícone e actions slot
- **AppButton** — wrapper do `v-btn` com defaults padronizados
- **PageHeader** — cabeçalho de página (título + subtítulo + slot de ícone)
- **SectionTitle** — título interno de seção
- **AppStat** — exibição de valor numérico com label e ícone
- **EmptyState** — estado vazio (ícone + título + descrição + ação)
- **LoadingState** — estado de carregamento
- **ErrorState** — estado de erro com botão de retry

Esses componentes nunca devem conter regras específicas do domínio de Dons Espirituais.

## Layouts

Diferente do plano original, layouts não são componentes isolados em `src/layouts/`. O controle de layout é feito via prop `layout` do `AppPage`:

- `layout="default"` — largura padrão (900px)
- `layout="reading"` — largura reduzida para leitura (700px)
- `layout="form"` — largura para formulários (600px)

Os layouts não devem conter regras específicas de negócio.

## Componentes de Domínio

Representam elementos específicos do sistema. Localizados em `components/`.

Atuais:
- **AiAnalysis** — exibição da análise gerada por IA (com banner de regeneração)
- **GiftBadges** — pódio dos top 3 dons
- **GrowthSection** — sugestões de desenvolvimento espiritual
- **HistoryList** — item individual do histórico de resultados
- **QuestionStep** — pergunta do quiz com alternativas
- **QuizProgress** — barra de progresso e contador do quiz
- **ResourcesSection** — recursos e recomendações externas
- **ResultsChart** — gráfico de barras dos dons (Chart.js)
- **UserInfoForm** — formulário de dados do usuário antes do quiz

Esses componentes podem utilizar componentes base internamente.

---

# Design Tokens

Toda a identidade visual deve ser controlada através de tokens CSS.

Nunca utilizar valores arbitrários espalhados pelo projeto.

A fonte oficial dos tokens são os arquivos em `src/styles/`:

| Arquivo | Responsabilidade |
|---------|------------------|
| `tokens.css` | Cores, tipografia, espaçamentos, bordas, sombras, containers |
| `variables.css` | Motion (`--duration-*`, `--easing-*`), containers alternativos |
| `typography.css` | Escala tipográfica e classes semânticas |
| `spacing.css` | Classes utilitárias de espaçamento |

### Tokens de Cor (atuais)

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#1B5438` | `#2E7D5E` |
| Secondary | `#C8A220` | `#D4A830` |
| Background | `#F4F8F4` | `#121212` |
| Surface | `#FAFAF8` | `#1E1E1E` |
| Error | `#B00020` | `#CF6679` |
| Info | `#2196F3` | `#64B5F6` |
| Success | `#4CAF50` | `#81C784` |
| Warning | `#FB8C00` | `#FFB74D` |

### Tokens de Espaçamento

| Nome | Valor |
|------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-xxl` | 48px |

### Tokens de Borda

| Nome | Valor |
|------|-------|
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 16px |
| `--radius-xl` | 20px |

### Tokens de Sombra

| Nome | Valor |
|------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 8px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 8px 16px rgba(0,0,0,0.10)` |

### Tokens de Transição

| Nome | Valor |
|------|-------|
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-slow` | 350ms |
| `--easing-standard` | ease |

### Tokens de Container

| Nome | Valor | Uso |
|------|-------|-----|
| `--page-max-width` | 900px | Layout padrão |
| `--reading-max-width` | 700px | Conteúdo de leitura |
| `--form-max-width` | 700px | Formulários |

---

# Tema Vuetify

Toda cor utilizada pelos componentes deve vir do tema Vuetify.

Evitar cores hardcoded.

A configuração do tema está em `src/plugins/vuetify.js` com suporte a `light` e `dark`.

A alteração futura da identidade visual deve ocorrer apenas no tema.

---

# Breakpoints

Utilizar os breakpoints oficiais do Vuetify.

| Nome | Largura |
|------|---------|
| xs | < 600 px |
| sm | 600–959 px |
| md | 960–1279 px |
| lg | ≥1280 px |

Não criar breakpoints personalizados sem necessidade comprovada.

Para breakpoints reativos em JS, utilizar `useDisplay()` do Vuetify.

---

# Tipografia

A tipografia deve priorizar clareza, consistência e conforto de leitura.

Evitar tamanhos arbitrários definidos diretamente nas páginas.

Toda a escala tipográfica e classes semânticas estão centralizadas em `typography.css`.

## Escala Tipográfica

| Elemento | Tamanho | Peso | Classe |
|----------|---------|------|--------|
| Título Principal | 24px | 700 | `.main-title` |
| Título de Página | 22px | 700 | `.page-title` |
| Título de Seção | 18px | 600 | `.section-title` |
| Subtítulo | 16px | 600 | — |
| Texto padrão | 16px | 400 | `.body-text` |
| Texto auxiliar | 14px | 400 | `.helper-text` |
| Legenda | 12px | 400 | `.caption-text` |

## Hierarquia

Uma página normalmente deve possuir apenas três níveis de título.

```
Título da página

    Título da seção

        Texto
```

Evitar criar múltiplos níveis visuais desnecessários.

## Regras

Nunca definir:

```css
font-size: 17px;
font-size: 19px;
```

Preferir classes reutilizáveis ou tokens.

O texto padrão deve utilizar `line-height: 1.6` para facilitar leituras longas.

---

# Espaçamentos

Todo espaçamento do projeto deve utilizar a escala fixa de tokens.

Não utilizar valores arbitrários.

Preferir:
```css
padding: var(--space-md);
margin-top: var(--space-xl);
```

Utilizar as classes Vuetify sempre que possível:
- `mb-*`, `mt-*`, `pa-*`, `ga-*`
- Combine com breakpoints: `mb-4 mb-sm-6`

---

# Containers

Existem três larguras padrão, controladas pela prop `layout` do `AppPage`:

## Página (default)

```css
max-width: 900px;
margin: auto;
padding: var(--space-md);
```

## Conteúdo de Leitura (reading)

```css
max-width: 700px;
```

Utilizado para análises, textos longos e conteúdo explicativo.

## Formulários (form)

```css
max-width: 700px;
margin: auto;
```

---

# Responsividade

Toda tela deve ser validada inicialmente em:

- 360 px
- 390 px
- 412 px
- 430 px

Somente depois validar:

- Tablet
- Desktop

## Padrões responsivos adotados

- **Margens**: `mb-4 mb-sm-6` — margem menor no mobile, maior no desktop
- **Densidade de tabela**: `:density="mobile ? 'compact' : 'comfortable'"` via `useDisplay()`
- **Colunas**: ocultar colunas de baixa prioridade no mobile com `d-none d-sm-table-cell`
- **Datas**: formato completo no desktop, abreviado no mobile (via `useDisplay()`)
- **Grid de stats**: `cols="6" sm="3"` — 2 colunas no mobile, 4 no desktop

## Regras

Evitar:

- scroll horizontal;
- textos cortados;
- botões muito pequenos;
- elementos encostados nas bordas.

## Área de toque

Todo elemento clicável deve possuir área mínima próxima de 44px de altura.

---

# Cards

Todos os cards devem compartilhar a mesma identidade visual utilizando o componente `<AppCard>`.

## Aparência padrão

- `border-radius: lg` (16px)
- sombra leve (elevation 2)
- padding: `var(--space-lg)`
- largura fluida
- fundo baseado no tema

## Variantes

| Variante | Descrição |
|----------|-----------|
| `default` | Card elevado com sombra padrão |
| `outlined` | Card com borda, sem sombra |
| `flat` | Card sem borda nem sombra |
| `compact` | Card flat com padding reduzido (`var(--space-md)`) |
| `interactive` | Card elevado com hover lift (translateY(-2px) + shadow-lg) |

A aparência deve ser controlada por propriedades, nunca por duplicação de componentes.

## CollapsibleCard

O componente `<CollapsibleCard>` estende o AppCard com comportamento de expandir/recolher.

Props:

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | string | — | Título do card (obrigatório) |
| `subtitle` | string | — | Subtítulo opcional |
| `icon` | string | — | Ícone MDI à esquerda do título |
| `modelValue` | boolean | true | Estado expandido/recolhido (v-model) |
| `variant` | string | 'default' | Variante AppCard |

Slots:

| Slot | Descrição |
|------|-----------|
| `default` | Conteúdo interno (visível apenas quando expandido) |
| `actions` | Ações no cabeçalho (à esquerda do botão de toggle) |

Utiliza `<v-expand-transition>` para animação.

---

# Botões

Todos os botões devem utilizar o componente `<AppButton>` sempre que possível.

O AppButton define defaults:
- `size="large"`
- `rounded="lg"`

Botões apenas com ícone devem possuir tooltip sempre que possível.

---

# Ícones

Utilizar exclusivamente Material Design Icons.

Tamanho padrão: 24px.

Ícones devem reforçar significado. Nunca substituir texto importante apenas por ícones.

---

# Tabelas

Em smartphones normalmente deve-se preferir cards, listas ou blocos empilhados.

Quando uma tabela for necessária (ex: painel admin):

- Usar `density="compact"` no mobile
- Ocultar colunas de baixa prioridade com `d-none d-sm-table-cell`
- Garantir scroll horizontal apenas se inevitável

---

# Estados

Toda página deve tratar explicitamente seus estados.

## Loading

Utilizar `<LoadingState>`. Nunca mostrar tela vazia durante carregamentos.

## Empty

Utilizar `<EmptyState>`. Sempre explicar ao usuário o motivo da ausência de conteúdo.

## Error

Utilizar `<ErrorState>`. Sempre oferecer possibilidade de tentar novamente.

---

# Feedback Visual

A interface deve sempre responder às ações do usuário.

Exemplos:

- loading em botões;
- snackbars;
- mensagens de sucesso;
- mensagens de erro.

Nunca deixar o usuário sem retorno visual após uma ação.

---

# Padrões de Página

Todas as páginas devem seguir estruturas semelhantes.

## Estrutura Geral (template)

```vue
<template>
  <AppPage :layout="...">
    <PageHeader
      v-if="needed"
      title="..."
      subtitle="..."
    >
      <v-icon ... />
    </PageHeader>

    <!-- Seções -->
    <CollapsibleCard ...>
      ...
    </CollapsibleCard>

    <!-- Estados -->
    <LoadingState v-if="loading" ... />
    <ErrorState v-if="error" ... />
    <EmptyState v-if="!loading && !items.length" ... />

  </AppPage>
</template>
```

## Script

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useStore } from '...'
import AppPage from '...'
// demais imports

const { mobile } = useDisplay()
</script>
```

Convenções:
- Sempre `<script setup>`
- Imports primeiro (vue → vuetify → stores → serviços → componentes)
- Stores no topo do script
- Computeds e métodos após o estado
- `onMounted` no final

## Estados por View

| View | Loading | Error | Empty | PageHeader |
|------|---------|-------|-------|------------|
| HomeView | — | — | — | ✅ |
| LoginView | ✅ | — | — | ✅ |
| QuizView | ✅ | — | — | — (usa QuizProgress) |
| ResultsView | ✅ | ✅ | — | ✅ |
| MyResultsView | ✅ | ✅ | ✅ | ✅ |
| AdminView | ✅ | ✅ | ✅ | — |

---

# Home

Estrutura atual:

```
PageHeader (título + subtítulo + ícone)
↓
CollapsibleCard "Sobre o teste" (ícone: mdi-information-outline)
↓
CollapsibleCard "Preparação para o teste" (ícone: mdi-clipboard-list)
  → Chips de resposta
  → Perguntas de reflexão
↓
CTA "Descobrir meus dons" (AppButton)
```

# Login

```
PageHeader
↓
LoadingState (enquanto carrega)
↓
Card com formulário (v-text-field)
↓
v-btn "Entrar com Google"
```

# Quiz

```
QuizProgress (barra de progresso + contador)
↓
QuestionStep (pergunta + alternativas)
↓
v-btn navegação
```

# Resultado (ResultsView)

```
PageHeader (nome + data)
↓
GiftBadges (top 3)
↓
CollapsibleCard "Gráfico" → ResultsChart
↓
CollapsibleCard "Análise" → AiAnalysis
↓
CollapsibleCard "Desenvolvimento" → GrowthSection
↓
CollapsibleCard "Recursos" → ResourcesSection
```

# Meus Resultados (MyResultsView)

```
PageHeader
↓
LoadingState / ErrorState / EmptyState
↓
Lista de AppCard variant="interactive" (data, nome, top gift, chevron)
```

# Admin

```
LoadingState
↓
Busca (v-text-field)
↓
Stats row (Total, Sem IA, Hoje, 7 dias) — filtros rápidos
↓
ErrorState
↓
v-data-table (status, nome, GP, respondido em, idade)
  → inline editors para nome e GP
```

---

# Componentes Base (Referência Detalhada)

## AppPage

Container principal de todas as páginas.

Props:
- `layout`: `'default'` | `'reading'` | `'form'` (padrão: `'default'`)

Responsabilidades:
- centralizar conteúdo
- aplicar largura máxima conforme layout
- aplicar padding padrão

## AppCard

Card padrão da aplicação.

Props:
- `variant`: `'default'` | `'outlined'` | `'flat'` | `'compact'` | `'interactive'` (padrão: `'default'`)

Responsabilidades:
- bordas
- sombra
- padding (lg ou md para compact)
- variantes visuais

## AppButton

Wrapper do `v-btn`.

Props:
- `size`: `'x-small'` | `'small'` | `'default'` | `'large'` | `'x-large'` (padrão: `'large'`)
- `rounded`: `'0'` | `'sm'` | `'md'` | `'lg'` | `'xl'` | `'pill'` (padrão: `'lg'`)
- `loading`, `prependIcon`, `appendIcon`, `icon`

Sempre preferir este componente ao uso direto de `v-btn`.

## PageHeader

Cabeçalho de página com slot para ícone decorativo.

Props:
- `title`: string
- `subtitle`: string (opcional)

Slots:
- `default`: ícone decorativo à esquerda do título

## SectionTitle

Título interno de seção.

Props:
- `title`: string
- `subtitle`: string (opcional)

## CollapsibleCard

Card colapsável com título e ícone. Ver seção "Cards" acima.

## AppStat

Exibição de valor numérico com label e ícone.

Props:
- `value`: string | number
- `label`: string
- `icon`: string (opcional, MDI)

## LoadingState

Estado de carregamento.

Props:
- `size`: number (padrão: 56)
- `thickness`: number (padrão: 5)

## EmptyState

Ausência de conteúdo.

Props:
- `icon`: string (padrão: `'mdi-inbox-outline'`)
- `title`: string
- `description`: string (opcional)
- `button-label`: string (opcional)
- `action`: emit (opcional)
- `card-variant`: string (padrão: `'flat'`)

## ErrorState

Erro inesperado.

Props:
- `title`: string
- `description`: string (opcional)
- `button-label`: string (padrão: `"Tentar novamente"`)
- `action`: emit

---

# Responsabilidade das Views

As Views devem conter apenas:

- composição da página;
- chamadas de stores;
- uso de `useDisplay()` para responsividade;
- eventos.

Evitar CSS complexo dentro das Views. Toda regra visual reutilizável deve migrar para componentes.

# Responsabilidade dos Componentes

Componentes devem focar apenas na apresentação.

Sempre que possível:

- receber dados por props;
- emitir eventos;
- evitar dependência direta de stores.

Isso aumenta reutilização e facilita testes.

---

# Checklist de Revisão

Toda alteração visual deve ser revisada utilizando este checklist.

Nenhuma tela deve ser considerada concluída sem atender aos critérios abaixo.

## Estrutura

- Utiliza `AppPage` com layout adequado?
- Utiliza `PageHeader` quando necessário?
- Utiliza `AppCard` / `CollapsibleCard` quando necessário?
- Utiliza componentes reutilizáveis antes de criar novos?
- Utiliza `LoadingState` / `ErrorState` / `EmptyState` quando necessário?

## Tipografia

- Segue a escala oficial?
- Possui hierarquia clara?
- Evita tamanhos hardcoded?
- Mantém boa legibilidade em smartphones?

## Espaçamentos

- Utiliza apenas os tokens oficiais?
- Existem espaçamentos inconsistentes?
- Há elementos muito próximos ou muito afastados?

## Cores

- Utiliza apenas cores do tema?
- Evita cores hardcoded?
- Mantém contraste adequado?

## Responsividade

Validado em:

- 360 px, 390 px, 412 px, 430 px
- tablet
- desktop

Não existe scroll horizontal.

## Componentes

Existe algum componente duplicado? Existe CSS repetido?

## Estados

A página trata corretamente: Loading, Empty, Error.

## Código

Não existem:

- estilos inline;
- CSS duplicado;
- componentes desnecessários;
- lógica de negócio misturada com apresentação.

---

# Acessibilidade

Toda nova interface deve considerar princípios básicos de acessibilidade.

- Botões com área mínima de 44px
- Contraste adequado (evitar combinações de baixo contraste)
- Navegação consistente: o usuário deve reconhecer rapidamente onde está, como voltar e como concluir uma ação
- Ícones com tooltip quando necessário

---

# Regras para IA

## Escopo

Alterar apenas:

- componentes visuais;
- estilos;
- organização da interface.

## Não alterar sem solicitação explícita

- regras de negócio;
- stores;
- APIs;
- rotas;
- autenticação;
- lógica de cálculo.

## Componentes

- Sempre reutilizar componentes existentes antes de criar novos.
- Componentes de domínio devem consumir componentes base.
- Caso um novo componente seja necessário: genérico, reutilizável, independente da regra de negócio.

## CSS

- Nunca duplicar CSS.
- Mover regras reutilizáveis para `src/styles/` ou `components/ui/`.

## Responsividade

- Toda alteração deve considerar primeiro smartphones. Desktop é adaptação.

## Código

- Evitar refatorações não solicitadas.
- Cada etapa deve gerar alterações pequenas e fáceis de revisar.
- O objetivo é exclusivamente melhorar a interface.
