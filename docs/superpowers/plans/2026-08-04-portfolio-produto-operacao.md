# Portfolio Product and Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio home around “Produtos digitais para operações reais”, with an automatic non-scroll-dependent opening, seven real projects, applied technologies, a factual career story, and real contact channels.

**Architecture:** Keep Next.js App Router and file-based MDX. Move business truth into typed modules (`site.ts`, `carreira.ts`) and a strict project parser in `content.ts`; keep components focused by section. Use progressive enhancement for motion: server-render the settled content, then animate disposable masks with GSAP so JavaScript failure never hides the offer.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.9, Tailwind CSS 4, MDX via `next-mdx-remote`, GSAP 3, Vitest, Testing Library, jsdom.

## Global Constraints

- The first viewport must communicate “Produtos digitais para operações reais.” without cinema metaphors in headings, labels, or navigation.
- Cinema is structural only: framing, rhythm, contrast, hard cuts, rectangular masks, and controlled scale.
- Opening animation runs automatically in approximately 900-1,200 ms and never depends on scroll.
- The settled hero content is visible in server HTML and when JavaScript or animation fails.
- `prefers-reduced-motion: reduce` renders the final state immediately.
- The only accent is `#D4FF00`; base colors remain deep black, graphite, and warm white.
- Public proof must remain factual: no invented customers, metrics, revenue, testimonials, or delivery times.
- Project states are explicit and text-backed: `publicado`, `entregue`, `em-construcao`, `demonstracao`.
- Required technologies: Python, Node.js, React, Next.js, and C# with a sentence explaining real use.
- WhatsApp is `5544997762271`; e-mail is `leandroappa@gmail.com`; LinkedIn is `https://www.linkedin.com/in/lhsoliveira`; Instagram is `https://www.instagram.com/lhs.oliveira`.
- Private product imagery must not expose names, documents, CNPJs, credentials, or operational data.
- Work test-first: observe each focused test fail for the intended missing behavior before editing production code.
- Before the first UI edit, read `C:\Users\leand\.agents\skills\impeccable\reference\craft-floor.md` in full.
- Do not add a CMS, backend form, authentication, testimonials, i18n, autoplay video, or audio.

## File Structure

### Create

- `vitest.config.ts` - jsdom test configuration and `@/` alias.
- `src/test/setup.ts` - Testing Library matchers and browser API stubs.
- `src/lib/site.test.ts` - identity, contacts, WhatsApp, navigation, and stack contracts.
- `src/lib/content.test.ts` - project parsing, validation, status, and ordering.
- `src/components/Abertura.test.tsx` - first-frame offer and action contract.
- `src/components/Projetos.test.tsx` - project status, links, and no-image behavior.
- `src/components/Stack.test.tsx` - required technologies and applied descriptions.
- `src/components/Trajetoria.test.tsx` - factual timeline and absence of placeholders.
- `src/components/Contato.test.tsx` - all four real contact channels.
- `src/components/Notas.test.tsx` - direct editorial positioning for articles.
- `src/components/Projetos.tsx` - real project showcase.
- `src/components/StatusProjeto.tsx` - accessible project-state label.
- `src/components/Stack.tsx` - applied technology section.
- `src/components/Trajetoria.tsx` - factual professional history.
- `public/projetos/alinnea.webp` - public first-party project capture.
- `public/projetos/roadmap.webp` - sanitized local screenshot.
- `public/projetos/gabriela-lorenson.webp` - public site capture.
- `public/projetos/ebano.webp` - public demo capture.
- `public/projetos/petgest.webp` - public first-party project capture.

### Modify

- `package.json`, `package-lock.json` - test dependencies and scripts; remove Lenis after shell simplification.
- `src/lib/site.ts` - real identity, contacts, stack, and navigation.
- `src/lib/content.ts` - strict project schema and parser.
- `src/lib/carreira.ts` - factual timeline from the supplied LinkedIn profile.
- `content/projetos/*.mdx` - replace fictional demo cases with seven real entries.
- `src/components/Abertura.tsx` - automatic opening without ScrollTrigger.
- `src/components/Cabecalho.tsx` - compact direct navigation.
- `src/components/Processo.tsx` - direct three-step working method.
- `src/components/QuemSou.tsx` - replaced by the new trajectory component.
- `src/components/Contato.tsx` - real WhatsApp, e-mail, LinkedIn, and Instagram.
- `src/components/Notas.tsx`, `src/components/Rodape.tsx`, `src/components/Botao.tsx`, `src/components/Titulo.tsx` - direct language and new visual grammar.
- `src/app/page.tsx` - new section order.
- `src/app/layout.tsx` - revised direction contract and simplified shell.
- `src/app/globals.css` - responsive visual system, masks, focus, and reduced motion.
- `src/app/projetos/[slug]/page.tsx` - new project fields and status presentation.
- `src/app/notas/page.tsx` - remove residual editing metaphors.
- `src/app/opengraph-image.tsx` - new positioning copy.

