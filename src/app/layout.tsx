import type { Metadata, Viewport } from 'next';
import { Archivo, Martian_Mono } from 'next/font/google';
import { site, stack } from '@/lib/site';
import { Cabecalho } from '@/components/Cabecalho';
import { JsonLd } from '@/components/JsonLd';
import { Movimento } from '@/components/Movimento';
import { Rodape } from '@/components/Rodape';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const martian = Martian_Mono({
  subsets: ['latin'],
  variable: '--font-martian',
  display: 'swap',
});

/*
 * Em produção o domínio real é o piso, não `localhost`. A variável de ambiente
 * continua tendo a palavra final (preview branches, staging), mas esquecê-la na
 * Vercel não pode mais publicar `og:image` apontando para a máquina de quem
 * buildou — que é exatamente o que acontecia antes.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === 'production' ? site.url : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.nome} — ${site.papel}`,
    template: `%s — ${site.nome}`,
  },
  description: site.descricao,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.nome,
    url: '/',
    title: `${site.nome} — ${site.papel}`,
    description: site.descricao,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

/**
 * Identidade legível por máquina. Os dados já estavam estruturados em
 * `site.ts` — aqui só são serializados no vocabulário que o buscador lê.
 */
const pessoaJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.nomeCompleto,
  alternateName: site.nome,
  jobTitle: site.papel,
  description: site.bio,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.github, site.linkedin, site.instagram],
  knowsAbout: stack.map((item) => item.nome),
};

export const viewport: Viewport = {
  themeColor: '#0b0b0b',
  colorScheme: 'dark',
};

/*
 * O contrato da direção vive no markup emitido (abaixo, no primeiro filho do
 * body) para que qualquer um consiga auditar a página contra a decisão que a
 * originou, inclusive depois do build de produção.
 */
const CONTRATO = `
IMPECCABLE · CONTRATO DE DIREÇÃO · revisão produto e operação

THESIS: Produtos digitais para operações reais. Recusa tanto o portfólio de dev reduzido
a logos quanto a experiência que obriga o visitante a decifrar uma metáfora antes da oferta.

OWN-WORLD: Preto profundo, grafite, branco quente e verde-limão (#d4ff00). Archivo largo
carrega a tese; Martian Mono fica restrita a tecnologia e dados. Cinema vive no ritmo,
enquadramento e cortes retangulares, nunca nos nomes da interface.

STORY: O visitante entende a oferta, encontra projetos reais, reconhece repertório técnico
e trajetória operacional, e abre um dos canais reais de contato.

FIRST VIEWPORT: Headline assimétrica já legível no HTML, duas faixas diagonais estreitas saem
automaticamente em menos de 1,2 segundo, e projetos ficam disponíveis no scroll seguinte.

FORM [SEED: spec-3b3faa8]: Portfólio editorial em movimento; uma abertura coreografada e o restante disciplinado.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, and DESIGN.md
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${martian.variable}`}>
      <body className="bg-ink text-paper antialiased">
        <div hidden dangerouslySetInnerHTML={{ __html: `<!--${CONTRATO}-->` }} />
        <JsonLd dados={pessoaJsonLd} />
        <a
          href="#conteudo"
          className="meta sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-mark focus:px-4 focus:py-3 focus:text-black"
        >
          Pular para o conteúdo
        </a>
        <Movimento />
        <Cabecalho />
        <main id="conteudo">{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
