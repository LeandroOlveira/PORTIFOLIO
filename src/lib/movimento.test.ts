import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { observarSecoes, observarTensao } from '@/lib/movimento';

/**
 * Um relógio de quadros controlado à mão.
 *
 * `observarTensao` mede uma derivada: quanto a página andou por unidade de
 * tempo. Testar isso com o `requestAnimationFrame` real seria testar o humor
 * do agendador — aqui cada quadro é avançado explicitamente, com intervalo
 * conhecido, e a velocidade passa a ser uma consequência aritmética.
 */
function relogioDeQuadros() {
  let agora = 0;
  let pendente: FrameRequestCallback | undefined;

  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    pendente = cb;
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {
    pendente = undefined;
  });

  return {
    /** Roda um quadro depois de `ms`. Devolve false quando o laço parou. */
    avancar(ms = 16.667): boolean {
      const cb = pendente;
      if (!cb) return false;
      pendente = undefined;
      agora += ms;
      cb(agora);
      return true;
    },
    get parado() {
      return pendente === undefined;
    },
  };
}

function rolarPara(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

function tensao(): number {
  return Number(document.documentElement.style.getPropertyValue('--tensao'));
}

describe('observarTensao', () => {
  let quadros: ReturnType<typeof relogioDeQuadros>;

  beforeEach(() => {
    quadros = relogioDeQuadros();
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('style');
  });

  it('sobe com a rolagem e volta a zero quando ela para', () => {
    const desligar = observarTensao();

    // Doze quadros de 60fps andando 140px cada: ~8400px/s, bem acima da
    // velocidade de referência, então a tensão satura em 1.
    let y = 0;
    for (let i = 0; i < 12; i += 1) {
      y += 140;
      rolarPara(y);
      quadros.avancar();
    }
    expect(tensao()).toBe(1);

    // Parado, sem novos eventos de rolagem: a queda é amortecida, não um
    // corte seco — é o que faz o eixo de largura assentar em vez de saltar.
    quadros.avancar();
    const logoApos = tensao();
    expect(logoApos).toBeLessThan(1);
    expect(logoApos).toBeGreaterThan(0.5);

    let voltas = 0;
    while (quadros.avancar() && voltas < 200) voltas += 1;

    expect(tensao()).toBe(0);
    desligar();
  });

  it('encerra o laço em repouso e não agenda quadro nenhum', () => {
    const desligar = observarTensao();

    rolarPara(600);
    while (quadros.avancar());

    // Sem quadro pendente, uma página parada não paga por um efeito que
    // ninguém está provocando.
    expect(quadros.parado).toBe(true);
    expect(tensao()).toBe(0);

    // E volta a acordar no próximo gesto.
    rolarPara(1200);
    expect(quadros.parado).toBe(false);

    desligar();
  });

  it('devolve a raiz ao estado original ao desligar', () => {
    const desligar = observarTensao();
    rolarPara(400);
    quadros.avancar();

    desligar();

    expect(document.documentElement.style.getPropertyValue('--tensao')).toBe('');
  });
});

describe('observarSecoes', () => {
  const observados: Element[] = [];
  let disparar: ((entradas: IntersectionObserverEntry[]) => void) | undefined;

  beforeEach(() => {
    observados.length = 0;
    document.body.innerHTML = `
      <main>
        <section id="projetos"></section>
        <section id="stack"></section>
        <section id="processo"></section>
        <section id="trajetoria"></section>
        <section id="notas"></section>
        <section id="contato"></section>
      </main>
    `;

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: (entradas: IntersectionObserverEntry[]) => void) {
          disparar = cb;
        }
        observe(alvo: Element) {
          observados.push(alvo);
        }
        disconnect() {
          observados.length = 0;
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  const entrar = (id: string) =>
    disparar?.([
      { isIntersecting: true, target: document.getElementById(id)! },
    ] as unknown as IntersectionObserverEntry[]);

  it('observa todas as seções, inclusive as que não estão na navegação', () => {
    const desligar = observarSecoes(['stack', 'contato'], () => {});

    expect(observados.map((no) => no.id)).toEqual([
      'projetos',
      'stack',
      'processo',
      'trajetoria',
      'notas',
      'contato',
    ]);

    desligar();
  });

  it('reporta a própria seção quando ela está na navegação', () => {
    const visto: string[] = [];
    const desligar = observarSecoes(['stack', 'trajetoria'], (id) => visto.push(id));

    entrar('trajetoria');

    expect(visto).toEqual(['trajetoria']);
    desligar();
  });

  it('reporta a entrada mais próxima acima quando a seção não tem link', () => {
    const visto: string[] = [];
    const desligar = observarSecoes(
      ['projetos', 'stack', 'trajetoria', 'contato'],
      (id) => visto.push(id),
    );

    // Ler "Processo" acende "Stack"; ler "Notas" acende "Trajetória". Sem
    // isto a marca ficaria parada na última seção acionada, e a navegação
    // apontaria para um lugar onde a pessoa não está.
    entrar('processo');
    entrar('notas');

    expect(visto).toEqual(['stack', 'trajetoria']);
    desligar();
  });

  it('não reporta nada quando não há entrada de navegação acima', () => {
    const visto: string[] = [];
    const desligar = observarSecoes(['contato'], (id) => visto.push(id));

    entrar('stack');

    expect(visto).toEqual(['']);
    desligar();
  });
});
