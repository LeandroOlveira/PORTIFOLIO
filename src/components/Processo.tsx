import { Titulo } from '@/components/Titulo';

const etapas = [
  {
    numero: '01',
    titulo: 'Entendo a operação',
    texto:
      'Observo como o trabalho acontece hoje, converso com quem executa a rotina e separo a causa do problema dos sintomas. Planilhas, mensagens e exceções também fazem parte do requisito.',
    detalhe: 'Descoberta com contexto, dados e pessoas.',
  },
  {
    numero: '02',
    titulo: 'Defino o que resolve primeiro',
    texto:
      'Transformo a necessidade em uma entrega clara, priorizando o fluxo que reduz risco ou retrabalho mais cedo. O restante fica visível para evoluir sem confundir prioridade com esquecimento.',
    detalhe: 'Escopo explícito e decisão compartilhada.',
  },
  {
    numero: '03',
    titulo: 'Construo e acompanho o uso',
    texto:
      'Desenvolvo, publico e valido o software dentro da rotina real. O retorno de quem usa orienta ajustes, documentação e os próximos passos do produto.',
    detalhe: 'Entrega, validação e evolução contínua.',
  },
] as const;

export function Processo() {
  return (
    <section id="processo" aria-labelledby="processo-titulo" className="border-t border-line bg-black py-20 md:py-32">
      <div className="shell">
        <div id="processo-titulo">
          <Titulo apoio="Do entendimento ao uso, trabalho em ciclos curtos o suficiente para que a operação participe das decisões.">
            Como eu trabalho
          </Titulo>
        </div>

        <ol className="mt-14 grid gap-px bg-line md:mt-20 lg:grid-cols-3">
          {etapas.map((etapa) => (
            <li key={etapa.numero} className="flex min-h-full flex-col bg-ink p-6 sm:p-8">
              <span className="meta text-mark">{etapa.numero}</span>
              <h3 className="title-tight mt-10 text-2xl text-paper sm:text-3xl">
                {etapa.titulo}
              </h3>
              <p className="mt-5 text-sm leading-6 text-mid sm:text-base sm:leading-7">
                {etapa.texto}
              </p>
              <p className="mt-auto border-t border-line pt-6 text-sm leading-6 text-paper">
                {etapa.detalhe}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
