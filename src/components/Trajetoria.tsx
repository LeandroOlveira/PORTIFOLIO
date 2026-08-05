import { carreira } from '@/lib/carreira';
import { site } from '@/lib/site';
import { Titulo } from '@/components/Titulo';

export function Trajetoria() {
  return (
    <section id="trajetoria" aria-labelledby="trajetoria-titulo" data-motion-section="trajectory" className="border-t border-line bg-ink py-20 md:py-32">
      <div className="shell">
        <div id="trajetoria-titulo">
          <Titulo apoio="Conheço software pelos dois lados: o código que precisa se sustentar e a operação que precisa confiar nele.">
            Trajetória
          </Titulo>
        </div>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-[minmax(16rem,0.55fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="title-tight max-w-[18ch] text-2xl text-paper sm:text-3xl">
              {site.nomeCompleto}
            </p>
            <p className="mt-4 max-w-[36ch] text-sm leading-6 text-mid sm:text-base">
              Desenvolvimento full stack, produto e liderança conectados a mais de uma
              década de experiência com software dentro da operação.
            </p>
          </div>

          <ol data-trajectory-list className="border-b border-line">
            {carreira.map((marco) => (
              <li data-motion-item key={marco.periodo} className="grid gap-4 border-t border-line py-8 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8 md:py-10">
                <p className="meta text-mark">{marco.periodo}</p>
                <div>
                  <h3 className="title-tight text-xl text-paper sm:text-2xl">
                    {marco.titulo}
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-sm leading-6 text-mid sm:text-base sm:leading-7">
                    {marco.descricao}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
