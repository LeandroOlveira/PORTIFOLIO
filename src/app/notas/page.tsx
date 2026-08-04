import type { Metadata } from 'next';
import Link from 'next/link';
import { dataCurta, getNotas } from '@/lib/content';
import { Selo } from '@/components/Selo';

export const metadata: Metadata = {
  title: 'Notas',
  description: 'O que eu aprendi apanhando, escrito antes de eu esquecer.',
};

export default function ListaDeNotas() {
  const notas = getNotas();

  return (
    <div className="bg-ink pt-14">
      <div className="shell py-16 md:py-24">
        <h1 className="title text-[2.25rem] text-paper sm:text-[3rem] md:text-[3.75rem]">
          Notas
        </h1>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-mid sm:text-lg">
          O que eu aprendi apanhando, escrito antes de eu esquecer. Sobre processo,
          escopo e o que acontece quando software encontra operação de verdade.
        </p>

        {notas.length === 0 ? (
          <p className="burn mt-16 border border-line bg-panel px-5 py-6 text-mid normal-case tracking-[0.06em]">
            Ainda não há notas publicadas. Crie um arquivo <code>.mdx</code> em{' '}
            <code>content/notas/</code> e ele aparece aqui.
          </p>
        ) : (
          <ul className="mt-14 md:mt-20">
            {notas.map((n) => (
              <li key={n.slug} className="border-t border-line">
                <Link
                  href={`/notas/${n.slug}`}
                  className="group grid gap-4 py-8 md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-10 md:py-10"
                >
                  <p className="burn text-dim transition-colors group-hover:text-mark">
                    {dataCurta(n.data)}
                  </p>
                  <div className="max-w-[58ch]">
                    <h2 className="title-tight text-[1.25rem] text-paper transition-colors group-hover:text-mark sm:text-[1.5rem]">
                      {n.titulo}
                    </h2>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-mid">
                      {n.resumo}
                    </p>
                    {n.demo ? (
                      <span className="mt-4 inline-block">
                        <Selo>Rascunho de exemplo</Selo>
                      </span>
                    ) : null}
                  </div>
                  <p className="burn text-dim md:text-right">{n.leitura}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
