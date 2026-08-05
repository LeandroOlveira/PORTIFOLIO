import { describe, expect, it } from 'vitest';
import {
  DISTANCIA_QUADRO,
  ESPACAMENTO,
  posicaoCamera,
  zDaEstacao,
} from './path';

describe('posicaoCamera', () => {
  it('começa recuada, atrás do ponto de enquadramento da primeira estação', () => {
    const { z, indiceAtivo } = posicaoCamera(0, 5);
    expect(indiceAtivo).toBe(0);
    expect(z).toBeGreaterThan(zDaEstacao(0) + DISTANCIA_QUADRO);
  });

  it('avança sempre para o fundo, sem recuar em nenhum ponto', () => {
    let anterior = Infinity;
    for (let i = 0; i <= 400; i += 1) {
      const { z } = posicaoCamera(i / 400, 6);
      expect(z).toBeLessThanOrEqual(anterior + 1e-6);
      anterior = z;
    }
  });

  it('enquadra cada estação à distância de quadro durante a retenção', () => {
    const total = 4;
    for (let indice = 0; indice < total; indice += 1) {
      const progresso = (indice + 0.55) / total;
      const { z, indiceAtivo, foco } = posicaoCamera(progresso, total);

      expect(indiceAtivo).toBe(indice);
      expect(foco).toBe(1);
      expect(z - zDaEstacao(indice)).toBeGreaterThan(DISTANCIA_QUADRO - 2);
      expect(z - zDaEstacao(indice)).toBeLessThanOrEqual(DISTANCIA_QUADRO);
    }
  });

  it('atravessa a estação: ao fim do segmento a câmera está além do plano', () => {
    const { z } = posicaoCamera(0.999 / 3, 3);
    expect(z).toBeLessThan(zDaEstacao(0));
  });

  it('zera o foco nas bordas do segmento e mantém em 1 no meio', () => {
    expect(posicaoCamera(0, 3).foco).toBeCloseTo(0, 5);
    expect(posicaoCamera(0.5 / 3, 3).foco).toBe(1);
  });

  it('mantém o espaçamento declarado entre estações vizinhas', () => {
    expect(zDaEstacao(0) - zDaEstacao(1)).toBe(ESPACAMENTO);
  });

  it('não quebra sem estações', () => {
    expect(posicaoCamera(0.4, 0)).toEqual({ z: 0, indiceAtivo: 0, foco: 0, local: 0 });
  });
});
