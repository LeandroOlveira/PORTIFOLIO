# AI Search Readiness (GEO) — 78/100

Análise para AI Overviews do Google, ChatGPT Search, Perplexity e Bing Copilot.

## Acesso de crawlers de IA

`robots.txt` é `User-Agent: * / Allow: /` sem exceções. GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot e Bingbot têm acesso total. Nenhum bloqueio acidental.

## `llms.txt` — o ponto mais forte

200, 4.186 bytes, `text/plain; charset=utf-8`. Estrutura:

- Nome e posicionamento em uma linha
- Site, e-mail, WhatsApp, GitHub, LinkedIn
- `## Repertório técnico` — cinco tecnologias, cada uma com o que ela resolve
- `## Projetos` — cada projeto com tipo, problema, resultado e URL ao vivo

O formato problema→resultado por projeto é exatamente o que um modelo extrai bem. Está acima da média do que se vê em portfólios.

*Nota: `llms.txt` é ignorado pelo Google Search. O valor aqui é para assistentes que buscam ao vivo (ChatGPT, Perplexity, Claude), não para ranking orgânico.*

## Citabilidade

**A favor:**
- Conteúdo em HTML server-rendered — 748 palavras no HTML bruto da home. O corredor WebGL não esconde texto de crawler que não executa JS.
- H2 formulados como perguntas ou afirmações autocontidas ("Por que não é um robô de e-CAC", "Onde a IA entra, e onde não entra") — bons pontos de extração de passagem.
- `Person` com `sameAs` e `knowsAbout` explícitos: entidade bem definida.
- `BlogPosting` com `datePublished`/`dateModified` e `inLanguage: pt-BR`.

**Contra:**
- **A1 pesa aqui também.** O nome da entidade ("Leandro Oliveira") aparece no JSON-LD e no `llms.txt`, mas em nenhum `<title>` nem `<h1>`. Um modelo que resolve entidade por texto visível encontra "lhs.oliveira"; um que lê dados estruturados encontra "Leandro Oliveira". Sinal dividido.
- Passagens curtas: os blocos sob cada H2 têm ~80 palavras. Bom para leitura, curto para citação com contexto.
- Sem menções de marca externas. Nenhum backlink, nenhuma citação de terceiros — nada que corrobore o que o site diz sobre si.

## Sinais de marca

Domínio novo, sem histórico de menções. `sameAs` cobre GitHub, LinkedIn e Instagram, o que dá três pontos de corroboração. É o mínimo viável.

O caminho para melhorar isto não é técnico: é publicar (B1) e ser citado.

## Recomendações

| # | Item | Prioridade |
|---|---|---|
| 1 | Resolver A1 — o nome da entidade no título e no H1 da home | Alta |
| 2 | Expandir as passagens sob cada H2 de ~80 para 150–250 palavras nos projetos | Média |
| 3 | Manter o `llms.txt` sincronizado ao publicar novos projetos/notas | Média |
| 4 | Adicionar `ProfilePage` na home envolvendo o `Person` | Baixa |

**Não fazer:** `FAQPage`. O Google aposentou os rich results de FAQ para todos os sites em 07/05/2026, e não há evidência confirmada de ganho de citação em LLM.

## Falsificação

Perguntar a ChatGPT Search e Perplexity "quem é Leandro Oliveira desenvolvedor Maringá" daqui a 60 dias. Se nenhum citar `devleandrooliveira.com.br`, o problema é de autoridade externa (backlinks, menções), não de estrutura — e nenhum ajuste on-page resolve.