### Delete after imports are removed

- `src/components/Transporte.tsx` - persistent edit-timeline navigation.
- `src/components/Scroll.tsx` - Lenis and global scroll reveals.
- `src/components/Entregas.tsx` - replaced by `Projetos.tsx`.
- `src/components/QuemSou.tsx` - replaced by `Trajetoria.tsx`.
- `src/lib/playhead.ts` - timecode/progress infrastructure.
- `src/lib/secoes.ts` - timeline-based navigation model.
- `content/projetos/gestao-de-documentos.mdx`
- `content/projetos/ordem-de-servico-em-campo.mdx`
- `content/projetos/pedidos-do-representante.mdx`

---

### Task 1: Test Harness, Identity, Contacts, and Applied Stack Data

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/site.test.ts`
- Modify: `src/lib/site.ts`

**Interfaces:**
- Produces: `site`, `stack`, `navegacao`, and `whatsappLink(message?: string): string`.
- `site.whatsapp` is normalized digits-only E.164 and is consumed by hero, header, contact, metadata, and tests.

- [ ] **Step 1: Install the test harness and add scripts**

Run:

```powershell
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

- [ ] **Step 2: Write the failing identity and contact tests**

Create `src/lib/site.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { navegacao, site, stack, whatsappLink } from '@/lib/site';

describe('site identity', () => {
  it('publishes the real contact channels', () => {
    expect(site.nomeCompleto).toBe('Leandro Oliveira');
    expect(site.whatsapp).toBe('5544997762271');
    expect(site.email).toBe('leandroappa@gmail.com');
    expect(site.linkedin).toBe('https://www.linkedin.com/in/lhsoliveira');
    expect(site.instagram).toBe('https://www.instagram.com/lhs.oliveira');
  });

  it('builds a real encoded WhatsApp link', () => {
    const url = new URL(whatsappLink('Olá, Leandro.'));
    expect(`${url.origin}${url.pathname}`).toBe('https://wa.me/5544997762271');
    expect(url.searchParams.get('text')).toBe('Olá, Leandro.');
  });

  it('exposes direct navigation without editing metaphors', () => {
    expect(navegacao.map((item) => item.label)).toEqual([
      'Projetos',
      'Stack',
      'Trajetória',
      'Contato',
    ]);
  });

  it('describes every required technology in context', () => {
    expect(stack.map((item) => item.nome)).toEqual([
      'Python',
      'Node.js',
      'React',
      'Next.js',
      'C#',
    ]);
    expect(stack.every((item) => item.descricao.length >= 24)).toBe(true);
  });
});
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm test -- src/lib/site.test.ts`

Expected: FAIL because the current site contains the placeholder WhatsApp, empty contact links, no `stack`, and no `navegacao` export.

- [ ] **Step 4: Implement the typed site contract**

Replace the identity portion of `src/lib/site.ts` with:

```ts
export const site = {
  nome: 'lhs.oliveira',
  nomeCompleto: 'Leandro Oliveira',
  papel: 'Desenvolvedor full stack · Produto e operações',
  descricao:
    'Produtos digitais e sistemas para operações reais, da descoberta ao código em produção.',
  locale: 'pt-BR',
  whatsapp: '5544997762271',
  whatsappMensagem:
    'Oi, Leandro. Vi seu portfólio e quero conversar sobre um projeto.',
  email: 'leandroappa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lhsoliveira',
  instagram: 'https://www.instagram.com/lhs.oliveira',
  github: 'https://github.com/LeandroOlveira',
} as const;

export const navegacao = [
  { href: '#projetos', label: 'Projetos' },
  { href: '#stack', label: 'Stack' },
  { href: '#trajetoria', label: 'Trajetória' },
  { href: '#contato', label: 'Contato' },
] as const;

export const stack = [
  { nome: 'Python', descricao: 'Análise de dados, dashboards, automações e pipelines com IA.' },
  { nome: 'Node.js', descricao: 'APIs, integrações e serviços que sustentam produtos web.' },
  { nome: 'React', descricao: 'Interfaces operacionais densas e experiências de produto.' },
  { nome: 'Next.js', descricao: 'Aplicações e sites rápidos, acessíveis e preparados para busca.' },
  { nome: 'C#', descricao: 'Ferramentas internas e integrações com sistemas corporativos.' },
] as const;

export function whatsappLink(message: string = site.whatsappMensagem): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
```

Keep `site.url` out of visitor copy. In `layout.tsx`, a later task will resolve metadata base from `NEXT_PUBLIC_SITE_URL` with `http://localhost:3000` as the build-only default.

- [ ] **Step 5: Run GREEN checks**

Run:

```powershell
npm test -- src/lib/site.test.ts
npm run typecheck
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/lib/site.ts src/lib/site.test.ts
git commit -m "test: define real portfolio identity and contacts"
```

