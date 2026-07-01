# Design Plan

> Documento oficial de arquitetura visual e Design System do projeto Dons Espirituais.

> Este documento define os padrões visuais, componentes reutilizáveis, regras de implementação e diretrizes para utilização de IA (GitHub Copilot, Codex e ChatGPT). Toda alteração de interface deve seguir este documento.

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

# Objetivos do Design System

O Design System deve garantir que:

- todas as telas pareçam parte do mesmo sistema;
- os componentes sejam reutilizados sempre que possível;
- novas funcionalidades sigam automaticamente os padrões existentes;
- a navegação seja simples e intuitiva;
- a experiência em smartphones seja excelente;
- a interface permaneça limpa, moderna e profissional.

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
reutilizar
↓

adaptar

↓

criar novo
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

- Vue 3
- TypeScript
- Vuetify 3

Toda padronização deve utilizar os recursos do Vuetify antes de criar soluções personalizadas.

---

# Arquitetura

A estrutura desejada é:

```text
src/

├── styles/
│   ├── variables.css
│   ├── typography.css
│   ├── spacing.css
│   ├── utilities.css
│   ├── animations.css
│   └── index.css
│
├── components/
│
├── components/ui/
│   ├── AppPage.vue
│   ├── AppCard.vue
│   ├── AppButton.vue
│   ├── PageHeader.vue
│   ├── SectionTitle.vue
│   ├── EmptyState.vue
│   ├── LoadingState.vue
│   ├── ErrorState.vue
│   └── AppStat.vue
│
├── layouts/
│   ├── FormLayout.vue
│   ├── ReadingLayout.vue
│   ├── ResultsLayout.vue
│   └── QuizLayout.vue
```

---

# Hierarquia de Componentes

Os componentes são divididos em três níveis.

## Componentes Base

São componentes genéricos reutilizados em todo o sistema.

Exemplos:

- AppPage
- AppCard
- AppButton
- SectionTitle
- PageHeader

Esses componentes nunca devem conter regras específicas do domínio de Dons Espirituais.

---

## Layouts

Layouts organizam componentes base para formar estruturas reutilizáveis.

Exemplos:

- formulário
- página de leitura
- resultado
- quiz

Layouts não devem conter regras específicas de negócio.

---

## Componentes de Domínio

Representam elementos específicos do sistema.

Exemplos:

- GiftScoreCard
- RankingCard
- AnalysisCard
- ResultCard
- HistoryCard

Esses componentes podem utilizar componentes base internamente.

---

# Design Tokens

Toda a identidade visual deve ser controlada através de tokens.

Nunca utilizar valores arbitrários espalhados pelo projeto.

Os tokens devem controlar:

- cores;
- tipografia;
- espaçamentos;
- bordas;
- sombras;
- transições;
- largura de containers.

---

## Tokens de Cor

Exemplo:

```css
--color-primary
--color-secondary
--color-success
--color-warning
--color-error
--color-background
--color-surface
--color-text
--color-text-secondary
```

---

## Tokens de Espaçamento

```css
--space-xs
--space-sm
--space-md
--space-lg
--space-xl
--space-xxl
```

---

## Tokens de Borda

```css
--radius-sm
--radius-md
--radius-lg
--radius-xl
```

---

## Tokens de Sombra

```css
--shadow-sm
--shadow-md
--shadow-lg
```

---

## Tokens de Container

```css
--container-default
--container-reading
--container-form
```

---

## Tokens de Transição

```css
--duration-fast
--duration-normal
--duration-slow
```

---

# Tema Vuetify

Toda cor utilizada pelos componentes deve vir do tema.

Evitar cores hardcoded.

Paleta inicial:

| Token | Cor |
|--------|------|
| Primary | #1E40AF |
| Secondary | #475569 |
| Accent | #0F766E |
| Success | #16A34A |
| Warning | #EA580C |
| Error | #DC2626 |

A alteração futura da identidade visual deve ocorrer apenas no tema.

---

# Breakpoints

Utilizar os breakpoints oficiais do Vuetify.

