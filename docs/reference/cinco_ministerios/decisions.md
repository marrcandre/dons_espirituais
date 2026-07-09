# Decisões Técnicas

## Por que não Clean Architecture completa?

O projeto é pequeno e não se beneficiaria da complexidade adicional. Preferimos uma separação pragmática entre domínio, interface e serviços.

## Por que Vuetify + Tailwind?

Vuetify fornece componentes acessíveis e prontos. Tailwind permite customização rápida sem sair do HTML. A combinação oferece produtividade e flexibilidade.

## Por que localStorage?

Sem backend, sem autenticação. localStorage é suficiente para o MVP e elimina infraestrutura.

## Por que módulos?

Cada funcionalidade (questionário, resultados) será um módulo independente. Facilita manutenção e possível extração futura.

## Por que @/ como alias?

Padrão Vue + Vite. Evita imports relativos profundos como `../../../../`.

## Por que CSS puro nos tokens (não Tailwind variables)?

Os tokens precisam ser acessíveis tanto pelo Tailwind quanto pelo Vuetify e por componentes Vue. CSS custom properties são o formato universal. O Tailwind 4 lê nativamente `@import` e as variáveis ficam disponíveis em todo o ecossistema.

## Por que Dark Theme via classe `.dark`?

Solução leve e sem dependências. A classe `.dark` no `<html>` ativa as sobrescritas dos tokens. O Vuetify sincroniza via `useTheme()`.

## Por que `src/styles/theme/vuetify.ts` em vez de `app/plugins/`?

O tema Vuetify faz parte do Design System, não da configuração da aplicação. Agrupar com os tokens reforça que é um artefato compartilhável entre projetos.
