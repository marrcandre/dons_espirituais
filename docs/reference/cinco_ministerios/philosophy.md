# Filosofia do Projeto

## Simplicidade acima da complexidade

Toda decisão deve favorecer a solução mais simples que funciona. Complexidade só se justifica quando a solução simples já não atende.

## Domínio independente da interface

A lógica de negócio não depende de Vue, Vuetify ou qualquer tecnologia de apresentação. Pode ser testada e executada sem o navegador.

## Componentes pequenos

Cada componente resolve um problema. Se um componente cresce demais, divide-se.

## Evitar duplicação

Toda repetição é uma oportunidade de extrair um componente, composable ou utilitário.

## Offline first

A aplicação funciona sem rede. Dados residem no navegador. Persistência via localStorage.

## Performance por padrão

Código deve ser eficiente sem otimizações prematuras. Lazy loading, bundle pequeno, renderização eficiente.

## Acessibilidade desde o início

Acessibilidade não é uma camada adicional. É parte do design e do código desde o primeiro componente.

## Documentação simples

Documentação clara, objetiva e junto ao código. Evitar documentação extensa que ninguém lê.

## Código fácil de manter

Prefira legibilidade a "inteligência". Nomes claros, estrutura previsível, padrões consistentes.

## Preferência por soluções pequenas

Uma biblioteca pequena é melhor que uma grande. Um arquivo pequeno é melhor que um grande. Uma função pequena é melhor que uma grande.
