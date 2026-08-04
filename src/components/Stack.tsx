import { stack } from '@/lib/site';
import { Titulo } from '@/components/Titulo';

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-titulo" className="border-t border-line bg-ink py-20 md:py-32">
      <div className="shell">
        <div id="stack-titulo">
          <Titulo apoio="Tecnologia entra como ferramenta de produto: cada escolha precisa servir à experiência, aos dados e à manutenção da operação.">
            Stack aplicada
          </Titulo>
        </div>

        <ol className="mt-14 border-b border-line md:mt-20">
          {stack.map((item, index) => (
            <li key={item.nome} className="grid gap-4 border-t border-line py-7 sm:grid-cols-[3rem_minmax(0,0.8fr)_minmax(16rem,1fr)] sm:items-baseline sm:gap-8 md:py-9">
              <span className="meta text-dim">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="title-tight text-2xl text-paper sm:text-3xl md:text-4xl">
                {item.nome}
              </h3>
              <p className="max-w-[52ch] text-sm leading-6 text-mid sm:text-base sm:leading-7">
                {item.descricao}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-[75ch] text-sm leading-6 text-mid">
          Também trabalho com NestJS, PostgreSQL, Prisma, SQL Server, APIs REST/SOAP e
          processamento de arquivos.
        </p>
      </div>
    </section>
  );
}
