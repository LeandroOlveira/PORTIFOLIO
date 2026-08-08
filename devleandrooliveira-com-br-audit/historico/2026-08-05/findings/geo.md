# AI Search Readiness (GEO) — relatório integral (agente claude-seo:seo-geo)

Auditoria feita via fetch direto (robots.txt, sitemap.xml, llms.txt, HTML bruto de home/projeto/nota) e inspeção do código-fonte (`src/app`, `src/lib`, `content/`) para confirmar causa-raiz de cada achado. O conteúdo essencial é confirmado 100% SSR — todo o texto citado abaixo veio do HTML bruto (`curl`), sem execução de JS.

## GEO Health Score: 56/100

| Dimensão | Peso | Nota | Observação |
|---|---|---|---|
| Citability | 25% | 62/100 | Fatos de projeto bem isolados (dl/dt/dd), mas parágrafos curtos e headings não formulados como pergunta |
| Structural Readability | 20% | 68/100 | H1 único, hierarquia H2/H3 correta, `<time dateTime>` nas notas; falta `rel=canonical` em todo o site |
| Multi-Modal Content | 15% | 40/100 | Screenshots com alt text bom, mas zero vídeo (sinal de maior correlação, ~0.737), zero diagramas |
| Authority & Brand Signals | 20% | 35/100 | Zero JSON-LD, GitHub cadastrado no código mas nunca renderizado, OG de projeto cai no genérico |
| Technical Accessibility | 20% | 70/100 | robots.txt liberal, sitemap.xml correto, SSR completo — mas og:image quebrada em produção e sem llms.txt |

## Status de acesso a crawlers de IA (robots.txt)

```
User-Agent: *
Allow: /
Sitemap: https://lhsoliveira.dev/sitemap.xml
```

Todos os crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai) estão **permitidos por padrão** — o wildcard `Allow: /` cobre todo mundo, então tecnicamente não há bloqueio hoje. Isso é suficiente para funcionar, mas é frágil: não há registro explícito de intenção. Recomendo declarar os user-agents de busca por nome (é grátis e remove ambiguidade caso algum crawler mude seu comportamento padrão no futuro).

Achado adicional: **`robots.ts` e `sitemap.ts` apontam para `https://lhsoliveira.dev`** (definido em `src/lib/site.ts:9`), um terceiro domínio que não é nem o preview da Vercel nem o `devleandrooliveira.com.br` mencionado no briefing. Antes de indexação ampla, é preciso decidir qual domínio é o canônico definitivo — hoje há uma divergência de sinal entre três domínios possíveis.

## llms.txt: ausente (404 confirmado)

Vale a pena para este porte de site — é praticamente o inverso de "caro": 7 projetos + 3 notas cabem confortavelmente em um único arquivo de ~40 linhas, e os dados já existem estruturados em `src/lib/content.ts` (gerável a partir do mesmo `getProjetos()`/`getNotas()` que já alimenta o site, sem duplicar conteúdo à mão). Prioridade Alta, esforço baixo.

## Citabilidade e estrutura de dados factuais

Ponto forte real: a página de projeto usa `<dl>/<dt>/<dd>` para Tipo / Problema / Resultado — isso é exatamente o padrão que um extrator de IA gosta, dado factual isolado sem prosa decorativa ao redor:

```html
<dt>Resultado</dt><dd>Um produto único organiza atendimento, documentação e comunicação.</dd>
```

A lista de tecnologias (`<ul aria-label="Tecnologias do projeto">`) também é isolada corretamente do texto — mas na página testada (Alinnea) o array `stack` no MDX estava vazio, então essa lista não renderizou. Vale conferir se todos os 7 projetos têm `stack` preenchido no frontmatter.

Ponto fraco: os parágrafos de prosa (no corpo MDX de projetos e notas) ficam na faixa de ~30-55 palavras — abaixo da janela ótima de 134-167 palavras recomendada para citação direta por IA. Isso não é necessariamente ruim (frases curtas facilitam extração pontual), mas significa que nenhum parágrafo isolado carrega contexto suficiente para ser uma "resposta completa" por si só. Os H2 também são todos declarativos ("Por que ela existe", "O que fazer com ela"), nunca formulados como pergunta explícita que bate com uma query de usuário.

## Sinais de marca e autoria

**Não há nenhum JSON-LD no site** (confirmado por grep no HTML de home, projeto e nota — zero ocorrências de `application/ld+json`). Isso importa muito para GEO: motores de resposta (Google AI Overviews, Bing Copilot, e cada vez mais ChatGPT/Perplexity via seus índices) usam `Person`/`Organization`/`Article` como a forma mais barata de confirmar quem é a entidade, quando o conteúdo foi publicado e quem assina. Sem isso, o site depende inteiramente de o modelo inferir a entidade a partir de prosa solta.

