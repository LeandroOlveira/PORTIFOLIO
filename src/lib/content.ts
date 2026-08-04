import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const RAIZ = path.join(process.cwd(), 'content');

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
  return ler('projetos')
    .map(({ slug, data, corpo }) => parseProjeto(slug, data, corpo))
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
