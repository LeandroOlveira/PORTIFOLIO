import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const RAIZ = path.join(process.cwd(), 'content');

export type Projeto = {
  slug: string;
  titulo: string;
  /** O resumo de uma linha que aparece no clipe. */
  linha: string;
  /** O processo como estava: longo, tremido, sem foco. */
  bruto: string[];
  /** O que foi entregue. */
  corte: string[];
  stack: string[];
  ano: string;
  setor: string;
  /** Duração real do projeto, se souber. Vazio some da claquete. */
  duracao?: string;
  url?: string;
  repo?: string;
  /** true = conteúdo de demonstração; a UI marca isso na cara. */
  demo?: boolean;
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
      const bruto = fs.readFileSync(path.join(dir, f), 'utf8');
      const { data, content } = matter(bruto);
      return { slug: f.replace(/\.mdx$/, ''), data, corpo: content };
    });
}

export function getProjetos(): Projeto[] {
  return ler('projetos')
    .map(({ slug, data, corpo }) => ({
      slug,
      titulo: String(data.titulo ?? slug),
      linha: String(data.linha ?? ''),
      bruto: (data.bruto as string[]) ?? [],
      corte: (data.corte as string[]) ?? [],
      stack: (data.stack as string[]) ?? [],
      ano: String(data.ano ?? ''),
      setor: String(data.setor ?? ''),
      duracao: data.duracao ? String(data.duracao) : undefined,
      url: data.url ? String(data.url) : undefined,
      repo: data.repo ? String(data.repo) : undefined,
      demo: Boolean(data.demo),
      corpo,
    }))
    .sort((a, b) => b.ano.localeCompare(a.ano) || a.titulo.localeCompare(b.titulo));
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

/** `2025-11-04` → `04.11.25` — o formato curto da claquete. */
export function dataCurta(iso: string): string {
  const [a, m, d] = iso.split('-');
  if (!a || !m || !d) return iso;
  return `${d}.${m}.${a.slice(2)}`;
}
