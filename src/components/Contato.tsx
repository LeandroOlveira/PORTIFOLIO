import { site, whatsappLink, contatoPendente } from '@/lib/site';

/**
 * 05 — CONTATO
 *
 * A claquete marca o começo de uma tomada, não o fim. É por isso que o fim da
 * página é a coisa mais clara dela: o único ponto do site em que o verde-limão
 * toma a tela inteira, porque é o único ponto em que ele é a ação.
 */
export function Contato() {
  return (
    <section id="contato" className="bg-mark text-black">
      <div className="shell py-20 md:py-32">
        <div data-cut className="max-w-[42ch]">
          <h2 className="title text-[2.25rem] sm:text-[3rem] md:text-[4rem]">
            Me conta como funciona hoje
          </h2>

          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-black/80 sm:text-lg">
            Sem proposta na primeira conversa e sem jargão. Me descreve o processo do
            jeito que ele acontece, com a planilha e a gambiarra inclusas. Se eu não for
            a pessoa certa para isso, eu falo — é mais barato para nós dois.
          </p>

          <div className="mt-10">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border-2 border-black px-7 py-4 font-mono text-[0.8125rem] font-semibold tracking-[0.16em] text-black uppercase transition-colors duration-200 hover:bg-black hover:text-mark"
            >
              Chamar no WhatsApp
              <span
                aria-hidden
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </div>

          {contatoPendente ? (
            <p className="burn mt-8 max-w-[52ch] leading-relaxed text-black/70 normal-case tracking-[0.06em]">
              O número de WhatsApp ainda é um placeholder. Troque{' '}
              <code className="font-semibold">whatsapp</code> em{' '}
              <code className="font-semibold">src/lib/site.ts</code> antes de publicar,
              ou este botão não leva a lugar nenhum.
            </p>
          ) : null}

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-black/25 pt-6">
            {site.github ? (
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="burn text-black/70 underline decoration-black/30 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
              >
                GitHub
              </a>
            ) : null}
            {site.linkedin ? (
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="burn text-black/70 underline decoration-black/30 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
              >
                LinkedIn
              </a>
            ) : null}
            {site.instagram ? (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="burn text-black/70 underline decoration-black/30 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
              >
                Instagram
              </a>
            ) : null}
            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                className="burn text-black/70 underline decoration-black/30 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
              >
                {site.email}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
