# Content Quality — relatório integral (agente claude-seo:seo-content)

Análise feita sobre o código-fonte de produção (`content/*.mdx`, componentes React, `layout.tsx`) e confirmada contra o site ao vivo (`https://lhs-oliveira-portfolio.vercel.app`). Fontes citadas por caminho de arquivo.

---

## CRITICAL

### 1. `og:image` aponta para `localhost:3000` em produção — todas as páginas
**Evidência:** HTML ao vivo da home:
```html
<meta property="og:image" content="http://localhost:3000/opengraph-image?2972eb17b80f3a41"/>
```
Isso vem de `src/app/layout.tsx` (`metadataBase: new URL(siteUrl)` com `siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'`) — a variável de ambiente não está configurada na Vercel de produção, então o fallback local vaza para o HTML público.
**Impacto:** todo compartilhamento em WhatsApp, LinkedIn, Twitter/X e qualquer preview gerado por crawler de IA (que usa OG tags para montar snippets) mostra imagem quebrada. É o principal canal de contato do site (WhatsApp) sendo prejudicado justamente no compartilhamento.
**Recomendação:** definir `NEXT_PUBLIC_SITE_URL` no ambiente de produção da Vercel com a URL real do deploy (e depois com `devleandrooliveira.com.br` quando o domínio for comprado). Validar com `curl` pós-deploy que `og:image` não contém `localhost`.

### 2. `sitemap.xml` e `robots.txt` referenciam um domínio (`lhsoliveira.dev`) diferente do domínio real em produção
**Evidência:**
```
Sitemap: https://lhsoliveira.dev/sitemap.xml
<loc>https://lhsoliveira.dev</loc>
```
enquanto o site está servido em `lhs-oliveira-portfolio.vercel.app`. Origem: `site.url: 'https://lhsoliveira.dev'` em `src/lib/site.ts`, usado por `src/app/sitemap.ts` e `src/app/robots.ts`.
**Impacto:** o sitemap enviado a buscadores/crawlers de IA declara URLs que não existem publicamente (o domínio `.dev` nunca foi comprado, segundo o briefing). Isso é um sinal de inconsistência/desconfiança para rastreadores e pode gerar indexação zero ou confusão de canonical quando o Google tentar validar as URLs do sitemap.
**Recomendação:** até a compra do domínio definitivo, `site.url` deve apontar para a URL real de produção (`lhs-oliveira-portfolio.vercel.app`) ou o sitemap/robots devem ser suprimidos de indexação agressiva. Nunca publicar sitemap com domínio que não resolve.

---

## HIGH

### 3. "Template sameness" nas 7 páginas de projeto — estrutura, tamanho e vocabulário idênticos
**Evidência:** todos os 7 arquivos em `content/projetos/*.mdx` seguem exatamente o mesmo esqueleto de dois H2, com o segundo sempre idêntico:
- Alinnea: `## Produto` / `## O que ele demonstra`
- DocHub: `## Operação atendida` / `## O que ele demonstra`
- Ébano: `## Demonstração` / `## O que ele demonstra`
- Gabriela Lorenson: `## Entrega` / `## O que ele demonstra`
- PetGest: `## Produto` / `## O que ele demonstra`
- Radar Fiscal: `## Produto` / `## O que ele demonstra`
- Roadmap: `## Operação atendida` / `## O que ele demonstra`

Frontmatter também é um molde fixo repetido em todos: `problema` / `resultado` / `status` / `tipo`, renderizado pelo mesmo componente `<ProjectFact term="Problema" .../>` em `src/app/projetos/[slug]/page.tsx`. Corpo de texto varia entre 48 e 56 palavras por página — praticamente idêntico em extensão.
**Impacto:** para o Google (QRG set. 2025 trata "template sameness" como sinal de conteúdo escalado/pouco diferenciado) e para LLMs que buscam extrair o que torna cada projeto único, a estrutura repetitiva sinaliza produção em série, não estudo de caso aprofundado. Sete páginas quase idênticas competem entre si por relevância em vez de se reforçarem.
**Recomendação:** variar a profundidade por projeto conforme a complexidade real (Roadmap/Radar Fiscal/DocHub têm stack técnica declarada e múltiplas capturas — merecem 300-500 palavras com decisões técnicas específicas; os projetos sem stack, como Alinnea/PetGest/Gabriela Lorenson/Ébano, precisam de pelo menos um parágrafo de contexto de negócio real). Trocar o segundo H2 fixo "O que ele demonstra" por perguntas específicas do projeto (ex.: "Como o alerta de vencimento funciona" no DocHub) em vez de repetir o mesmo rótulo genérico nas 7 páginas.

### 4. Thin content nas páginas de projeto — muito abaixo do piso de estudo de caso
**Evidência:** corpo de texto (excluindo frontmatter) medido diretamente nos arquivos-fonte:

| Projeto | Palavras no corpo |
|---|---|
| alinnea.mdx | 54 |
| dochub.mdx | 56 |
| ebano.mdx | 48 |
| gabriela-lorenson.mdx | 51 |
| petgest.mdx | 51 |
| radar-fiscal.mdx | 53 |
| roadmap.mdx | 53 |

