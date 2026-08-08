# Auditoria SEO — devleandrooliveira.com.br

**Data:** 2026-08-08
**Site auditado:** https://devleandrooliveira.com.br (domínio próprio, já no ar e respondendo 200)
**Auditoria anterior:** 2026-08-05, nota 47/100 — arquivada em `historico/2026-08-05/`
**Tipo de negócio detectado:** portfólio pessoal / desenvolvedor autônomo (híbrido *agency* + *publisher*), conversão por WhatsApp
**Escopo:** 12 URLs do sitemap, todas rastreadas e analisadas (100% de cobertura)

**Método:** rastreio HTTP direto das 12 URLs com extração de título, meta, canonical, OG, headings, imagens, links internos e JSON-LD; inspeção de headers; verificação de robots.txt, sitemap.xml e llms.txt; medição em navegador real (CLS, timings, recursos, alvos de toque); leitura cruzada do código-fonte local (Next.js 15 App Router).

**Limitações declaradas — leia antes de usar os números:**
- O runtime Python do plugin não está provisionado nesta máquina (`claude-seo doctor` → `ready: false`). Nenhuma das ferramentas empacotadas (Lighthouse via Playwright, gerador de PDF, validador de schema) foi executada. Rode `/seo setup` se quiser o relatório em PDF.
- **Sem dados de campo (CrUX):** a cota diária da API PageSpeed Insights sem chave estava esgotada, e o domínio é novo demais para ter amostra CrUX. Os números de performance abaixo são de laboratório/observação direta, não de usuários reais.
- **Sem capturas de tela:** o painel do navegador não estava sendo exibido, então a composição de frames não ocorreu e a captura falhou. A análise visual foi feita via DOM (geometria de elementos, conteúdo acima da dobra, alvos de toque) em vez de imagem.
- Sem dados de Search Console, GA4 ou backlinks — nenhuma credencial configurada, e o domínio não tem histórico.

---

## SEO Health Score: 71/100

| Categoria | Peso | Nota | Ponderada | vs. 05/08 |
|---|---|---|---|---|
| Technical SEO | 22% | 82/100 | 18,0 | +27 |
| Content Quality | 23% | 68/100 | 15,6 | +23 |
| On-Page SEO | 20% | 58/100 | 11,6 | +8 |
| Schema / Dados estruturados | 10% | 75/100 | 7,5 | +65 |
| Performance (CWV) | 10% | 74/100 | 7,4 | +19 |
| AI Search Readiness | 10% | 78/100 | 7,8 | +28 |
| Imagens | 5% | 66/100 | 3,3 | +1 |
| **Total** | | | **71,3** | **+24** |

O salto de 47 para 71 é real e vem quase todo da Fase 1 e 2 do handoff: os três bugs de produção sumiram e os dados estruturados saíram do zero. O que sobra não são bugs — é **posicionamento**. O site está tecnicamente correto e semanticamente invisível: o nome próprio do dono não aparece em nenhum `<title>`, e nenhum título de projeto contém a palavra que alguém digitaria para achá-lo.

---

## O que já está resolvido

Verificado em produção, não presumido:

| Item | Evidência |
|---|---|
| Canonical em todas as páginas | 12/12 URLs com `<link rel="canonical">` apontando para si mesmas |
| Domínio correto em sitemap e robots | `sitemap.xml` e `robots.txt` declaram `devleandrooliveira.com.br` |
| OG por página | Todas as 12 URLs com `og:title`/`og:description` próprios (antes: título genérico do site) |
| `og:image` sem `localhost` | Home: `/opengraph-image` → 200 `image/png` 41 KB; projetos: PNG próprio de cada um |
| JSON-LD presente | `Person` em 12/12; `CreativeWork` + `BreadcrumbList` nos 7 projetos; `BlogPosting` + `BreadcrumbList` nas 3 notas |
| CLS corrigido | `Corredor.tsx:35` usa `useLayoutEffect` no cliente; CLS medido = **0,000** em 3 carregamentos |
| Contraste da Stack | `globals.css:264` — piso de opacidade elevado de 0,12 para 0,4 |
| Links sociais renderizados | GitHub, LinkedIn e Instagram presentes no DOM, todos com `rel="noopener noreferrer"` |
| Páginas de projeto aprofundadas | 237–348 palavras cada (antes: 48–56) |
| Alt text descritivo nas capturas | Ex.: *"Página inicial do Alinnea, com a chamada 'Sua agenda no piloto automático'…"* |
| Tempo de leitura falso | Removido do frontmatter — não há mais número inventado |
| `llms.txt` | 200, 4.186 bytes, com projetos, stack, contato e links — bem acima do mínimo |
| Conteúdo rastreável apesar do WebGL | 748 palavras no HTML bruto da home; o corredor 3D não esconde texto de crawler |
| Infra | `X-Nextjs-Prerender: 1`, `X-Vercel-Cache: HIT`, TTFB 14–94 ms, HSTS `max-age=63072000` |