---

### Task 2: Strict Project Model and Seven Real MDX Cases

**Files:**
- Create: `src/lib/content.test.ts`
- Modify: `src/lib/content.ts`
- Delete: the three fictional files under `content/projetos/`
- Create: `content/projetos/alinnea.mdx`
- Create: `content/projetos/roadmap.mdx`
- Create: `content/projetos/dochub.mdx`
- Create: `content/projetos/radar-fiscal.mdx`
- Create: `content/projetos/petgest.mdx`
- Create: `content/projetos/gabriela-lorenson.mdx`
- Create: `content/projetos/ebano.mdx`

**Interfaces:**
- Produces: `ProjectStatus`, `Projeto`, `parseProjeto(slug, data, corpo)`, `getProjetos()`, and `getProjeto(slug)`.
- `Projeto` fields: `slug`, `titulo`, `resumo`, `problema`, `resultado`, `status`, `tipo`, `url?`, `imagem?`, `stack`, `destaque`, `ordem`, `corpo`.

- [ ] **Step 1: Write failing parser and ordering tests**

Create `src/lib/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getProjetos, parseProjeto } from '@/lib/content';

const valid = {
  titulo: 'Alinnea',
  resumo: 'CRM para psicólogos.',
  problema: 'Rotinas clínicas espalhadas.',
  resultado: 'Agenda, prontuário e comunicação reunidos.',
  status: 'publicado',
  tipo: 'SaaS próprio',
  url: 'https://alinnea.com.br/',
  imagem: '/projetos/alinnea.webp',
  stack: ['Next.js'],
  destaque: true,
  ordem: 1,
};

describe('project content', () => {
  it('parses the explicit project contract', () => {
    expect(parseProjeto('alinnea', valid, 'corpo')).toMatchObject({
      slug: 'alinnea',
      status: 'publicado',
      ordem: 1,
      destaque: true,
    });
  });

  it('rejects unknown status with the file name', () => {
    expect(() => parseProjeto('invalido', { ...valid, status: 'pronto' }, '')).toThrow(
      'content/projetos/invalido.mdx: status inválido',
    );
  });

  it('rejects a missing required field', () => {
    const { problema: _problema, ...missing } = valid;
    expect(() => parseProjeto('incompleto', missing, '')).toThrow(
      'content/projetos/incompleto.mdx: problema é obrigatório',
    );
  });

  it('loads seven real projects in explicit order', () => {
    const projects = getProjetos();
    expect(projects).toHaveLength(7);
    expect(projects.map((project) => project.slug)).toEqual([
      'alinnea',
      'roadmap',
      'dochub',
      'radar-fiscal',
      'petgest',
      'gabriela-lorenson',
      'ebano',
    ]);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/lib/content.test.ts`

Expected: FAIL because `parseProjeto` and the new schema do not exist and only three fictional cases load.

- [ ] **Step 3: Implement project validation**

Add to `src/lib/content.ts`:

```ts
export const projectStatuses = [
  'publicado',
  'entregue',
  'em-construcao',
  'demonstracao',
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export type Projeto = {
  slug: string;
  titulo: string;
  resumo: string;
  problema: string;
  resultado: string;
  status: ProjectStatus;
  tipo: string;
  url?: string;
  imagem?: string;
  stack: string[];
  destaque: boolean;
  ordem: number;
  corpo: string;
};

function requiredString(slug: string, data: Record<string, unknown>, field: string) {
  const value = data[field];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`content/projetos/${slug}.mdx: ${field} é obrigatório`);
  }
  return value.trim();
}

export function parseProjeto(
  slug: string,
  data: Record<string, unknown>,
  corpo: string,
): Projeto {
  const status = requiredString(slug, data, 'status');
  if (!projectStatuses.includes(status as ProjectStatus)) {
    throw new Error(`content/projetos/${slug}.mdx: status inválido`);
  }

  return {
    slug,
    titulo: requiredString(slug, data, 'titulo'),
    resumo: requiredString(slug, data, 'resumo'),
    problema: requiredString(slug, data, 'problema'),
    resultado: requiredString(slug, data, 'resultado'),
    status: status as ProjectStatus,
    tipo: requiredString(slug, data, 'tipo'),
    url: typeof data.url === 'string' && data.url ? data.url : undefined,
    imagem: typeof data.imagem === 'string' && data.imagem ? data.imagem : undefined,
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    destaque: data.destaque === true,
    ordem: Number(data.ordem),
    corpo,
  };
}
```

Make `getProjetos()` call `parseProjeto()` and sort ascending by `ordem`, then title. Reject non-finite `ordem` with `ordem é obrigatória`.

- [ ] **Step 4: Author the seven exact frontmatter records**

Use this content matrix; bodies expand the same facts without adding unsupported metrics:

