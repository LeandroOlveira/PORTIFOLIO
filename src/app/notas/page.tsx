import type { Metadata } from 'next';
import Link from 'next/link';
import { dataCurta, getNotas } from '@/lib/content';
import { Selo } from '@/components/Selo';

export const metadata: Metadata = {
  title: 'Notas',
  description: 'Reflexões sobre produto, integração, IA aplicada e software em operação.',
};

export default function ListaDeNotas() {
  const notas = getNotas();

  return (
    <div className="bg-ink pt-14">
      <div className="shell py-16 md:py-24">
        <h1 className="title text-[2.5rem] text-paper sm:text-[3.5rem] md:text-[4.5rem]">
          Notas
        </h1>
        <p className="mt-6 max-w-[56ch] text-base leading-7 text-mid sm:text-lg">
          Reflexões sobre produto, integração, IA aplicada e software em operação.
        </p>

        {notas.length > 0 ? (
          <ul className="mt-14 border-b border-line md:mt-20">
            {notas.map((nota) => (
              <li key={nota.slug} className="border-t border-line">
                <Link href={`/notas/${nota.slug}`} className="group grid gap-4 py-8 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-baseline md:gap-10 md:py-10">
                  <time dateTime={nota.data} className="meta text-dim transition-colors group-hover:text-mark">
                    {dataCurta(nota.data)}
                  </time>
                  <div className="max-w-[58ch]">
                    <h2 className="title-tight text-xl text-paper transition-colors group-hover:text-mark sm:text-2xl">
                      {nota.titulo}
                    </h2>
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
        ) : (
          <p className="mt-14 border-t border-line pt-8 text-base text-mid">
            Novos textos serão publicados aqui.
          </p>
        )}
      </div>
    </div>
  );
}
