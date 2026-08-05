import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getNotas, getProjetos, parseProjeto } from '@/lib/content';

const valid = {
  titulo: 'Alinnea',
  resumo: 'CRM para psicólogos.',
  problema: 'Rotinas clínicas espalhadas.',
  resultado: 'Agenda, prontuário e comunicação reunidos.',
  status: 'publicado',
  tipo: 'SaaS próprio',
  url: 'https://alinnea.com.br/',
  imagem: '/projetos/alinnea.webp',
  stack: ['Next.js'],
  destaque: true,
  ordem: 1,
};

describe('project content', () => {
  it('parses the explicit project contract', () => {
    expect(parseProjeto('alinnea', valid, 'corpo')).toMatchObject({
      slug: 'alinnea',
      status: 'publicado',
      ordem: 1,
      destaque: true,
    });
  });

  it('rejects unknown status with the file name', () => {
    expect(() => parseProjeto('invalido', { ...valid, status: 'pronto' }, '')).toThrow(
      'content/projetos/invalido.mdx: status inválido',
    );
  });

  it('rejects a missing required field', () => {
    const { problema: _problema, ...missing } = valid;
    expect(() => parseProjeto('incompleto', missing, '')).toThrow(
      'content/projetos/incompleto.mdx: problema é obrigatório',
    );
  });

  it('loads seven real projects in explicit order', () => {
    const projects = getProjetos();
    expect(projects).toHaveLength(7);
    expect(projects.map((project) => project.slug)).toEqual([
      'alinnea',
      'roadmap',
      'dochub',
      'radar-fiscal',
      'petgest',
      'gabriela-lorenson',
      'ebano',
    ]);
  });

  it('loads safe visual proof for the four operational products', () => {
    const images = Object.fromEntries(getProjetos().map(({ slug, imagem }) => [slug, imagem]));

    expect(images).toMatchObject({
      alinnea: '/projetos/alinnea.png',
      roadmap: '/projetos/roadmap.png',
      dochub: '/projetos/dochub.png',
      'radar-fiscal': '/projetos/radar-fiscal.png',
    });

    for (const imagePath of Object.values(images).filter(Boolean)) {
      const assetPath = path.join(process.cwd(), 'public', String(imagePath).replace(/^\//, ''));
      expect(fs.existsSync(assetPath)).toBe(true);
    }
  });

  it('keeps editorial headings free of the discarded cinema labels', () => {
    const notes = getNotas();
    expect(notes.map((note) => note.corpo).join('\n')).not.toMatch(/^##\s+O corte$/im);
  });
});
