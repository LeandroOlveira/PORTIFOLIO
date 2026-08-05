'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Projeto } from '@/lib/content';
import { StatusProjeto } from '@/components/StatusProjeto';
import { Botao, BotaoAcao } from '@/components/Botao';
import { whatsappLink } from '@/lib/site';
import { posicaoCamera, smootherstep } from '@/lib/corridor/path';
import { FASE_PORTA, entrarNoCorredor } from '@/lib/corridor/rolagem';
import type { Corredor as MotorCorredor, PerfilMovimento } from '@/lib/corridor/scene';

type Modo = 'documento' | 'corredor';

/** Abaixo disso a porta se parte na horizontal; acima, ao meio na vertical. */
const LARGURA_ESTREITA = 768;

/**
 * Ângulo final. Precisa ser 90° cheios: a 84° a folha ainda projeta uma faixa
 * larga junto à dobradiça, que cobria as bordas do corredor e o texto do
 * projeto. De perfil exato ela não ocupa área nenhuma.
 */
const ANGULO = 90;

/**
 * `useLayoutEffect` no cliente, `useEffect` no servidor.
 *
 * A decisão entre `documento` e `corredor` troca a árvore inteira — de um
 * empilhamento curto para um `sticky` de várias telas. Feita depois da
 * pintura, ela era o maior salto de layout da página (CLS 0,42, começando
 * 9ms depois do LCP). `canvas.getContext('webgl2')` é síncrono, então nada
 * justifica esperar o quadro seguinte para saber o modo. O alias existe só
 * porque `useLayoutEffect` não roda no servidor e o React avisa sobre isso.
 */
const useEfeitoDeLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * A abertura e o corredor, numa peça só.
 *
 * O hero não é uma seção que rola para fora: ele é a porta. Ocupa a primeira
 * tela inteira, e à primeira rolagem se parte ao meio — as duas metades são
 * empurradas para dentro, girando para longe de quem olha, e o que estava
 * atrás delas é o corredor com os projetos.
 *
 * O documento é a fonte da verdade: título, textos e links existem em HTML
 * real, e o modo `documento` — sem WebGL, sem JavaScript ou com movimento
 * reduzido — entrega o hero inteiro e os projetos empilhados, sem porta.
 */
