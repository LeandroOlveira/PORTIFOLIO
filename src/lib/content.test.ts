import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getNotas,
  getProjetos,
  medirImagemPublica,
  parseProjeto,
  tempoDeLeitura,
} from '@/lib/content';

const valid = {
  titulo: 'Alinnea',
  resumo: 'CRM para psicólogos.',
  categoria: 'CRM para psicólogos',
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

  it('gives every project a title that says what it is, inside the ~60 chars Google shows', () => {
    for (const projeto of getProjetos()) {
      expect(projeto.categoria).toBeTruthy();
      // O nome próprio sozinho não é buscável: a categoria precisa acrescentar
      // termo, não repetir o título.
      expect(projeto.categoria.toLowerCase()).not.toBe(projeto.titulo.toLowerCase());

      const titulo = `${projeto.titulo} — ${projeto.categoria} — Leandro Oliveira`;
      expect(titulo.length).toBeLessThanOrEqual(60);
    }
  });

  it('composes a project meta description that fills the SERP snippet', () => {
    for (const projeto of getProjetos()) {
      // O mesmo par que `generateMetadata` emenda: o que o projeto é, e o que
      // ele mudou. O `resumo` sozinho dava 40 a 65 num campo que mostra ~155.
      const descricao = `${projeto.resumo} ${projeto.resultado}`;
      expect(descricao.length, `${projeto.slug}: ${descricao.length} chars`).toBeGreaterThanOrEqual(
        100,
      );
      expect(descricao.length, `${projeto.slug}: ${descricao.length} chars`).toBeLessThanOrEqual(
        155,
      );
    }
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

  it('describes each screenshot instead of numbering it', () => {
    const semDescricao: string[] = [];

    for (const projeto of getProjetos()) {
      for (const captura of projeto.imagens) {
        if (!captura.alt) {
          semDescricao.push(captura.src);
          continue;
        }
        // "tela 2 de 3" era ordem de arquivo, não descrição.
        expect(captura.alt).not.toMatch(/tela \d+ de \d+/i);
        expect(captura.alt.length).toBeGreaterThan(40);
      }
    }

    expect(semDescricao).toEqual([]);
  });

  it('derives reading time from the text instead of the frontmatter', () => {
    expect(tempoDeLeitura('palavra '.repeat(200))).toBe('1 min');
    expect(tempoDeLeitura('palavra '.repeat(700))).toBe('4 min');
    // Um texto curto nunca anuncia "0 min".
    expect(tempoDeLeitura('três palavras aqui')).toBe('1 min');
  });

  it('does not count MDX syntax as words the reader reads', () => {
    const cru = '## Título\n\n- item um\n- item dois\n\n[texto](https://exemplo.com/rota/longa)';
    // 8 palavras de leitura: "Título", "item um", "item dois", "texto".
    expect(tempoDeLeitura(cru)).toBe('1 min');
    expect(tempoDeLeitura(`${cru}\n${'palavra '.repeat(600)}`)).toBe('3 min');
  });

  it('announces a reading time that matches every published note', () => {
    for (const nota of getNotas()) {
      expect(nota.leitura).toBe(tempoDeLeitura(nota.corpo));
      expect(nota.leitura).toMatch(/^\d+ min$/);
    }
  });

  it('only announces a revision that happened after publication', () => {
    for (const nota of getNotas()) {
      if (!nota.atualizado) continue;
      expect(nota.atualizado > nota.data).toBe(true);
      expect(nota.atualizado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('describes every image inside an article and hosts it where it can be measured', () => {
    // `![alt](src)` — sem alt a imagem some do leitor de tela e da busca por
    // imagem; hospedada fora de `public/` não há como medi-la no build, e a
    // página volta a pular quando ela chega.
    const imagem = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

    for (const nota of getNotas()) {
      for (const [, alt, src] of nota.corpo.matchAll(imagem)) {
        expect(alt.trim(), `${nota.slug}: imagem ${src} sem alt`).not.toBe('');
        expect(src, `${nota.slug}: ${src} precisa vir de public/`).toMatch(/^\//);
        expect(medirImagemPublica(src), `${nota.slug}: ${src} não encontrada`).toBeDefined();
      }
    }
  });

  it('refuses to measure outside public/', () => {
    expect(medirImagemPublica('/../next.config.ts')).toBeUndefined();
    expect(medirImagemPublica('https://exemplo.com/foto.png')).toBeUndefined();
    expect(medirImagemPublica('/projetos/alinnea.png')).toMatchObject({
      largura: expect.any(Number),
      altura: expect.any(Number),
    });
  });

  it('keeps editorial headings free of the discarded cinema labels', () => {
    const notes = getNotas();
    expect(notes.map((note) => note.corpo).join('\n')).not.toMatch(/^##\s+O corte$/im);
  });
});
