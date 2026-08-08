# On-Page SEO — 58/100

**A categoria mais fraca da auditoria**, e a de maior retorno por hora de trabalho.

## Títulos

| URL | Título | Chars |
|---|---|---|
| `/` | lhs.oliveira — Desenvolvedor full stack · Produto e operações | 61 |
| `/notas` | Notas — lhs.oliveira | 20 |
| `/projetos/alinnea` | Alinnea — lhs.oliveira | 22 |
| `/projetos/ebano` | Ébano — lhs.oliveira | 20 |
| `/projetos/dochub` | DocHub — lhs.oliveira | 21 |
| `/projetos/petgest` | PetGest — lhs.oliveira | 22 |
| `/projetos/roadmap` | Roadmap — lhs.oliveira | 22 |
| `/projetos/radar-fiscal` | Radar Fiscal — lhs.oliveira | 27 |
| `/projetos/gabriela-lorenson` | Gabriela Lorenson — lhs.oliveira | 32 |
| `/notas/escopo-nao-e-lista-de-desejo` | Escopo não é lista de desejo — lhs.oliveira | 43 |
| `/notas/a-gambiarra-e-documentacao` | A gambiarra é documentação — lhs.oliveira | 41 |
| `/notas/refem-do-desenvolvedor` | Se o sistema depende de mim para respirar, eu falhei — lhs.oliveira | 67 |

Todos únicos, nenhum duplicado, um só acima de 60 chars. Tecnicamente corretos.

**Dois problemas de fundo:**

**A1 — o nome próprio não aparece em nenhum.** `site.ts:5` tem `nomeCompleto: 'Leandro Oliveira'` e nenhum título usa. A consulta de maior intenção para um portfólio pessoal é o nome; "lhs.oliveira" é handle de Instagram, não termo de busca.

**A2 — os sete títulos de projeto não dizem o que o projeto é.** 20–32 de ~60 chars usados, gastos em substantivos próprios desconhecidos. A categoria já está na `meta description` ("CRM para psicólogos com agenda, prontuário e automações") — falta levá-la para o título.

## Meta descriptions

12/12 presentes, únicas, 40–100 chars. Bem escritas — dizem o problema resolvido, não o que a página contém. Nenhuma correção necessária, exceto notar que estão curtas: há espaço até ~155 chars se quiser mais.

## Estrutura de headings

- H1 único em 12/12 ✅
- Hierarquia sem saltos ✅
- Home: 1 H1 → 6 H2 → 22 H3, todos descritivos
- Projetos: H1 + 2–3 H2 com títulos autorais ("O trabalho que ninguém contratou", "Dado de terceiro exige cuidado explícito")

Os H2 são bons demais para o tamanho do corpo — ver `content.md`.

## Linkagem interna (A4)

| Página | Links internos emitidos |
|---|---|
| `/` | 10 |
| `/notas` | 4 |
| `/notas/*` | 2 |
| `/projetos/*` | **1** |

Grafo estrela de um salto. As sete páginas de projeto não passam autoridade para lugar nenhum e não recebem de nenhuma irmã. Sem `/projetos` (404), não há hub.

**Fix:** hub `/projetos` + bloco "outros projetos" nas páginas de projeto + link cruzado nota↔projeto.

## Open Graph

12/12 com `og:title`, `og:description`, `og:type`, `og:url` próprios ✅
`og:image`: presente na home (`/opengraph-image`, 41 KB PNG) e nos 7 projetos. **Ausente em `/notas` e nas 3 notas** — a rota `/notas/[slug]/opengraph-image` dá 404. Ver A3.
`og:locale`: só na home (M7).
`twitter:card: summary_large_image` em 12/12 ✅
