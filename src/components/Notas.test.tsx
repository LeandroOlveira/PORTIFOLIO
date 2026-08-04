import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Notas } from '@/components/Notas';

describe('Notas', () => {
  it('posiciona a escrita em produto e operação mesmo sem artigos', () => {
    render(<Notas notas={[]} />);

    expect(
      screen.getByText('Reflexões sobre produto, integração, IA aplicada e software em operação.'),
    ).toBeInTheDocument();
  });
});

