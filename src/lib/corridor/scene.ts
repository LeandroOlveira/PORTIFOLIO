import * as THREE from 'three';
import {
  DISTANCIA_QUADRO,
  ESPACAMENTO,
  desvioDaEstacao,
  giroDaEstacao,
  posicaoCamera,
  zDaEstacao,
} from './path';
import { fragmentChapa, fragmentVeu, vertexChapa, vertexVeu } from './shaders';

export type PerfilMovimento = 'full' | 'compact';

export type EstacaoEntrada = {
  id: string;
  /** Vazio na abertura: a estação existe, mas não carrega chapa. */
  imagens: string[];
};

export type Corredor = {
  atualizar: (progresso: number) => void;
  redimensionar: () => void;
  destruir: () => void;
};

const COR_NEVOA = new THREE.Color('#050505');
const COR_MARCA = new THREE.Color('#d4ff00');

/** Quanto da altura visível a chapa ocupa quando enquadrada. */
const OCUPACAO_ALTURA = 0.62;

/**
 * Enquadramento por largura de tela.
 *
 * Uma captura widescreen numa tela vertical é sempre baixa — não há truque
 * que mude isso. Em vez de esticar a imagem, o telefone recebe outra ótica:
 * a chapa toma a largura inteira, sobe para o terço superior e os satélites
 * saem de cena. O corredor continua sendo corredor, com menos objetos.
 */
const ENQUADRAMENTO = {
  amplo: { largura: 0.86, elevacao: 0.12, satelites: 3, inclinacao: 0, seguimento: 0.82 },
  // A inclinação sobe o ponto de fuga: sem ela as chapas distantes convergem
  // para o centro da tela, que no telefone é justamente onde o título está.
  // A elevação fica baixa porque a inclinação já levanta o quadro inteiro —
  // somar as duas cortava a chapa enquadrada no topo. E a câmera centraliza
  // mais, porque num quadro estreito o desvio residual vira corte na borda.
  estreito: {
    largura: 0.9,
    elevacao: 0.1,
    satelites: 1,
    inclinacao: -0.075,
    seguimento: 0.96,
  },
} as const;

/** Quantas estações à frente têm textura carregada. */
const JANELA_ADIANTE = 4;
const JANELA_ATRAS = 1;

type Chapa = {
  malha: THREE.Mesh;
  material: THREE.ShaderMaterial;
  textura?: THREE.Texture;
  fonte: string;
  aspecto: number;
  /** 0 = chapa principal; >0 = satélites que passam pelas laterais. */
  ordem: number;
  carregando: boolean;
};

type Estacao = {
  id: string;
  grupo: THREE.Group;
  chapas: Chapa[];
  desvio: { x: number; y: number };
  giro: number;
};

