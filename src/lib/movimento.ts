/**
 * Movimento fora do corredor.
 *
 * O corredor tem WebGL e uma cena própria. O resto da página não precisa de
 * nada disso: quase toda a coreografia depois dele é resolvida pelo próprio
 * navegador com `animation-timeline: view()`, sem script nenhum.
 *
 * Sobram exatamente duas coisas que o CSS não alcança, e é só isso que vive
 * aqui: a velocidade da rolagem (nenhuma timeline expõe derivada) e qual
 * seção está sendo lida (nenhum seletor relaciona um atributo do documento
 * com o `href` de um link). Sem depender de biblioteca e sem laço em repouso.
 */

export type Desligar = () => void;

const PREFERE_REDUZIDO = '(prefers-reduced-motion: reduce)';

/** Velocidade tratada como "rolagem decidida" — o topo da escala de tensão. */
const VELOCIDADE_PLENA = 2600;

/** Quanto da tensão sobra a cada quadro de 60fps quando a rolagem afrouxa. */
const REPOUSO = 0.9;

/** Abaixo disto a tensão é indistinguível de zero e o laço se encerra. */
const LIMIAR = 0.002;

/**
 * Quadros de sobrevida concedidos a cada evento de rolagem.
 *
 * O primeiro quadro depois de acordar compara a posição atual com a do
 * instante do evento — e num gesto discreto (um clique de roda, um
 * `scrollTo`) essas duas posições são a mesma, então a leitura é zero. Sem
 * sobrevida o laço se encerraria aí, antes de medir qualquer coisa, e a
 * tensão só existiria para quem rola rápido e contínuo.
 */
const CARENCIA = 3;

export function movimentoReduzido(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia(PREFERE_REDUZIDO).matches
  );
}

/**
 * Tensão de rolagem em `--tensao`, de 0 (parado) a 1 (rolagem plena).
 *
 * A subida é imediata e a queda é amortecida: o tipo reage no instante do
 * gesto e leva um momento para assentar, que é o que faz o eixo de largura
 * parecer um material sob carga em vez de um valor sendo trocado.
 *
 * O laço só existe enquanto há movimento. Parado, nenhum quadro é agendado —
 * a página não paga nada por um efeito que ninguém está provocando.
 */
export function observarTensao(): Desligar {
  const raiz = document.documentElement;
  let anteriorY = window.scrollY;
  let anteriorT = 0;
  let tensao = 0;
  let quadro = 0;
  let rodando = false;
  let carencia = 0;

  const escrever = (valor: number) => {
    raiz.style.setProperty('--tensao', valor.toFixed(3));
  };

  const passo = (agora: number) => {
    // O primeiro quadro depois de acordar não tem intervalo confiável; 16ms
    // é a suposição correta e evita um pico de velocidade fantasma.
    const intervalo = anteriorT ? Math.min(64, agora - anteriorT) : 16;
    anteriorT = agora;

    const y = window.scrollY;
    const velocidade = (Math.abs(y - anteriorY) / intervalo) * 1000;
    anteriorY = y;

    const alvo = Math.min(1, velocidade / VELOCIDADE_PLENA);
    tensao =
      alvo > tensao ? alvo : tensao * Math.pow(REPOUSO, intervalo / 16.667);
    escrever(tensao);

    if (carencia > 0) carencia -= 1;

    if (tensao > LIMIAR || carencia > 0) {
      quadro = requestAnimationFrame(passo);
    } else {
      escrever(0);
      rodando = false;
      quadro = 0;
    }
  };

  const acordar = () => {
    carencia = CARENCIA;
    if (rodando) return;
    rodando = true;
    anteriorT = 0;
    // A posição do momento do evento, não a de quando o laço adormeceu: um
    // salto de âncora entre um gesto e outro viraria velocidade fantasma.
    anteriorY = window.scrollY;
    quadro = requestAnimationFrame(passo);
  };

  window.addEventListener('scroll', acordar, { passive: true });

  return () => {
    window.removeEventListener('scroll', acordar);
    if (quadro) cancelAnimationFrame(quadro);
    raiz.style.removeProperty('--tensao');
  };
}

/**
 * Avisa qual entrada da navegação corresponde ao que está sendo lido.
 *
 * A margem negativa reduz a raiz à fatia central da tela, então
 * "intersectando" passa a significar "é isto que a pessoa está lendo agora",
 * e não "aparece em algum lugar da tela" — que numa página de seções altas
 * seria sempre verdade para duas delas ao mesmo tempo.
 *
 * Nem toda seção tem entrada na navegação. Observar só as que têm deixaria a
 * marca parada na última acionada, e ler "Notas" com "Contato" aceso é pior
 * que não marcar nada. Então observamos todas e reportamos a entrada mais
 * próxima acima da seção lida: em "Processo" acende "Stack", em "Notas"
 * acende "Trajetória". A regra não depende da direção da rolagem, o que
 * evita a marca contar histórias diferentes na subida e na descida.
 */
export function observarSecoes(
  navegaveis: readonly string[],
  aoEntrar: (id: string) => void,
): Desligar {
  const secoes = Array.from(
    document.querySelectorAll<HTMLElement>('main > section[id]'),
  );

  if (secoes.length === 0) return () => {};

  const ordem = secoes.map((secao) => secao.id);

  const maisProximaAcima = (id: string): string => {
    for (let i = ordem.indexOf(id); i >= 0; i -= 1) {
      if (navegaveis.includes(ordem[i])) return ordem[i];
    }
    return '';
  };

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) aoEntrar(maisProximaAcima(entrada.target.id));
      }
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  );

  for (const secao of secoes) observador.observe(secao);

  return () => observador.disconnect();
}
