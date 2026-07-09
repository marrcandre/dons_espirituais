# Design System

## Princípios de UX

- **Simplicidade** — cada tela tem um propósito único e claro
- **Espaço em branco** — o layout respira, elementos não são comprimidos
- **Tipografia legível** — fontes neutras, tamanhos adequados, hierarquia clara
- **Poucos elementos por tela** — evitar sobrecarga cognitiva
- **Animações discretas** — movimento sutil com propósito, não decoração
- **Acessibilidade** — contraste suficiente, foco visível, suporte a leitores de tela
- **Consistência** — mesmos padrões entre projetos da família
- **Interface limpa** — sem ruído visual, sem elementos desnecessários
- **Foco no conteúdo** — a interface serve ao conteúdo, não o contrário

## Tokens

### Cores — Light

| Token              | Valor     | Uso                        |
|--------------------|-----------|----------------------------|
| Primary            | #1B5438   | Ações principais, destaque |
| Primary Hover      | #14442D   | Hover de Primary           |
| Secondary          | #C8A220   | Ações secundárias          |
| Secondary Hover    | #B08E1A   | Hover de Secondary         |
| Background         | #F8F8F5   | Fundo da página            |
| Surface            | #FFFFFF   | Cartões, superfícies       |
| Text Primary       | #1A1A1A   | Títulos, texto principal   |
| Text Secondary     | #5A5A5A   | Texto de apoio             |
| Text Disabled      | #9E9E9E   | Texto desabilitado         |
| Border             | #E0E0E0   | Bordas, divisores          |
| Error              | #D32F2F   | Erros, validação           |
| Success            | #388E3C   | Sucesso, confirmação       |

### Cores — Dark

| Token              | Valor     |
|--------------------|-----------|
| Primary            | #2D8A5A   |
| Primary Hover      | #36A36C   |
| Secondary          | #D4A82E   |
| Secondary Hover    | #E0B83A   |
| Background         | #121212   |
| Surface            | #1E1E1E   |
| Text Primary       | #E8E8E8   |
| Text Secondary     | #A8A8A8   |
| Text Disabled      | #6E6E6E   |
| Border             | #333333   |
| Error              | #EF5350   |
| Success            | #66BB6A   |

### Tipografia

- Família: Inter / Roboto (fallback)
- Pesos: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Espaçamentos

| Token  | Valor  |
|--------|--------|
| xs     | 4px    |
| sm     | 8px    |
| md     | 16px   |
| lg     | 24px   |
| xl     | 32px   |
| 2xl    | 48px   |
| 3xl    | 64px   |

### Bordas

| Token | Valor  |
|-------|--------|
| sm    | 4px    |
| md    | 8px    |
| lg    | 12px   |
| xl    | 16px   |
| full  | 9999px |

### Sombras

- sm, md, lg, xl — progressão crescente de intensidade
- Dark theme: sombras mais escuras para manter profundidade

## Temas

Suporte completo a Light, Dark e System (segue preferência do SO).

Gerenciamento pelo composable `useTheme()`.

## Componentes

- **AppButton** — Botão com variantes (primary, secondary, outline, text), tamanhos (sm, md, lg)
- **AppCard** — Container com padding e variantes (elevated, outlined, flat)
- **AppContainer** — Wrapper com max-width responsivo
- **AppHeader** — Cabeçalho fixo com brand e toggle de tema
- **PageHeader** — Cabeçalho de página com título e descrição
- **SectionTitle** — Título de seção com subtítulo opcional
- **EmptyState** — Estado vazio com ícone, título e mensagem
- **LoadingState** — Estado de carregamento com spinner

## Tema Vuetify

O tema Vuetify (`cincoMinisteriosLight` / `cincoMinisteriosDark`) reflete os tokens CSS. Serve como fonte de verdade para componentes Vuetify.
