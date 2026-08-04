import Link from 'next/link';
import type { Projeto } from '@/lib/content';
import { StatusProjeto } from '@/components/StatusProjeto';
import { Titulo } from '@/components/Titulo';

export function Projetos({ projetos }: { projetos: Projeto[] }) {
  const destaques = projetos.filter((projeto) => projeto.destaque);
  const demais = projetos.filter((projeto) => !projeto.destaque);

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="border-t border-line bg-black py-20 md:py-32">
      <div className="shell">
        <div id="projetos-titulo">
          <Titulo apoio="Produtos próprios, sistemas internos e trabalhos publicados. Em cada projeto, o foco está no problema operacional e no que passou a funcionar melhor.">
            Projetos selecionados
          </Titulo>
        </div>

        <div className="mt-14 grid gap-px bg-line md:mt-20 md:grid-cols-12">
          {destaques.map((projeto, index) => (
            <ProjetoCard
              key={projeto.slug}
              projeto={projeto}
              className={index === 0 ? 'md:col-span-7' : 'md:col-span-5'}
              destaque
            />
          ))}
        </div>

        {demais.length > 0 ? (
          <div className="mt-px grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {demais.map((projeto) => (
              <ProjetoCard key={projeto.slug} projeto={projeto} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjetoCard({
  projeto,
  destaque = false,
  className = '',
}: {
  projeto: Projeto;
  destaque?: boolean;
  className?: string;
}) {
  return (
    <article className={`group flex min-h-full flex-col bg-ink ${className}`}>
      {projeto.imagem ? (
        <div className={`overflow-hidden border-b border-line bg-panel ${destaque ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          <img
            src={projeto.imagem}
            alt={`Interface do projeto ${projeto.titulo}`}
            className="h-full w-full object-cover object-top grayscale transition duration-500 group-hover:grayscale-0"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className={`flex flex-1 flex-col ${destaque ? 'p-6 sm:p-8' : 'p-5 sm:p-6'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusProjeto status={projeto.status} />
          <span className="meta text-dim">{projeto.tipo}</span>
        </div>

        <h3 className={`title-tight mt-8 text-paper ${destaque ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
          {projeto.titulo}
        </h3>
        <p className="mt-4 text-sm leading-6 text-mid sm:text-base">{projeto.resumo}</p>

        {destaque ? (
          <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <p className="meta text-dim">Problema</p>
              <p className="mt-3 text-sm leading-6 text-mid">{projeto.problema}</p>
            </div>
            <div>
              <p className="meta text-mark">Resultado</p>
              <p className="mt-3 text-sm leading-6 text-paper">{projeto.resultado}</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 border-l border-mark pl-4 text-sm leading-6 text-paper">
            {projeto.resultado}
          </p>
        )}

        {projeto.stack.length > 0 ? (
          <ul aria-label={`Tecnologias de ${projeto.titulo}`} className="mt-7 flex flex-wrap gap-2">
            {projeto.stack.map((tecnologia) => (
              <li key={tecnologia} className="meta tag">
                {tecnologia}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
          <Link
            href={`/projetos/${projeto.slug}`}
            aria-label={`Conhecer o projeto ${projeto.titulo}`}
            className="meta text-paper underline decoration-line-strong underline-offset-4 transition-colors hover:text-mark hover:decoration-mark"
          >
            Conhecer projeto
          </Link>
          {projeto.url ? (
            <a
              href={projeto.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ${projeto.titulo}`}
              className="meta text-mid transition-colors hover:text-mark"
            >
              Abrir site ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
