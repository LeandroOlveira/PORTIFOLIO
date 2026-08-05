/**
 * Rolagem conduzida.
 *
 * O botão do hero não pula para o corredor: ele empurra a página no tempo
 * certo para que a abertura das portas aconteça na frente de quem clicou.
 * Um `scrollIntoView` suave do navegador não serve porque a duração é
 * decidida por ele, e aqui a duração é a própria animação.
 */

/** Fração da rolagem do corredor gasta abrindo as portas. */
export const FASE_PORTA = 0.9;

function embalo(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function rolarPara(alvo: number, duracao = 1800): void {
  const inicio = window.scrollY;
  const distancia = alvo - inicio;

  if (
    Math.abs(distancia) < 4 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.scrollTo(0, alvo);
    return;
  }

  let partida: number | undefined;
  let cancelado = false;

  // Qualquer gesto do visitante devolve o controle na hora.
  const abortar = () => {
    cancelado = true;
  };
  window.addEventListener('wheel', abortar, { passive: true, once: true });
  window.addEventListener('touchstart', abortar, { passive: true, once: true });
  window.addEventListener('keydown', abortar, { once: true });

  const passo = (agora: number) => {
    if (cancelado) return;
    partida ??= agora;
    const t = Math.min(1, (agora - partida) / duracao);
    window.scrollTo(0, inicio + distancia * embalo(t));

    if (t < 1) {
      requestAnimationFrame(passo);
    } else {
      window.removeEventListener('wheel', abortar);
      window.removeEventListener('touchstart', abortar);
      window.removeEventListener('keydown', abortar);
    }
  };

  requestAnimationFrame(passo);
}

/** Leva até o ponto em que as portas terminam de abrir. */
export function entrarNoCorredor(): void {
  const secao = document.getElementById('projetos');
  if (!secao) return;
  const topo = secao.getBoundingClientRect().top + window.scrollY;
  rolarPara(topo + window.innerHeight * FASE_PORTA);
}
