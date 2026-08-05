import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const RAIZ = path.join(process.cwd(), 'content');
const CAPTURAS = path.join(process.cwd(), 'public', 'projetos');
const EXTENSOES = /\.(png|jpe?g|webp|avif)$/i;

/**
 * Lê a pasta de capturas uma vez por build e agrupa por slug.
 *
 * A convenção é o nome do arquivo: `roadmap.png` é a capa, e `roadmap-2.png`,
 * `roadmap-3.png` (ou qualquer sufixo depois de um hífen) entram na sequência,
 * ordenados naturalmente. Assim publicar mais telas de um projeto é copiar
 * arquivo para dentro de `public/projetos/` — nenhum componente muda.
 */
function lerCapturas(): Map<string, string[]> {
  const porSlug = new Map<string, string[]>();
  if (!fs.existsSync(CAPTURAS)) return porSlug;

  for (const arquivo of fs.readdirSync(CAPTURAS)) {
    if (!EXTENSOES.test(arquivo)) continue;
    const base = arquivo.replace(EXTENSOES, '');
    const slug = base.split('-').length > 1 && /-\d+$/.test(base)
      ? base.replace(/-\d+$/, '')
      : base;
    const lista = porSlug.get(slug) ?? [];
    lista.push(`/projetos/${arquivo}`);
    porSlug.set(slug, lista);
  }

  for (const [slug, lista] of porSlug) {
    lista.sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }),
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

export type Projeto = {
  slug: string;
  titulo: string;
  resumo: string;
  problema: string;
  resultado: string;
  status: ProjectStatus;
  tipo: string;
  url?: string;
  imagem?: string;
  /**
   * Todas as capturas do projeto, na ordem. A primeira é `imagem`.
   * Descobertas em disco: qualquer arquivo `public/projetos/<slug>*.png|jpg|webp`
   * entra sozinho — basta soltar `roadmap-2.png` na pasta.
   */
  imagens: string[];
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

export function getProjetos(): Projeto[] {
  const capturas = lerCapturas();

  return ler('projetos')
    .map(({ slug, data, corpo }) => {
      const projeto = parseProjeto(slug, data, corpo);
      const encontradas = capturas.get(slug) ?? [];

      // O frontmatter continua mandando na capa; o disco completa a sequência.
      const imagens = projeto.imagem
        ? [projeto.imagem, ...encontradas.filter((i) => i !== projeto.imagem)]
        : encontradas;

      return { ...projeto, imagem: projeto.imagem ?? imagens[0], imagens };
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
  const problema = requiredString(slug, data, 'problema');
  const resultado = requiredString(slug, data, 'resultado');
  const tipo = requiredString(slug, data, 'tipo');

  return {
    slug,
    titulo: requiredString(slug, data, 'titulo'),
    resumo,
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

export function getNotas(): Nota[] {
  return ler('notas')
    .map(({ slug, data, corpo }) => ({
      slug,
      titulo: String(data.titulo ?? slug),
      resumo: String(data.resumo ?? ''),
      data: String(data.data ?? ''),
      leitura: String(data.leitura ?? ''),
      demo: Boolean(data.demo),
      corpo,
    }))
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
