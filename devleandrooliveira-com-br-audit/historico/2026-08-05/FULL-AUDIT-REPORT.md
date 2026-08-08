# Auditoria SEO — lhs.oliveira / devleandrooliveira.com.br

**Data:** 2026-08-05
**Site auditado:** https://lhs-oliveira-portfolio.vercel.app (domínio final planejado — `devleandrooliveira.com.br` — ainda não comprado)
**Método:** código-fonte local (Next.js 15 App Router) + site em produção via curl/Lighthouse/DevTools + 2 agentes especializados (conteúdo, GEO); um terceiro agente (SXO) falhou por limite de sessão da ferramenta e foi substituído por análise direta, marcada como tal abaixo.

## SEO Health Score: 47/100

| Categoria | Peso | Nota | Nota ponderada |
|---|---|---|---|
| Technical SEO | 22% | 55/100 | 12,1 |
| Content Quality | 23% | 45/100 | 10,4 |
| On-Page SEO | 20% | 50/100 | 10,0 |
| Schema / Dados estruturados | 10% | 10/100 | 1,0 |
| Performance (CWV) | 10% | 55/100 | 5,5 |
| AI Search Readiness | 10% | 50/100 | 5,0 |
| Imagens | 5% | 65/100 | 3,3 |

A nota reflete um site **tecnicamente bem construído** (SSR completo, HTML semântico, alt text presente, Lighthouse Accessibility 96 / Best Practices 100 / SEO 100) que **não está pronto para lançamento**: três bugs concretos de produção (não hipóteses) e ausência total de dados estruturados pesam mais que a qualidade de base. É uma correção de dias, não uma reconstrução.

## Top 5 problemas críticos

1. **`og:image` aponta para `http://localhost:3000` em produção** — todo compartilhamento (WhatsApp, LinkedIn, preview de IA) mostra imagem quebrada, no canal que é a própria conversão do site.
2. **`sitemap.xml` e `robots.txt` declaram um domínio (`lhsoliveira.dev`) que não é nem o Vercel atual nem o `devleandrooliveira.com.br` planejado** — sinal de indexação fragmentado antes mesmo do lançamento.
3. **Zero dados estruturados (JSON-LD)** em qualquer página — nenhum `Person`, `Article`, `CreativeWork`, `BreadcrumbList`.
4. **CLS de 0,42 (ruim; teto "bom" é 0,10)** — causado com alta confiança pela troca de modo `documento → corredor` do componente `Corredor.tsx`, que substitui a árvore DOM inteira ~300ms depois do primeiro paint.
5. **As 7 páginas de projeto têm 48-56 palavras de corpo cada, com estrutura e vocabulário quase idênticos** ("template sameness") — abaixo de qualquer piso razoável de estudo de caso.

## Top 5 quick wins (baixo esforço, alto valor)

1. Definir `NEXT_PUBLIC_SITE_URL` no ambiente da Vercel — resolve o `og:image` quebrado. 15 minutos.
2. Corrigir `site.url` em `src/lib/site.ts` para apontar para um domínio real (o da Vercel, até a compra do `.com.br`). 5 minutos.
3. Renderizar o link do GitHub, que já existe em `src/lib/site.ts` mas nunca é usado em nenhum componente. 10 minutos.
4. Adicionar `Person` schema (JSON-LD) no `layout.tsx` raiz — maior alavanca isolada de Authority/GEO. Meio dia.
5. Sobrescrever `openGraph`/`twitter` em `generateMetadata` de `projetos/[slug]/page.tsx` com a imagem e título do projeto específico, em vez de herdar o genérico do site inteiro. 1-2h.

---

## Technical SEO

**O que funciona:**
- SSR/SSG completo confirmado — todo texto essencial de home, projeto e nota está no HTML bruto, sem depender de JS/WebGL (`curl` sem executar JS já traz o conteúdo inteiro).
- `robots.txt` liberal (`Allow: /`) — nenhum crawler bloqueado, incluindo bots de IA (GPTBot, ClaudeBot, PerplexityBot cobertos pelo wildcard).
- `sitemap.xml` estruturalmente válido, lista as 11 URLs reais (home, /notas, 7 projetos, 3 notas) com `lastmod` correto por nota.
- HTTPS com HSTS (`max-age=63072000; includeSubDomains; preload`) — herdado da Vercel, correto.
- `generateStaticParams` garante pré-renderização estática de todas as páginas de projeto e nota.