| slug | titulo | tipo | status | ordem | url | resumo | problema | resultado |
|---|---|---|---|---:|---|---|---|---|
| `alinnea` | Alinnea | SaaS próprio | publicado | 1 | `https://alinnea.com.br/` | CRM para psicólogos com agenda, prontuário e automações. | A rotina clínica se divide entre agenda, registros, recibos e mensagens. | Um produto único organiza atendimento, documentação e comunicação. |
| `roadmap` | Roadmap | Sistema interno | entregue | 2 | - | Gestão de agenda e capacidade para a operação de implantação. | Coordenadores precisavam distribuir técnicos e enxergar conflitos numa operação de aproximadamente 80 pessoas. | Uma base operacional com visões macro, semanal e de disponibilidade. |
| `dochub` | DocHub | Sistema entregue | entregue | 3 | - | Controle de documentação de funcionários de obra. | Documentos, competências e vencimentos exigiam conferência manual e cobrança dispersa. | Biblioteca central, checklist por funcionário, alertas e radar de vencimentos. |
| `radar-fiscal` | Radar Fiscal | SaaS próprio | em-construcao | 4 | - | Monitoramento fiscal para escritórios de contabilidade. | Conferir cliente por cliente no e-CAC não escala e deixa inadimplência aparecer tarde. | Uma carteira consolidada mostra exceções e orienta a ação do operador. |
| `petgest` | PetGest | SaaS próprio | em-construcao | 5 | `https://www.petgest.com.br/` | Gestão para petshops, do atendimento ao financeiro e aviário. | Agenda, estoque, vendas, histórico dos pets e plantel vivem em rotinas separadas. | Um produto reúne operação comercial, serviços e controle de criadores. |
| `gabriela-lorenson` | Gabriela Lorenson | Site profissional | publicado | 6 | `https://gabrielalorenson.com.br/` | Presença digital para psicóloga clínica. | A profissional precisava explicar abordagem, atendimento e conteúdo com confiança. | Um site autoral organiza apresentação, artigos, dúvidas e contato. |
| `ebano` | Ébano | Demonstração | demonstracao | 7 | `https://site-orcamento-snowy.vercel.app/` | Demonstração de site para móveis planejados com orçamento online. | Mostrar portfólio e captar briefing sem depender apenas de uma conversa inicial. | Uma experiência visual conduz do trabalho realizado ao pedido de orçamento. |

Set `destaque: true` for Alinnea, Roadmap, and DocHub. Set the five image paths listed in File Structure; leave `imagem` absent for DocHub and Radar Fiscal until sanitized material exists. Use only confirmed stack values; an empty list is better than guessing.

- [ ] **Step 5: Run GREEN checks**

Run:

```powershell
npm test -- src/lib/content.test.ts
npm run typecheck
```

Expected: PASS; the loader returns seven projects and invalid content fails with the source filename.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/content.ts src/lib/content.test.ts content/projetos
git commit -m "feat: replace demo cases with real project content"
```

---

### Task 3: Direct Header and Automatic Opening

**Files:**
- Create: `src/components/Abertura.test.tsx`
- Modify: `src/components/Abertura.tsx`
- Modify: `src/components/Cabecalho.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `site`, `navegacao`, `whatsappLink()` from Task 1.
- Produces: `Abertura` with settled content and disposable `[data-intro-mask]` layers; no ScrollTrigger or scroll-linked state.

- [ ] **Step 1: Read the Impeccable craft floor before UI edits**

Read `C:\Users\leand\.agents\skills\impeccable\reference\craft-floor.md` completely and apply its bans to all remaining UI tasks.

- [ ] **Step 2: Write the failing first-frame test**

Create `src/components/Abertura.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Abertura } from '@/components/Abertura';

vi.mock('gsap', () => ({
  default: { context: (callback: () => void) => (callback(), { revert: vi.fn() }), to: vi.fn() },
}));

describe('Abertura', () => {
  it('renders the complete offer and actions before animation', () => {
    render(<Abertura />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Produtos digitais para operações reais.',
    );
    expect(screen.getByRole('link', { name: 'Conversar sobre um projeto' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/5544997762271'),
    );
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute(
      'href',
      '#projetos',
    );
    expect(screen.queryByText(/role|bruto|corte|escala/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm test -- src/components/Abertura.test.tsx`

Expected: FAIL because the current heading is “Todo cliente me entrega bruto”, the link targets `#entregas`, and the component exposes scroll/scale language.

- [ ] **Step 4: Implement settled markup and mask-only motion**

Build the hero with this content hierarchy:

