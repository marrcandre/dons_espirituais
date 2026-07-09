# Próximo Sprint — Sprint 6.4: Revisão Final e Release (v1.0.0)

## Objetivo

Realizar a revisão final da aplicação **Cinco Ministérios** antes da publicação oficial da primeira versão estável.

Este sprint tem como objetivo garantir que a aplicação esteja pronta para divulgação pública, validando aspectos técnicos, visuais e documentais.

Não serão realizadas alterações em regras de negócio ou arquitetura.

---

# Escopo

## 1. Auditoria final da aplicação

Revisar:

* funcionamento completo do fluxo:

  * página inicial;
  * teste;
  * resultado;
  * página institucional.

* navegação entre páginas;

* links internos;

* links externos;

* comportamento em desktop e dispositivos móveis;

* modo claro e escuro.

---

## 2. Revisão de publicação

Validar:

* favicon;
* logo;
* apple-touch-icon;
* imagem Open Graph;
* compartilhamento em redes sociais;
* manifest PWA;
* robots.txt;
* sitemap.xml.

Conferir se todas as URLs provisórias estão corretas.

---

## 3. Documentação final

Atualizar:

* README.md;
* CHANGELOG.md;
* documentação do Sprint 6.

Verificar:

* descrição do projeto;
* tecnologias utilizadas;
* instruções de execução;
* links públicos;
* informações de autoria.

---

## 4. Validação técnica

Executar:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Confirmar:

* ausência de erros;
* todos os testes passando;
* build de produção funcionando.

---

## 5. Preparação da versão 1.0.0

Após aprovação final:

Criar tag:

```bash
v1.0.0
```

Criar release correspondente no GitHub.

Registrar:

* resumo das funcionalidades;
* decisões importantes;
* data da primeira publicação oficial.

---

# Fora do escopo

Não serão implementados neste sprint:

* autenticação;
* banco de dados de usuários;
* histórico de resultados;
* novos testes;
* integração com outros projetos;
* mudanças na metodologia do teste.

---

# Critério de conclusão

O Sprint 6.4 será considerado concluído quando:

* aplicação revisada;
* documentação atualizada;
* testes aprovados;
* versão marcada como `v1.0.0`;
* release publicada no GitHub.