Mesmo somando frontmatter (resumo + problema + resultado ≈ 40-60 palavras) e a lista de stack, cada página fica na casa de 100-130 palavras de texto único. Não há explicação de decisões técnicas, desafios enfrentados, métricas de resultado (só o Roadmap cita um número concreto: "operação de aproximadamente 80 pessoas", em `roadmap.mdx`), nem depoimento de cliente.
**Impacto:** muito abaixo de qualquer referência razoável para "estudo de caso" (que tipicamente pede 400-800 palavras para ter substância). Risco real de thin content na avaliação humana das QRG e pouca "extraibilidade" para IA — não há fatos suficientes para uma LLM citar algo além do resumo de uma linha.
**Recomendação:** para cada projeto, adicionar um bloco "Como funciona" ou "Decisão técnica" com 2-3 parágrafos concretos (ex.: no DocHub, explicar a lógica dos status válido/vencendo/vencido; no Radar Fiscal, explicar isolamento por escritório e filas de processamento — esses detalhes já existem em uma frase solta em "O que ele demonstra" e podem virar seção própria). Adicionar métricas sempre que existirem (tempo economizado, volume de dados, nº de usuários).

### 5. Posts de `/notas` muito curtos para o tempo de leitura anunciado
**Evidência:** contagem de palavras do corpo:
- `a-gambiarra-e-documentacao.mdx`: 172 palavras, frontmatter declara `leitura: '3 min'`
- `escopo-nao-e-lista-de-desejo.mdx`: 233 palavras, `leitura: '4 min'`
- `refem-do-desenvolvedor.mdx`: 180 palavras, `leitura: '4 min'`

A uma velocidade de leitura padrão em português (~200 palavras/min), esses textos levam 50-70 segundos para ler, não 3-4 minutos.
**Impacto:** dois problemas simultâneos — (a) muito abaixo do piso de 1.500 palavras para blog post das próprias diretrizes de conteúdo, o que caracteriza thin content para um blog que pretende rankear por temas de produto/desenvolvimento; (b) o rótulo de tempo de leitura incorreto é um pequeno sinal de descuido/inconsistência que pode ser notado por um leitor atento — soa como "template não ajustado ao conteúdo real", reforçando a impressão de conteúdo padronizado.
**Recomendação:** corrigir os rótulos de `leitura` para refletir o tempo real (~1 min) OU expandir cada nota com um exemplo concreto de operação real vivida por Leandro (ele tem casos reais em `carreira.ts` e nos projetos — cruzar essas notas com exemplos específicos dos próprios projetos entregues, ex.: citar o DocHub como exemplo de "gambiarra vira requisito"). Isso resolveria E-E-A-T e profundidade ao mesmo tempo.

### 6. Ausência total de dados estruturados (JSON-LD / schema.org)
**Evidência:** busca em todo o repositório por `application/ld+json`, `schema.org` retornou zero ocorrências em `src/` e zero no HTML renderizado de produção (`grep -c 'application/ld+json'` = 0).
**Impacto:** nenhuma página declara `Person`, `ProfilePage`, `Article`/`BlogPosting`, `CreativeWork` ou `BreadcrumbList`. Isso reduz a chance de rich results no Google e prejudica a extração estruturada por LLMs/AI Overviews, que se beneficiam de entidades explícitas (nome, cargo, projetos, datas de publicação, autor).
**Recomendação:** adicionar `Person` schema no layout (nome, `sameAs` com LinkedIn/GitHub/Instagram, `jobTitle`), `BlogPosting` nas páginas de `/notas` (com `datePublished` vindo do campo `data` do frontmatter, que já existe), e `CreativeWork`/`SoftwareApplication` nas páginas de projeto.

---

## MEDIUM

### 7. Nenhum sinal de autoria/credencial verificável nas páginas de blog
**Evidência:** `src/app/notas/[slug]/page.tsx` não renderiza nome do autor, foto, cargo ou link para bio em nenhum lugar do artigo — só título, data, tempo de leitura e corpo. O nome "Leandro Oliveira" só aparece na seção Trajetória da home (`src/components/Trajetoria.tsx`), sem link cruzado a partir dos posts.
**Impacto:** para E-E-A-T de conteúdo editorial (blog), a ausência de bio de autor no próprio artigo é uma lacuna clássica apontada nas QRG — quem lê uma nota isolada (via busca ou compartilhamento) não tem como avaliar a expertise de quem escreveu sem navegar de volta à home.
**Recomendação:** adicionar um bloco de autor no fim (ou início) de cada nota: nome, "Desenvolvedor full stack · Produto e operações" (já existe em `site.papel`), e link para LinkedIn/projetos. Reaproveitar dados já centralizados em `src/lib/site.ts`.

