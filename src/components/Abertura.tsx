'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Botao } from '@/components/Botao';
import { site, whatsappLink } from '@/lib/site';

/**
 * 00 — ABERTURA
 *
 * Close extremo: a palavra ocupa três vezes a largura da tela e você está
 * perto demais para ler. O scroll recua a câmera, e no meio do recuo há um
 * corte duro — BRUTO vira CORTE, cinco letras trocadas na mesma caixa, que é
 * exatamente o que um corte de cinema faz.
 *
 * Sem script ou com movimento reduzido, a página abre com a palavra enquadrada
 * e a headline inteira já em pé.
 */
export function Abertura() {
  const secao = useRef<HTMLElement>(null);
  const visor = useRef<HTMLDivElement>(null);
  const lede = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState('1,0');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      {
        anima: '(prefers-reduced-motion: no-preference)',
        parado: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { anima } = ctx.conditions as { anima: boolean; parado: boolean };
        const el = secao.current;
        if (!el) return;

        if (!anima) {
          // Sem movimento a página abre montada: a palavra já enquadrada, o
          // corte já feito, a headline em pé e o HUD de recuo fora do caminho.
          gsap.set('[data-palavra="bruto"]', { autoAlpha: 0 });
          gsap.set('[data-palavra="corte"]', { autoAlpha: 1 });
          gsap.set('[data-hud]', { autoAlpha: 0 });
          return;
        }

        // A pista de recuo só existe quando há movimento para recuar. Ela é
        // curta de propósito: uma passada de dedo já entrega a headline.
        gsap.set(el, { height: '175svh' });

        const INICIO = 2.6;
        const FIM_DO_RECUO = 0.52;

        // A palavra fica centrada no visor inteiro enquanto está em close, e
        // sobe exatamente o necessário para a headline caber embaixo dela. A
        // medida vem do próprio bloco, então celular e desktop se resolvem
        // sozinhos.
        const alturaLede = lede.current?.offsetHeight ?? 0;
        const subida = -Math.round(alturaLede / 2);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.55,
            onUpdate: (self) => {
              const e =
                INICIO + (1 - INICIO) * Math.min(1, self.progress / FIM_DO_RECUO);
              setEscala(e.toFixed(1).replace('.', ','));
            },
          },
        });

        tl.fromTo(
          '[data-palco]',
          { scale: INICIO, xPercent: 24, y: 0 },
          {
            scale: 1,
            xPercent: 0,
            y: subida,
            ease: 'power1.inOut',
            duration: FIM_DO_RECUO,
          },
          0,
        )
          // O corte acontece durante o movimento, não no repouso.
          .set('[data-palavra="bruto"]', { autoAlpha: 0 }, 0.34)
          .set('[data-palavra="corte"]', { autoAlpha: 1 }, 0.34)
          // O HUD desocupa a base antes da headline pousar nela.
          .to('[data-hud]', { autoAlpha: 0, duration: 0.12, ease: 'none' }, 0.3)
          .from(
            '[data-lede] > *',
            { y: 28, autoAlpha: 0, ease: 'expo.out', duration: 0.2, stagger: 0.05 },
            0.44,
          );

        return () => {
          gsap.set(el, { clearProps: 'height' });
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={secao}
      id="abertura"
      aria-label="Abertura"
      className="relative min-h-svh"
    >
      <div ref={visor} className="sticky top-0 h-svh overflow-hidden bg-ink">
        {/* Guias de área segura do visor. */}
        <Guias />

        <div className="absolute inset-0 grid place-items-center">
          <div
            data-palco
            className="relative w-full origin-center will-change-transform"
          >
            <p
              className="title text-center text-[21vw] leading-[0.86] text-paper"
              aria-hidden
            >
              <span data-palavra="bruto" className="block">
                Bruto
              </span>
              <span
                data-palavra="corte"
                className="absolute inset-x-0 top-0 block text-mark opacity-0"
              >
                Corte
              </span>
            </p>
          </div>
        </div>

        <div
          ref={lede}
          data-lede
          className="shell absolute inset-x-0 bottom-0 pb-20 md:pb-24"
        >
          <h1 className="title-tight max-w-[18ch] text-[2rem] text-paper sm:text-[2.75rem] md:max-w-[24ch] md:text-[3.5rem]">
            Todo cliente me entrega bruto.
            <br />
            Eu devolvo o corte.
          </h1>

          <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-relaxed text-mid sm:text-base">
            {site.papel}. Levanto o requisito como quem vai ter que codar depois — e
            entrego o sistema que faz o processo parar de doer.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Botao href={whatsappLink()}>Chamar no WhatsApp</Botao>
            <Botao href="#entregas" variante="contorno">
              Ver as entregas
            </Botao>
          </div>
        </div>

        {/* O HUD do visor ocupa a base enquanto a headline ainda não chegou:
            escala de enquadramento à esquerda, convite a rolar à direita. */}
        <div
          data-hud
          className="shell pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between pb-20 md:pb-24"
        >
          <p className="burn text-dim">
            <span aria-hidden>Esc {escala}:1</span>
            <span className="sr-only">Escala de enquadramento {escala} para 1</span>
          </p>
          <p className="burn flex items-center gap-3 text-dim">
            Role
            <span aria-hidden className="block h-px w-10 bg-dim" />
          </p>
        </div>
      </div>
    </section>
  );
}

/** As quatro quinas de área segura, como num visor de câmera. */
function Guias() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-5 z-10 md:inset-10">
      <span className="guide-corner top-0 left-0 border-t border-l" />
      <span className="guide-corner top-0 right-0 border-t border-r" />
      <span className="guide-corner bottom-0 left-0 border-b border-l" />
      <span className="guide-corner right-0 bottom-0 border-r border-b" />
    </div>
  );
}
