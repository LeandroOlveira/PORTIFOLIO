import Link from 'next/link';
import type { Nota } from '@/lib/content';
import { dataCurta } from '@/lib/content';
import { Selo } from '@/components/Selo';
import { Titulo } from '@/components/Titulo';

export function Notas({ notas }: { notas: Nota[] }) {
  return (
    <section id="notas" aria-labelledby="notas-titulo" className="border-t border-line bg-black py-20 md:py-32">
      <div className="shell">
        <div id="notas-titulo">
          <Titulo
            apoio="Reflexões sobre produto, integração, IA aplicada e software em operação."
            acao={
              notas.length > 3 ? (
                <Link href="/notas" className="meta text-paper underline decoration-line-strong underline-offset-4 transition-colors hover:text-mark">
                  Todas as notas
                </Link>
              ) : undefined
            }
          >
            Notas
          </Titulo>
        </div>

        {notas.length > 0 ? (
          <ul className="mt-14 border-b border-line md:mt-20">
            {notas.slice(0, 3).map((nota) => (
              <li key={nota.slug} className="border-t border-line">
                <Link href={`/notas/${nota.slug}`} className="group grid gap-4 py-8 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-baseline md:gap-10 md:py-10">
                  <time dateTime={nota.data} className="meta text-dim transition-colors group-hover:text-mark">
                    {dataCurta(nota.data)}
                  </time>
                  <div className="max-w-[58ch]">
                    <h3 className="title-tight text-xl text-paper transition-colors group-hover:text-mark sm:text-2xl">
                      {nota.titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-mid sm:text-base">
                      {nota.resumo}
                    </p>
                    {nota.demo ? (
                      <span className="mt-4 inline-block">
                        <Selo>Texto em revisão</Selo>
                      </span>
                    ) : null}
                  </div>
                  <p className="meta text-dim md:text-right">{nota.leitura}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
