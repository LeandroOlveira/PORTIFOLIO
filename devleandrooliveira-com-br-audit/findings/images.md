# Imagens — 66/100

## Alt text

| Contexto | Estado |
|---|---|
| Páginas de projeto | ✅ Descritivo de verdade |
| Fallback da home | ⚠️ Genérico |
| Imagens sem `alt` | 0 em 12 páginas |
| `alt=""` indevido | 0 |

Exemplo do que está bom (`/projetos/alinnea`):
> *"Página inicial do Alinnea, com a chamada 'Sua agenda no piloto automático' e um aviso no topo sobre o assistente clínico que escreve a anotação a partir da fala do profissional."*

Descreve o que a tela mostra, não o que o arquivo é. Isso é alt text correto.

**B2 — o fallback da home não acompanhou.** As sete `<img>` do modo documento usam `Interface do projeto {título}`. O texto bom já existe no conteúdo; é reaproveitá-lo.

## Dimensões e CLS

| Contexto | `width`/`height` | `loading` |
|---|---|---|
| `/projetos/[slug]` | ✅ presentes (`captura.largura`/`altura`) | 1ª `eager`, resto `lazy` |
| Fallback da home | ❌ ausentes | todas `lazy` |

Nas páginas de projeto está certo — dimensões explícitas, primeira imagem eager. No fallback da home faltam dimensões, mas como o caminho principal é WebGL (que não carrega imagem nenhuma), o impacto real é limitado a dispositivos sem WebGL2.

## Formato e peso (M5)

| Arquivo | Peso | Formato |
|---|---|---|
| `radar-fiscal.png` | **729 KB** | PNG |
| `roadmap.png` | 212 KB | PNG |
| `dochub.png` | 192 KB | PNG |
| `gabriela-lorenson.png` | 91 KB | PNG |
| `ebano.png` | 81 KB | PNG |
| `petgest.png` | 73 KB | PNG |
| `alinnea.png` | 65 KB | PNG |

**Total: ≈1,44 MB, todo em PNG.**

`next.config.ts` declara:
```ts
images: { formats: ['image/avif', 'image/webp'] }
```

E não vale para nada: nenhuma imagem passa por `next/image`. Verificado no HTML publicado — **0 ocorrências de `srcset`, 0 de `_next/image`**. As duas renderizações usam `<img>` cru:
- `src/components/Corredor.tsx:409` (fallback da home)
- `src/app/projetos/[slug]/page.tsx:105` (páginas de projeto)

**Onde isso custa:** `/projetos/radar-fiscal` carrega 729 KB de PNG com `loading="eager"`, no caminho crítico. Em AVIF a mesma captura ficaria abaixo de 100 KB.

**Onde não custa:** na home. Medição confirmou 0 requisições de imagem no modo WebGL.

**Fix:** `next/image` em `src/app/projetos/[slug]/page.tsx`. As dimensões já existem, então a troca não reintroduz CLS, e AVIF/WebP passam a valer automaticamente.

## OG images

| Página | `og:image` |
|---|---|
| `/` | ✅ `/opengraph-image` → 200, PNG, 41 KB |
| `/projetos/*` (7) | ✅ PNG próprio de cada projeto |
| `/notas` | ❌ ausente |
| `/notas/*` (3) | ❌ ausente — rota `opengraph-image` dá 404 |

Ver A3 em `FULL-AUDIT-REPORT.md`. É o achado de imagem de maior impacto: o conteúdo feito para circular é o único sem card.

## Falsificação

```bash
curl -s https://devleandrooliveira.com.br/projetos/radar-fiscal | grep -c 'srcset'
```
Deve ser maior que zero depois do fix de M5.
