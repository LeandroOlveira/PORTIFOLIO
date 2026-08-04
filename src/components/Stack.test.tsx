import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from '@/components/Stack';

describe('Stack', () => {
  it('apresenta as tecnologias com contexto de uso', () => {
    render(<Stack />);

    for (const technology of ['Python', 'Node.js', 'React', 'Next.js', 'C#']) {
      const heading = screen.getByRole('heading', { name: technology });
      expect(heading.parentElement).toHaveTextContent(/.{24,}/);
    }
  });
});