**Problemas:**

| Severidade | Achado | Evidência | Recomendação |
|---|---|---|---|
| Critical | `sitemap.xml`/`robots.txt` apontam para `lhsoliveira.dev`, domínio não utilizado | `curl .../sitemap.xml` → `<loc>https://lhsoliveira.dev</loc>` | Atualizar `site.url` em `src/lib/site.ts` para o domínio real de produção; migrar para `devleandrooliveira.com.br` quando comprado |
| Critical | Nenhuma página tem `<link rel="canonical">` | Confirmado por grep no HTML de home e projeto — ausente | Adicionar `alternates: { canonical: ... }` em `layout.tsx` e em cada `generateMetadata` |
| Medium | Faltam headers de segurança (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) | `curl -I` não retorna nenhum desses headers | Adicionar via `next.config.ts` (`headers()`) — não bloqueia indexação, mas é sinal de maturidade técnica |
| Low | Sem `site.webmanifest`/`manifest.json`, apenas um ícone 32×32 | `404` em ambos; um único `<link rel="icon">` | Opcional para portfólio (não é PWA); considerar `apple-touch-icon` 180×180 para previews no iOS |

## Content Quality

*(Auditoria completa por agente especializado — ver `findings/content.md` para o relatório integral com todas as 12 constatações.)*

**Resumo:** a voz autoral é consistente, direta, sem sinais de geração por IA de baixa qualidade — mas a **profundidade** está muito abaixo do necessário:

- As 7 páginas de projeto (`content/projetos/*.mdx`) têm corpo de 48-56 palavras cada, com estrutura idêntica (`## [Produto|Operação atendida|Demonstração]` seguido sempre por `## O que ele demonstra`). Isso é "template sameness" — o padrão que as Quality Rater Guidelines do Google tratam como sinal de conteúdo escalado, pouco diferenciado.
- As 3 notas (`content/notas/*.mdx`) têm 172-233 palavras, mas o frontmatter declara `leitura: '3 min'` / `'4 min'` — a ~200 palavras/min em português, isso é 50-70 segundos reais de leitura, não 3-4 minutos. É uma inconsistência pequena, mas perceptível.
- Só um projeto (Roadmap) cita uma métrica numérica concreta ("operação de aproximadamente 80 pessoas"). Os outros 6 são inteiramente qualitativos.
- Nenhuma nota tem bio de autor — quem chega a um post isolado via busca não tem como avaliar a expertise de quem escreveu sem navegar de volta à home.
- Alt text das capturas é genérico e templado (`"${projeto.titulo}, tela ${indice+1} de ${total}"`) em vez de descrever o que cada tela mostra — desperdiça a prova visual real que já existe.

## On-Page SEO

**O que funciona:**
- Título e meta description únicos por página, confirmado nas 4 páginas de projeto testadas e nas 3 notas.
- Um único `<h1>` por página, hierarquia H2/H3 correta, sem pulos de nível.
- Notas já sobrescrevem `openGraph` corretamente (`type: 'article'`, título e descrição específicos).

**Problemas:**

| Severidade | Achado | Evidência | Recomendação |
|---|---|---|---|
| Critical | `generateMetadata` de `projetos/[slug]/page.tsx` não sobrescreve `openGraph`/`twitter` | `og:title` da página do Alinnea é o título genérico do site inteiro, não "Alinnea" | Replicar o padrão já usado em `notas/[slug]/page.tsx`: `openGraph: { type: 'article', title: projeto.titulo, description: projeto.resumo, images: [projeto.imagens[0]?.src] }` |
| Medium | Meta descriptions muito curtas (56-100 caracteres) | Ex.: "CRM para psicólogos com agenda, prontuário e automações." — 56 caracteres, bem abaixo dos ~155-160 recomendados | Expandir para usar o espaço de SERP disponível, incluindo um diferencial concreto do projeto |
| Low | `stack` vazio no frontmatter do projeto Alinnea (confirmado pelo agente GEO) | Lista de tecnologias não renderiza para esse projeto | Conferir se todos os 7 projetos têm `stack` preenchido |