| Nome | Largura |
|--------|---------|
| xs | < 600 px |
| sm | 600–959 px |
| md | 960–1279 px |
| lg | ≥1280 px |

Não criar breakpoints personalizados sem necessidade comprovada.

---

# Tipografia

A tipografia deve priorizar clareza, consistência e conforto de leitura.

Evitar tamanhos arbitrários definidos diretamente nas páginas.

Toda a escala tipográfica deve ser centralizada em `typography.css`.

---

## Escala Tipográfica

| Elemento | Tamanho | Peso |
|----------|---------|------|
| Título Principal | 24px | 700 |
| Título de Página | 22px | 700 |
| Título de Seção | 18px | 600 |
| Subtítulo | 16px | 600 |
| Texto padrão | 16px | 400 |
| Texto auxiliar | 14px | 400 |
| Legenda | 12px | 400 |

---

## Hierarquia

Uma página normalmente deve possuir apenas três níveis de título.

Exemplo:

```
Título da página

    Título da seção

        Texto
```

Evitar criar múltiplos níveis visuais desnecessários.

---

## Regras

Nunca definir:

```css
font-size: 17px;
font-size: 19px;
```

Preferir classes reutilizáveis ou tokens.

Evitar alterar pesos de fonte sem necessidade.

O texto padrão deve utilizar line-height aproximado de:

```css
1.6
```

para facilitar leituras longas.

---

# Espaçamentos

Todo espaçamento do projeto deve utilizar uma escala fixa.

Não utilizar valores arbitrários.

---

## Escala

| Nome | Valor |
|------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| xxl | 48px |

---

## Exemplos

Evitar:

```css
padding: 13px;

margin-top: 27px;
```

Preferir:

```css
padding: var(--space-md);

margin-top: var(--space-xl);
```

---

## Margens

Priorizar espaçamento entre blocos ao invés de espaçamentos internos excessivos.

Evitar componentes "espremidos".

---

## Padding

Todos os cards semelhantes devem possuir o mesmo padding.

Não criar cards visualmente diferentes apenas por pequenas alterações de padding.

---

# Containers

Existem três larguras padrão.

---

## Página

```css
max-width: 900px;
margin: auto;
padding: var(--space-md);
```

Utilizada na maioria das páginas.

---

## Conteúdo de Leitura

```css
max-width: 700px;
```

Utilizado para:

- análises
- textos longos
- conteúdo explicativo

Objetivo:

Melhorar a leitura em monitores grandes.

---

## Formulários

```css
max-width: 600px;
margin: auto;
```

Utilizado em:

- Login
- Cadastro
- Recuperação de senha
- Alteração de senha

---

# Grid

O projeto deve utilizar grids simples.

Evitar layouts excessivamente complexos.

---

## Smartphone

Sempre:

```
1 coluna
```

---

## Tablet

Preferencialmente:

```
2 colunas
```

quando fizer sentido.

---

## Desktop

Utilizar:

```
2 ou 3 colunas
```

apenas quando melhorar a leitura.

Nunca adicionar colunas apenas porque há espaço disponível.

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

---

## Regras

Evitar:

- scroll horizontal;
- textos cortados;
- botões muito pequenos;
- elementos encostados nas bordas.

---

## Área de toque

Todo elemento clicável deve possuir área mínima próxima de:

```css
44px
```

de altura.

Essa regra melhora significativamente a experiência mobile.

---

# Cards

Todos os cards devem compartilhar a mesma identidade visual.

Sempre utilizar o componente:

```
<AppCard>
```

---

## Aparência padrão

- border-radius: 16px
- sombra leve
- padding consistente
- largura fluida
- fundo baseado no tema

---

## Variantes

O componente deve suportar variantes como:

```
default

outlined

flat

compact

interactive
```

A aparência deve ser controlada por propriedades, nunca por duplicação de componentes.

---

## Regras

Não criar:

```
ResultCardA

ResultCardB

HistoryCard

SimpleCard
```

quando apenas a aparência muda.

A responsabilidade da aparência pertence ao `AppCard`.

---

# Botões

