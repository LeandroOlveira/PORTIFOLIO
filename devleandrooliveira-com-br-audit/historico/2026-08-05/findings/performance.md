# Performance (CWV) — achados diretos

Medido com Chrome DevTools MCP: Lighthouse (mobile, navigation mode) + trace de performance real no site em produção.

## Lighthouse

| Categoria | Nota |
|---|---|
| Accessibility | 96/100 |
| Best Practices | 100/100 |
| SEO técnico | 100/100 |
| Agentic Browsing | 62/100 |

Duas falhas específicas:

**color-contrast (Accessibility).** Itens reprovados: `<h3 class="title-tight ...">` e `<p class="... text-mid">` — exatamente o padrão dos itens da seção Stack (`src/components/Stack.tsx`, classe `.pilha-item`). Causa: `src/app/globals.css` define `.pilha-item { opacity: calc(0.12 + var(--montagem) * 0.88) }` — em repouso (`--montagem` = 0, antes de entrar na janela de rolagem que dispara a animação), o texto fica a 12% de opacidade, contraste insuficiente para qualquer ferramenta que capture o DOM nesse estado.

**cumulative-layout-shift (Agentic Browsing).** Score 0,23 no Lighthouse; 0,42 no trace de performance dedicado (variação normal entre execuções, ambos na faixa "ruim", teto "bom" = 0,10).

## Trace de performance (dados reais)

| Métrica | Valor |
|---|---|
| LCP | 287ms (excelente) |
| TTFB | 13ms |
| Render delay (parte do LCP) | 274ms |
| CLS | 0,42 |

**Causa raiz do CLS, com alta confiança:** o maior salto de layout (score 0,4250, isolado) começa aos 296ms — 9ms depois do LCP finalizar. Essa janela de tempo bate exatamente com o padrão de `src/components/Corredor.tsx`:

```tsx
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = tela.current;
  if (!canvas || !canvas.getContext('webgl2')) return;
  setModo('corredor');
}, []);
```

Este efeito roda **depois** do primeiro paint (comportamento padrão de `useEffect`). Ao detectar suporte a WebGL2, ele troca `modo` de `'documento'` para `'corredor'`, o que substitui toda a árvore DOM: do layout empilhado curto (modo `documento`) para um contêiner `sticky` de `(FASE_PORTA + total) * 100svh` — várias telas de altura (modo `corredor`). Essa troca acontecendo depois do navegador já ter pintado o layout `documento` é o salto medido.

**Recomendação concreta:** trocar `useEffect` por `useLayoutEffect` nesse bloco específico. `useLayoutEffect` roda de forma síncrona depois do commit do React mas antes do navegador pintar, então a decisão de modo acontece antes da primeira pintura visível — é o padrão correto do React para decisões de layout dependentes de uma medição síncrona (`canvas.getContext('webgl2')` não é assíncrono, não precisa esperar `useEffect`). Testar visualmente após a troca para confirmar que o salto desaparece — `useLayoutEffect` bloqueia a pintura até terminar, então vale medir se isso não introduz atraso perceptível no primeiro paint em dispositivos mais lentos.

## O que já funciona bem

- LCP de 287ms é excelente por qualquer critério.
- Imagens da galeria de projeto com `width`/`height` explícitos (lidos do arquivo em build) — não contribuem para CLS de carregamento de imagem.
- Best Practices e SEO técnico do Lighthouse em 100/100.
