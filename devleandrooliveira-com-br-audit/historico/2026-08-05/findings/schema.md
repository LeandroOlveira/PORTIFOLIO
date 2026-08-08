# Schema & Dados Estruturados — recomendações concretas

Zero implementação hoje (confirmado por grep em `src/` e no HTML de produção). Abaixo, os três blocos recomendados com exemplo de código para este stack (Next.js 15 App Router, TypeScript). Não implementados nesta auditoria — são recomendação, não mudança de código.

## 1. Person, no layout raiz

Em `src/app/layout.tsx`, dentro do `<body>` (via `<script type="application/ld+json">` com `dangerouslySetInnerHTML`, mesmo padrão já usado no arquivo para o comentário `CONTRATO`):

```tsx
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.nomeCompleto,
  jobTitle: site.papel,
  url: site.url,
  sameAs: [site.linkedin, site.github, site.instagram].filter(Boolean),
  knowsAbout: stack.map((s) => s.nome),
};
```

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
/>
```

## 2. Article/BlogPosting, por nota

Em `src/app/notas/[slug]/page.tsx`, dentro de `generateMetadata` ou do componente da página:

```tsx
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: n.titulo,
  description: n.resumo,
  datePublished: n.data,
  author: { '@type': 'Person', name: site.nomeCompleto, url: site.url },
};
```

## 3. CreativeWork, por projeto

Em `src/app/projetos/[slug]/page.tsx`:

```tsx
const projectSchema = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: projeto.titulo,
  description: projeto.resumo,
  url: projeto.url,
  creator: { '@type': 'Person', name: site.nomeCompleto },
};
```

## 4. BreadcrumbList (opcional, reforça hierarquia)

Nas rotas dinâmicas (`/projetos/[slug]`, `/notas/[slug]`), refletindo a navegação já existente ("← Projetos" / "← Notas"):

```tsx
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: site.url },
    { '@type': 'ListItem', position: 2, name: projeto.titulo, item: `${site.url}/projetos/${projeto.slug}` },
  ],
};
```

## Nota de implementação

Todos os dados necessários já existem em `src/lib/site.ts`, `src/lib/content.ts` e `src/lib/carreira.ts` — nenhum desses blocos exige coletar informação nova, só serializar o que já está estruturado no código. Validar cada schema com o [Rich Results Test](https://search.google.com/test/rich-results) do Google antes de publicar.