```tsx
<section id="abertura" className="hero shell">
  <div className="hero-copy">
    <p className="hero-kicker">Leandro Oliveira · Full stack · Produto</p>
    <h1>Produtos digitais para operações reais.</h1>
    <p>
      Eu transformo processos, integrações e dados em software que as pessoas
      conseguem usar no trabalho real.
    </p>
    <div className="hero-actions">
      <Botao href={whatsappLink()}>Conversar sobre um projeto</Botao>
      <Botao href="#projetos" variante="contorno">Ver projetos</Botao>
    </div>
  </div>
  <ul aria-label="Provas de experiência" className="hero-proof">
    <li><strong>Produto</strong><span>SaaS próprios em construção e operação.</span></li>
    <li><strong>Entrega</strong><span>Sistemas e sites publicados para negócios reais.</span></li>
    <li><strong>Operação</strong><span>Ferramenta interna usada por uma área de aproximadamente 80 pessoas.</span></li>
  </ul>
  <div aria-hidden className="intro-masks">
    <span data-intro-mask />
    <span data-intro-mask />
  </div>
</section>
```

In `useLayoutEffect`, animate only `[data-intro-mask]` out of the viewport when reduced motion is not requested. Do not set `opacity`, `visibility`, `scale`, or position on `.hero-copy` or `.hero-proof`. The section remains `min-height: 100svh`, never `175svh`.

Update `Cabecalho` to render `navegacao`, the handle, and one WhatsApp action. Remove timecode and playhead subscriptions.

Update `layout.tsx` to remove `Scroll` and `Transporte`, replace the old direction contract with the approved product/operations contract, and resolve:

```ts
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
```

- [ ] **Step 5: Run GREEN checks**

Run:

```powershell
npm test -- src/components/Abertura.test.tsx src/lib/site.test.ts
npm run typecheck
```

Expected: PASS; no ScrollTrigger import remains in `Abertura.tsx`.

- [ ] **Step 6: Commit**

```powershell
git add src/components/Abertura.tsx src/components/Abertura.test.tsx src/components/Cabecalho.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: add automatic direct portfolio opening"
```

---

### Task 4: Real Project Showcase, Status, Assets, and Case Route

**Files:**
- Create: `src/components/Projetos.test.tsx`
- Create: `src/components/Projetos.tsx`
- Create: `src/components/StatusProjeto.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/projetos/[slug]/page.tsx`
- Create: five images under `public/projetos/`
- Delete: `src/components/Entregas.tsx`

**Interfaces:**
- Consumes: `Projeto[]` and `ProjectStatus` from Task 2.
- Produces: `Projetos({ projetos }: { projetos: Projeto[] })` and `StatusProjeto({ status }: { status: ProjectStatus })`.

- [ ] **Step 1: Write failing project presentation tests**

Create `src/components/Projetos.test.tsx` with one published project and one image-less construction project:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Projetos } from '@/components/Projetos';
import type { Projeto } from '@/lib/content';

const projects: Projeto[] = [
  {
    slug: 'alinnea',
    titulo: 'Alinnea',
    resumo: 'CRM para psicólogos.',
    problema: 'Rotinas clínicas espalhadas.',
    resultado: 'Agenda e registros reunidos.',
    status: 'publicado',
    tipo: 'SaaS próprio',
    url: 'https://alinnea.com.br/',
    imagem: '/projetos/alinnea.webp',
    stack: ['Next.js'],
    destaque: true,
    ordem: 1,
    corpo: '',
  },
  {
    slug: 'radar-fiscal',
    titulo: 'Radar Fiscal',
    resumo: 'Monitoramento fiscal.',
    problema: 'Conferência manual não escala.',
    resultado: 'Exceções consolidadas.',
    status: 'em-construcao',
    tipo: 'SaaS próprio',
    stack: [],
    destaque: false,
    ordem: 4,
    corpo: '',
  },
];

