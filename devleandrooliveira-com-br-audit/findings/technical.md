# Technical SEO — 82/100

**Data:** 2026-08-08 · 12/12 URLs do sitemap rastreadas

## Rastreabilidade e indexação

| Check | Estado |
|---|---|
| `robots.txt` | ✅ 200, `User-Agent: * / Allow: /`, sitemap declarado |
| `sitemap.xml` | ✅ 200, 12 URLs, `lastmod` + `priority`, domínio correto |
| Canonical | ✅ 12/12, auto-referencial, domínio correto |
| `meta robots` | ✅ `index, follow` em todas |
| `lang` | ✅ `pt-BR` em todas |
| 404 real | ✅ `/pagina-inexistente` → 404 (não soft-404) |
| HTTP → HTTPS | ✅ redireciona |
| Renderização | ✅ SSR/prerender — 748 palavras no HTML bruto da home |

Nenhuma URL do sitemap retorna erro. Nenhuma cadeia de redirect. Nenhum `noindex` acidental.

## Problemas

### M3 — `www` responde 200 em vez de 301
`https://www.devleandrooliveira.com.br/` serve o mesmo conteúdo com status 200. O canonical aponta para o apex, então não há indexação duplicada, mas há rastreio desperdiçado.
**Fix:** Vercel → Domains → redirect `www` para o apex.
**Falsificação:** `curl -s -o /dev/null -w "%{http_code}" https://www.devleandrooliveira.com.br/` deve dar 301.

### A4 — `/projetos` retorna 404
Existem 7 páginas `/projetos/[slug]` e nenhum índice. Sem hub, o cluster de conteúdo comercialmente mais relevante não tem página de categoria indexável.

### M4 — Headers de segurança
Presente: `Strict-Transport-Security: max-age=63072000`.
Ausentes: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`.
Sem efeito direto em ranking; conta em auditoria de terceiros. `nosniff` e `Referrer-Policy` são risco zero. CSP exige teste por causa do WebGL.

## Infraestrutura

`Server: Vercel` · `X-Nextjs-Prerender: 1` · `X-Vercel-Cache: HIT` · TTFB medido 14–94 ms · `Cache-Control: public, max-age=0, must-revalidate` com `X-Nextjs-Stale-Time: 300`.

Nada a corrigir aqui — a entrega é sólida.

## Não verificado

Sem Search Console configurado: cobertura real de indexação, erros de rastreio e canonical escolhido pelo Google não puderam ser confirmados. O runtime Python do plugin não está provisionado, então nenhuma ferramenta empacotada rodou.
