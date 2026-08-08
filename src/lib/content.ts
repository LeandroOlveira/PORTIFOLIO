import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const RAIZ = path.join(process.cwd(), 'content');
const CAPTURAS = path.join(process.cwd(), 'public', 'projetos');
const EXTENSOES = /\.(png|jpe?g|webp|avif)$/i;

/**
 * Dimensões reais do arquivo, lidas do cabeçalho.
 *
 * A galeria empilha capturas grandes de proporções diferentes. Sem `width` e
 * `height` no HTML o navegador não sabe que altura reservar e a página pula a
 * cada imagem que chega. Ler o cabeçalho custa alguns bytes por arquivo, uma
 * vez por build, e resolve isso sem embutir número nenhum à mão.
 *
 * O formato é decidido pela assinatura, não pela extensão — quatro capturas
 * deste projeto são JPEG salvos como `.png`, e confiar no nome daria a
 * proporção errada justamente onde ela importa.
 */
function medirImagem(caminho: string): { largura: number; altura: number } | undefined {
  let cabecalho: Buffer;
  try {
    cabecalho = fs.readFileSync(caminho);
  } catch {
    return undefined;
  }

  if (cabecalho.length > 24 && cabecalho.toString('ascii', 1, 4) === 'PNG') {
    return { largura: cabecalho.readUInt32BE(16), altura: cabecalho.readUInt32BE(20) };
  }

  if (cabecalho.length > 4 && cabecalho[0] === 0xff && cabecalho[1] === 0xd8) {
    let i = 2;
    while (i + 9 < cabecalho.length) {
      if (cabecalho[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marcador = cabecalho[i + 1];
      // SOF0..SOF15 carregam as dimensões; DHT, DAC e RSTn não são SOF.
      const ehSOF =
        marcador >= 0xc0 &&
        marcador <= 0xcf &&
        marcador !== 0xc4 &&
        marcador !== 0xc8 &&
        marcador !== 0xcc;
      if (ehSOF) {
        return {
          largura: cabecalho.readUInt16BE(i + 7),
          altura: cabecalho.readUInt16BE(i + 5),
        };
      }
      i += 2 + cabecalho.readUInt16BE(i + 2);
    }
  }

  return undefined;
}

/**
 * Lê a pasta de capturas uma vez por build e agrupa por slug.
 *
 * A convenção é o nome do arquivo: `roadmap.png` é a capa, e `roadmap-2.png`,
 * `roadmap-3.png` (ou qualquer sufixo depois de um hífen) entram na sequência,
 * ordenados naturalmente. Assim publicar mais telas de um projeto é copiar
 * arquivo para dentro de `public/projetos/` — nenhum componente muda.
 */
function lerCapturas(): Map<string, Captura[]> {
  const porSlug = new Map<string, Captura[]>();
  if (!fs.existsSync(CAPTURAS)) return porSlug;

  for (const arquivo of fs.readdirSync(CAPTURAS)) {
    if (!EXTENSOES.test(arquivo)) continue;
    const base = arquivo.replace(EXTENSOES, '');
    const slug = base.split('-').length > 1 && /-\d+$/.test(base)
      ? base.replace(/-\d+$/, '')
      : base;
    const lista = porSlug.get(slug) ?? [];
    lista.push({
      src: `/projetos/${arquivo}`,
      ...medirImagem(path.join(CAPTURAS, arquivo)),
    });
    porSlug.set(slug, lista);
  }

  for (const [slug, lista] of porSlug) {
    lista.sort((a, b) =>
      a.src.localeCompare(b.src, 'pt-BR', { numeric: true, sensitivity: 'base' }),
    );
    porSlug.set(slug, lista);
  }

  return porSlug;
}

export const projectStatuses = [
  'publicado',
  'entregue',
  'em-construcao',
  'demonstracao',
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

/** Uma captura do projeto. As dimensões faltam se o formato não for legível. */
export type Captura = {
  src: string;
  largura?: number;
  altura?: number;
  /**
   * O que a tela mostra, escrito à mão no frontmatter.
   *
   * Vem do conteúdo e não do código porque só quem conhece o produto sabe dizer o
   * que importa naquela captura. O texto gerado que existia antes — "tela 2 de 3" —
   * é ordem de arquivo, não descrição: para quem usa leitor de tela ele não informa
   * nada, e para o buscador é ruído.
   */
  alt?: string;
};

export type Projeto = {
  slug: string;
  titulo: string;
  resumo: string;
  /**
   * A categoria em três ou quatro palavras, para o `<title>`.
   *
   * "Alinnea" é um nome inventado que ninguém digita na busca; "CRM para
   * psicólogos" é o que alguém procura. O `resumo` já dizia isso, mas longo
   * demais para caber no título somado ao nome — daí um campo próprio, curto
   * por contrato, em vez de recortar o resumo no código e torcer.
   */
  categoria: string;
  problema: string;
  resultado: string;
  status: ProjectStatus;
  tipo: string;
  url?: string;
  /** A capa. É a única que vai ao corredor: lá a chapa enquadrada é a prova. */
  imagem?: string;
  /**
   * A galeria completa, na ordem, começando pela capa. Vive na página do
   * projeto — o corredor mostra só a capa.
   *
   * Descobertas em disco: qualquer arquivo `public/projetos/<slug>*.png|jpg|webp`
   * entra sozinho — basta soltar `roadmap-2.png` na pasta.
   */
  imagens: Captura[];
  stack: string[];
  destaque: boolean;
  ordem: number;
  corpo: string;
};

export type Nota = {
  slug: string;
  titulo: string;
  resumo: string;
  data: string;
  /**
   * Quando o texto foi revisado, se foi.
   *
   * Sem este campo o `dateModified` do JSON-LD repetia o `datePublished`, e uma
   * nota reescrita em profundidade continuava se anunciando com a data original
   * — o buscador não tinha como saber que valia reindexar. Fica opcional porque
   * a maioria dos textos nunca é revisada, e declarar revisão que não houve é
   * pior do que não declarar nada.
   */
  atualizado?: string;
  leitura: string;
  demo?: boolean;
  corpo: string;
};

function ler(pasta: string): { slug: string; data: Record<string, unknown>; corpo: string }[] {
  const dir = path.join(RAIZ, pasta);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const source = fs.readFileSync(path.join(dir, f), 'utf8');
      const { data, content } = matter(source);
      return { slug: f.replace(/\.mdx$/, ''), data, corpo: content };
    });
}

/**
 * O bloco `alt:` do frontmatter, indexado pelo nome do arquivo.
 *
 * A chave é só o nome (`roadmap-2.png`) porque o caminho `/projetos/` é sempre o
 * mesmo e repeti-lo em toda linha convida ao erro de digitação silencioso.
 */
function lerAlternativos(bruto: unknown): Record<string, string> {
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) return {};

  const mapa: Record<string, string> = {};
  for (const [arquivo, texto] of Object.entries(bruto as Record<string, unknown>)) {
    if (typeof texto === 'string' && texto.trim()) mapa[arquivo] = texto.trim();
  }
  return mapa;
}