export function criarCorredor(
  canvas: HTMLCanvasElement,
  entradas: EstacaoEntrada[],
  perfil: PerfilMovimento,
): Corredor | null {
  const contexto = canvas.getContext('webgl2', { antialias: false, alpha: true });
  if (!contexto) return null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context: contexto,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const tetoPixel = perfil === 'full' ? 2 : 1.5;
  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.5, ESPACAMENTO * 9);

  const carregador = new THREE.TextureLoader();
  const anisotropiaMax = renderer.capabilities.getMaxAnisotropy();
  const geometria = new THREE.PlaneGeometry(1, 1);

  const estacoes: Estacao[] = entradas.map((entrada, indice) => {
    const grupo = new THREE.Group();
    grupo.position.z = zDaEstacao(indice);
    cena.add(grupo);

    const desvio = desvioDaEstacao(indice);
    const giro = giroDaEstacao(indice);

    const chapas: Chapa[] = entrada.imagens.slice(0, 3).map((fonte, ordem) => {
      const material = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: vertexChapa,
        fragmentShader: fragmentChapa,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uMapa: { value: null },
          uNevoa: { value: COR_NEVOA },
          uMarca: { value: COR_MARCA },
          uOpacidade: { value: 0 },
          uDesfoque: { value: 0 },
          // A névoa serve à distância, não ao quadro: na chapa enquadrada ela
          // pesa menos de 3%, então a interface chega praticamente no tom do
          // arquivo.
          uDensidade: { value: 0.0032 },
          uMoldura: { value: 0.004 },
          uAspecto: { value: 1 },
          uBrilho: { value: ordem === 0 ? 1 : 0.86 },
        },
      });

      const malha = new THREE.Mesh(geometria, material);
      malha.visible = false;
      malha.renderOrder = ordem === 0 ? 2 : 1;
      grupo.add(malha);

      return { malha, material, fonte, aspecto: 16 / 9, ordem, carregando: false };
    });

    return { id: entrada.id, grupo, chapas, desvio, giro };
  });

  // --- Véu de projeção -----------------------------------------------------
  const veuMaterial = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertexVeu,
    fragmentShader: fragmentVeu,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uTempo: { value: 0 },
      uGrao: { value: perfil === 'full' ? 0.03 : 0.018 },
      uVinheta: { value: 0.5 },
    },
  });
  const veu = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), veuMaterial);
  veu.frustumCulled = false;
  veu.renderOrder = 999;
  cena.add(veu);

  // --- Dimensionamento -----------------------------------------------------
  let alturaVisivel = 1;
  let larguraVisivel = 1;
  let optica: (typeof ENQUADRAMENTO)[keyof typeof ENQUADRAMENTO] = ENQUADRAMENTO.amplo;

  function medirQuadro() {
    const rad = (camera.fov * Math.PI) / 180;
    alturaVisivel = 2 * DISTANCIA_QUADRO * Math.tan(rad / 2);
    larguraVisivel = alturaVisivel * camera.aspect;
    optica =
      (canvas.clientWidth || window.innerWidth) < 700
        ? ENQUADRAMENTO.estreito
        : ENQUADRAMENTO.amplo;
  }

  /** Escala a chapa para caber no quadro respeitando altura e largura. */
  function dimensionar(chapa: Chapa) {
    const porAltura = alturaVisivel * OCUPACAO_ALTURA;
    const porLargura = (larguraVisivel * optica.largura) / chapa.aspecto;
    const altura = Math.min(porAltura, porLargura) * (chapa.ordem === 0 ? 1 : 0.46);
    const largura = altura * chapa.aspecto;

    chapa.malha.scale.set(largura, altura, 1);
    chapa.material.uniforms.uAspecto.value = chapa.aspecto;

    // Satélites acima do limite da ótica atual saem de cena por completo.
    chapa.malha.userData.dispensado = chapa.ordem >= optica.satelites;

    if (chapa.ordem === 0) {
      chapa.malha.position.set(0, alturaVisivel * optica.elevacao, 0);
    } else {
      const lado = chapa.ordem === 1 ? -1 : 1;
      chapa.malha.position.set(
        lado * (largura * 0.9 + alturaVisivel * 0.22),
        alturaVisivel * (optica.elevacao + (chapa.ordem === 1 ? 0.1 : -0.1)),
        ESPACAMENTO * (chapa.ordem === 1 ? 0.2 : -0.16),
      );
    }
  }

  function redimensionar() {
    const largura = canvas.clientWidth || window.innerWidth;
    const altura = canvas.clientHeight || window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tetoPixel));
    renderer.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();

    medirQuadro();
    for (const estacao of estacoes) {
      for (const chapa of estacao.chapas) dimensionar(chapa);
    }
  }

  // --- Carregamento progressivo -------------------------------------------
  function carregar(chapa: Chapa) {
    if (chapa.textura || chapa.carregando) return;
    chapa.carregando = true;

    carregador.load(
      chapa.fonte,
      (textura) => {
        /**
         * Sem espaço de cor declarado, de propósito.
         *
         * Com `SRGBColorSpace` a GPU decodifica a textura para linear na
         * amostragem, mas a conversão de volta para sRGB na saída só acontece
         * nos materiais nativos do Three — um ShaderMaterial próprio escreve
         * direto no framebuffer. O resultado era a captura saindo bem mais
         * escura que o arquivo original. Mantendo tudo em espaço de tela, o
         * que aparece na chapa é o que está no PNG.
         */
        textura.colorSpace = THREE.NoColorSpace;
        textura.generateMipmaps = true;
        textura.minFilter = THREE.LinearMipmapLinearFilter;
        textura.magFilter = THREE.LinearFilter;
        textura.anisotropy = Math.min(8, anisotropiaMax);
        textura.needsUpdate = true;

        chapa.textura = textura;
        chapa.aspecto = textura.image.width / textura.image.height;
        chapa.material.uniforms.uMapa.value = textura;
        chapa.carregando = false;
        dimensionar(chapa);
      },
      undefined,
      () => {
        // Uma captura ausente não pode derrubar a viagem: a estação segue
        // existindo, apenas sem chapa.
        chapa.carregando = false;
      },
    );
  }

  function descarregar(chapa: Chapa) {
    if (!chapa.textura) return;
    chapa.material.uniforms.uMapa.value = null;
    chapa.textura.dispose();
    chapa.textura = undefined;
    chapa.malha.visible = false;
  }

  // --- Ponteiro ------------------------------------------------------------
  const alvoPonteiro = { x: 0, y: 0 };
  const ponteiro = { x: 0, y: 0 };

  function aoMover(evento: PointerEvent) {
    alvoPonteiro.x = (evento.clientX / window.innerWidth - 0.5) * 2;
    alvoPonteiro.y = (evento.clientY / window.innerHeight - 0.5) * 2;
  }

  if (perfil === 'full') window.addEventListener('pointermove', aoMover, { passive: true });

  // --- Laço ----------------------------------------------------------------
  let progressoAlvo = 0;
  let progressoSuave = 0;
  let quadro = 0;
  let vivo = true;
  let contador = 0;

  function atualizar(progresso: number) {
    progressoAlvo = Math.min(1, Math.max(0, progresso));
  }

  function desenhar() {
    if (!vivo) return;
    quadro = requestAnimationFrame(desenhar);

    // Inércia: o corredor continua andando um instante depois do dedo parar,
    // sem atrasar a ponto de a câmera parecer presa atrás da rolagem.
    progressoSuave += (progressoAlvo - progressoSuave) * 0.14;
    ponteiro.x += (alvoPonteiro.x - ponteiro.x) * 0.05;
    ponteiro.y += (alvoPonteiro.y - ponteiro.y) * 0.05;

    const total = estacoes.length;
    const { z, indiceAtivo, foco } = posicaoCamera(progressoSuave, total);

    const desvioAtivo = estacoes[indiceAtivo]?.desvio ?? { x: 0, y: 0 };
    camera.position.z = z;
    // A câmera acompanha a estação ativa, mas nunca a centraliza por completo:
    // o resto do desvio é o que mantém o enquadramento vivo em vez de simétrico.
    const segue = optica.seguimento;
    camera.position.x += (desvioAtivo.x * foco * segue - camera.position.x) * 0.06;
    camera.position.y += (desvioAtivo.y * foco * segue - camera.position.y) * 0.06;
    camera.rotation.y = -ponteiro.x * 0.026;
    camera.rotation.x = optica.inclinacao - ponteiro.y * 0.018;

    for (let i = 0; i < total; i += 1) {
      const estacao = estacoes[i];
      const distancia = camera.position.z - estacao.grupo.position.z;
      const janela = i - indiceAtivo;

      if (janela <= JANELA_ADIANTE && janela >= -JANELA_ATRAS) {
        for (const chapa of estacao.chapas) carregar(chapa);
      } else if (janela > JANELA_ADIANTE + 1 || janela < -JANELA_ATRAS - 1) {
        for (const chapa of estacao.chapas) descarregar(chapa);
      }

      // Fora do alcance da câmera ou já atravessada: não desenha.
      const visivel = distancia > 0.6 && distancia < ESPACAMENTO * (JANELA_ADIANTE + 1);

      estacao.grupo.position.x = estacao.desvio.x;
      estacao.grupo.position.y = estacao.desvio.y;

      for (const chapa of estacao.chapas) {
        if (!visivel || !chapa.textura || chapa.malha.userData.dispensado) {
          chapa.malha.visible = false;
          continue;
        }

        chapa.malha.visible = true;

        // Entra da névoa, some ao ser atravessada.
        const chegada = Math.min(1, distancia / (ESPACAMENTO * 2.4));
        const saida = Math.min(1, Math.max(0, (distancia - 0.6) / 5.5));
        chapa.material.uniforms.uOpacidade.value = (1 - chegada * 0.15) * saida;

        // Profundidade de campo: nítido no quadro, difuso longe e ao passar.
        // A curva é suave de propósito — a chapa seguinte precisa continuar
        // reconhecível como uma interface, não virar um borrão cinza.
        const erro = Math.abs(distancia - DISTANCIA_QUADRO) / ESPACAMENTO;
        chapa.material.uniforms.uDesfoque.value = Math.min(4, erro * 2.1);

        // A moldura é medida em UV, então encolheria junto com a chapa e
        // sumiria no fundo. Compensada pela distância, ela mantém espessura
        // constante em pixels — e é essa linha repetida fugindo para o ponto
        // de fuga que faz o conjunto ler como corredor, não como colagem.
        const compensacao = Math.min(5, Math.max(1, distancia / DISTANCIA_QUADRO));
        chapa.material.uniforms.uMoldura.value = 0.0016 * chapa.aspecto * compensacao;

        // A chapa se alinha à câmera conforme entra em foco.
        chapa.malha.rotation.y = estacao.giro * (1 - foco * (i === indiceAtivo ? 1 : 0));
      }
    }

    // O grão só troca a ~12 quadros por segundo; grão de 60fps vira chiado.
    contador += 1;
    if (contador % 5 === 0) veuMaterial.uniforms.uTempo.value = contador;

    renderer.render(cena, camera);
  }

  redimensionar();
  window.addEventListener('resize', redimensionar, { passive: true });
  quadro = requestAnimationFrame(desenhar);

  return {
    atualizar,
    redimensionar,
    destruir() {
      vivo = false;
      cancelAnimationFrame(quadro);
      window.removeEventListener('resize', redimensionar);
      window.removeEventListener('pointermove', aoMover);

      for (const estacao of estacoes) {
        for (const chapa of estacao.chapas) {
          descarregar(chapa);
          chapa.material.dispose();
        }
      }
      geometria.dispose();
      veu.geometry.dispose();
      veuMaterial.dispose();
      renderer.dispose();
    },
  };
}
