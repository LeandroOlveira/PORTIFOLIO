import { site, whatsappLink } from '@/lib/site';

export function Contato() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-mark text-black">
      <div className="shell py-20 md:py-32">
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
      className="group flex min-h-14 items-center justify-between gap-4 border-b border-black/30 py-4 text-sm font-semibold text-black transition-colors hover:bg-black hover:px-4 hover:text-mark sm:text-base"
    >
      {label}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        {external ? '↗' : '→'}
      </span>
    </a>
  );
}

