'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Botao } from '@/components/Botao';
import { whatsappLink } from '@/lib/site';

export function Abertura() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      const masks = gsap.utils.toArray<HTMLElement>('[data-intro-mask]');
      gsap.set(masks, { autoAlpha: 1 });
      gsap.to(masks, {
        xPercent: 102,
        duration: 0.76,
        stagger: 0.12,
        ease: 'expo.inOut',
        delay: 0.08,
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={section}
      id="abertura"
      aria-labelledby="abertura-titulo"
      className="relative min-h-svh overflow-hidden bg-ink pt-14"
    >
      <div className="shell grid min-h-[calc(100svh-3.5rem)] content-between gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)] lg:grid-rows-[1fr_auto] lg:gap-x-20 lg:gap-y-10 lg:py-16">
        <div className="max-w-[65rem] self-center">
          <p className="meta mb-6 text-mark">Leandro Oliveira · Desenvolvedor full stack</p>
          <h1 id="abertura-titulo" className="hero-title text-paper">
            Produtos digitais{' '}
            <span className="block text-mark">para operações reais.</span>
          </h1>

          <p className="mt-8 max-w-[62ch] text-[1.0625rem] leading-7 text-mid sm:text-xl sm:leading-8">
            Eu transformo processos, integrações e dados em software que as pessoas
            conseguem usar no trabalho real.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Botao href={whatsappLink()}>Conversar sobre um projeto</Botao>
            <Botao href="#projetos" variante="contorno">
              Ver projetos
            </Botao>
          </div>
        </div>

        <p className="max-w-[48ch] self-end text-sm leading-6 text-mid sm:text-base">
          Desenvolvimento full stack, produto, dados e liderança técnica conectados à
          mesma pergunta: o que precisa funcionar melhor na operação?
        </p>

        <ul
          aria-label="Provas de experiência"
          className="grid self-end border-t border-line sm:grid-cols-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:grid-cols-1"
        >
          <Proof title="Produto">SaaS próprios em construção e operação.</Proof>
          <Proof title="Entrega">Sistemas e sites publicados para negócios reais.</Proof>
          <Proof title="Operação">
            Ferramenta interna usada por uma área de aproximadamente 80 pessoas.
          </Proof>
        </ul>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
        <span data-intro-mask className="intro-mask intro-mask-mark" />
        <span data-intro-mask className="intro-mask intro-mask-ink" />
      </div>
    </section>
  );
}

function Proof({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-2 border-b border-line py-4 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0 lg:border-r-0 lg:px-0 lg:first:pl-0">
      <strong className="text-sm font-semibold text-paper">{title}</strong>
      <span className="text-sm leading-5 text-mid">{children}</span>
    </li>
  );
}
