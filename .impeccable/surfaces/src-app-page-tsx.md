---
version: 2
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets:
  - "src/app/projetos/[slug]/page.tsx"
  - "src/app/notas/page.tsx"
  - "src/app/notas/[slug]/page.tsx"
---

## Escopo

Home e rotas editoriais do portfólio de Leandro Oliveira. Visitor mode: **Persuade**.

## Oferta e audiência

Produtos digitais e sistemas para operações reais. A página atende donos de operação,
fundadores, agências e gestores técnicos sem exigir que o visitante decifre uma metáfora.
O resultado esperado é entender a oferta, reconhecer prova concreta e iniciar uma conversa.

## Ação e prova

Ação primária: abrir o WhatsApp. Ações secundárias: conhecer projetos, visitar produtos
publicados e acessar e-mail, LinkedIn ou Instagram. A prova vem de sete projetos reais,
estados textuais, stack aplicada e uma trajetória profissional factual. Não inventar
clientes, depoimentos, receita, prazo ou métricas.

## Direção escolhida

**Produto e operação.** Preto profundo, grafite, branco quente e verde-limão `#D4FF00`.
Archivo largo sustenta títulos; Martian Mono fica restrita a tecnologia e metadados.
Cinema aparece apenas no enquadramento, ritmo, contraste e transições retangulares — nunca
em nomes de seção, navegação ou explicações do trabalho.

## Abertura e movimento

A tese “Produtos digitais para operações reais” está legível no HTML antes de qualquer
efeito. Duas faixas diagonais estreitas atravessam automaticamente a entrada em menos de
1,2 segundo, sem depender da rolagem. Em `prefers-reduced-motion`, as faixas não aparecem.
O restante da página é estável e disciplinado, com estado de hover apenas como apoio.

## Guardrails

- Não reintroduzir Lenis, ScrollTrigger global, playhead, timecode ou barra de transporte.
- Não transformar stack em uma grade de logos nem projetos em cartões genéricos com ícones.
- Manter superfícies retangulares, foco visível e alvos de toque de pelo menos 44 px.
- Usar imagens públicas ou sanitizadas; nunca publicar dados internos identificáveis.
- Preservar WhatsApp, e-mail, LinkedIn e Instagram como canais explícitos.
