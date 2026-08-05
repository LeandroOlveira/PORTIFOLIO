import { site, whatsappLink } from '@/lib/site';

/**
 * A única superfície verde da página, e ela não desliza para dentro: é
 * aplicada. A chapa sobe sobre o preto e o conteúdo — que é preto — só
 * começa a existir depois que ela cobriu a tela. Os dois saem do mesmo
 * progresso, então não há como um adiantar o outro.
 */
export function Contato() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      data-motion-section="contact"
      className="placa text-black"
    >
      <div className="placa-conteudo shell py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-20">
          <div>
            <h2 id="contato-titulo" className="title max-w-[17ch] text-[2.4rem] sm:text-[3.5rem] md:text-[4.5rem]">
              Tem uma operação que ainda depende de planilha, retrabalho ou conferência manual?
            </h2>
            <p className="mt-7 max-w-[58ch] text-base leading-7 text-black/75 sm:text-lg">
              Me conte como o processo funciona hoje. Eu ajudo a transformar a necessidade
              em uma entrega clara, sem esconder a conversa atrás de jargão técnico.
            </p>
          </div>

          <div className="border-t-2 border-black">
            <ContactLink href={whatsappLink()} label="WhatsApp" external />
            <ContactLink href={`mailto:${site.email}`} label={site.email} />
            <ContactLink href={site.github} label="GitHub" external />
            <ContactLink href={site.linkedin} label="LinkedIn" external />
            <ContactLink href={site.instagram} label="@lhs.oliveira" external />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({ href, label, external = false }: { href: string; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-contact-link
      className="canal group flex min-h-14 items-center justify-between gap-4 border-b border-black/30 px-3 py-4 text-sm font-semibold text-black transition-colors duration-200 hover:text-mark focus-visible:text-mark sm:text-base"
    >
      {label}
      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1">
        {external ? '↗' : '→'}
      </span>
    </a>
  );
}
