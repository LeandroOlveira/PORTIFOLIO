# Handoff — SEO

Documento autossuficiente para retomar o trabalho numa sessão nova.
**Como usar:** abra uma janela nova e diga *"leia HANDOFF-SEO.md"*.

Última atualização: **2026-08-08**

---

## 1. Contexto do projeto

| Item | Valor |
|---|---|
| Diretório | `D:\GitHub\PORTIFOLIO` |
| Stack | Next.js 15.5.22 (App Router), React 19, TypeScript, Tailwind v4, Three.js |
| Repositório | `github.com/LeandroOlveira/PORTIFOLIO`, branch `main` |
| Produção | https://devleandrooliveira.com.br — **no ar** |
| Projeto Vercel | `lhs-oliveira-portfolio` (time `leandroolveiras-projects`) |
| Deploy | Automático a cada push em `main` |
| Testes | `npm test` (37 testes), `npm run typecheck`, `npm run build` |

**O site é um portfólio + blog de Leandro Oliveira**, desenvolvedor full stack. Conversão principal: WhatsApp.

### Duas armadilhas ao rodar build local

1. `next dev` e `next build` compartilham o diretório `.next` e se corrompem mutuamente. Se der `Cannot find module './vendor-chunks/...'`, pare o dev, `rm -rf .next` e rebuilde. **Nunca rode dois builds em paralelo** — eles se corrompem do mesmo jeito e o build fica pendurado sem erro visível.
2. `npm start` (`next start`) falha localmente com `ENOENT ... routes-manifest.json` num caminho absurdo que concatena `C:\Users\leand\OneDrive\Documentos\GitHub\PORTIFOLIO` com `D:\GitHub\PORTIFOLIO` duas vezes. É o `outputFileTracingRoot` de `next.config.ts` resolvendo errado a partir de um diretório antigo. **Não afeta a Vercel** — o build gera os HTMLs corretos. Para verificar o output localmente, leia `.next/server/app/**/*.html` em vez de subir o servidor.

---

## 2. Status do domínio

`devleandrooliveira.com.br` está **registrado, apontado e servindo 200**. O bloqueio descrito no handoff anterior não existe mais.

Verificado em 08/08:
- Apex responde 200, `X-Nextjs-Prerender: 1`, `X-Vercel-Cache: HIT`, TTFB 14–94 ms
- HTTP redireciona para HTTPS; HSTS `max-age=63072000`
- `robots.txt` e `sitemap.xml` declaram o domínio certo

**Pendências de infraestrutura (painel Vercel, não código):**
- `www.devleandrooliveira.com.br` responde **200 em vez de 301** para o apex. O canonical protege a indexação, mas divide sinal. Corrigir em Domains → Redirect to.
- `lhs-oliveira-portfolio.vercel.app` continua respondendo 200. Faz cross-canonical correto para o domínio próprio, então é cosmético; um 301 seria mais limpo.

**Search Console e Bing Webmaster Tools ainda não foram configurados.** Fazer isso agora — não há mais motivo para esperar. A auditoria já reflete os títulos novos.

---

## 3. Estado do SEO

Auditoria completa em `devleandrooliveira-com-br-audit/`. A de 05/08 está arquivada em `historico/2026-08-05/`.

| Rodada | Nota |
|---|---|
| 2026-08-05 | 47/100 |
| 2026-08-08 | **71/100** |

### Já resolvido (verificado em produção ou no HTML do build)

- Canonical em 13/13 páginas, domínio correto
- `og:image` sem `localhost`; card próprio para home, projetos, notas e `/projetos`
- JSON-LD: `Person` (todas), `CreativeWork` + `BreadcrumbList` (projetos), `BlogPosting` + `BreadcrumbList` (notas), `CollectionPage` (`/projetos`)
- **CLS 0,42 → 0,000** — `Corredor.tsx:35` usa `useLayoutEffect` no cliente
- Contraste da Stack: piso de opacidade 0,12 → 0,4
- Nome real ("Leandro Oliveira") nos títulos; `lhs.oliveira` fica como `alternateName` e marca visual
- Títulos de projeto com categoria: `Alinnea — CRM para psicólogos — Leandro Oliveira`
- Hub `/projetos` (era 404), no sitemap e no breadcrumb
- Links internos por página de projeto: 1 → 5
- `CreativeWork.url` aponta para a própria página; produto externo em `sameAs`
- `og:locale` em 13/13
- `llms.txt` presente e rico
- Blog aceita `atualizado` (→ `dateModified`) e imagens no corpo com dimensão automática

