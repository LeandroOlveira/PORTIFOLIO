# Performance (Core Web Vitals) — 74/100

**Aviso metodológico:** não há dado de campo. A cota diária da API PageSpeed Insights sem chave estava esgotada, e o domínio é novo demais para amostra CrUX. O runtime Python do plugin não está provisionado, então o Lighthouse empacotado não rodou. Os números abaixo vêm de medição direta no navegador e de inspeção de recursos. **Reavaliar quando houver dado de usuário real.**

## Medido

| Métrica | Valor | Limite "bom" | Estado |
|---|---|---|---|
| CLS | **0,000** | ≤ 0,10 | ✅ |
| TTFB | 14–94 ms | ≤ 800 ms | ✅ |
| DOMContentLoaded | 43–137 ms | — | ✅ |
| Load | 52–383 ms | — | ✅ |
| Requisições (home) | 13 | — | ✅ |
| Transferido (home) | ≈364 KB | — | ⚠️ |
| JS descompactado | 864 KB | — | ⚠️ |

**LCP e INP não medidos.** O painel do navegador não registrou entradas de paint timing em nenhum dos três carregamentos (recursos vindo de cache de disco), então não há número de LCP confiável para reportar. Não vou estimar.

## CLS: 0,42 → 0,000

O problema central da auditoria anterior está resolvido, e a correção está confirmada nos dois lados:

- **Código:** `src/components/Corredor.tsx:35` — `const useEfeitoDeLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;`. A detecção de WebGL2 agora roda antes da pintura, então a troca de `'documento'` para `'corredor'` não gera salto.
- **Produção:** `PerformanceObserver({type:'layout-shift', buffered:true})` retornou **zero entradas** em três carregamentos independentes.

## Peso do JavaScript (B5)

| Chunk | KB descompactado |
|---|---|
| `b536a0f1…js` (Three.js) | **315** |
| `bd904a5c…js` | 175 |
| `4bd1b696…js` | 169 |
| `255-…js` | 169 |
| CSS | 40 |
| Fontes (2 × woff2) | 111 |

864 KB descompactados, ≈364 KB transferidos. Um único chunk de 315 KB domina — o Three.js do corredor 3D.

**Isto não é um bug a corrigir.** O corredor é a peça autoral do site e o handoff é explícito em não mexer nele. O fallback textual já pinta antes do WebGL inicializar, então o custo não bloqueia o primeiro conteúdo. Fica registrado como o maior item de peso da home, a ser revisitado **com dado de campo**, não antes.

## Imagens no caminho crítico (M5)

**Home: custo zero.** Medição confirmou **0 requisições de imagem** — no modo WebGL o corredor substitui a árvore DOM que contém as sete `<img>`, e nenhuma textura é carregada. As imagens só existem no caminho de fallback.

**Páginas de projeto: custo real.** A primeira captura carrega com `loading="eager"` e é PNG não otimizado:

| Página | Primeira imagem |
|---|---|
| `/projetos/radar-fiscal` | **729 KB** |
| `/projetos/roadmap` | 212 KB |
| `/projetos/dochub` | 192 KB |

`next.config.ts` declara `formats: ['image/avif', 'image/webp']`, mas nada passa por `next/image` — zero ocorrências de `srcset` e de `_next/image` no HTML. A configuração está inerte.

**Fix:** trocar `<img>` por `next/image` em `src/app/projetos/[slug]/page.tsx:105`. As dimensões já vêm do conteúdo (`captura.largura`/`captura.altura`), então não há risco de reintroduzir CLS.

## Entrega

`X-Nextjs-Prerender: 1` · `X-Vercel-Cache: HIT` · `Cache-Control: public, max-age=0, must-revalidate` + `X-Nextjs-Stale-Time: 300` · fontes com `rel="preload"` e `crossorigin`.

Nada a corrigir. A camada de entrega é a parte mais bem resolvida do site.

## Falsificação

Se após 30 dias de tráfego o Search Console mostrar LCP acima de 2,5 s em móvel, o chunk de 315 KB passa de escolha defensável a problema — e aí a correção é carregar o Three.js sob demanda depois do primeiro paint, não removê-lo.
