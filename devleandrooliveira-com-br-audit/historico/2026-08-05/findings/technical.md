# Technical SEO — achados diretos

Verificado por leitura de código (`src/app/robots.ts`, `sitemap.ts`, `layout.tsx`, `next.config.ts`) e checagem ao vivo (`curl`, headers de resposta).

## Critical

**sitemap.xml e robots.txt apontam para `lhsoliveira.dev`, domínio não utilizado.**
`src/lib/site.ts:9` — `url: 'https://lhsoliveira.dev'`. Usado por `sitemap.ts` (11 URLs) e `robots.ts` (`Sitemap:` header). Nenhum dos dois reflete o domínio real (Vercel) ou o planejado (`devleandrooliveira.com.br`).
→ Atualizar `site.url` para o domínio real de produção agora.

**Nenhuma página declara `<link rel="canonical">`.**
Confirmado por grep no HTML de home e de página de projeto. `metadataBase` só resolve URLs relativas de OG; não gera canonical automaticamente.
→ Adicionar `alternates: { canonical }` em `layout.tsx` e em cada `generateMetadata`.

## Medium

**Faltam headers de segurança.**
`curl -I` na home retorna apenas `Strict-Transport-Security` (herdado da Vercel). Ausentes: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
→ Adicionar via `headers()` em `next.config.ts`. Não bloqueia indexação, mas é praxe de maturidade técnica e o Lighthouse Best Practices já está em 100 — vale manter.

## Low

**Sem web app manifest.**
`/site.webmanifest` e `/manifest.json` retornam 404. Apenas um ícone declarado (32×32 PNG via `icon.tsx`), sem `apple-touch-icon` 180×180.
→ Opcional para um portfólio que não é PWA. Se fizer, adicionar `apple-touch-icon` ajuda o preview ao salvar em home screen iOS/compartilhar via iMessage.

## O que já funciona bem

- SSR/SSG completo confirmado nas 4 páginas de projeto e 3 notas testadas via `curl` sem executar JS.
- `robots.txt` com `Allow: /` — nenhum crawler bloqueado.
- `sitemap.xml` estruturalmente correto, com `lastmod` por página (data de publicação real nas notas).
- HTTPS + HSTS ativo (`max-age=63072000; includeSubDomains; preload`).
- `generateStaticParams` cobrindo as 7 rotas de projeto e 3 de nota.
