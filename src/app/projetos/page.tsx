import type { Metadata } from 'next';
import Link from 'next/link';
import { StatusProjeto } from '@/components/StatusProjeto';
import { JsonLd } from '@/components/JsonLd';
import { getProjetos } from '@/lib/content';
import { site } from '@/lib/site';

const DESCRICAO =
  'Sistemas e produtos digitais construídos para operações reais: SaaS próprios, ferramentas internas e sites profissionais.';

export const metadata: Metadata = {
  // Mesma razão de /notas: o <h1> é a palavra seca, o título carrega o termo.
  title: 'Projetos — SaaS e sistemas para operação',
  description: DESCRICAO,
  alternates: { canonical: '/projetos' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/projetos',
    title: 'Projetos',
    description: DESCRICAO,
  },
};

/**
 * O índice que faltava.
 *
 * As sete páginas de projeto existiam sem página de categoria: `/projetos`
 * respondia 404, o breadcrumb pulava direto de "Início" para o projeto, e a
 * única porta de entrada era a seção da home — que é o corredor 3D, ótimo para
 * quem chega para olhar e ruim para quem chega procurando uma coisa específica.
 */
export default function ListaDeProjetos() {
  const projetos = getProjetos();

  const listaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projetos',
    description: DESCRICAO,
    url: `${site.url}/projetos`,
    hasPart: projetos.map((projeto) => ({
      '@type': 'CreativeWork',
      name: projeto.titulo,
      description: projeto.resumo,
      url: `${site.url}/projetos/${projeto.slug}`,
    })),
  };

  const trilhaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Projetos', item: `${site.url}/projetos` },
    ],
  };

  return (
    <div className="bg-ink pt-14">
      <JsonLd dados={listaJsonLd} />
      <JsonLd dados={trilhaJsonLd} />
      <div className="shell py-16 md:py-24">
        <h1 className="title text-[2.5rem] text-paper sm:text-[3.5rem] md:text-[4.5rem]">
          Projetos
        </h1>
        <p className="mt-6 max-w-[56ch] text-base leading-7 text-mid sm:text-lg">
          {DESCRICAO}
        </p>

        <ul className="mt-14 border-b border-line md:mt-20">
          {projetos.map((projeto) => (
            <li key={projeto.slug} className="border-t border-line">
              <Link
                href={`/projetos/${projeto.slug}`}
                className="group grid gap-4 py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline md:gap-10 md:py-10"
              >
                <div className="max-w-[58ch]">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <StatusProjeto status={projeto.status} />
                    <span className="meta text-dim">{projeto.tipo}</span>
                  </div>
                  <h2 className="title-tight mt-4 text-xl text-paper transition-colors group-hover:text-mark sm:text-2xl">
                    {projeto.titulo}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-mid sm:text-base">
                    {projeto.resumo}
                  </p>
                </div>
                <p className="meta text-dim md:text-right">{projeto.categoria}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
