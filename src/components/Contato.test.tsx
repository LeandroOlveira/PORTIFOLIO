import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Contato } from '@/components/Contato';

describe('Contato', () => {
  it('renderiza os quatro canais reais de contato', () => {
    render(<Contato />);

    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5544997762271'),
    );
    expect(screen.getByRole('link', { name: 'leandroappa@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:leandroappa@gmail.com',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/lhsoliveira',
    );
    expect(screen.getByRole('link', { name: '@lhs.oliveira' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/lhs.oliveira',
    );
  });
});
