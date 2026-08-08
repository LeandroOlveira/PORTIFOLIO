# Plano de Ação — SEO pré-lançamento

## Fase 1: Correções críticas (antes de qualquer divulgação do link)

- [ ] Definir `NEXT_PUBLIC_SITE_URL` nas env vars da Vercel (produção e preview) com a URL real — resolve `og:image` quebrado. **15 min**
- [ ] Atualizar `site.url` em `src/lib/site.ts` para o mesmo domínio real, removendo a referência a `lhsoliveira.dev` — resolve sitemap/robots apontando para domínio inexistente. **5 min**
- [ ] Adicionar `alternates: { canonical }` em `layout.tsx` (raiz) e nas rotas dinâmicas (`projetos/[slug]`, `notas/[slug]`) — nenhuma página tem canonical hoje. **1h**
- [ ] Sobrescrever `openGraph`/`twitter` em `generateMetadata` de `projetos/[slug]/page.tsx` com título, descrição e imagem específicos do projeto (replicar o padrão já usado em `notas/[slug]/page.tsx`). **1-2h**
- [ ] Validar pós-deploy com `curl` que nenhuma página tem `og:image` contendo `localhost`.

## Fase 2: Melhorias de alto impacto (semana 1-2)

- [ ] Adicionar JSON-LD `Person` no `layout.tsx` raiz (nome, jobTitle, sameAs: LinkedIn/GitHub/Instagram). **Meio dia**
- [ ] Adicionar JSON-LD `Article`/`BlogPosting` em cada nota (author, datePublished a partir do frontmatter `data`). **2-3h**
- [ ] Adicionar JSON-LD `CreativeWork` em cada projeto. **2-3h**
- [ ] Renderizar o link do GitHub (já existe em `site.ts`, nunca usado) no Rodapé ou seção de Contato. **10 min**
- [ ] Trocar `useEffect` por `useLayoutEffect` na detecção de WebGL em `Corredor.tsx` para eliminar o CLS de 0,42 causado pela troca de modo `documento → corredor`. **1-2h + teste visual em navegador real**
- [ ] Elevar o piso de opacidade de `.pilha-item` (hoje 0,12) para algo como 0,35-0,4, ou aceitar a captura de Lighthouse como falso-positivo documentado — decisão de design, não só técnica. **30 min + revisão visual**

## Fase 3: Conteúdo e autoridade (mês 1-2)

- [ ] Expandir as 7 páginas de projeto: adicionar seção "Como funciona"/"Decisão técnica" com 2-3 parágrafos concretos por projeto, substituindo o H2 fixo "O que ele demonstra" por algo específico de cada um. **1-2 dias**
- [ ] Adicionar métrica quantificada em pelo menos mais 3-4 projetos (hoje só Roadmap tem número concreto). **Depende de dados disponíveis**
- [ ] Corrigir os rótulos de `leitura` nas notas para refletir o tempo real de leitura (~1 min hoje, não 3-4 min), ou expandir o conteúdo para justificar o tempo declarado. **Escolher uma direção**
- [ ] Adicionar bloco de autor (nome, papel, link) ao final de cada nota. **1-2h, dados já existem em `site.ts`**
- [ ] Escrever alt text específico por captura de projeto (o que a tela mostra, não "tela 2 de 3"). **1-2h**
- [ ] Criar `/llms.txt` reaproveitando `getProjetos()`/`getNotas()` — zero conteúdo duplicado a mão. **2-3h**
- [ ] Declarar explicitamente GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended em `robots.ts` (redundante com o wildcard atual, mas remove ambiguidade). **10 min**

## Fase 4: Monitoramento e iteração (contínuo)

- [ ] Depois de comprar `devleandrooliveira.com.br`: configurar o domínio na Vercel, redirect 301 permanente do domínio antigo/preview, atualizar `site.url` uma única vez.
- [ ] Cadastrar no Google Search Console e Bing Webmaster Tools assim que o domínio definitivo estiver ativo.
- [ ] Reexportar/comprimir `radar-fiscal.png` (712KB, muito acima das outras capturas).
- [ ] Adicionar headers de segurança (`Content-Security-Policy`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`) via `next.config.ts`.
- [ ] Repetir esta auditoria depois da Fase 1 e 2 para confirmar os ganhos, especialmente CLS e og:image.