Todos os botões devem utilizar o componente:

```
<AppButton>
```

internamente baseado em `v-btn`.

---

## Botão Principal

- color="primary"
- size="large"
- rounded="lg"

---

## Botão Secundário

- variant="outlined"

---

## Botão de Texto

Utilizar apenas quando a ação for claramente secundária.

---

## Ícones

Botões apenas com ícone devem possuir tooltip sempre que possível.

---

# Ícones

Utilizar exclusivamente:

Material Design Icons.

Evitar misturar bibliotecas.

---

## Tamanho padrão

24 px

---

## Regras

Ícones devem reforçar significado.

Nunca substituir texto importante apenas por ícones.

---

# Chips e Badges

Devem ser utilizados para:

- classificação;
- categorias;
- status;
- destaques rápidos.

Evitar utilizá-los como botões.

---

# Avatares

Sempre utilizar tamanhos padronizados.

Exemplo:

- pequeno
- médio
- grande

Evitar definir pixels diretamente nas páginas.

---

# Divisores

Utilizar divisores apenas quando realmente ajudarem na leitura.

Evitar excesso de linhas horizontais.

Muitas vezes um bom espaçamento produz resultado visual melhor.

---

# Animações

As animações devem ser discretas.

Nunca chamar mais atenção que o conteúdo.

---

## Duração

Utilizar tokens:

```css
--duration-fast

--duration-normal

--duration-slow
```

---

## Tipos permitidos

- Fade
- Expand
- Collapse
- Slide curto

---

## Evitar

- Bounce
- Zoom exagerado
- Rotações
- Animações longas

---

# Sombras

Utilizar apenas três níveis.

```
shadow-sm

shadow-md

shadow-lg
```

Evitar sombras diferentes para cada componente.

---

# Bordas

Utilizar apenas os raios definidos pelos tokens.

Evitar:

```css
border-radius: 11px;

border-radius: 19px;
```

Preferir:

```
radius-sm

radius-md

radius-lg

radius-xl
```

---

# Tabelas

Sempre avaliar se uma tabela realmente é necessária.

Em smartphones normalmente deve-se preferir:

- cards;
- listas;
- blocos empilhados.

---

## Exemplo

Evitar:

```
| Dom | Pontuação |
```

Preferir:

```
Dom

Ensino

Pontuação

87%
```

ou

```
Dom: Ensino

Pontuação: 87%
```

quando a leitura em celulares for significativamente melhor.

---

# Estilos

Evitar:

- estilos inline;
- CSS duplicado;
- classes quase idênticas;
- cores hardcoded;
- tamanhos hardcoded;
- espaçamentos arbitrários.

Sempre centralizar regras reutilizáveis no Design System.

---

# Componentes Base

Os componentes base representam os blocos fundamentais da interface.

Eles não devem conter regras de negócio ou conhecimento específico sobre o domínio do projeto.

Sua única responsabilidade é padronizar a aparência e a estrutura visual da aplicação.

---

# AppPage

Responsável pelo container principal de todas as páginas.

Deve ser utilizado em praticamente todas as Views.

## Responsabilidades

- centralizar conteúdo;
- aplicar largura máxima;
- aplicar padding padrão;
- controlar espaçamento vertical da página.

## Estrutura esperada

```vue
<AppPage>

    <PageHeader />

    ...

</AppPage>
```

---

# AppCard

Representa o card padrão da aplicação.

Todo conteúdo agrupado deve utilizar este componente.

## Responsabilidades

- bordas;
- sombra;
- padding;
- variantes visuais.

## Variantes

- default
- outlined
- flat
- compact
- interactive

Não criar componentes diferentes apenas para alterar aparência.

---

# AppButton

Wrapper do `v-btn`.

Responsável por padronizar:

- tamanho;
- raio;
- comportamento;
- loading;
- ícones;
- cores.

Sempre preferir este componente ao uso direto de `v-btn`.

---

# PageHeader

Responsável pelo cabeçalho de todas as páginas.

## Estrutura

```vue
<PageHeader
    title=""
    subtitle=""
/>
```

## Responsabilidades