Achado concreto adicional: `src/lib/site.ts` já tem `github: 'https://github.com/LeandroOlveira'` cadastrado, mas **nenhum componente renderiza esse link** — `Rodape.tsx` só expõe E-mail, LinkedIn e Instagram. Para um portfólio de desenvolvedor, GitHub é provavelmente o sinal de credibilidade técnica mais direto disponível e está sendo descartado de graça.

Outro achado: `generateMetadata` em `src/app/projetos/[slug]/page.tsx` só define `title` e `description` — não sobrescreve `openGraph`/`twitter`, então **todo card social de todo projeto usa o título/descrição genérico do site inteiro**, não o do projeto específico (confirmado: og:title da página do Alinnea é "lhs.oliveira — Desenvolvedor full stack..." em vez de "Alinnea"). Nas notas isso já está correto — o padrão existe no código, só não foi replicado para projetos.

E um bug ativo, não hipotético: **`og:image` e `twitter:image` apontam para `http://localhost:3000/opengraph-image...`** em produção. Causa raiz em `src/app/layout.tsx:22`: `NEXT_PUBLIC_SITE_URL` não está definido neste ambiente, então cai no fallback `localhost:3000`.

## Acessibilidade técnica para crawlers

Positivo: 100% SSR confirmado. `sitemap.xml` existe, é válido, lista as 11 URLs com `lastmod` correto por post. `generateStaticParams` garante pré-renderização estática dos projetos.

Negativo: nenhuma página tem `<link rel="canonical">`. Combinado com o domínio ambíguo (vercel.app vs lhsoliveira.dev vs devleandrooliveira.com.br), isso é um risco real de sinal fragmentado assim que mais de um domínio ficar acessível publicamente.

## Top 5 recomendações priorizadas

1. **[CRITICAL] Adicionar JSON-LD estruturado** — `Person`/`ProfilePage` no layout raiz (nome, jobTitle, sameAs: LinkedIn/GitHub/Instagram), `Article` em cada nota (author, datePublished a partir do frontmatter `data`), `CreativeWork` ou `SoftwareApplication` em cada projeto (name, description, url). Esforço: meio dia. Maior alavanca isolada — ataca diretamente a dimensão mais fraca (Authority, 35/100, peso 20%).

2. **[CRITICAL] Corrigir metadata social/OG quebrada** — definir `NEXT_PUBLIC_SITE_URL` corretamente em todo ambiente Vercel (produção e preview), e sobrescrever `openGraph`/`twitter` em `generateMetadata` de `projetos/[slug]/page.tsx` com título/descrição/imagem específicos do projeto. Esforço: 1-2h. Bug ativo, afeta toda página hoje.

3. **[HIGH] Criar `/llms.txt`** via `src/app/llms.txt/route.ts`, reaproveitando `getProjetos()`/`getNotas()` de `src/lib/content.ts`. Esforço: 2-3h, zero conteúdo duplicado a mão.

4. **[HIGH] Consolidar domínio canônico** — decidir entre `lhsoliveira.dev` (já hardcoded) e `devleandrooliveira.com.br` (planejado), atualizar `site.url`, e adicionar `alternates.canonical`. Esforço: baixo tecnicamente, depende da decisão de domínio.

5. **[MEDIUM] Reforçar passagens citáveis** — combinar/expandir parágrafos para a faixa de ~134-167 palavras por bloco de resposta, e considerar 1 seção de FAQ curta com `FAQPage` schema.

**Extras de baixo esforço/alto valor**: renderizar o link do GitHub já existente em `site.ts` no Rodapé/Contato (10 min); declarar explicitamente GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended em `robots.ts` (10 min, redundante funcionalmente mas remove ambiguidade).

## Scores por plataforma (estimativa qualitativa)

| Plataforma | Nota estimada | Por quê |
|---|---|---|
| Google AI Overviews | ~55/100 | SSR e sitemap ajudam; ausência de schema.org e canonical pesa contra |
| ChatGPT / OAI-SearchBot | ~45/100 | Texto limpo e extraível ajuda; falta de llms.txt e de presença de marca fora do próprio site limita confiança da entidade |
| Perplexity | ~50/100 | Boa para respostas pontuais (fatos isolados em dl/dt/dd); passagens curtas limitam citação de blocos completos |
| Bing Copilot | ~40/100 | É o que mais pesa sinais tradicionais (schema, canonical) — hoje é onde a ausência desses dói mais |

## Arquivos relevantes

- `src/app/layout.tsx` — metadata raiz, fallback `localhost:3000`, sem JSON-LD
- `src/app/projetos/[slug]/page.tsx` — `generateMetadata` sem override de OG/Twitter
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/lib/site.ts` — domínio canônico (`url`), `github` não renderizado
- `src/lib/content.ts` — fonte de dados estruturados (projetos/notas) reutilizável para llms.txt
- `src/lib/carreira.ts` — timeline factual, boa base para `Person`/experiência em JSON-LD
- `src/components/Rodape.tsx` — falta link GitHub
