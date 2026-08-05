/**
 * A trajetória da câmera pelo corredor.
 *
 * Lógica pura, sem WebGL: dado o progresso de rolagem, devolve onde a câmera
 * está no eixo Z, qual estação está sendo enquadrada e o quanto ela está
 * enquadrada. A camada 3D e a camada de texto leem a mesma função, então o
 * título nunca aparece fora de registro com a imagem.
 *
 * O ritmo não é linear de propósito. Cada estação tem três tempos —
 * aproximação, retenção e travessia — e é a retenção que dá tempo de ler.
 * Um corredor de velocidade constante vira esteira.
 */

/**
 * Distância entre duas estações. A razão entre ela e a distância de quadro é
 * o que decide quantas chapas cabem na perspectiva ao mesmo tempo: em 24/10
 * a próxima chapa aparece com cerca de 40% do tamanho da atual, e a terceira
 * ainda é legível ao fundo. É daí que vem a sensação de corredor.
 */
export const ESPACAMENTO = 20;

/** Distância entre câmera e plano no instante em que ele está enquadrado. */
export const DISTANCIA_QUADRO = 10;

/** O quanto a câmera avança além do plano ao atravessá-lo. */
const TRAVESSIA = 4;

/**
 * Recuo inicial. Curto de propósito: a página abre com o corredor já formado
 * atrás do título, não com um vazio que só ganha conteúdo depois de rolar.
 */
const PARTIDA = 6;

/**
 * Deriva durante a retenção — a câmera nunca congela, só desacelera.
 *
 * Exportada porque a cena precisa dimensionar as chapas pela distância de
 * chegada real, e não pela de quadro: é aqui que a câmera termina.
 */
export const DERIVA = 1.1;

/**
 * Menor distância entre câmera e plano enquanto ele está enquadrado.
 *
 * Dimensionar em `DISTANCIA_QUADRO` e desenhar aqui é desenhar 12% maior do
 * que o medido, exatamente na fase em que a pessoa está lendo a captura.
 */
export const DISTANCIA_MINIMA = DISTANCIA_QUADRO - DERIVA;

const APROXIMACAO = 0.44;
const RETENCAO = 0.68;

export function smootherstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

export function easeIn(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x;
}

export function zDaEstacao(indice: number): number {
  return -indice * ESPACAMENTO;
}

/** Z da câmera no instante em que a estação está perfeitamente enquadrada. */
function zEnquadrado(indice: number): number {
  return zDaEstacao(indice) + DISTANCIA_QUADRO;
}

/** Z da câmera logo depois de atravessar a estação. */
function zAtravessado(indice: number): number {
  return zDaEstacao(indice) - TRAVESSIA;
}

export type PosicaoCamera = {
  z: number;
  /** Estação que domina o enquadramento agora. */
  indiceAtivo: number;
  /** 0 = longe ou já passou; 1 = enquadrada. */
  foco: number;
  /** Progresso dentro do segmento da estação ativa, 0..1. */
  local: number;
};

/**
 * @param progresso 0..1 da rolagem do corredor
 * @param total quantidade de estações
 */
export function posicaoCamera(progresso: number, total: number): PosicaoCamera {
  if (total <= 0) return { z: 0, indiceAtivo: 0, foco: 0, local: 0 };

  const p = Math.min(1, Math.max(0, progresso));
  const bruto = p * total;
  const indice = Math.min(total - 1, Math.floor(bruto));
  const local = Math.min(1, bruto - indice);

  const origem = indice === 0 ? zEnquadrado(0) + PARTIDA : zAtravessado(indice - 1);
  const enquadrado = zEnquadrado(indice);
  const retido = enquadrado - DERIVA;
  const atravessado = zAtravessado(indice);

  let z: number;
  let foco: number;

  if (local < APROXIMACAO) {
    const t = easeOut(local / APROXIMACAO);
    z = origem + (enquadrado - origem) * t;
    foco = smootherstep(local / APROXIMACAO);
  } else if (local < RETENCAO) {
    const t = (local - APROXIMACAO) / (RETENCAO - APROXIMACAO);
    z = enquadrado + (retido - enquadrado) * t;
    foco = 1;
  } else {
    const t = easeIn((local - RETENCAO) / (1 - RETENCAO));
    z = retido + (atravessado - retido) * t;
    foco = 1 - smootherstep((local - RETENCAO) / (1 - RETENCAO));
  }

  return { z, indiceAtivo: indice, foco, local };
}

/**
 * Deslocamento lateral de cada estação. O corredor não é um túnel de
 * quadrados centralizados: cada plano fica um pouco fora do eixo e a câmera
 * corrige para ele, o que lê como câmera acompanhando, não como esteira.
 */
export function desvioDaEstacao(indice: number): { x: number; y: number } {
  const alternado = indice % 2 === 0 ? 1 : -1;
  const amplitude = 2.2 + ((indice * 7) % 5) * 0.55;
  return {
    x: alternado * amplitude,
    y: ((indice * 3) % 4) * 0.5 - 0.75,
  };
}

/** Giro inicial do plano, que se alinha à câmera conforme entra em foco. */
export function giroDaEstacao(indice: number): number {
  const alternado = indice % 2 === 0 ? -1 : 1;
  return alternado * (0.1 + ((indice * 11) % 4) * 0.028);
}
