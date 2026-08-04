import type { Metadata, Viewport } from 'next';
import { Archivo, Martian_Mono } from 'next/font/google';
import { site } from '@/lib/site';
import { Transporte } from '@/components/Transporte';
import { Cabecalho } from '@/components/Cabecalho';
import { Rodape } from '@/components/Rodape';
import { Scroll } from '@/components/Scroll';
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} — ${site.papel}`,
    template: `%s — ${site.nome}`,
  },
  description: site.descricao,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.nome,
    title: `${site.nome} — ${site.papel}`,
    description: site.descricao,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
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
IMPECCABLE · CONTRATO DE DIREÇÃO · seed f1522d39 (reroll 2, índice 6)

THESIS: Todo cliente entrega bruto — longo, tremido, sem foco. O que ele devolve é o
corte. Recusa o portfólio de dev padrão: fundo escuro com accent neon, borda verde nos
cards, grid de fundo, grade de logos de stack.

OWN-WORLD: Mesa de edição. Preto de projeção (#0b0b0b) com uma camada gráfica queimada
por cima: hairlines, guias de área segura, timecode em mono tabular. Verde-limão
(#d4ff00) é a cor do marcador e do trecho selecionado, nunca decoração. Sem brilho,
sem sombra colorida, sem raio de canto. Archivo Expanded para título, Martian Mono
para a camada técnica.

STORY: O visitante entende em segundos que essa pessoa recebe processo bagunçado e
devolve sistema. Acredita porque vê o par bruto/corte de cada entrega, e não uma lista
de tecnologias. Age abrindo o WhatsApp.

FIRST VIEWPORT: Close extremo — a palavra BRUTO em escala 8x, cortada nos quatro lados,
timecode correndo no canto superior direito e guias de área segura nas quatro quinas.
O scroll recua a câmera; no meio do recuo há um corte duro para CORTE FINAL. Quando o
recuo termina, a headline e a ação primária (WhatsApp) pousam embaixo, à esquerda.

FORM: Mesa de edição, candidato 6 da lista fundamentada da rodada 3, encenado com
first-viewport-cropped-giant. Seed key f1522d39, reroll 2.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, and DESIGN.md
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${martian.variable}`}>
      <body className="bg-ink text-paper antialiased">
        <div hidden dangerouslySetInnerHTML={{ __html: `<!--${CONTRATO}-->` }} />
        <Scroll />
        <a
          href="#conteudo"
          className="burn sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-mark focus:px-4 focus:py-3 focus:text-black"
        >
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main id="conteudo">{children}</main>
        <Rodape />
        <Transporte />
      </body>
    </html>
  );
}
