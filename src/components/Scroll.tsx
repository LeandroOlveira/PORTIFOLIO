'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * A inércia do scroll e a orquestração de entrada.
 *
 * Nada é escondido por CSS: cada entrada é um `gsap.from`, que só existe se
 * o script rodou. Se o JS falhar, a página inteira continua legível e montada.
 */
export function Scroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | undefined;
    let limpaTicker: (() => void) | undefined;

    if (!reduzido) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
        // Sem isto, os links de âncora da barra de transporte brigam com a
        // inércia e o scroll volta sozinho para onde estava.
        anchors: { offset: -56 },
      });

      // A instância precisa ser alcançável para qualquer scroll programático
      // — caso contrário o rAF do Lenis desfaz o window.scrollTo no quadro
      // seguinte.
      (window as unknown as Window & { lenis?: Lenis }).lenis = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      const tick = (tempo: number) => lenis?.raf(tempo * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      limpaTicker = () => gsap.ticker.remove(tick);
    }

    const ctx = gsap.context(() => {
      if (reduzido) return;

      // Uma entrada só, repetida com disciplina: o elemento sobe do escuro
      // com ease exponencial. Sem variação por seção, sem efeito espalhado.
      gsap.utils.toArray<HTMLElement>('[data-cut]').forEach((el) => {
        const filhos = el.querySelectorAll<HTMLElement>('[data-cut-item]');
        const alvos = filhos.length ? Array.from(filhos) : [el];

        gsap.from(alvos, {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: filhos.length ? 0.07 : 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // As réguas se desenham da esquerda, como um clipe sendo estendido.
      gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
      limpaTicker?.();
      lenis?.destroy();
    };
  }, []);

  return null;
}