### 8. Alt text genérico e templado nas capturas de projeto — perde oportunidade de citação por IA
**Evidência:** `src/app/projetos/[slug]/page.tsx`:
```js
alt={indice === 0
  ? `Interface do projeto ${projeto.titulo}`
  : `${projeto.titulo}, tela ${indice + 1} de ${projeto.imagens.length}`}
```
Aplicado às 12 capturas reais existentes em `public/projetos/` (DocHub e Radar Fiscal e Roadmap têm 3 capturas cada).
**Impacto:** texto alternativo não descreve o que a tela mostra (ex.: "tela de checklist de vencimento por funcionário" em vez de "DocHub, tela 2 de 3"). Isso é uma prova visual real de trabalho entregue — sinal forte de "Experience" — mas o alt genérico desperdiça o potencial de indexação de imagem e de extração de contexto por sistemas de IA que leem alt text como fonte de fato.
**Recomendação:** escrever alt text específico por captura no frontmatter (ex.: campo `legendas: string[]` por imagem) descrevendo a funcionalidade mostrada em cada tela.

### 9. Nenhuma métrica quantificada de resultado, exceto um caso
**Evidência:** dos 7 `resultado` no frontmatter, só Roadmap contém um número: `"Coordenadores precisavam distribuir técnicos e enxergar conflitos numa operação de aproximadamente 80 pessoas."`. Os demais são qualitativos: "Um produto único organiza atendimento, documentação e comunicação" (Alinnea), "Biblioteca central, checklist por funcionário, alertas e radar de vencimentos" (DocHub) etc. — nenhum "reduziu X horas", "atende Y clientes", "processa Z documentos/mês".
**Impacto:** fatos quantificados são o material mais citável por AI Overviews e featured snippets ("qual sistema atende 80 pessoas em implantação" seria uma pergunta extraível). Prosa qualitativa de marca não serve como resposta direta.
**Recomendação:** para cada projeto, incluir ao menos um número real (volume de dados, usuários, tempo de operação, redução de retrabalho), mesmo que aproximado, seguindo o padrão que já existe no Roadmap.

### 10. Homepage: conteúdo textual disperso e não vinculado a hierarquia semântica robusta para além do design
**Evidência:** o `<h1>` real da home é "Produtos digitais para operações reais." (`src/components/Corredor.tsx`, `function Titulo()`), seguido de uma frase de 20 palavras. Título forte, mas o restante da narrativa de autoridade (Stack, Processo, Trajetória) está fragmentado em seções curtas de 2-4 frases cada, sem parágrafo consolidado que uma LLM possa citar como "resumo do que Leandro faz e por quê confiar nele".
**Impacto:** o conteúdo é suficiente para leitura humana em um portfólio visual, mas fica no limite do piso de 500 palavras esperado para homepage, e fragmentado demais para extração de resposta direta.
**Recomendação:** considerar um parágrafo de resumo único (2-3 frases, texto corrido) logo após o hero ou antes do rodapé, consolidando nome, papel, anos de experiência (desde 2014, visível em `carreira.ts`), tipo de cliente atendido.

---

## LOW

### 11. Legibilidade em português: boa, mas com risco de soar genérico/aforístico sem ancoragem concreta
**Evidência:** trechos como "A lista não é o problema. O problema é que ela chega pronta." e "Ninguém cria uma gambiarra por prazer." são frases curtas, naturais, sem jargão técnico pesado — boa legibilidade.
**Impacto:** positivo para leitura humana, mas o estilo aforístico/reflexivo, sem nomear clientes, ferramentas ou números, é justamente o padrão que as QRG associam a "conteúdo genérico" quando não é ancorado em exemplo verificável.
**Recomendação:** não é problema de legibilidade (que está boa), é falta de ancoragem: cada nota deveria fechar com um exemplo nomeado. Baixa prioridade porque o estilo direto já atende bem ao leitor humano brasileiro.

### 12. GitHub definido mas não exposto na UI de contato
**Evidência:** `src/lib/site.ts` define `github: 'https://github.com/LeandroOlveira'`, mas nenhum componente de contato renderiza esse link.
**Impacto:** para um desenvolvedor, o GitHub é um dos sinais de expertise mais verificáveis. Omiti-lo é perder um sinal de autoridade técnica gratuito.
**Recomendação:** adicionar link de GitHub na seção de contato ou no rodapé.

---

## Resumo executivo

O maior risco de SEO/E-E-A-T aqui não é o texto em si (a voz autoral é consistente e sem sinais claros de geração por IA de baixa qualidade), mas dois problemas técnicos graves de produção (og:image e sitemap apontando para domínios/hosts incorretos) somados a um problema estrutural de escala: 7 páginas de projeto com corpo de 48-56 palavras cada, seguindo um molde idêntico de dois H2, e 3 posts de blog com 172-233 palavras rotulados como "3-4 min de leitura". Ambos os grupos de página estão bem abaixo do piso de profundidade necessário, e a repetição estrutural entre os 7 projetos é um caso de manual de "template sameness". Não há JSON-LD em lugar nenhum do site. As provas de experiência real existem (capturas de tela reais, trajetória cronológica concreta, produtos com URLs públicas e verificáveis) mas estão subutilizadas.
