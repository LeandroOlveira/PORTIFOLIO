# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated. Chosen: **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + MDX file-based content + GSAP/ScrollTrigger + Lenis**, deployed as a static-capable Next build (Vercel target).

Why this and not the alternatives, given the user's stated constraints ("chamativo", "MUITAS animações", "não deve ser estático — vou inserir projetos conforme forem terminando", "quero uma seção de blog"):

- **Content must grow without a rebuild of code.** Projects and blog posts live as MDX files in `content/`, read at build time with a typed loader. Adding a case = adding one `.mdx` file. No CMS bill, no database, git is the CMS.
- **Blog needs routing.** `/blog` index + `/blog/[slug]` and `/projetos/[slug]` are first-class App Router routes with per-page metadata, OG images, sitemap and RSS.
- **Heavy animation needs a client runtime.** GSAP + ScrollTrigger for scroll choreography, Lenis for inertial scroll. Framer/Motion is not used; one animation runtime avoids two competing scroll systems.
- **Matches the owner's own stack.** He sells React/Node/Nest work; the portfolio being a React app is itself consistent with the pitch.
- **Room to grow.** If a contact form, CMS, or auth is wanted later, the API layer already exists.

## Users

Four confirmed audiences, all landing on the same page and self-selecting:

1. **Dono de PME / responsável por operação** — não técnico. Tem um processo manual (planilha, WhatsApp, papel) que dói. Não está comprando "tecnologia"; está comprando o fim de um problema operacional. Julga por: entendo minha dor? consigo falar com essa pessoa hoje?
2. **Fundador de startup / product owner** — técnico ou semi-técnico. Precisa de senioridade para construir ou destravar produto. Julga por: arquitetura, velocidade de entrega, autonomia.
3. **Agência / outra software house** — contrata como especialista terceirizado ou white-label. Julga por: confiabilidade, stack, capacidade de entrar em código alheio.
4. **Recrutador / gestor de engenharia** — avalia para posição de longo prazo. Julga por: profundidade técnica demonstrada, não por lista de tecnologias.

Consequence for design: the page must prove seniority to a technical reader *without* becoming unreadable to a non-technical one. Technical depth is the substrate; plain-language outcome is the surface.

## Product Purpose

Portfólio pessoal e site de aquisição de **lhs.oliveira**, desenvolvedor full stack sênior autônomo que vende software sob demanda.

Success = a qualified stranger arrives, understands within seconds that this person diagnoses business processes and builds the software that fixes them, sees evidence that it is real, and opens WhatsApp.

Secondary success = the blog gives returning visitors and search a reason to come back, and gives recruiters/founders proof of thinking, not just proof of shipping.

## Positioning

Não é "desenvolvedor que aceita escopo". É **diagnóstico + construção**: levanta o requisito como quem vai ter que codar depois, e por isso o escopo que entrega é o escopo que resolve. O diferencial declarado pelo dono da marca: "Diagnóstico. Código. Resultado."

The claim a neighboring freelancer could not truthfully copy: he refuses to start from a feature list; he starts from the process that hurts.

## Operating Context

- Visitor arrives cold, most often from Instagram, LinkedIn, or a referral link pasted in WhatsApp. **Mobile-first is not a nicety; it is the majority case.**
- The evaluation is short and skeptical. Freelance-developer sites are a saturated, low-trust category.
- The conversion happens off-site, in WhatsApp, in a conversation. The site's job is to make that first message easy and informed, not to close a sale.
- Content is maintained by the owner himself, in his own repo, by writing MDX. Any authoring flow that requires him to touch React to publish a case is a failure of this design.

## Capabilities and Constraints

- Single locale: **Portuguese (pt-BR)**. No i18n requirement recorded.
- Must work on web and mobile (responsive; not a native app).
- Content types: **projetos/cases** and **blog posts**, both file-based MDX, both growing over time. The page must look correct with 2 cases and with 20.
- Primary conversion: **WhatsApp** (deep link). No backend form was requested; none is built.
- Animation is an explicit requirement from the owner ("MUITAS animações"), balanced against: must respect `prefers-reduced-motion`, must never hide content behind an animation that failed to fire, must not wreck mobile performance.
- **Undecided / not yet supplied by the owner:** real project names, screenshots, URLs, GitHub handle, WhatsApp number, Instagram handle, LinkedIn URL, domain. These ship as clearly marked placeholders on a replacement list.

## Brand Commitments

Binding, volunteered by the owner in the brief and preserved:

- Name/handle: **lhs.oliveira**.
- Accent color: **verde-limão `#D4FF00`**, and it is the *only* accent. No blues, reds, or multicolor gradients.
- Deep black ground `#0D0D0D` for authority/process passages.
- Restraint is the point: minimal palette, live angles (no rounded-pill aesthetic), abundant whitespace, no emoji in primary content, no autoplay spectacle.
- Voice: short sentences, full stops for emphasis ("Diagnóstico. Código. Resultado."), plain language over jargon, no hype. Genuine invitation over sales pressure ("Me conta como ele funciona hoje. Sem proposta prematura.").
- Reference the owner pinned for motion/feel: `vanholtz.co`.

Not binding: the specific type scale, Inter as the typeface, and the section-by-section layout in the owner's original guidelines document — he explicitly asked for improvements to it.

## Evidence on Hand

- **Real projects with screenshots and/or public URLs exist**, per the owner. Not yet handed over. Case entries ship as authored demonstration content, labeled, on the replacement list.
- **Public GitHub repositories exist** and are usable as technical proof. Handle not yet supplied.
- **No testimonials, no named clients, no benchmarks, no revenue or headcount metrics were supplied.** These must not be fabricated anywhere on the site. Any metric shown must come from the owner.

## Product Principles

1. **Prove, don't claim.** Seniority is shown by demonstrating the work and the reasoning, never by adjectives like "sênior" or "experiente" doing the load-bearing.
2. **The dor comes before the stack.** Every case leads with the process that hurt and the outcome; the technology list is a footnote, not a headline.
3. **Two readers, one page.** A non-technical operator and a staff engineer must both find their evidence without a toggle, a tab, or a second page.
4. **Content is a file, not a deploy ticket.** Publishing a case or a post is writing one MDX file. The design must degrade gracefully as that library grows.
5. **Never fabricate proof.** No invented clients, metrics, testimonials, or timelines — a marked placeholder is always better than a plausible lie.

## Accessibility & Inclusion

- WCAG AA contrast is a hard floor, including the `#D4FF00` accent, which fails on white for text sizes below large and must be used as ground/border, not as body text on light surfaces.
- Full keyboard operability with a visible focus ring in the accent color.
- `prefers-reduced-motion` must disable scroll choreography without removing content or breaking layout.
- Mobile is the majority case; touch targets ≥ 44px.
