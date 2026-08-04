import { describe, expect, it } from 'vitest';
import { navegacao, site, stack, whatsappLink } from '@/lib/site';

describe('site identity', () => {
  it('publishes the real contact channels', () => {
    expect(site.nomeCompleto).toBe('Leandro Oliveira');
    expect(site.whatsapp).toBe('5544997762271');
    expect(site.email).toBe('leandroappa@gmail.com');
    expect(site.linkedin).toBe('https://www.linkedin.com/in/lhsoliveira');
    expect(site.instagram).toBe('https://www.instagram.com/lhs.oliveira');
  });

  it('builds a real encoded WhatsApp link', () => {
    const url = new URL(whatsappLink('Olá, Leandro.'));
    expect(`${url.origin}${url.pathname}`).toBe('https://wa.me/5544997762271');
    expect(url.searchParams.get('text')).toBe('Olá, Leandro.');
  });

  it('exposes direct navigation without editing metaphors', () => {
    expect(navegacao.map((item) => item.label)).toEqual([
      'Projetos',
      'Stack',
      'Trajetória',
      'Contato',
    ]);
  });

  it('keeps public navigation free of cinema object labels', () => {
    const labels = navegacao.map((item) => item.label).join(' ').toLowerCase();
    for (const banned of ['corte', 'clipe', 'claquete', 'timecode', 'transporte']) {
      expect(labels).not.toContain(banned);
    }
  });

  it('describes every required technology in context', () => {
    expect(stack.map((item) => item.nome)).toEqual([
      'Python',
      'Node.js',
      'React',
      'Next.js',
      'C#',
    ]);
    expect(stack.every((item) => item.descricao.length >= 24)).toBe(true);
  });
});
