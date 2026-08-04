import Link from 'next/link';
import type { Projeto } from '@/lib/content';
import { Selo } from '@/components/Selo';
import { Titulo } from '@/components/Titulo';

/**
 * 02 — ENTREGAS
 *
 * Cada projeto é um clipe, e cada clipe carrega o par que sustenta a venda:
 * o material como ele chegou e o material como ele saiu. A comparação é a
 * prova — a lista de tecnologia é rodapé.
 */
export function Entregas({ projetos }: { projetos: Projeto[] }) {
  return (
    <section id="entregas" className="border-t border-line bg-black py-20 md:py-32">
      <div className="shell">
        <Titulo apoio="De cada projeto eu mostro as duas pontas: como o processo funcionava antes e o que passou a funcionar depois. Sem isso é só uma lista de tecnologias.">
          O que eu entreguei
        </Titulo>

        <div className="mt-14 md:mt-20">
          {projetos.map((p, i) => (
            <Clipe key={p.slug} projeto={p} indice={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Clipe({ projeto: p, indice }: { projeto: Projeto; indice: number }) {
  return (
    <article data-cut className="border-t border-line pb-14 md:pb-20">
      <div className="slate">
        <span className="slate-field burn">
          <span className="slate-key">Clipe</span>
          <span className="slate-val">{String(indice + 1).padStart(2, '0')}</span>
        </span>
        {p.ano ? (
          <span className="slate-field burn">
            <span className="slate-key">Ano</span>
            <span className="slate-val">{p.ano}</span>
          </span>
        ) : null}
        {p.setor ? (
          <span className="slate-field burn">
            <span className="slate-key">Setor</span>
            <span className="slate-val">{p.setor}</span>
          </span>
        ) : null}
        {p.duracao ? (
          <span className="slate-field burn">
            <span className="slate-key">Duração</span>
            <span className="slate-val">{p.duracao}</span>
          </span>
        ) : null}
        {p.demo ? (
          <span className="ml-auto">
            <Selo />
          </span>
        ) : null}
      </div>

      <h3 className="title-tight mt-8 max-w-[22ch] text-[1.5rem] text-paper sm:text-[2rem] md:text-[2.375rem]">
        {p.titulo}
      </h3>
      {p.linha ? (
        <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-mid sm:text-base">
          {p.linha}
        </p>
      ) : null}

      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-0">
        <Coluna
          rotulo="Bruto"
          itens={p.bruto}
          className="md:pr-10 lg:pr-16"
          tom="dim"
        />
        <Coluna
          rotulo="Corte final"
          itens={p.corte}
          className="border-t border-line pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10 lg:pl-16"
          tom="mark"
        />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <ul className="flex flex-wrap gap-2">
          {p.stack.map((t) => (
            <li key={t} className="burn tag">
              {t}
            </li>
          ))}
        </ul>

        <Link
          href={`/projetos/${p.slug}`}
          className="burn group inline-flex items-center gap-3 text-paper transition-colors hover:text-mark"
        >
          Abrir o caso
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}

function Coluna({
  rotulo,
  itens,
  className = '',
  tom,
}: {
  rotulo: string;
  itens: string[];
  className?: string;
  tom: 'dim' | 'mark';
}) {
  const marca = tom === 'mark';

  return (
    <div className={className}>
      <p className={`burn ${marca ? 'text-mark' : 'text-dim'}`}>{rotulo}</p>
      <ul className="mt-5 space-y-4">
        {itens.map((item) => (
          <li key={item} className="relative pl-6">
            <span
              aria-hidden
              className={`absolute top-[0.7em] left-0 block h-px w-3 ${
                marca ? 'bg-mark' : 'bg-dim'
              }`}
            />
            <span
              className={`text-[0.9375rem] leading-relaxed ${
                marca ? 'text-paper' : 'text-mid'
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
