'use client';

import { useEffect } from 'react';
import { observarTensao } from '@/lib/movimento';

/**
 * Liga a tensão de rolagem e a desliga junto com a preferência do sistema.
 *
 * Não renderiza nada: o efeito inteiro é uma variável no elemento raiz. Sem
 * este componente — script bloqueado, hidratação ainda pendente — `--tensao`
 * permanece no valor inicial 0 e os títulos ficam na largura de sempre.
 */
export function Movimento() {
  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    let desligar: (() => void) | undefined;

    const sincronizar = () => {
      desligar?.();
      desligar = consulta.matches ? undefined : observarTensao();
    };

    sincronizar();
    consulta.addEventListener('change', sincronizar);

    return () => {
      consulta.removeEventListener('change', sincronizar);
      desligar?.();
    };
  }, []);

  return null;
}