export function getProjetos(): Projeto[] {
  const capturas = lerCapturas();

  return ler('projetos')
    .map(({ slug, data, corpo }) => {
      const projeto = parseProjeto(slug, data, corpo);
      const encontradas = capturas.get(slug) ?? [];
      const alternativos = lerAlternativos(data.alt);

      // O frontmatter continua mandando na capa; o disco completa a sequência.
      const capa = encontradas.find((c) => c.src === projeto.imagem);
      const imagens = (capa ? [capa, ...encontradas.filter((c) => c !== capa)] : encontradas).map(
        (captura) => ({ ...captura, alt: alternativos[captura.src.split('/').pop() ?? ''] }),
      );

      return { ...projeto, imagem: projeto.imagem ?? imagens[0]?.src, imagens };
    })
    .sort((a, b) => a.ordem - b.ordem || a.titulo.localeCompare(b.titulo));
}

function requiredString(slug: string, data: Record<string, unknown>, field: string) {
  const value = data[field];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`content/projetos/${slug}.mdx: ${field} é obrigatório`);
  }
  return value.trim();
}

export function parseProjeto(
  slug: string,
  data: Record<string, unknown>,
  corpo: string,
): Projeto {
  const status = requiredString(slug, data, 'status');
  if (!projectStatuses.includes(status as ProjectStatus)) {
    throw new Error(`content/projetos/${slug}.mdx: status inválido`);
  }

  const ordem = Number(data.ordem);
  if (!Number.isFinite(ordem)) {
    throw new Error(`content/projetos/${slug}.mdx: ordem é obrigatória`);
  }

  const resumo = requiredString(slug, data, 'resumo');
  const categoria = requiredString(slug, data, 'categoria');
  const problema = requiredString(slug, data, 'problema');
  const resultado = requiredString(slug, data, 'resultado');
  const tipo = requiredString(slug, data, 'tipo');

  return {
    slug,
    titulo: requiredString(slug, data, 'titulo'),
    resumo,
    categoria,
    problema,
    resultado,
    status: status as ProjectStatus,
    tipo,
    url: typeof data.url === 'string' && data.url ? data.url : undefined,
    imagem: typeof data.imagem === 'string' && data.imagem ? data.imagem : undefined,
    imagens: [],
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    destaque: data.destaque === true,
    ordem,
    corpo,
  };
}