## Schema & Dados Estruturados

Zero implementação — confirmado por grep em `src/` e no HTML de produção (`application/ld+json` não aparece nenhuma vez). Recomendações concretas, priorizadas:

1. **`Person`/`ProfilePage`** no `layout.tsx` raiz: nome, `jobTitle`, `url`, `sameAs` (LinkedIn, GitHub, Instagram), `knowsAbout` (a partir de `src/lib/site.ts:stack`).
2. **`Article`/`BlogPosting`** em cada nota: `datePublished` (já existe em `data` no frontmatter, formato ISO), `author` referenciando a mesma entidade `Person`, `headline`, `description`.
3. **`CreativeWork`** em cada projeto: `name`, `description`, `url` (quando existir), `dateCreated` se disponível.
4. **`BreadcrumbList`** nas rotas dinâmicas (`/projetos/[slug]`, `/notas/[slug]`) — reforça hierarquia para rich results.
5. Considerar **`FAQPage`** se uma seção de perguntas frequentes for adicionada (ver recomendação de GEO sobre passagens citáveis).

Fonte de dados já pronta para isso: `src/lib/content.ts` (`getProjetos()`/`getNotas()`) e `src/lib/carreira.ts` (timeline factual), sem necessidade de duplicar conteúdo à mão.

## Performance (Core Web Vitals)

Medido via Lighthouse (mobile, navigation) e trace de performance real no site em produção.

| Métrica | Valor | Classificação |
|---|---|---|
| LCP | 287ms | Excelente |
| CLS | 0,42 (trace) / 0,23 (Lighthouse) | **Ruim** (teto "bom" = 0,10; "precisa melhorar" até 0,25) |
| Accessibility (Lighthouse) | 96/100 | Muito bom |
| Best Practices (Lighthouse) | 100/100 | Perfeito |
| SEO técnico (Lighthouse) | 100/100 | Perfeito |
| Agentic Browsing (Lighthouse) | 62/100 | Fraco — puxado pelo CLS |

**Causa raiz do CLS, com alta confiança:** o trace de performance mostra o maior salto de layout (score 0,4250, isoladamente) começando aos 296ms — 9ms depois do LCP finalizar aos 287ms. Isso bate exatamente com o padrão de `src/components/Corredor.tsx`: um `useEffect` (que roda **depois** do primeiro paint) detecta suporte a WebGL2 e, se disponível, troca `modo` de `'documento'` para `'corredor'`, substituindo toda a árvore DOM — de um layout empilhado curto para um contêiner `sticky` de `(FASE_PORTA + total) * 100svh` (múltiplas telas de altura). Essa troca acontece depois que o navegador já pintou o layout `documento`.

**Recomendação concreta:** trocar o `useEffect` de detecção de WebGL (linhas ~51-56 de `Corredor.tsx`) por `useLayoutEffect`. Isso não elimina o custo de detecção, mas faz a decisão de modo acontecer antes do navegador pintar a primeira vez, evitando o salto visível — é o padrão React correto para decisões de layout dependentes de medição síncrona (`canvas.getContext('webgl2')` é uma chamada síncrona, não precisa de `useEffect`).

**Achado de acessibilidade relacionado, não hipotético:** o Lighthouse reprova contraste de cor nos itens da seção Stack (`<h3 class="title-tight ...">`/`<p class="... text-mid">`). Causa: `.pilha-item { opacity: calc(0.12 + var(--montagem) * 0.88) }` — antes do elemento entrar na janela de rolagem que dispara a animação, o texto fica a 12% de opacidade, que é contraste insuficiente para qualquer ferramenta de auditoria (ou pessoa) que capture o DOM nesse estado. Isso é uma tensão real entre a coreografia de entrada e acessibilidade estática — vale considerar um piso de opacidade mais alto (ex.: 0,35-0,4) para o estado de repouso.

## AI Search Readiness (GEO)

