import Link from 'next/link';
import type { Nota } from '@/lib/content';
import { dataCurta } from '@/lib/content';
import { Selo } from '@/components/Selo';

/**
 * 04 — NOTAS
 *
 * O que eu penso sobre o trabalho, para quem está avaliando se quer trabalhar
 * comigo. Três na home; o resto vive em /notas.
 */
export function Notas({ notas }: { notas: Nota[] }) {
  if (!notas.length) return null;

  return (
    <section id="notas" className="border-t border-line bg-ink py-20 md:py-32">
      <div className="shell">
        <div data-cut className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[44ch]">
            <h2 className="title text-[2rem] text-paper sm:text-[2.5rem] md:text-[3rem]">
              Notas
            </h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-mid sm:text-base">
              O que eu aprendi apanhando, escrito antes de eu esquecer.
            </p>
          </div>

          {notas.length > 3 ? (
            <Link
              href="/notas"
              className="burn group inline-flex items-center gap-3 text-paper transition-colors hover:text-mark"
            >
              Todas as notas
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          ) : null}
        </div>

        <ul data-cut className="mt-12 md:mt-16">
          {notas.slice(0, 3).map((n) => (
            <li key={n.slug} data-cut-item className="border-t border-line">
              <Link
                href={`/notas/${n.slug}`}
                className="group grid gap-4 py-8 transition-colors md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-10 md:py-10"
              >
                <p className="burn text-dim transition-colors group-hover:text-mark">
                  {dataCurta(n.data)}
                </p>

                <div className="max-w-[58ch]">
                  <h3 className="title-tight text-[1.25rem] text-paper transition-colors group-hover:text-mark sm:text-[1.5rem]">
                    {n.titulo}
                  </h3>
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
      </div>
    </section>
  );
}
