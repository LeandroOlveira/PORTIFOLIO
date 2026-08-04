import Image from 'next/image';
import { carreira, carreiraTemPlaceholder } from '@/lib/carreira';
import { site } from '@/lib/site';
import { Aviso } from '@/components/Selo';

/**
 * 03 — QUEM SOU
 *
 * A história de profissão como arquivo: entradas ordenadas numa tira, com
 * marcador em cada ponto de corte. É o lugar mais natural que esse mundo tem
 * para uma biografia, porque uma carreira já é uma linha do tempo.
 */
export function QuemSou() {
  return (
    <section id="quem-sou" className="border-t border-line bg-ink py-20 md:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[19rem_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Retrato />
            <p className="burn mt-5 text-mid">{site.nome}</p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-dim">{site.papel}</p>
          </div>

          <div>
            <div data-cut className="max-w-[46ch]">
              <h2 className="title text-[2rem] text-paper sm:text-[2.5rem] md:text-[3rem]">
                Como eu cheguei aqui
              </h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-mid sm:text-base">
                Quem contrata uma pessoa e não uma empresa está contratando um histórico.
                Então aqui está o meu, na ordem em que aconteceu.
              </p>
            </div>

            {carreiraTemPlaceholder ? (
              <div data-cut className="mt-8 max-w-[62ch]">
                <Aviso>
                  As entradas abaixo são um esqueleto para você preencher. Biografia não
                  é inventável — edite <code className="text-paper">src/lib/carreira.ts</code>{' '}
                  e apague a marca <code className="text-paper">placeholder</code> de cada
                  entrada. Este aviso some sozinho quando a última for substituída.
                </Aviso>
              </div>
            ) : null}

            <ol data-cut className="mt-14 md:mt-16">
              {carreira.map((m) => (
                <li
                  key={m.tempo}
                  data-cut-item
                  className="relative border-l border-line py-8 pl-8 first:pt-0 md:pl-12"
                >
                  {/* O tique de corte na régua. */}
                  <span
                    aria-hidden
                    className="absolute top-9 -left-px block h-px w-4 bg-mark first:top-1 md:w-6"
                  />
                  <p className="burn text-mark">{m.tempo}</p>
                  <h3 className="title-tight mt-4 text-[1.25rem] text-paper sm:text-[1.5rem]">
                    {m.titulo}
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-mid sm:text-base">
                    {m.texto}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Retrato() {
  if (site.retrato) {
    return (
      <div className="relative aspect-4/5 w-full border border-line">
        <Image
          src={site.retrato}
          alt={`Retrato de ${site.nome}`}
          fill
          sizes="(min-width: 1024px) 19rem, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  // Quadro vazio assumido: parece uma decisão, não um erro de carregamento.
  return (
    <div className="relative flex aspect-4/5 w-full items-center justify-center border border-line bg-panel">
      <span className="guide-corner top-3 left-3 border-t border-l" />
      <span className="guide-corner top-3 right-3 border-t border-r" />
      <span className="guide-corner bottom-3 left-3 border-b border-l" />
      <span className="guide-corner right-3 bottom-3 border-r border-b" />
      <p className="burn max-w-[16ch] text-center leading-relaxed text-dim">
        Retrato pendente
      </p>
    </div>
  );
}