*(Auditoria completa por agente especializado — ver `findings/geo.md` para o relatório integral, incluindo notas por plataforma: Google AI Overviews ~55, ChatGPT/OAI-SearchBot ~45, Perplexity ~50, Bing Copilot ~40.)*

**Pontos fortes:** conteúdo 100% SSR (nada depende de JS para ser lido por um crawler), fatos de projeto isolados em `<dl>/<dt>/<dd>` (padrão que extratores de IA preferem), robots.txt não bloqueia nenhum crawler de IA.

**Pontos fracos:** zero JSON-LD (mesmo problema da seção de Schema, com peso duplo aqui), ausência de `llms.txt` (recomendado para este porte de site — 7 projetos + 3 notas cabem em ~40 linhas, gerável a partir de `getProjetos()`/`getNotas()` sem duplicar conteúdo), parágrafos de prosa muito curtos (30-55 palavras, abaixo da janela ótima de 134-167 palavras para citação direta), headings sempre declarativos nunca formulados como pergunta.

## Imagens

- Todas as imagens têm `alt` (confirmado: zero `<img>` sem atributo `alt` na home ou nas galerias de projeto).
- `width`/`height` presentes em todas as imagens da galeria (lidos do arquivo em build) — previne CLS por carregamento de imagem.
- `radar-fiscal.png` tem 712KB, ~5-14× o tamanho das outras capturas (52-207KB) — vale reexportar/comprimir.
- Alt text é descritivo o suficiente para acessibilidade, mas genérico para SEO/GEO (ver achado #8 em Content Quality) — "Roadmap, tela 2 de 3" não diz o que a tela mostra.

## Search Experience (SXO) — análise direta

*O agente especializado em SXO falhou por limite de sessão da ferramenta antes de entregar resultado. Esta seção foi escrita diretamente, sem o agente, a partir do PRODUCT.md e da inspeção das páginas já feita nesta auditoria — está sinalizada aqui para transparência.*

Personas-alvo declaradas no PRODUCT.md: (1) donos/responsáveis por operação buscando substituir processo frágil, (2) fundadores/product owners precisando de software sob medida, (3) agências/times técnicos buscando execução full stack, (4) recrutadores avaliando repertório.

- **Home:** atende bem as quatro personas — tese no H1 (screenshot mobile confirma: CTA e proposta de valor visíveis sem rolar), stack técnica serve à persona 3, trajetória serve à persona 4, projetos servem a 1/2, contato converte para todas. Sem mismatch de page-type aqui.
- **Notas:** se alguém chega via busca por uma dor específica (ex. "como definir escopo de projeto"), o page-type de reflexão pessoal com CTA de WhatsApp no fim é adequado — mas o conteúdo curto (achado #5 de Content Quality) entrega intent superficialmente, arriscando bounce antes do CTA.
- **Projetos:** se alguém busca pelo nome de um projeto específico ("Alinnea CRM psicólogos"), o formato de estudo de caso é o page-type certo — mas as 48-56 palavras de corpo (achado #4 de Content Quality) não sustentam a pergunta implícita "isso é real, e ele sabe o que faz?" com a profundidade que esse tipo de busca de alta intenção merece.

Nenhum mismatch de page-type identificado — o problema aqui é profundidade de conteúdo, já capturado na seção de Content Quality, não arquitetura de página.

---

## Nota sobre o domínio

Hoje existem **três** domínios diferentes em jogo no código e na conversa: `lhsoliveira.dev` (hardcoded em `site.ts`, nunca comprado), o preview da Vercel (`lhs-oliveira-portfolio.vercel.app`, o que está realmente no ar), e `devleandrooliveira.com.br` (planejado, ainda não comprado). Essa auditoria foi feita contra o segundo. Antes de investir em qualquer correção de SEO além dos itens Critical, vale decidir o domínio definitivo — trocar de domínio depois de indexado tem custo real (redirects 301, tempo de reindexação, possível perda temporária de qualquer sinal acumulado). Se `devleandrooliveira.com.br` é a decisão, o ideal é: comprar, configurar redirect permanente do Vercel preview (ou usar o domínio custom na Vercel desde já), e só então atualizar `site.url` uma única vez.
