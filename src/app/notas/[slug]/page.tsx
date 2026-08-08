import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { dataCurta, getNota, getNotas } from '@/lib/content';
import { Selo } from '@/components/Selo';
import { AutorNota } from '@/components/AutorNota';
import { Botao } from '@/components/Botao';
import { JsonLd } from '@/components/JsonLd';
import { site, whatsappLink } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getNotas().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = getNota(slug);
  if (!n) return {};
  const caminho = `/notas/${n.slug}`;

  return {
    title: n.titulo,
    description: n.resumo,
    alternates: { canonical: caminho },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url: caminho,
      title: n.titulo,
      description: n.resumo,
      publishedTime: n.data,
    },
  };
}

export default async function Nota({ params }: Props) {
  const { slug } = await params;
  const n = getNota(slug);
  if (!n) notFound();

  const endereco = `${site.url}/notas/${n.slug}`;

  const notaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: n.titulo,
    description: n.resumo,
    datePublished: n.data,
    dateModified: n.data,
    inLanguage: site.locale,
    // O mesmo card que o WhatsApp mostra. A diretriz de Article pede imagem, e
    // gerar uma segunda só para o JSON-LD seria manter duas verdades.
    image: [`${endereco}/opengraph-image`],
    mainEntityOfPage: { '@type': 'WebPage', '@id': endereco },
    author: { '@type': 'Person', name: site.nomeCompleto, url: site.url },
    publisher: { '@type': 'Person', name: site.nomeCompleto, url: site.url },
  };

  const trilhaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Notas', item: `${site.url}/notas` },
      { '@type': 'ListItem', position: 3, name: n.titulo, item: endereco },
    ],
  };

  return (
    <article className="bg-ink pt-14">
      <JsonLd dados={notaJsonLd} />
      <JsonLd dados={trilhaJsonLd} />
      <div className="shell py-16 md:py-24">
        <Link
          href="/notas"
          className="meta group inline-flex items-center gap-3 text-mid transition-colors hover:text-mark"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Notas
        </Link>

        <h1 className="title-tight mt-10 max-w-[22ch] text-[2rem] text-paper sm:text-[2.75rem] md:text-[3.25rem]">
          {n.titulo}
        </h1>

        <div className="mt-8 flex max-w-[68ch] flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-4">
          <span className="meta text-mid">
            <time dateTime={n.data}>{dataCurta(n.data)}</time>
          </span>
          {n.leitura ? (
            <span className="meta text-mid">{n.leitura} de leitura</span>
          ) : null}
          {n.demo ? (
            <span className="ml-auto">
              <Selo>Rascunho de exemplo</Selo>
            </span>
          ) : null}
        </div>

        <div className="article-prose mt-12 max-w-[68ch]">
          <MDXRemote source={n.corpo} />
        </div>

        <AutorNota />

        <div className="mt-16 max-w-[68ch] border-t border-line pt-12">
          <p className="title-tight max-w-[26ch] text-[1.5rem] text-paper sm:text-[1.875rem]">
            Tem um processo aí que se parece com isso?
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Botao href={whatsappLink()}>Chamar no WhatsApp</Botao>
            {/* A nota argumenta; os projetos são a prova. Sem este link o texto
                terminava sem lugar para onde mandar quem se convenceu. */}
            <Link
              href="/projetos"
              className="meta group inline-flex items-center gap-3 py-2 text-mid transition-colors hover:text-mark"
            >
              Ver os projetos
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