- título;
- subtítulo;
- alinhamento;
- espaçamento inferior.

---

# SectionTitle

Representa títulos internos.

Exemplo:

```
Resumo

Ranking

Análise

Histórico
```

Evitar criar `<h2>` personalizados em cada página.

---

# AppStat

Componente para pequenas informações numéricas.

Exemplo:

```
42

Respostas
```

ou

```
87%

Ensino
```

Pode ser reutilizado em:

- Dashboard
- Resultado
- Histórico
- Perfil

---

# EmptyState

Representa ausência de conteúdo.

Exemplos:

- nenhum teste realizado;
- nenhum favorito;
- nenhum histórico.

Deve permitir:

- ícone;
- título;
- descrição;
- ação opcional.

---

# LoadingState

Representa carregamento.

Evitar utilizar `CircularProgress` diretamente nas páginas.

Sempre utilizar este componente.

---

# ErrorState

Representa erros inesperados.

Deve possuir:

- ícone;
- mensagem;
- botão para tentar novamente.

---

# Layouts

Layouts organizam componentes base.

Eles não possuem regras de negócio.

---

# FormLayout

Utilizado em:

- Login
- Cadastro
- Recuperação de senha
- Alteração de senha

Estrutura:

```
PageHeader

↓

Card

↓

Campos

↓

Botões

↓

Links auxiliares
```

---

# ReadingLayout

Utilizado em páginas com muito texto.

Exemplo:

- Análise
- Perfil do Dom
- Explicações

Características:

- largura reduzida;
- excelente legibilidade;
- linhas curtas.

---

# QuizLayout

Utilizado durante o teste.

Estrutura:

```
Barra de progresso

↓

Pergunta

↓

Alternativas

↓

Botões
```

Todo o fluxo do questionário deve seguir esse padrão.

---

# ResultsLayout

Utilizado para apresentação dos resultados.

Estrutura recomendada:

```
PageHeader

↓

Resumo

↓

Ranking

↓

Gráficos

↓

Análise

↓

Ações
```

Evitar blocos visuais sem organização clara.

---

# Componentes de Domínio

São componentes específicos do projeto.

Podem utilizar componentes base internamente.

---

# GiftScoreCard

Representa um dom espiritual.

Pode conter:

- nome;
- pontuação;
- categoria;
- badge.

Não deve controlar layout da página.

---

# RankingCard

Representa posições do ranking.

Pode ser reutilizado em:

- Resultado
- Histórico

---

# AnalysisCard

Representa blocos de análise.

Exemplo:

- descrição;
- pontos fortes;
- desafios;
- recomendações.

---

# ResultCard

Representa um resumo completo de um resultado.

Pode conter:

- data;
- nome;
- principais dons;
- ações.

---

# HistoryCard

Representa um item do histórico.

Responsabilidade apenas visual.

Toda lógica permanece na View.

---

# Padrões de Página

Todas as páginas devem seguir estruturas semelhantes.

---

# Home

Estrutura recomendada

```
PageHeader

↓

Resumo

↓

Ações principais

↓

Informações adicionais
```

Evitar excesso de texto logo na primeira tela.

---

# Login

Estrutura

```
PageHeader

↓

Card

↓

Campos

↓

Entrar

↓

Links auxiliares
```

---

# Cadastro

Mesmo padrão do Login.

Não criar layout diferente.

---

# Quiz

Estrutura

```
Progresso

↓

Pergunta

↓

Alternativas

↓

Navegação
```

A pergunta deve ser sempre o elemento visual dominante.

---

# Resultado

Estrutura recomendada

```
Resumo

↓

Ranking

↓

Badges

↓

Gráfico

↓

Análise

↓

Compartilhamento
```

A ordem deve seguir prioridade de leitura.

---

# Perfil do Dom

Estrutura

```
Nome

↓

Descrição

↓

Características

↓

Pontos fortes

↓

Desafios

↓

Aplicações
```

---

# Histórico

Estrutura

```
PageHeader

↓

Filtros

↓

Lista

↓

Paginação
```

Caso não existam resultados:

