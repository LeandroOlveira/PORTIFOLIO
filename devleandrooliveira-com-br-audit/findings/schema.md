# Schema / Dados estruturados — 75/100

**Saiu de 10/100 (05/08) para 75.** Era a maior lacuna da auditoria anterior; hoje é cobertura ampla com dois defeitos de precisão.

## Cobertura

| Tipo | Onde | Estado |
|---|---|---|
| `Person` | 12/12 páginas | ✅ completo |
| `CreativeWork` | 7 páginas de projeto | ⚠️ `url` errado |
| `BlogPosting` | 3 notas | ⚠️ sem `image` |
| `BreadcrumbList` | 7 projetos + 3 notas | ✅ |

Nenhum erro de parse de JSON em nenhuma das 12 páginas.

## `Person` — correto

```json
{
  "@type": "Person",
  "name": "Leandro Oliveira",
  "alternateName": "lhs.oliveira",
  "jobTitle": "Desenvolvedor full stack · Produto e operações",
  "description": "Trabalho com software ligado a operação desde 2014 …",
  "url": "https://devleandrooliveira.com.br",
  "email": "mailto:leandroappa@gmail.com",
  "sameAs": ["github…", "linkedin…", "instagram…"],
  "knowsAbout": ["Python", "Node.js", "React", "Next.js", "C#"]
}
```

`sameAs` com três perfis reais e `knowsAbout` explícito são exatamente os sinais que um grafo de entidades consome. Nada a mudar.

**Observação de consistência:** o `Person` já declara `name: "Leandro Oliveira"` — e nenhum `<title>` do site declara. Os dados estruturados estão mais corretos que o HTML visível (ver A1 em `onpage.md`).

## `CreativeWork` — M1, precisa correção

```json
{
  "@type": "CreativeWork",
  "name": "Alinnea",
  "url": "https://alinnea.com.br/",     // ← aponta para fora
  "keywords": [],                        // ← array vazio
  "creator": { "@type": "Person", "name": "Leandro Oliveira", … },
  "image": ["https://devleandrooliveira.com.br/projetos/alinnea.png"]
}
```

Três ajustes:
1. `url` deve ser a URL canônica da entidade descrita **naquela página** → `https://devleandrooliveira.com.br/projetos/alinnea`. O produto ao vivo vai em `sameAs` (ou `workExample`).
2. `keywords: []` — omitir a propriedade em vez de emitir array vazio.
3. Falta `mainEntityOfPage` / `@id`. As notas fazem isso certo; os projetos não.

Mesmo padrão nos sete.

## `BlogPosting` — M2

```json
{
  "@type": "BlogPosting",
  "headline": "Escopo não é lista de desejo",
  "datePublished": "2026-06-18",
  "dateModified": "2026-06-18",
  "inLanguage": "pt-BR",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "…" },
  "author": { "@type": "Person", "name": "Leandro Oliveira", … },
  "publisher": { "@type": "Person", … }
}
```

Bem formado. Falta só `image` — a diretriz de Article do Google pede. Resolve junto com A3 (`opengraph-image` para as notas): mesma imagem serve aos dois.

## `BreadcrumbList` — correto

Projetos: `Início → {Projeto}` (2 níveis). Notas: `Início → Notas → {Nota}` (3 níveis).

O breadcrumb de projeto pular direto para o item é coerente enquanto `/projetos` não existir. **Ao criar o hub (A4), incluir o nível intermediário.**

## Oportunidades não implementadas

- `WebSite` com `potentialAction: SearchAction` — só faz sentido se houver busca interna. Não há. Pular.
- `FAQPage` — **não recomendar.** O Google aposentou os rich results de FAQ para todos os sites em 07/05/2026. Não há benefício de SERP.
- `ProfilePage` na home, envolvendo o `Person`, é o único ganho adicional que valeria — baixa prioridade.

## Validação

Nenhum validador automático rodou (runtime Python do plugin não provisionado). A análise é de leitura direta do JSON-LD publicado contra o vocabulário Schema.org.

**Falsificação:** [Rich Results Test](https://search.google.com/test/rich-results) em `/projetos/alinnea` e numa nota, após a correção.