### Pendente

Ordem e detalhe em `devleandrooliveira-com-br-audit/ACTION-PLAN.md`. Resumo:

| # | Item | Onde |
|---|---|---|
| M3 | 301 `www` → apex | Painel Vercel |
| M5 | `next/image` nas páginas de projeto; recomprimir `radar-fiscal.png` (729 KB, `eager`) | `src/app/projetos/[slug]/page.tsx` |
| M4 | `nosniff`, `Referrer-Policy`, `Permissions-Policy`; CSP por último, com teste (WebGL) | `next.config.ts` |
| M6 | Padding vertical nos links para ~48 px de área tocável (22 links abaixo de 40 px) | componentes |
| B2 | Alt descritivo no fallback da home (hoje genérico) | `Corredor.tsx` |
| B3 | Parágrafo de contexto em `/notas` (105 palavras) | `src/app/notas/page.tsx` |
| B1 | **Publicar.** Três notas de ~250 palavras não sustentam autoria temática | `content/notas/` |

`next.config.ts` declara `formats: ['image/avif','image/webp']`, mas **nada passa por `next/image`** — a configuração está inerte até M5.

---

## 4. Como publicar um artigo

Criar `content/notas/slug.mdx`:

```markdown
---
titulo: Título com as palavras que alguém digitaria na busca
resumo: Uma frase. Vira meta description e texto do card social.
data: '2026-08-12'
atualizado: '2026-09-14'   # opcional, só quando houver revisão real
---

Markdown normal. `##`, listas, **negrito**, [links](https://exemplo.com),
`código` e blocos ``` já têm estilo em `.article-prose`.

![Descrição para quem não vê](/notas/imagem.png "Legenda visível")
```

Push em `main` → no ar. Vêm de graça: sitemap, canonical, título, OG, card gerado, `BlogPosting`, breadcrumb, tempo de leitura calculado do texto real e bloco de autoria.

Imagens vão em `public/notas/`. As dimensões são lidas do arquivo no build — não digite `width`/`height`. Imagem sem `alt` ou fora de `public/` **falha nos testes**.

Editorialmente: 800–1.200 palavras, `##` a cada 200–300, título com termo de busca (não manchete de ensaio), dois textos por mês, em cluster temático e linkando um no outro.

---

## 5. O que NÃO mexer

- **Corredor 3D / seção de projetos** — o usuário considera pronta.
- **Coreografia de rolagem** das seções (stack, processo, trajetória, notas, contato).
- **Textos das notas** — já passaram por revisão anti-AI-writing.
- **Nav do cabeçalho** aponta para `#projetos` (âncora do corredor), não para `/projetos`. Mudar alteraria a experiência da home.

---

## 6. Estado do repositório

- Branch `main` + branch `seo/entidade-hub-e-blog` com dois commits de SEO
- Vulnerabilidades conhecidas (pré-existentes, não bloqueiam): `sharp` e `postcss`, ambos empacotados pelo próprio Next 15.5.22. Corrigir exige subir a versão do Next — decisão do usuário.

### Verificação

```bash
npm run typecheck && npm test && npm run build
```

Depois do deploy:

```bash
curl -s https://devleandrooliveira.com.br/projetos/alinnea | grep -o '<title>[^<]*</title>'
curl -s -o /dev/null -w "%{http_code}\n" https://devleandrooliveira.com.br/projetos
curl -s https://devleandrooliveira.com.br/notas/refem-do-desenvolvedor | grep -o 'og:image[^>]*'
```

Esperado: título com "CRM para psicólogos", `/projetos` retornando 200, e `og:image` presente na nota.
