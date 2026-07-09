# Domínio — Teste dos Cinco Ministérios

## Modelo do Teste

O teste é composto por **6 perguntas**. Cada pergunta possui **5 alternativas**, cada uma associada a um dos cinco ministérios. O respondente escolhe a alternativa que mais se identifica.

Ao final, cada resposta soma **1 ponto** ao ministério correspondente. O resultado é a lista dos ministérios ordenada por pontuação.

## Ministérios

| ID | Nome | Descrição |
|----|------|-----------|
| apostolo | Apóstolo | Visão, pioneirismo, fundação de novas obras |
| profeta | Profeta | Revelação, discernimento, correção e verdade |
| evangelista | Evangelista | Paixão por almas, comunicação, mobilização |
| pastor | Pastor | Pastoreio, cuidado, aconselhamento, edificação |
| mestre | Mestre | Ensino, doutrina, estudo, precisão teológica |

## Regra de Pontuação

```
Cada resposta → +1 ponto ao ministério da alternativa escolhida
Ordenação final → decrescente por pontuação
Empate → todos os ministérios com a mesma pontuação máxima são considerados
```

## Gabarito Oficial

Cada alternativa (a, b, c, d, e) corresponde ao ministério indicado:

| Pergunta | a | b | c | d | e |
|----------|---|---|---|---|---|
| 1 | mestre | evangelista | pastor | profeta | apóstolo |
| 2 | pastor | apóstolo | mestre | profeta | evangelista |
| 3 | apóstolo | pastor | evangelista | profeta | mestre |
| 4 | pastor | evangelista | apóstolo | profeta | mestre |
| 5 | evangelista | pastor | mestre | profeta | apóstolo |
| 6 | pastor | mestre | evangelista | profeta | apóstolo |

## Decisões do MVP

- **6 perguntas**: número suficiente para identificar tendências sem tornar o teste cansativo
- **1 alternativa por ministério**: cada pergunta oferece exatamente uma opção para cada ministério, sem repetições
- **Pontuação simples**: soma direta, sem pesos ou normalização
- **Empates expostos**: o sistema revela quando há empate, em vez de esconder ou forçar um desempate
- **Domínio puro**: toda a lógica está em `src/domain/`, sem dependência de Vue ou qualquer framework
- **Conteúdo textual imutável**: as perguntas e alternativas são dados oficiais do teste e não devem ser alteradas sem decisão documentada

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `src/domain/types.ts` | Tipos: Ministry, Question, Option, Answer, MinistryScore |
| `src/domain/ministries.ts` | Dados dos 5 ministérios |
| `src/domain/questions.ts` | 6 perguntas com alternativas |
| `src/domain/scoring.ts` | Cálculo de pontuação |