export function getProjeto(slug: string): Projeto | undefined {
  return getProjetos().find((p) => p.slug === slug);
}

/**
 * As dimensões de um arquivo servido de `public/`, a partir da URL dele.
 *
 * Mesma leitura de cabeçalho usada nas capturas de projeto, exposta para o corpo
 * dos artigos: uma imagem no meio do texto sem `width`/`height` faz a página
 * pular quando ela chega, e o CLS que custou uma auditoria inteira para zerar
 * voltaria pela porta dos fundos a cada artigo ilustrado.
 *
 * Só resolve caminhos absolutos de dentro de `public/`. URL externa não tem como
 * ser medida no build, e é por isso que a convenção é hospedar a imagem aqui.
 */
export function medirImagemPublica(src: string): { largura: number; altura: number } | undefined {
  if (!src.startsWith('/') || src.startsWith('//')) return undefined;

  const alvo = path.normalize(path.join(process.cwd(), 'public', decodeURIComponent(src)));
  const raiz = path.join(process.cwd(), 'public');
  // `../` no caminho sairia de `public/` e leria arquivo arbitrário do disco.
  if (!alvo.startsWith(raiz + path.sep)) return undefined;

  return medirImagem(alvo);
}

/** Palavras por minuto. 200 é a faixa usual de leitura silenciosa em português. */
const RITMO = 200;

/**
 * O tempo de leitura sai do texto, não do frontmatter.
 *
 * Declarado à mão ele mentia: as três notas anunciavam 3 a 4 minutos para textos de
 * um a dois. E mentiria de novo a cada revisão, porque ninguém lembra de recontar
 * depois de cortar um parágrafo. Contando aqui, o número não tem como divergir.
 *
 * A sintaxe de MDX sai antes da contagem — `##`, `-`, marcadores de ênfase e o alvo
 * dos links não são lidos, e contá-los inflaria textos com muitas listas ou títulos.
 */
export function tempoDeLeitura(corpo: string): string {
  const limpo = corpo
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/[*_`>]/g, ' ');

  const palavras = limpo.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(palavras / RITMO))} min`;
}

export function getNotas(): Nota[] {
  return ler('notas')
    .map(({ slug, data, corpo }) => {
      const publicado = String(data.data ?? '');
      const revisado = typeof data.atualizado === 'string' ? data.atualizado.trim() : '';

      return {
        slug,
        titulo: String(data.titulo ?? slug),
        resumo: String(data.resumo ?? ''),
        data: publicado,
        // Uma revisão anterior à publicação é erro de digitação, não histórico.
        atualizado: revisado && revisado > publicado ? revisado : undefined,
        leitura: tempoDeLeitura(corpo),
        demo: Boolean(data.demo),
        corpo,
      };
    })
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function getNota(slug: string): Nota | undefined {
  return getNotas().find((n) => n.slug === slug);
}

/** `2025-11-04` → `04.11.25`. */
export function dataCurta(iso: string): string {
  const [a, m, d] = iso.split('-');
  if (!a || !m || !d) return iso;
  return `${d}.${m}.${a.slice(2)}`;
}
