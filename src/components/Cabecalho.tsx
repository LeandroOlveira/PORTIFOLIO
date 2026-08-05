'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { navegacao, whatsappLink } from '@/lib/site';
import { entrarNoCorredor } from '@/lib/corridor/rolagem';
import { observarSecoes } from '@/lib/movimento';

/** Só as seções que têm entrada aqui; as outras deixam a marca onde está. */
const SECOES = navegacao.map((item) => item.href.slice(1));

export function Cabecalho() {
  const [secaoAtiva, setSecaoAtiva] = useState('');

  useEffect(() => observarSecoes(SECOES, setSecaoAtiva), []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/95 backdrop-blur-sm">
      <div className="shell flex h-14 items-center justify-between gap-5">
        <Link
          href="/"
          className="title-tight shrink-0 text-[0.9375rem] tracking-[-0.01em] text-paper"
        >
          lhs<span className="text-mark">.</span>oliveira
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navegacao.map((item) => {
              const ativa = secaoAtiva === item.href.slice(1);

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    // Um salto de âncora para o corredor pousaria com as portas
                    // ainda fechadas, ou seja, numa tela preta. O link conduz a
                    // rolagem pela abertura, como o botão do hero.
                    onClick={
                      item.href === '#projetos'
                        ? (evento) => {
                            evento.preventDefault();
                            entrarNoCorredor();
                          }
                        : undefined
                    }
                    aria-current={ativa ? 'true' : undefined}
                    data-ativo={ativa ? '' : undefined}
                    className={`elo text-sm transition-colors ${
                      ativa ? 'text-paper' : 'text-mid hover:text-paper'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center bg-mark px-4 text-xs font-semibold tracking-[0.08em] text-black uppercase transition-colors hover:bg-mark-press"
        >
          WhatsApp
        </a>
      </div>

      {/* Quanto do documento já passou. Fica sobre a borda inferior porque é
          ali que a régua do cabeçalho já existia — a barra não acrescenta uma
          linha nova à página, ela colore a que estava lá. */}
      <div aria-hidden className="progresso" />
    </header>
  );
}
