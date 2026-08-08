# Plano de ação — devleandrooliveira.com.br

**Base:** auditoria de 2026-08-08, nota 71/100
**Nenhum item Crítico.** Nada bloqueia indexação hoje. O ganho disponível é de posicionamento, não de conserto.

A ordem importa: A1 e A2 mexem no mesmo arquivo e devem subir antes da submissão ao Search Console, para que a primeira indexação já pegue os títulos certos.

---

## Fase 1 — Antes de submeter ao Search Console (dia 1)

| # | Item | Arquivo | Esforço |
|---|---|---|---|
| A1 | Usar `nomeCompleto` ("Leandro Oliveira") no template de título; manter `lhs.oliveira` como `alternateName` | `src/lib/site.ts:4-5` + `src/app/layout.tsx` | 20 min |
| A2 | Título de projeto = `{nome} — {categoria} \| Leandro Oliveira`; dados já existem em `content.ts` | `src/app/projetos/[slug]/page.tsx` (`generateMetadata`) | 30 min |
| M3 | Redirect 301 `www` → apex | Painel Vercel → Domains | 5 min |

**Verificação:**
```bash
curl -s https://devleandrooliveira.com.br/projetos/alinnea | grep -o '<title>[^<]*</title>'
```
Esperado: título com "CRM para psicólogos" e "Leandro Oliveira".

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://www.devleandrooliveira.com.br/
```
Esperado: `301`.

**Depois disso:** submeter `sitemap.xml` no Google Search Console e no Bing Webmaster Tools.

---

## Fase 2 — Alto impacto (semana 1)

| # | Item | Arquivo | Esforço |
|---|---|---|---|
| A3 + M2 | `opengraph-image.tsx` para `notas/[slug]` e `notas/`; adicionar `image` ao `BlogPosting` (mesma causa raiz) | `src/app/notas/` | 1–2 h |
| A4a | Criar hub `/projetos` (hoje 404); incluir no sitemap e no breadcrumb dos projetos | `src/app/projetos/page.tsx`, `sitemap.ts` | 2 h |
| A4b | Bloco "outros projetos" (2–3 irmãos) em cada página de projeto | `src/app/projetos/[slug]/page.tsx` | 1 h |
| A4c | Link cruzado nota ↔ projeto que a exemplifica | conteúdo + componentes | 1 h |
| M1 | `CreativeWork.url` → URL da página; site externo para `sameAs`; remover `keywords: []`; adicionar `mainEntityOfPage` | gerador de JSON-LD dos projetos | 30 min |

**Verificação:** [Rich Results Test](https://search.google.com/test/rich-results) em `/projetos/alinnea` (o `url` precisa ser o de `devleandrooliveira.com.br`); [Sharing Debugger](https://developers.facebook.com/tools/debug/) em uma nota (card precisa ter imagem); recontar links internos por página (páginas de projeto devem sair de 1 para 4+).

---

## Fase 3 — Otimização (mês 1)

| # | Item | Esforço |
|---|---|---|
| M5 | Trocar `<img>` por `next/image` em `src/app/projetos/[slug]/page.tsx` — as dimensões já existem, então não há risco de CLS. Recomprimir `radar-fiscal.png` (729 KB) | 1 h |
| M4 | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` em `next.config.ts`. CSP por último, com teste — o WebGL exige cuidado | 1–2 h |
| M6 | Padding vertical nos links para ~48 px de área tocável (sem mexer na tipografia) | 1 h |
| M7 | `og:locale: pt_BR` no metadata compartilhado | 5 min |
| B2 | Reaproveitar o alt descritivo das páginas de projeto no fallback da home | 20 min |
| B3 | Parágrafo de contexto em `/notas` (hoje 105 palavras) | 20 min |
| B4 | 301 de `lhs-oliveira-portfolio.vercel.app` para o domínio próprio | 10 min |

---

## Fase 4 — Conteúdo e monitoramento (contínuo)

- **B1 — Publicar notas.** Três posts de ~250 palavras não sustentam autoria temática. Duas notas por mês, mais longas (600–900 palavras), ancoradas nos problemas que os projetos resolvem, fazem mais pelo ranking do que qualquer ajuste técnico restante.
- **Métricas concretas nos projetos.** Só o Roadmap tem número ("~80 pessoas"). Um dado real por projeto é o sinal de E-E-A-T mais barato disponível.
- **Reavaliar performance com dado de campo** assim que o domínio acumular amostra CrUX. O chunk de 315 KB do Three.js (B5) é escolha de produto defensável, mas merece medição real antes de qualquer decisão.

### Indicadores para acompanhar sem refazer a auditoria

| Indicador | Onde | O que significa |
|---|---|---|
| Impressões para o nome próprio | GSC → Consultas | Se ficar em zero após 30 dias, A1 não pegou |
| Impressões para consultas de categoria ("crm para psicólogos") | GSC → Consultas | Valida A2 |
| Páginas indexadas | GSC → Cobertura | Deve chegar a 13 (12 + `/projetos`) |
| Cliques em páginas de projeto | GSC → Páginas | Mede se A4 tirou os projetos da sombra da home |
| CWV de campo | GSC → Core Web Vitals | Primeiro dado real de performance |
