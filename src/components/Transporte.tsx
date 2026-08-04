'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ouvirPlayhead } from '@/lib/playhead';
import { secoes } from '@/lib/secoes';

/**
 * A barra de transporte. As seções são clipes e o cabeçote de reprodução é o
 * scroll: é a navegação, o indicador de progresso e a assinatura do mundo no
 * mesmo elemento.
 *
 * Fora da home ela vira uma faixa de retorno — a linha do tempo continua
 * sendo o lugar de onde tudo sai.
 */
export function Transporte() {
  const rota = usePathname();
  const [p, setP] = useState(0);
  const [ativa, setAtiva] = useState(0);

  const naHome = rota === '/';

  useEffect(() => {
    if (!naHome) return;
    return ouvirPlayhead(setP);
  }, [naHome]);

  useEffect(() => {
    if (!naHome) return;

    const alvos = secoes
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!alvos.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const i = alvos.indexOf(e.target as HTMLElement);
          if (i >= 0) setAtiva(i);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    alvos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [naHome]);

  if (!naHome) {
    return (
      <nav
        aria-label="Voltar"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink"
      >
        <div className="shell flex h-12 items-center">
          <Link
            href="/"
            className="burn group inline-flex items-center gap-3 text-mid transition-colors hover:text-mark"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">
              &larr;
            </span>
            Voltar para a linha do tempo
          </Link>
        </div>
      </nav>
    );
  }

  const atual = secoes[ativa];

  return (
    <nav
      aria-label="Seções desta página"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink"
    >
      {/* O cabeçote: uma linha só, atravessando a largura inteira. */}
      <div aria-hidden className="relative h-px bg-line">
        <div
          className="absolute inset-y-0 left-0 bg-mark"
          style={{ width: `${p * 100}%` }}
        />
        <div
          className="absolute top-0 h-2.5 w-px -translate-x-1/2 bg-mark"
          style={{ left: `${p * 100}%` }}
        />
      </div>

      {/* Celular: um clipe por vez, com o número e o nome da seção atual. */}
      <div className="shell flex h-12 items-center justify-between md:hidden">
        <p className="burn text-mid">
          <span className="text-mark">{atual.n}</span>
          <span className="mx-2 text-dim">/</span>
          {atual.nome}
        </p>
        <p className="burn text-dim">
          {String(Math.round(p * 100)).padStart(2, '0')}%
        </p>
      </div>

      {/* Desktop: a tira inteira de clipes. */}
      <ul className="hidden md:grid md:grid-cols-6">
        {secoes.map((s, i) => (
          <li key={s.id} className="border-l border-line first:border-l-0">
            <a
              href={`#${s.id}`}
              aria-current={i === ativa ? 'true' : undefined}
              className={`burn flex h-11 items-center gap-2.5 px-4 transition-colors duration-200 hover:text-paper ${
                i === ativa ? 'text-paper' : 'text-dim'
              }`}
            >
              <span className={i === ativa ? 'text-mark' : 'text-dim'}>{s.n}</span>
              <span className="truncate">{s.nome}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
