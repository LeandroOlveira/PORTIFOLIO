import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Projetos } from '@/components/Projetos';
import type { Projeto } from '@/lib/content';

const projetos: Projeto[] = [
  {
    slug: 'produto-real',
    titulo: 'Produto real',
    resumo: 'Uma solução para uma operação concreta.',
    problema: 'O time dependia de controles dispersos.',
    resultado: 'A rotina passou a ter uma base única.',
    status: 'publicado',
    tipo: 'SaaS próprio',
    url: 'https://example.com/',
    stack: ['React', 'Node.js'],
    destaque: true,
    ordem: 1,
    corpo: '',
  },
];

describe('Projetos', () => {
  it('apresenta o projeto como produto, com estado, resultado e destinos claros', () => {
    render(<Projetos projetos={projetos} />);

    expect(screen.getByRole('heading', { name: 'Produto real' })).toBeInTheDocument();
    expect(screen.getByText('Publicado')).toBeInTheDocument();
    expect(screen.getByText('A rotina passou a ter uma base única.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Conhecer o projeto Produto real' })).toHaveAttribute(
      'href',
      '/projetos/produto-real',
    );
    expect(screen.getByRole('link', { name: 'Abrir Produto real' })).toHaveAttribute(
      'href',
      'https://example.com/',
    );
    expect(screen.queryByText(/clipe|bruto|corte final/i)).not.toBeInTheDocument();
  });
});
