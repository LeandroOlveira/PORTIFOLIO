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

  /*
   * "Alinnea — lhs.oliveira" gastava 22 dos ~60 caracteres do título em dois
   * nomes próprios que ninguém busca. A categoria entra aqui, no campo de maior
   * peso, e não só na descrição, onde já estava.
   */
  const titulo = `${projeto.titulo} — ${projeto.categoria}`;

  /*
   * O `resumo` sozinho dava 40 a 65 caracteres num campo que mostra ~155 — o
   * resultado do projeto ficava de fora justamente do texto que decide o clique
   * quando o link aparece ao lado de outros seis. Os dois já estão escritos e
   * são a mesma verdade: o que o projeto é, e o que ele mudou. Emendá-los põe a
   * descrição na faixa de 107 a 141 sem inventar copy nem mexer no que a página
   * mostra — na tela o `resumo` continua sozinho, como subtítulo.
   */
  const descricao = `${projeto.resumo} ${projeto.resultado}`;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url: caminho,
      title: titulo,
      description: descricao,
      ...(capa ? { images: [capa] } : {}),
    },
  };
}

export default async function ProjetoPage({ params }: Props) {
  const { slug } = await params;
  const projeto = getProjeto(slug);
  if (!projeto) notFound();

  const endereco = `${site.url}/projetos/${projeto.slug}`;
  const outros = getProjetos().filter((p) => p.slug !== projeto.slug).slice(0, 3);

  const obraJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projeto.titulo,
    description: projeto.resumo,
    /*
     * `url` é a URL canônica da entidade descrita *nesta* página. Apontá-la para
     * o produto no ar — como estava — diz ao buscador que a página não é sobre
     * si mesma. O endereço externo é a mesma obra em outro lugar: `sameAs`.
     */
    url: endereco,
    mainEntityOfPage: { '@type': 'WebPage', '@id': endereco },
    ...(projeto.url ? { sameAs: [projeto.url] } : {}),
    creator: { '@type': 'Person', name: site.nomeCompleto, url: site.url },
    // Array vazio é ruído: quatro dos sete projetos não declaram stack.
    ...(projeto.stack.length > 0 ? { keywords: projeto.stack } : {}),
    ...(projeto.imagens.length > 0
      ? { image: projeto.imagens.map((captura) => `${site.url}${captura.src}`) }
      : {}),
  };

  const trilhaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Projetos', item: `${site.url}/projetos` },
      { '@type': 'ListItem', position: 3, name: projeto.titulo, item: endereco },
    ],
  };

  return (
    <article className="bg-ink pt-14">
      <JsonLd dados={obraJsonLd} />
      <JsonLd dados={trilhaJsonLd} />
      <div className="shell py-16 md:py-24">
        <Link
          href="/projetos"
          className="meta group inline-flex items-center gap-3 py-2 text-mid transition-colors hover:text-mark"
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
                  // Sem descrição escrita, o rótulo genérico é melhor que `alt=""`:
                  // a captura é a prova do projeto, não decoração.
                  alt={captura.alt ?? `Interface do projeto ${projeto.titulo}`}
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

        {outros.length > 0 ? (
          /*
           * Antes esta página emitia um único link interno — a home. Sete
           * projetos que não se citam são sete becos: quem chega por um deles
           * sai pelo mesmo lugar, e nenhum reforça o outro.
           */
          <nav aria-label="Outros projetos" className="mt-16 border-t border-line pt-10">
            <h2 className="meta text-dim">Outros projetos</h2>
            <ul className="mt-6 grid gap-px bg-line sm:grid-cols-3">
              {outros.map((outro) => (
                <li key={outro.slug} className="bg-black">
                  <Link
                    href={`/projetos/${outro.slug}`}
                    className="group block h-full p-5 transition-colors hover:bg-panel sm:p-6"
                  >
                    <span className="title-tight block text-lg text-paper transition-colors group-hover:text-mark">
                      {outro.titulo}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-mid">
                      {outro.categoria}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
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
