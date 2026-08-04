'use client';

import { useEffect, useRef, useState } from 'react';
import { Titulo } from '@/components/Titulo';

/**
 * 01 — PROCESSO
 *
 * Três passadas sobre o mesmo material. Não são três cards iguais: são três
 * trechos de uma tira, e só o trecho que está sendo lido carrega os marcadores
 * de entrada e saída acesos. Nada acende sem estar sendo trabalhado.
 */

const passadas = [
  {
    n: '01',
    titulo: 'Eu assisto o bruto inteiro',
    chamada: 'Diagnóstico',
    texto:
      'Antes de propor qualquer coisa eu quero ver o processo rodando do jeito que ele roda hoje: com a planilha, o WhatsApp, o papel e a gambiarra que ninguém documentou porque funciona. Requisito levantado por quem não vai codar depois vira retrabalho — e o retrabalho é sempre seu, não meu.',
    detalhe: 'Nesta fase eu ainda não vendi nada. Só perguntei.',
  },
  {
    n: '02',
    titulo: 'Corto o que não entra',
    chamada: 'Código',
    texto:
      'Escopo é decisão, não lista de desejo. Eu construo primeiro a parte que tira a dor e coloco no ar cedo, porque software que ninguém usou ainda não é software — é aposta. O resto entra depois, com a operação já falando comigo.',
    detalhe: 'O que fica de fora fica anotado, não esquecido.',
  },
  {
    n: '03',
    titulo: 'Entrego o corte, não o material bruto',
    chamada: 'Resultado',
    texto:
      'Você recebe um sistema rodando dentro da sua operação, com o código legível e documentado o suficiente para outra pessoa manter. Quem contrata um autônomo sênior não pode ficar refém dele — se você precisar de mim para o sistema respirar, eu falhei.',
    detalhe: 'Repositório seu, credenciais suas, saída limpa.',
  },
];

export function Processo() {
  const [ativa, setAtiva] = useState(0);
  const linhas = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const alvos = linhas.current.filter((el): el is HTMLLIElement => Boolean(el));
    if (!alvos.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtiva(alvos.indexOf(e.target as HTMLLIElement));
        }
      },
      { rootMargin: '-40% 0px -45% 0px' },
    );

    alvos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="processo" className="border-t border-line bg-ink py-20 md:py-32">
      <div className="shell">
        <Titulo apoio="Três passadas sobre o mesmo material. A primeira é a que quase ninguém faz, e é a que decide se as outras duas prestam.">
          Como eu trabalho
        </Titulo>

        <ol className="mt-14 md:mt-20">
          {passadas.map((p, i) => {
            const acesa = i === ativa;
            return (
              <li
                key={p.n}
                ref={(el) => {
                  linhas.current[i] = el;
                }}
                data-cut
                className="relative border-t border-line py-10 md:py-14"
              >
                {/* Marcadores de entrada e saída: acendem só na passada lida. */}
                <Marcador aceso={acesa} lado="entrada" />
                <Marcador aceso={acesa} lado="saida" />

                <div className="grid gap-6 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[9rem_minmax(0,1fr)_15rem] lg:gap-12">
                  <div className="flex items-baseline gap-4 md:block">
                    <p
                      className={`burn-lg transition-colors duration-300 ${
                        acesa ? 'text-mark' : 'text-dim'
                      }`}
                    >
                      {p.n}
                    </p>
                    <p className="burn mt-0 text-mid md:mt-3">{p.chamada}</p>
                  </div>

                  <div className="max-w-[58ch]">
                    <h3 className="title-tight text-[1.375rem] text-paper sm:text-[1.75rem] md:text-[2.125rem]">
                      {p.titulo}
                    </h3>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-mid sm:text-base">
                      {p.texto}
                    </p>
                  </div>

                  {/* A nota de margem: a frase curta que fecha a passada. */}
                  <p className="max-w-[34ch] border-t border-line pt-4 text-[0.875rem] leading-relaxed text-dim lg:border-t-0 lg:border-l lg:pt-1 lg:pl-6">
                    {p.detalhe}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/**
 * O colchete de entrada e de saída, como o par que delimita um trecho
 * selecionado num editor: um pé horizontal e uma haste vertical.
 */
function Marcador({ aceso, lado }: { aceso: boolean; lado: 'entrada' | 'saida' }) {
  const cor = aceso ? 'border-mark' : 'border-transparent';
  const pos = lado === 'entrada' ? 'top-0 border-t' : 'bottom-0 border-b';

  return (
    <span
      aria-hidden
      className={`absolute -left-px block h-5 w-3 border-l transition-colors duration-300 ${pos} ${cor}`}
    />
  );
}
