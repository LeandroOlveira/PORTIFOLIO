import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Abertura } from '@/components/Abertura';

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    matchMedia: () => ({ add: vi.fn(), revert: vi.fn() }),
    context: (callback: () => void) => {
      callback();
      return { revert: vi.fn() };
    },
    to: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

describe('Abertura', () => {
  it('renders the complete offer and actions before animation', () => {
    render(<Abertura />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Produtos digitais para operações reais.',
    );
    expect(screen.getByRole('link', { name: 'Conversar sobre um projeto' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/5544997762271'),
    );
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute(
      'href',
      '#projetos',
    );
    expect(screen.queryByText(/role|bruto|corte|escala/i)).not.toBeInTheDocument();
  });
});