utilizar EmptyState.

---

# Estados

Toda página deve tratar explicitamente seus estados.

---

## Loading

Utilizar:

```
LoadingState
```

Nunca mostrar tela vazia durante carregamentos.

---

## Empty

Utilizar:

```
EmptyState
```

Sempre explicar ao usuário o motivo da ausência de conteúdo.

---

## Error

Utilizar:

```
ErrorState
```

Sempre oferecer possibilidade de tentar novamente.

---

## Offline

Quando possível:

informar que não há conexão.

Evitar mensagens técnicas.

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

# Navegação

As páginas devem manter comportamento consistente.

Sempre que possível:

- botão voltar na mesma posição;
- ações no mesmo local;
- cabeçalhos semelhantes.

---

# Componentes Reutilizáveis

Sempre que um trecho visual aparecer em duas ou mais páginas, avaliar promovê-lo para:

```
components/ui
```

Evitar duplicação de código visual.

---

# Responsabilidade das Views

As Views devem conter apenas:

- composição da página;
- chamadas de stores;
- chamadas de composables;
- eventos.

Evitar CSS complexo dentro das Views.

Toda regra visual reutilizável deve migrar para componentes.

---

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

---

## Estrutura

- Utiliza `AppPage`?
- Utiliza `PageHeader`?
- Utiliza `AppCard` quando necessário?
- Utiliza componentes reutilizáveis antes de criar novos?

---

## Tipografia

- Segue a escala oficial?
- Possui hierarquia clara?
- Evita tamanhos hardcoded?
- Mantém boa legibilidade em smartphones?

---

## Espaçamentos

- Utiliza apenas os tokens oficiais?
- Existem espaçamentos inconsistentes?
- Há elementos muito próximos ou muito afastados?

---

## Cores

- Utiliza apenas cores do tema?
- Evita cores hardcoded?
- Mantém contraste adequado?

---

## Responsividade

Validado em:

- 360 px
- 390 px
- 412 px
- 430 px

Também validado em:

- tablet
- desktop

Não existe scroll horizontal.

---

## Componentes

Existe algum componente duplicado?

Existe algum componente semelhante que poderia ser reutilizado?

Existe CSS repetido?

---

## Estados

A página trata corretamente:

- Loading
- Empty
- Error

---

## Código

Não existem:

- estilos inline;
- CSS duplicado;
- componentes desnecessários;
- lógica de negócio misturada com apresentação.

---

# Acessibilidade

Toda nova interface deve considerar princípios básicos de acessibilidade.

---

## Botões

Devem possuir área mínima de toque próxima de:

```
44 px
```

---

## Contraste

Evitar combinações de cores com baixo contraste.

Priorizar sempre a legibilidade.

---

## Navegação

A navegação deve ser consistente.

O usuário deve reconhecer rapidamente:

- onde está;
- como voltar;
- como concluir uma ação.

---

## Ícones

Ícones não substituem texto importante.

Sempre que necessário utilizar tooltip.

---

# Performance

O Design System também deve favorecer desempenho.

---

## Componentes

Evitar componentes muito grandes.

Preferir pequenos componentes reutilizáveis.

---

## CSS

Evitar:

- CSS duplicado;
- seletores muito específicos;
- regras espalhadas em várias páginas.

---

## Renderização

Evitar renderizações desnecessárias.

Os componentes devem receber dados por props sempre que possível.

---

# Fluxo de Implementação

A padronização visual deve ocorrer de forma incremental.

Nunca modificar toda a aplicação de uma única vez.

---

## Fase 1

Criar infraestrutura.

Implementar:

```
styles/

variables.css

spacing.css

typography.css

utilities.css

animations.css

index.css
```

Nenhuma página deve ser alterada nesta etapa.

---

## Fase 2

Criar o tema centralizado do Vuetify.

Definir:

- cores;
- tipografia;
- densidade;
- defaults quando possível.

---

## Fase 3

Criar componentes base.

Implementar inicialmente:

- AppPage
- AppCard
- AppButton
- PageHeader
- SectionTitle
- AppStat
- EmptyState
- LoadingState
- ErrorState

