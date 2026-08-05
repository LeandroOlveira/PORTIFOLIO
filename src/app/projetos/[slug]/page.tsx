import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Botao } from '@/components/Botao';
import { StatusProjeto } from '@/components/StatusProjeto';
import { JsonLd } from '@/components/JsonLd';
import { getProjeto, getProjetos } from '@/lib/content';
import { site, whatsappLink } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjetos().map((projeto) => ({ slug: projeto.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projeto = getProjeto(slug);
  if (!projeto) return {};

  const caminho = `/projetos/${projeto.slug}`;
  const capa = projeto.imagens[0]?.src;

  return {
    title: projeto.titulo,
    description: projeto.resumo,
    alternates: { canonical: caminho },
    openGraph: {
      type: 'article',
      url: caminho,
      title: projeto.titulo,
      description: projeto.resumo,
      ...(capa ? { images: [capa] } : {}),
    },
  };
}

export default async function ProjetoPage({ params }: Props) {
  const { slug } = await params;
  const projeto = getProjeto(slug);
  if (!projeto) notFound();

  const endereco = `${site.url}/projetos/${projeto.slug}`;

  const obraJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projeto.titulo,
    description: projeto.resumo,
    url: projeto.url ?? endereco,
    creator: { '@type': 'Person', name: site.nomeCompleto, url: site.url },
    keywords: projeto.stack,
    ...(projeto.imagens.length > 0
      ? { image: projeto.imagens.map((captura) => `${site.url}${captura.src}`) }
      : {}),
  };

  const trilhaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: site.url },
      { '@type': 'ListItem', position: 2, name: projeto.titulo, item: endereco },
    ],
  };

  return (
    <article className="bg-ink pt-14">
      <JsonLd dados={obraJsonLd} />
      <JsonLd dados={trilhaJsonLd} />
      <div className="shell py-16 md:py-24">
        <Link
          href="/#projetos"
          className="meta group inline-flex items-center gap-3 text-mid transition-colors hover:text-mark"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Projetos
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-end lg:gap-16">
          <div>
            <StatusProjeto status={projeto.status} />
            <h1 className="title-tight mt-6 max-w-[20ch] text-[2.5rem] text-paper sm:text-[3.5rem] md:text-[4.5rem]">
              {projeto.titulo}
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-7 text-mid sm:text-lg">
              {projeto.resumo}
            </p>
          </div>

          <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-1">
            <ProjectFact term="Tipo" description={projeto.tipo} />
            <ProjectFact term="Problema" description={projeto.problema} />
            <ProjectFact term="Resultado" description={projeto.resultado} emphasis />
          </dl>
        </div>

        {projeto.imagens.length > 0 ? (
          <div className="mt-14 grid gap-px bg-line md:mt-20">
            {projeto.imagens.map((captura, indice) => (
              <figure key={captura.src} className="bg-panel">
                <img
                  src={captura.src}
                  width={captura.largura}
                  height={captura.altura}
                  alt={
                    indice === 0
                      ? `Interface do projeto ${projeto.titulo}`
                      : `${projeto.titulo}, tela ${indice + 1} de ${projeto.imagens.length}`
                  }
                  // A captura é a prova, então ela aparece inteira. O corte em
                  // 16/9 escondia justamente o que a tela larga tinha a mostrar
                  // — e no DocHub, que é vertical, escondia metade.
                  className="block h-auto w-full"
                  loading={indice === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        ) : null}

        {projeto.stack.length > 0 ? (
          <ul aria-label="Tecnologias do projeto" className="mt-10 flex flex-wrap gap-2">
            {projeto.stack.map((tecnologia) => (
              <li key={tecnologia} className="meta tag">
                {tecnologia}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="article-prose mt-14 max-w-[68ch] border-t border-line pt-12 md:mt-20">
          <MDXRemote source={projeto.corpo} />
        </div>

        <div className="mt-14 flex flex-wrap gap-4 border-t border-line pt-10">
          {projeto.url ? (
            <Botao href={projeto.url}>Abrir projeto</Botao>
          ) : null}
          <Botao href={whatsappLink()} variante={projeto.url ? 'contorno' : 'marcador'}>
            Conversar sobre um projeto
          </Botao>
        </div>
      </div>
    </article>
  );
}

function ProjectFact({
  term,
  description,
  emphasis = false,
}: {
  term: string;
  description: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-black p-5 sm:p-6">
      <dt className={`meta ${emphasis ? 'text-mark' : 'text-dim'}`}>{term}</dt>
      <dd className={`mt-3 text-sm leading-6 ${emphasis ? 'text-paper' : 'text-mid'}`}>
        {description}
      </dd>
    </div>
  );
}