export function Corredor({ projetos }: { projetos: Projeto[] }) {
  const [modo, setModo] = useState<Modo>('documento');
  const [vertical, setVertical] = useState(false);
  const pista = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const blocos = useRef<(HTMLDivElement | null)[]>([]);
  const folhaA = useRef<HTMLDivElement>(null);
  const folhaB = useRef<HTMLDivElement>(null);
  const sombraA = useRef<HTMLDivElement>(null);
  const sombraB = useRef<HTMLDivElement>(null);
  const medidor = useRef<HTMLSpanElement>(null);

  const total = projetos.length;

  useEfeitoDeLayout(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = tela.current;
    if (!canvas || !canvas.getContext('webgl2')) return;
    setModo('corredor');
  }, []);

  useEfeitoDeLayout(() => {
    if (modo !== 'corredor') return;
    const medir = () => setVertical(window.innerWidth < LARGURA_ESTREITA);
    medir();
    window.addEventListener('resize', medir, { passive: true });
    return () => window.removeEventListener('resize', medir);
  }, [modo]);

  useEffect(() => {
    if (modo !== 'corredor') return;

    const canvas = tela.current;
    const trilho = pista.current;
    if (!canvas || !trilho) return;

    let vivo = true;
    let motor: MotorCorredor | undefined;
    let quadro = 0;

    const estacoes = projetos.map((projeto) => ({
      id: projeto.slug,
      imagens: projeto.imagens.map((captura) => captura.src),
    }));

    const perfil: PerfilMovimento =
      window.innerWidth >= 1024 && (navigator.hardwareConcurrency || 4) >= 8
        ? 'full'
        : 'compact';

    void import('@/lib/corridor/scene')
      .then(({ criarCorredor }) => {
        if (!vivo) return;
        const criado = criarCorredor(canvas, estacoes, perfil);
        if (!criado) {
          setModo('documento');
          return;
        }
        motor = criado;
      })
      .catch(() => {
        if (vivo) setModo('documento');
      });

    // Uma leitura de layout por quadro alimenta porta, câmera e texto.
    function laco() {
      if (!vivo) return;
      quadro = requestAnimationFrame(laco);

      const caixa = trilho!.getBoundingClientRect();
      const curso = caixa.height - window.innerHeight;
      const cru = curso > 0 ? Math.min(1, Math.max(0, -caixa.top / curso)) : 0;

      const fracaoPorta = FASE_PORTA / (FASE_PORTA + total);
      const abertura = smootherstep(Math.min(1, cru / fracaoPorta));
      const dentro = Math.min(1, Math.max(0, (cru - fracaoPorta) / (1 - fracaoPorta)));

      // A viagem termina com a última chapa ainda enquadrada: sair do corredor
      // para uma tela preta é anticlímax.
      const progresso = dentro * ((total - 0.34) / total);
      motor?.atualizar(progresso);

      // As folhas giram em torno da própria borda externa e afundam um pouco,
      // que é o que separa "porta empurrada" de "painel escorregando".
      const angulo = abertura * ANGULO;
      const recuo = abertura * 14;
      const eixo = vertical ? 'rotateX' : 'rotateY';

      if (folhaA.current) {
        folhaA.current.style.transform = `translateZ(-${recuo}px) ${eixo}(${vertical ? -angulo : angulo}deg)`;
      }
      if (folhaB.current) {
        folhaB.current.style.transform = `translateZ(-${recuo}px) ${eixo}(${vertical ? angulo : -angulo}deg)`;
      }

      // A face perde luz conforme se afasta do eixo da câmera, e a folha
      // termina de sumir antes do fim do curso — o corredor precisa da tela
      // inteira quando a primeira chapa chega.
      const sombra = String(abertura * 0.68);
      const desaparece = String(1 - smootherstep((abertura - 0.68) / 0.27));
      const fechada = abertura < 0.04;
      const sumiu = abertura > 0.97;

      for (const [folha, sombraRef] of [
        [folhaA.current, sombraA.current],
        [folhaB.current, sombraB.current],
      ] as const) {
        if (sombraRef) sombraRef.style.opacity = sombra;
        if (!folha) continue;
        folha.style.opacity = desaparece;
        folha.style.visibility = sumiu ? 'hidden' : 'visible';
        folha.style.pointerEvents = fechada ? 'auto' : 'none';
        folha.setAttribute('aria-hidden', fechada ? 'false' : 'true');
      }

      const { indiceAtivo, foco } = posicaoCamera(progresso, total);

      for (let i = 0; i < total; i += 1) {
        const bloco = blocos.current[i];
        if (!bloco) continue;

        const alfa = i === indiceAtivo ? foco * abertura : 0;
        bloco.style.opacity = String(alfa);
        bloco.style.transform = `translate3d(0, ${(1 - alfa) * 26}px, 0)`;
        bloco.style.pointerEvents = alfa > 0.65 ? 'auto' : 'none';
        bloco.setAttribute('aria-hidden', alfa > 0.2 ? 'false' : 'true');
      }

      if (medidor.current) {
        const rotulo = `${indiceAtivo + 1} de ${total}`;
        if (medidor.current.textContent !== rotulo) medidor.current.textContent = rotulo;
      }
    }

    quadro = requestAnimationFrame(laco);

    return () => {
      vivo = false;
      cancelAnimationFrame(quadro);
      motor?.destruir();
    };
  }, [modo, total, vertical, projetos]);

  const noCorredor = modo === 'corredor';

  if (!noCorredor) {
    // Sem porta e sem câmera: o hero inteiro, depois os projetos empilhados.
    return (
      <>
        <section
          id="abertura"
          aria-labelledby="abertura-titulo"
          className="relative flex min-h-svh flex-col justify-end bg-ink pt-14"
        >
          <div className="shell w-full pb-16 md:pb-20">
            <div className="grid gap-x-16 gap-y-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
              <Titulo />
              <Chamada />
            </div>
          </div>
        </section>

        <section
          id="projetos"
          aria-labelledby="corredor-titulo"
          className="relative bg-black py-20 md:py-28"
        >
          <h2 id="corredor-titulo" className="sr-only">
            Projetos selecionados
          </h2>
          <div className="shell grid gap-20">
            <canvas ref={tela} aria-hidden="true" className="absolute h-0 w-0 opacity-0" />
            {projetos.map((projeto) => (
              <Ficha key={projeto.slug} projeto={projeto} empilhado />
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <section
      id="projetos"
      aria-labelledby="corredor-titulo"
      className="relative bg-black"
    >
      <h2 id="corredor-titulo" className="sr-only">
        Projetos selecionados
      </h2>
      <span id="abertura" className="sr-only" />

      <div
        ref={pista}
        style={{ height: `${(FASE_PORTA + total) * 100}svh` }}
        className="relative"
      >
        <div
          className="sticky top-0 h-svh overflow-hidden"
          style={{ perspective: '1500px', perspectiveOrigin: '50% 45%' }}
        >
          <canvas
            ref={tela}
            aria-hidden="true"
            className="absolute inset-0 block h-full w-full"
          />

          <div className="relative z-10 flex h-full flex-col justify-end">
            <Scrim />
            {projetos.map((projeto, indice) => (
              <div
                key={projeto.slug}
                ref={(node) => {
                  blocos.current[indice] = node;
                }}
                style={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end will-change-[opacity,transform]"
              >
                <div className="shell pb-16 md:pb-20">
                  <Ficha projeto={projeto} />
                </div>
              </div>
            ))}
          </div>

          {/* --- A porta: o próprio hero, partido ao meio ------------------
              O contêiner não recebe clique. Ele cobre a tela inteira em z-30,
              e as fichas dos projetos vivem em z-10: sem isto, a moldura da
              porta engole todo clique do corredor mesmo depois das folhas
              terem sumido, e "Conhecer projeto" e "Abrir site" ficam mortos.
              Quem decide o clique são as folhas, que alternam entre `auto` e
              `none` conforme a porta abre. */}
          <div
            className="pointer-events-none absolute inset-0 z-30"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Folha refFolha={folhaA} refSombra={sombraA} vertical={vertical} lado="a">
              <Titulo />
            </Folha>
            <Folha refFolha={folhaB} refSombra={sombraB} vertical={vertical} lado="b">
              <Chamada />
            </Folha>
          </div>

          <p
            aria-live="polite"
            className="meta pointer-events-none absolute top-24 right-5 z-20 text-dim md:right-10"
          >
            <span ref={medidor}>1 de {total}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Uma folha da porta. Gira em torno da borda externa — esquerda e direita no
 * desktop, topo e base no telefone, onde um corte horizontal tem muito mais
 * curso para percorrer.
 */
function Folha({
  refFolha,
  refSombra,
  vertical,
  lado,
  children,
}: {
  refFolha: React.RefObject<HTMLDivElement | null>;
  refSombra: React.RefObject<HTMLDivElement | null>;
  vertical: boolean;
  lado: 'a' | 'b';
  children: React.ReactNode;
}) {
  const primeira = lado === 'a';

  const caixa = vertical
    ? `inset-x-0 h-1/2 ${primeira ? 'top-0' : 'bottom-0'}`
    : `inset-y-0 w-1/2 ${primeira ? 'left-0' : 'right-0'}`;

  const origem = vertical
    ? primeira
      ? 'center top'
      : 'center bottom'
    : primeira
      ? 'left center'
      : 'right center';

  // O conteúdo encosta na junta: o título sobe até ela, a chamada desce dela.
  const alinhamento = vertical
    ? primeira
      ? 'items-end pb-8'
      : 'items-start pt-8'
    : 'items-end pb-16 md:pb-20';

  return (
    <div
      ref={refFolha}
      style={{ transformOrigin: origem, backfaceVisibility: 'hidden' }}
      // `pointer-events` é herdado, e o contêiner da porta não recebe clique.
      // Sem reabrir aqui, os botões do hero nasceriam mortos e só ganhariam
      // vida no primeiro quadro do laço, quando o estilo em linha assume.
      className={`pointer-events-auto absolute ${caixa} bg-ink will-change-transform`}
    >
      <div className={`flex h-full w-full ${alinhamento}`}>{children}</div>

      {/* Nenhuma marca na junta: fechada, a porta é uma tela preta inteira e
          nada denuncia que ela abre. A surpresa é o efeito. */}
      <div
        ref={refSombra}
        aria-hidden
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 bg-black"
      />
    </div>
  );
}

function Titulo() {
  return (
    <h1
      id="abertura-titulo"
      className="hero-title recuo-shell pr-5 text-paper md:pr-10"
    >
      Produtos digitais{' '}
      <span className="block text-mark">para operações reais.</span>
    </h1>
  );
}

function Chamada() {
  return (
    <div className="recuo-shell w-full pr-5 md:pr-10 lg:pl-16">
      <p className="max-w-[46ch] text-base leading-7 text-mid sm:text-lg sm:leading-8">
        Eu transformo processos, integrações e dados em software que as pessoas
        conseguem usar no trabalho real.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Botao href={whatsappLink()}>Conversar sobre um projeto</Botao>
        <BotaoAcao onClick={entrarNoCorredor}>Ver projetos</BotaoAcao>
      </div>
    </div>
  );
}

/** Escurece a base do quadro para o texto sobreviver sobre a captura. */
function Scrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black via-black/72 to-transparent"
    />
  );
}

function Ficha({ projeto, empilhado = false }: { projeto: Projeto; empilhado?: boolean }) {
  return (
    <article className={empilhado ? 'border-t border-line pt-10' : ''}>
      {empilhado && projeto.imagem ? (
        <img
          src={projeto.imagem}
          alt={`Interface do projeto ${projeto.titulo}`}
          className="mb-10 w-full border border-line"
          loading="lazy"
        />
      ) : null}

      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusProjeto status={projeto.status} />
            <span className="meta text-dim">{projeto.tipo}</span>
          </div>

          <h3 className="title mt-6 max-w-[16ch] text-[2.25rem] text-paper sm:text-[3rem] md:text-[3.75rem]">
            {projeto.titulo}
          </h3>

          <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-6 text-mid sm:text-base sm:leading-7">
            {projeto.resumo}
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <p className="meta text-mark">Resultado</p>
            <p className="mt-3 max-w-[46ch] text-sm leading-6 text-paper sm:text-base">
              {projeto.resultado}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={`/projetos/${projeto.slug}`}
              className="meta text-paper underline decoration-line-strong underline-offset-4 transition-colors hover:text-mark hover:decoration-mark"
            >
              Conhecer projeto
            </Link>
            {projeto.url ? (
              <a
                href={projeto.url}
                target="_blank"
                rel="noopener noreferrer"
                className="meta text-mid transition-colors hover:text-mark"
              >
                Abrir site ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