describe('Projetos', () => {
  it('shows factual state and public action without requiring an image', () => {
    render(<Projetos projetos={projects} />);
    expect(screen.getByRole('heading', { name: 'Alinnea' })).toBeInTheDocument();
    expect(screen.getByText('Publicado')).toBeInTheDocument();
    expect(screen.getByText('Em construção')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visitar Alinnea' })).toHaveAttribute(
      'href',
      'https://alinnea.com.br/',
    );
    expect(screen.queryByText(/imagem pendente|demo fictícia/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/components/Projetos.test.tsx`

Expected: FAIL because `Projetos` and `StatusProjeto` do not exist.

- [ ] **Step 3: Implement status and showcase components**

Use this label map in `StatusProjeto.tsx`:

```ts
export const statusLabels = {
  publicado: 'Publicado',
  entregue: 'Entregue',
  'em-construcao': 'Em construção',
  demonstracao: 'Demonstração',
} as const;
```

`Projetos.tsx` renders the first three `destaque` entries as wide editorial rows and the remaining four in a compact two-column grid. Every entry includes type, text status, title, summary, problem, result, confirmed stack, an internal “Ver caso” link, and an external “Visitar {titulo}” link only when `url` exists. Use `next/image` only when `imagem` exists; image-less entries use typography, not a placeholder frame.

- [ ] **Step 4: Add safe project images**

- Capture settled public first viewports for Alinnea, Gabriela Lorenson, Ébano, and PetGest, crop to a consistent 16:10 frame, and export WebP at maximum 1600 px width.
- Copy `C:\Users\leand\OneDrive\Documentos\GitHub\ROADMAP-PROJETOS\roadmap-system\prints\visao_geral_calendario.png` to `public/projetos/roadmap.webp` after inspecting it at original resolution. If it contains personal or operational identifiers, blur/crop them before copying; do not publish it unchanged.
- Do not invent imagery for DocHub or Radar Fiscal.

- [ ] **Step 5: Update routes and run GREEN checks**

Replace `<Entregas>` with `<Projetos>` in `src/app/page.tsx`. Update the project detail route to show `resumo`, `problema`, `resultado`, `StatusProjeto`, optional image, external URL, confirmed stack, and rendered MDX body.

Run:

```powershell
npm test -- src/components/Projetos.test.tsx src/lib/content.test.ts
npm run typecheck
```

Expected: PASS; all seven project pages generate without missing-field errors.

- [ ] **Step 6: Commit**

```powershell
git add src/components/Projetos.tsx src/components/Projetos.test.tsx src/components/StatusProjeto.tsx src/app/page.tsx 'src/app/projetos/[slug]/page.tsx' public/projetos
git rm src/components/Entregas.tsx
git commit -m "feat: showcase real portfolio projects"
```

---

### Task 5: Applied Stack and Direct Working Method

**Files:**
- Create: `src/components/Stack.test.tsx`
- Create: `src/components/Stack.tsx`
- Modify: `src/components/Processo.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `stack` from Task 1.
- Produces: `Stack` section with `id="stack"`; `Processo` with direct three-step copy.

- [ ] **Step 1: Write the failing stack test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from '@/components/Stack';

describe('Stack', () => {
  it.each(['Python', 'Node.js', 'React', 'Next.js', 'C#'])(
    'shows %s with applied context',
    (technology) => {
      render(<Stack />);
      const heading = screen.getByRole('heading', { name: technology });
      expect(heading.parentElement).toHaveTextContent(/.{24,}/);
    },
  );
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/components/Stack.test.tsx`

Expected: FAIL because `Stack` does not exist.

- [ ] **Step 3: Implement the sections**

Render stack items as five typographic rows with a large technology name and a concrete description. Add a small secondary line:

```text
Também trabalho com NestJS, PostgreSQL, Prisma, SQL Server, APIs REST/SOAP e processamento de arquivos.
```

Replace current process copy with exactly three headings:

1. `Entendo a operação`
2. `Defino o que resolve primeiro`
3. `Construo e acompanho o uso`

Keep paragraphs focused on observation, scope, delivery, validation, and evolution. Remove “bruto”, “corto”, “corte final”, “passadas”, “marcadores de entrada e saída”, and editor UI decorations.

Place sections in `page.tsx` as `Abertura → Projetos → Stack → Processo`.

- [ ] **Step 4: Run GREEN checks**

Run:

```powershell
npm test -- src/components/Stack.test.tsx src/lib/site.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/Stack.tsx src/components/Stack.test.tsx src/components/Processo.tsx src/app/page.tsx
git commit -m "feat: connect applied stack to working method"
```

---

### Task 6: Factual Trajectory and Complete Contact Close

**Files:**
- Create: `src/components/Trajetoria.test.tsx`
- Create: `src/components/Trajetoria.tsx`
- Create: `src/components/Contato.test.tsx`
- Modify: `src/lib/carreira.ts`
- Modify: `src/components/Contato.tsx`
- Modify: `src/components/Rodape.tsx`
- Modify: `src/app/page.tsx`
- Delete: `src/components/QuemSou.tsx`

**Interfaces:**
- Produces: `carreira` with factual `periodo`, `titulo`, and `descricao`; `Trajetoria`; `Contato` with four real channels.

- [ ] **Step 1: Write failing trajectory and contact tests**

Create `src/components/Trajetoria.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Trajetoria } from '@/components/Trajetoria';

describe('Trajetoria', () => {
  it('uses factual milestones without authoring placeholders', () => {
    render(<Trajetoria />);
    expect(screen.getByText('2014')).toBeInTheDocument();
    expect(screen.getByText(/Delphi e Firebird/i)).toBeInTheDocument();
    expect(screen.getByText(/liderança técnica e operacional/i)).toBeInTheDocument();
    expect(screen.queryByText(/substitua|placeholder|pendente/i)).not.toBeInTheDocument();
  });
});
```

Create `src/components/Contato.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Contato } from '@/components/Contato';

describe('Contato', () => {
  it('renders all real channels', () => {
    render(<Contato />);
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5544997762271'),
    );
    expect(screen.getByRole('link', { name: 'leandroappa@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:leandroappa@gmail.com',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/lhsoliveira',
    );
    expect(screen.getByRole('link', { name: '@lhs.oliveira' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/lhs.oliveira',
    );
  });
});
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/components/Trajetoria.test.tsx src/components/Contato.test.tsx`

Expected: FAIL because the career is placeholder content and Instagram, LinkedIn, e-mail, and real WhatsApp are not all rendered.

- [ ] **Step 3: Implement the factual career data**

Replace `carreira` with these milestones:

```ts
export const carreira = [
  {
    periodo: '2014',
    titulo: 'Código, suporte e requisito',
    descricao: 'Comecei com Delphi e Firebird, apoiando suporte e validando requisitos diretamente com clientes.',
  },
  {
    periodo: '2016 — 2020',
    titulo: 'ERP por dentro da operação',
    descricao: 'Passei por help desk e retaguarda, trabalhando com banco de dados, rotinas corporativas e problemas reais de implantação.',
  },
  {
    periodo: '2020 — 2024',
    titulo: 'Implantação e liderança de retaguarda',
    descricao: 'Conduzi implantações, integrações e a evolução da retaguarda técnica, aproximando cliente, negócio e desenvolvimento.',
  },
  {
    periodo: '2025 — 2026',
    titulo: 'Projetos, dados e capacidade',
    descricao: 'Ajudei a estruturar a Retaguarda da Implantação e construí dashboards, indicadores e ferramentas para planejar trabalho e recursos.',
  },
  {
    periodo: 'Hoje',
    titulo: 'Produto e operação no mesmo trabalho',
    descricao: 'Atuo com liderança técnica e operacional, integrações, ferramentas internas, SaaS próprios e IA aplicada com validação humana.',
  },
] as const;
```

`Trajetoria` introduces the timeline with: “Conheço software pelos dois lados: o código que precisa se sustentar e a operação que precisa confiar nele.” Do not render a fake portrait frame when `site.retrato` is absent.

- [ ] **Step 4: Implement contact and footer**

Use the heading `Tem uma operação que ainda depende de planilha, retrabalho ou conferência manual?` and render four explicit links. Footer repeats handle, e-mail, LinkedIn, and Instagram with no cinema metaphors.

Place `Trajetoria → Notas → Contato` after `Processo` in `page.tsx`.

- [ ] **Step 5: Run GREEN checks**

Run:

```powershell
npm test -- src/components/Trajetoria.test.tsx src/components/Contato.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/lib/carreira.ts src/components/Trajetoria.tsx src/components/Trajetoria.test.tsx src/components/Contato.tsx src/components/Contato.test.tsx src/components/Rodape.tsx src/app/page.tsx
git rm src/components/QuemSou.tsx
git commit -m "feat: add factual trajectory and real contact channels"
```

---

### Task 7: Remove Timeline Infrastructure and Finish the Visual System

**Files:**
- Create: `src/components/Notas.test.tsx`
- Modify: `src/components/Notas.tsx`
- Modify: `src/components/Botao.tsx`
- Modify: `src/components/Titulo.tsx`
- Modify: `src/app/notas/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/opengraph-image.tsx`
- Modify: `package.json`, `package-lock.json`
- Delete: `src/components/Transporte.tsx`
- Delete: `src/components/Scroll.tsx`
- Delete: `src/lib/playhead.ts`
- Delete: `src/lib/secoes.ts`

**Interfaces:**
- Removes all runtime dependency on Lenis, global ScrollTrigger reveals, playhead, timecode, and timeline section navigation.
- Preserves GSAP only for the automatic opening mask.

- [ ] **Step 1: Write the failing public-language contract**

Keep the navigation guard in `src/lib/site.test.ts`:

```ts
it('keeps public navigation free of cinema object labels', () => {
  const labels = navegacao.map((item) => item.label).join(' ').toLowerCase();
  for (const banned of ['corte', 'clipe', 'claquete', 'timecode', 'transporte']) {
    expect(labels).not.toContain(banned);
  }
});
```

Create `src/components/Notas.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Notas } from '@/components/Notas';

describe('Notas', () => {
  it('positions writing around product and operations', () => {
    render(<Notas notas={[]} />);
    expect(
      screen.getByText('Reflexões sobre produto, integração, IA aplicada e software em operação.'),
    ).toBeInTheDocument();
  });
});
```

Change `Notas` so it always renders its section heading and introduction; an empty list hides only the article list. Add rendered assertions to the existing section tests so headings do not contain `bruto`, `corte`, `clipe`, or `claquete`.

- [ ] **Step 2: Run RED against the current rendered page copy**

Run: `npm test`

Expected: FAIL because the current empty `Notas` component returns `null` and does not render the new editorial positioning.

- [ ] **Step 3: Remove old infrastructure and dependency**

Remove component imports from layout, delete the four obsolete files, then run:

```powershell
npm uninstall lenis
```

Keep `gsap` because `Abertura` uses it. Remove all `ScrollTrigger` imports.

- [ ] **Step 4: Complete responsive styles and direct language**

In `globals.css`:

- Define page-scale black, graphite, warm-white, muted, line, mark, and mark-hover tokens.
- Replace safe-area guides, slate fields, transport rails, burn/timecode utilities, and camera HUD styles.
- Keep rectangular surfaces; no glowing edges, multicolor gradients, or generic icon-card grid.
- Set `scroll-margin-top` on section targets for the fixed header.
- Ensure the hero is readable from 320 px width and project rows collapse to one column.
- Add visible `:focus-visible` outlines using `#D4FF00`.
- Under reduced motion, disable the intro masks and all transitions without hiding content.

Rewrite notes metadata and copy around product, integration, IA applied, architecture, and process improvement. Update the OG image headline to “Produtos digitais para operações reais.”

- [ ] **Step 5: Run GREEN and production checks**

Run:

```powershell
npm test
npm run typecheck
npm run build
rg -n "Bruto|Corte final|Clipe|Claquete|Timecode|Role|Retrato pendente|PENDENTE" src content
```

Expected: tests, typecheck, and build pass; `rg` returns no visitor-facing legacy labels or placeholders. References inside historical design/spec documents are outside this scan.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json src/app src/components src/lib
git commit -m "refactor: remove editing timeline from portfolio shell"
```

---

### Task 8: Accessibility, Visual Verification, Impeccable Review, and Documentation

**Files:**
- Modify only files named by verified findings.
- Create: `DESIGN.md` and its Impeccable sidecar through the shipped documenter.
- Update: `.impeccable/surfaces/src-app-page-tsx.md` with the final direct product/operations direction.

**Interfaces:**
- Verifies the complete build; does not introduce new product scope.

- [ ] **Step 1: Run the complete mechanical suite**

Run:

```powershell
npm test
npm run typecheck
npm run build
node C:\Users\leand\.agents\skills\impeccable\scripts\detect.mjs --json src/app/page.tsx src/app/layout.tsx src/app/globals.css src/components/Abertura.tsx src/components/Projetos.tsx src/components/Stack.tsx src/components/Processo.tsx src/components/Trajetoria.tsx src/components/Contato.tsx
```

Expected: all code checks pass. Run the detector exactly once, after UI implementation is finished, and retain its JSON output for the finish review.

- [ ] **Step 2: Inspect desktop and mobile in one bounded round**

Start the production build and capture:

- Desktop: `1440 × 900`, first frame and settled state.
- Mobile: `390 × 844`, first frame and settled state.
- Reduced motion: one settled capture proving masks do not obscure content.

Check: first-frame legibility, automatic completion, no horizontal overflow, fixed-header clearance, image crop, status text, 44 px targets, keyboard focus, contact URLs, and absence of sensitive data.

- [ ] **Step 3: Apply one batched correction and confirm once**

Fix every material issue from the first round in one batch, rebuild once, then recapture desktop and mobile once. Stop local polishing after this confirmation round.

- [ ] **Step 4: Run the mandatory Impeccable finish review**

Use the shipped `impeccable-finish-reviewer` subagent with:

- Original request and approved focus.
- Contact additions.
- Artifact path `src/app/page.tsx`.
- Desktop, mobile, and reduced-motion screenshot paths.
- Direction contract from `layout.tsx`.
- Detector JSON.
- Approved spec and this plan.

Apply material findings in one batch, recapture, and return screenshots to the same reviewer for a resolved/partial/unresolved verdict. Respect the two-correction-round ceiling and report open items honestly.

- [ ] **Step 5: Document the built visual system**

Run the shipped `impeccable-documenter` with project root, `src/app/page.tsx`, the final direction contract, `PRODUCT.md`, and `C:\Users\leand\.agents\skills\impeccable\reference\document.md`. It must write `DESIGN.md` from the built result and update the sidecar.

Update the surface brief so it records:

- Mode: Persuade.
- Offer: products and systems for real operations.
- Cinema as structural language only.
- Automatic opening without scroll dependency.
- Real proof and contact channels.

- [ ] **Step 6: Run final verification and commit**

Run:

```powershell
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: all pass. Record exact outputs in the handoff; do not claim PASS for checks that were not executed.

```powershell
git add DESIGN.md .impeccable src content public package.json package-lock.json
git commit -m "docs: record final portfolio visual system"
```

## Plan Self-Review

- Spec coverage: opening, seven projects, stack, work method, trajectory, notes, contacts, responsive behavior, reduced motion, failure states, testing, visual review, and durable design documentation each map to a task.
- Placeholder scan: no implementation step delegates an unspecified TODO; remaining publication decisions are intentionally excluded from visitor-visible behavior.
- Type consistency: every consumer uses the `Projeto`, `ProjectStatus`, `site`, `stack`, `navegacao`, `carreira`, and `whatsappLink` signatures introduced before use.
- Scope: one cohesive home redesign with supporting content routes; no independent backend or CMS subsystem is included.