---

## Achados

### ALTO

#### A1. "Leandro Oliveira" não aparece em nenhum `<title>` do site

Todos os 12 títulos usam o sufixo `— lhs.oliveira`. O `JSON-LD` declara `"name": "Leandro Oliveira"`, o `llms.txt` abre com "# Leandro Oliveira", o domínio é `devleandrooliveira.com.br` — mas o nome completo não está em nenhum título nem em nenhum `<h1>`.

**Primeiro princípio:** para um portfólio pessoal, a consulta de maior intenção é o próprio nome. Quem viu o LinkedIn, recebeu o WhatsApp ou ouviu falar do trabalho vai digitar "leandro oliveira desenvolvedor" — não "lhs.oliveira", que é um handle de Instagram sem volume de busca.

**Causa:** `src/lib/site.ts:4` — `nome: 'lhs.oliveira'` alimenta o `title.template`. O campo `nomeCompleto: 'Leandro Oliveira'` existe na linha 5 e não é usado em nenhum título.

**Correção:** usar `nomeCompleto` no template de título e manter `lhs.oliveira` como `alternateName` (já está no JSON-LD). O título da home deveria conter o nome, o papel e o diferencial — hoje contém só o handle e o papel.

**Como saber se falhou:** buscar `site:devleandrooliveira.com.br leandro oliveira` no Google 2 semanas após a indexação. Se nenhum título retornado contiver o nome, a correção não subiu.

---

#### A2. Títulos de projeto sem nenhuma palavra-chave descritiva

| URL | Título atual | Chars |
|---|---|---|
| `/projetos/alinnea` | `Alinnea — lhs.oliveira` | 22 |
| `/projetos/ebano` | `Ébano — lhs.oliveira` | 20 |
| `/projetos/dochub` | `DocHub — lhs.oliveira` | 21 |
| `/projetos/petgest` | `PetGest — lhs.oliveira` | 22 |
| `/projetos/roadmap` | `Roadmap — lhs.oliveira` | 22 |
| `/projetos/radar-fiscal` | `Radar Fiscal — lhs.oliveira` | 27 |
| `/projetos/gabriela-lorenson` | `Gabriela Lorenson — lhs.oliveira` | 32 |

Sete títulos usando 20–32 dos ~60 caracteres disponíveis, e nenhum diz o que o projeto é. A `meta description` de `/projetos/alinnea` já diz "CRM para psicólogos com agenda, prontuário e automações" — a informação existe, só não está onde o Google pesa mais.

**Primeiro princípio:** "Alinnea" é um nome inventado com zero volume de busca. "CRM para psicólogos" é uma categoria que alguém procura. O título é o campo com maior peso de relevância on-page e está sendo gasto com um substantivo próprio desconhecido.

**Correção:** `{nome} — {descricaoCurta} | Leandro Oliveira`, ex.: `Alinnea — CRM para psicólogos | Leandro Oliveira` (48 chars). Os dados já existem em `src/lib/content.ts`.

**Como saber se falhou:** se após 30 dias o Search Console não registrar nenhuma impressão para consultas de categoria ("crm para psicólogos", "sistema para petshop"), o título não está capturando a demanda — o problema é de conteúdo, não de título.

---

#### A3. Nenhuma nota tem `og:image` — a prévia de link sai em branco

`/notas` e as três notas não têm `og:image` nem `twitter:image`. A rota `/notas/[slug]/opengraph-image` retorna **404** (verificado).

**Primeiro princípio:** as notas são o conteúdo feito para circular. A conversão declarada do site é WhatsApp, e o WhatsApp renderiza card com imagem. Um link de nota compartilhado hoje aparece como bloco de texto cinza — exatamente onde a apresentação mais importa.