Nenhuma View deve ser modificada antes desta etapa estar concluída.

---

## Fase 4

Escolher uma página piloto.

Sugestão:

- Home

ou

- Login

A página piloto servirá para validar todo o Design System.

---

## Fase 5

Migrar páginas individualmente.

Uma página por vez.

Após cada migração:

- revisar;
- testar;
- realizar commit.

Somente então iniciar a próxima página.

---

## Fase 6

Auditoria visual completa.

Verificar:

- consistência;
- componentes repetidos;
- CSS desnecessário;
- oportunidades de reutilização.

---

# Ordem Recomendada de Migração

A sequência sugerida é:

1. Home
2. Login
3. Cadastro
4. Perfil
5. Histórico
6. Quiz
7. Resultado
8. Perfil de Dom
9. Compartilhamento

As páginas mais complexas devem ser migradas apenas após estabilização dos componentes base.

---

# Regras para IA (Copilot / Codex)

Estas regras devem ser consideradas obrigatórias durante qualquer tarefa relacionada à interface.

---

## Escopo

Alterar apenas:

- componentes visuais;
- estilos;
- layouts;
- organização da interface.

---

## Não alterar

Nunca modificar sem solicitação explícita:

- regras de negócio;
- stores;
- composables;
- APIs;
- rotas;
- autenticação;
- integração com Supabase;
- consultas SQL;
- lógica de cálculo;
- processamento de resultados.

---

## Componentes

Sempre reutilizar componentes existentes antes de criar novos.

Caso um novo componente seja necessário:

- deve ser genérico;
- reutilizável;
- independente da regra de negócio.

---

## CSS

Nunca duplicar CSS.

Sempre procurar mover regras reutilizáveis para:

```
styles/
```

ou

```
components/ui
```

---

## Responsividade

Toda alteração deve considerar primeiro smartphones.

Desktop é adaptação.

Nunca o contrário.

---

## Código

Evitar:

- refatorações não solicitadas;
- mudanças de arquitetura;
- alterações de nomenclatura;
- reorganizações de arquivos sem necessidade.

---

## Commits

Cada etapa deve gerar alterações pequenas e fáceis de revisar.

Preferir diversos commits pequenos a um único commit grande.

---

## Objetivo

O objetivo da tarefa é exclusivamente melhorar a interface.

Caso alguma alteração funcional pareça necessária, ela deve ser apenas sugerida, nunca implementada automaticamente.

---

# Prompts Recomendados

Exemplo de prompt para o Copilot:

```
Leia o DESIGN_SYSTEM.md.

Implemente apenas o componente AppCard.

Não altere nenhuma View.

Não altere regras de negócio.

Não altere stores.

Não altere composables.

Não altere APIs.

Não altere rotas.

Utilize apenas Vue 3, TypeScript e Vuetify.

Siga rigorosamente os Design Tokens definidos neste documento.
```

---

Outro exemplo:

```
Leia o DESIGN_SYSTEM.md.

Atualize apenas LoginView.

Utilize exclusivamente componentes existentes do Design System.

Não altere lógica.

Não altere stores.

Não altere autenticação.

Não altere regras de negócio.

Apenas adapte a estrutura visual.
```

---

# Critério de Conclusão

A padronização visual será considerada concluída quando:

- todas as páginas utilizarem os componentes base;
- não existirem estilos inline relevantes;
- os Design Tokens forem utilizados em toda a aplicação;
- todas as telas apresentarem identidade visual consistente;
- a experiência em smartphones for equivalente ou superior à experiência em desktop;
- novos componentes possam ser desenvolvidos seguindo este documento sem necessidade de criar novos padrões.

---

# Manutenção

Este documento deve evoluir junto com o projeto.

Sempre que um novo padrão visual for criado, ele deve ser documentado aqui antes de ser adotado em outras partes da aplicação.

O Design System é a fonte oficial de verdade para toda a interface do projeto.

Nenhuma decisão visual deve contradizer este documento sem uma revisão explícita do próprio Design System.

