'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ouvirPlayhead, timecode } from '@/lib/playhead';
import { site, whatsappLink } from '@/lib/site';

/**
 * A faixa queimada de cima. Sempre presente, sempre com o nome, o papel e a
 * ação primária — para que o visitante saiba quem é e o que fazer já no
 * primeiro frame, antes do recuo da câmera terminar.
 */
export function Cabecalho() {
  const [tc, setTc] = useState('00:00:00:00');

  useEffect(() => ouvirPlayhead((p) => setTc(timecode(p))), []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink">
      <div className="shell flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link
            href="/"
            className="title-tight shrink-0 text-[0.9375rem] tracking-[-0.01em] text-paper"
          >
            lhs<span className="text-mark">.</span>oliveira
          </Link>
          <span aria-hidden className="hidden h-3.5 w-px bg-line-strong sm:block" />
          <p className="burn hidden truncate text-mid sm:block">{site.papel}</p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <p className="burn hidden text-dim min-[400px]:block">
            <span className="sr-only">Posição na linha do tempo: </span>
            <span aria-hidden>TC </span>
            <span className="text-mid">{tc}</span>
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="burn bg-mark px-4 py-2.5 text-black transition-colors duration-200 hover:bg-mark-press"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