**Dependência:** resolve junto com o M2 (`BlogPosting` sem `image`) — mesma causa raiz, mesma correção.

**Correção:** adicionar `opengraph-image.tsx` na rota `notas/[slug]` (e em `notas/`), no mesmo padrão do `/opengraph-image` da raiz, que já funciona.

**Como saber se falhou:** colar a URL da nota no [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — se o card não trouxer imagem, não subiu.

---

#### A4. Linkagem interna quase inexistente e `/projetos` não existe

| Página | Links internos que emite |
|---|---|
| `/` | 10 (todos os projetos + todas as notas) — correto |
| `/projetos/*` (7 páginas) | **1** — só `/` |
| `/notas/*` (3 páginas) | 2 — `/` e `/notas` |
| `/notas` | 4 — as três notas + `/` |

As 7 páginas de projeto são folhas: recebem link só da home e não passam autoridade para lugar nenhum. Não há link projeto↔projeto, nem projeto→nota relacionada, nem nota→projeto que a ilustra. **`/projetos` retorna 404** — não existe hub para o cluster de conteúdo mais forte do site.

**Primeiro princípio:** PageRank interno flui por links. Um grafo estrela de um salto concentra tudo na home e deixa as páginas de projeto — que são as que têm palavra-chave comercial — sem reforço mútuo.

**Desbloqueia:** um hub `/projetos` dá destino natural ao breadcrumb, cria uma página de categoria indexável e resolve metade do problema de linkagem de uma vez.

**Correção:** (a) criar `/projetos` listando os sete, adicionar ao sitemap e ao breadcrumb; (b) em cada página de projeto, adicionar bloco "outros projetos" com 2–3 irmãos; (c) linkar da nota para o projeto que a exemplifica e vice-versa.

**Como saber se falhou:** recontar links internos por página após o deploy. Se as páginas de projeto continuarem emitindo 1 link, não subiu.

---

### MÉDIO

#### M1. `CreativeWork.url` aponta para o produto externo, não para a página

Em `/projetos/alinnea`, o JSON-LD declara `"url": "https://alinnea.com.br/"`. O mesmo padrão nos outros seis. Também há `"keywords": []` — array vazio, que deveria ser omitido.

Pelo vocabulário Schema.org, `url` é a URL canônica **da entidade descrita naquela página**. Apontá-la para fora diz ao Google que a página não é sobre si mesma. Falta ainda `@id`/`mainEntityOfPage` — as notas fazem isso certo, os projetos não.

**Correção:** `url` → a URL da página; o site ao vivo vai em `sameAs` (ou `workExample`); remover `keywords` vazio; adicionar `mainEntityOfPage`.

**Como saber se falhou:** [Rich Results Test](https://search.google.com/test/rich-results) na URL do projeto — o `url` reportado deve ser o de `devleandrooliveira.com.br`.

#### M2. `BlogPosting` sem `image`

As três notas têm `BlogPosting` bem formado (`headline`, `datePublished`, `dateModified`, `inLanguage`, `mainEntityOfPage`, `author`, `publisher`) mas sem `image`. A diretriz de Article do Google pede imagem. Mesma causa e mesma correção do A3.

#### M3. `www` não redireciona para o apex

`https://www.devleandrooliveira.com.br/` responde **200** com o mesmo conteúdo, não 301. O canonical aponta corretamente para o apex, então não há risco de indexação duplicada — mas é rastreio desperdiçado e sinal dividido.

**Correção:** configurar o redirect 301 www → apex no painel Vercel (Domains → Redirect to).

#### M4. Headers de segurança ausentes

| Header | Estado |
|---|---|
| `Strict-Transport-Security` | ✅ `max-age=63072000` |
| `Content-Security-Policy` | ❌ ausente |
| `X-Content-Type-Options` | ❌ ausente |
| `Referrer-Policy` | ❌ ausente |
| `Permissions-Policy` | ❌ ausente |
| `X-Frame-Options` | ❌ ausente |

Efeito direto em ranking: nenhum. Efeito em auditoria de terceiros e em confiança: real. `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin` são duas linhas em `next.config.ts` sem risco de quebrar nada.

#### M5. Capturas em PNG não otimizado, servidas por `<img>` cru

| Arquivo | Peso |
|---|---|
| `radar-fiscal.png` | **729 KB** |
| `roadmap.png` | 212 KB |
| `dochub.png` | 192 KB |
| `gabriela-lorenson.png` | 91 KB |
| `ebano.png` | 81 KB |
| `petgest.png` | 73 KB |
| `alinnea.png` | 65 KB |

`next.config.ts` declara `images: { formats: ['image/avif', 'image/webp'] }`, mas **nada passa por `next/image`** — verificado: zero ocorrências de `srcset` e de `_next/image` no HTML. A configuração está inerte. As duas renderizações usam `<img>` cru (`src/components/Corredor.tsx:409` e `src/app/projetos/[slug]/page.tsx:105`).

Na home isso não custa nada hoje: no modo WebGL o corredor não carrega nenhuma imagem (medido — 0 requisições de imagem, 13 requisições no total). O custo é real nas **páginas de projeto**, onde a primeira captura carrega com `loading="eager"` — e em `/projetos/radar-fiscal` isso significa 729 KB de PNG no caminho crítico.

**Correção:** trocar por `next/image` em `src/app/projetos/[slug]/page.tsx` (as dimensões já estão no conteúdo, então não há risco de CLS). AVIF/WebP passam a valer automaticamente.

#### M6. Alvos de toque abaixo da diretriz móvel

22 links com altura inferior a 40 px: navegação a 15 px, CTAs "CONHECER PROJETO" e "ABRIR SITE ↗" a 11 px. A recomendação do Google é ~48 px de área tocável.

**Correção:** aumentar o padding vertical dos links (a área clicável, não o tamanho da fonte — a tipografia é escolha de design e não precisa mudar).

#### M7. `og:locale` só na home

A home declara `og:locale: pt_BR`; as outras 11 páginas não declaram nada. Baixo impacto, correção de uma linha no metadata compartilhado.

---

### BAIXO / INFO

- **B1 — Notas curtas.** As três notas têm ~200–260 palavras de corpo. Funcionam como opinião, mas são finas para atrair busca orgânica. Três posts também é pouco para estabelecer autoria temática.
- **B2 — Alt text genérico na home.** O fallback da home usa `Interface do projeto {título}` nos sete; as páginas de projeto já têm alt descritivo de verdade. Vale reaproveitar o texto bom.
- **B3 — `/notas` fina.** 105 palavras. Um parágrafo de contexto sobre o que são as notas e para quem ajudaria tanto a leitura quanto o ranking da página de índice.
- **B4 — `lhs-oliveira-portfolio.vercel.app` continua respondendo 200.** Faz cross-canonical correto para o domínio próprio, então não há duplicação indexável. Um 301 seria mais limpo.
- **B5 — JS pesado.** 864 KB descompactados (≈364 KB transferidos) em 13 requisições, dominados por um chunk de 315 KB (Three.js). Como o corredor é a peça autoral e o fallback textual já pinta antes, isso é uma escolha de produto defensável — mas é o maior item de peso da home e vale medir quando houver dado de campo.
- **B6 — Sem dado de campo.** Nenhuma métrica CrUX disponível. Reavaliar performance quando o domínio acumular tráfego.

---

## Metodologia de síntese

O relatório passou pelas quatro fases do framework do plugin: **PERCEIVE** (rastreio das 12 URLs, headers, robots/sitemap/llms, medição em navegador, leitura do código), **ANALYZE** (correlação entre HTML publicado e fonte — foi assim que `site.nome` apareceu como causa única de A1, e `next/image` ausente como causa de M5 apesar do `next.config` correto), **VALIDATE** (cada achado tem evidência reproduzível e um teste de falsificação explícito; achados que a medição derrubou foram descartados — ver nota abaixo), **ACT** (plano com sequência de dependências).

**Achado descartado na validação:** a hipótese inicial de "1,44 MB de PNG na home" não se sustentou. A medição em navegador mostrou zero requisições de imagem: no modo WebGL o corredor substitui a árvore com as `<img>`, que só existem no fallback. O peso foi realocado para M5, onde é real (páginas de projeto).

---

## Próximo passo recomendado

O site está pronto para ser submetido ao Google Search Console e ao Bing Webmaster Tools — o bloqueio do handoff (domínio não resolvia) não existe mais. Fazer isso **depois** de A1 e A2, para que a primeira indexação já pegue os títulos corretos.

Ver `ACTION-PLAN.md` para a sequência.
