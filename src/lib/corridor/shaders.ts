/**
 * Shaders do corredor.
 *
 * A profundidade de campo não é pós-processamento: cada chapa amostra o
 * próprio mipmap num nível calculado pela distância (`textureLod`). É barato,
 * roda em telefone e produz a desfocagem correta — o que está no fundo do
 * corredor perde detalhe de verdade, não ganha um blur por cima.
 */

export const vertexChapa = /* glsl */ `
  out vec2 vUv;
  out float vDist;

  void main() {
    vUv = uv;
    vec4 posicaoVista = modelViewMatrix * vec4(position, 1.0);
    vDist = -posicaoVista.z;
    gl_Position = projectionMatrix * posicaoVista;
  }
`;

export const fragmentChapa = /* glsl */ `
  precision highp float;

  uniform sampler2D uMapa;
  uniform vec3 uNevoa;
  uniform vec3 uMarca;
  uniform float uOpacidade;
  uniform float uDesfoque;
  uniform float uDensidade;
  uniform float uMoldura;
  uniform float uAspecto;
  uniform float uBrilho;

  in vec2 vUv;
  in float vDist;
  out vec4 cor;

  void main() {
    vec3 amostra = textureLod(uMapa, vUv, uDesfoque).rgb * uBrilho;

    // Névoa exponencial: o fundo do corredor se dissolve no preto de sala.
    float nevoa = clamp(1.0 - exp(-uDensidade * vDist), 0.0, 1.0);
    vec3 resultado = mix(amostra, uNevoa, nevoa);

    // Moldura da marca, corrigida pelo aspecto para ter espessura constante.
    // A transição é curta de propósito: uma borda larga vira contorno neon,
    // e o que se quer aqui é o fio que delimita a chapa.
    vec2 borda = min(vUv, 1.0 - vUv) * vec2(uAspecto, 1.0);
    float distanciaBorda = min(borda.x, borda.y);
    float linha = 1.0 - smoothstep(uMoldura, uMoldura * 1.4, distanciaBorda);
    resultado = mix(resultado, uMarca, linha * (1.0 - nevoa) * 0.8);

    cor = vec4(resultado, uOpacidade);
  }
`;

export const vertexVeu = /* glsl */ `
  out vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * O véu de projeção: vinheta e grão, aplicados sobre o quadro inteiro.
 * É a camada que faz o conjunto parecer projetado em vez de renderizado.
 */
export const fragmentVeu = /* glsl */ `
  precision highp float;

  uniform float uTempo;
  uniform float uGrao;
  uniform float uVinheta;

  in vec2 vUv;
  out vec4 cor;

  float ruido(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 centro = vUv - 0.5;
    centro.x *= 1.08;

    // A vinheta só entra perto da borda. Começando no meio do quadro ela
    // escurecia a própria captura, que é justamente o que não pode acontecer:
    // a interface tem que aparecer no tom em que foi desenhada.
    float queda = smoothstep(0.58, 0.98, length(centro));
    float grao = (ruido(vUv * 900.0 + uTempo) - 0.5) * uGrao;

    float alfa = clamp(queda * uVinheta + grao, 0.0, 1.0);
    cor = vec4(0.0, 0.0, 0.0, alfa);
  }
`;
