import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Contato } from '@/components/Contato';
import { Notas } from '@/components/Notas';
import { Processo } from '@/components/Processo';
import { Projetos } from '@/components/Projetos';
import { Stack } from '@/components/Stack';
import { Trajetoria } from '@/components/Trajetoria';
import { getNotas, getProjetos } from '@/lib/content';

describe('home motion contracts', () => {
  it('exposes semantic motion targets while keeping every section readable by default', () => {
    const projetos = getProjetos();
    const { container } = render(
      <>
        <Projetos projetos={projetos} />
        <Stack />
        <Processo />
        <Trajetoria />
        <Notas notas={getNotas()} />
        <Contato />
      </>,
    );

    expect(
      Array.from(container.querySelectorAll<HTMLElement>('[data-motion-section]')).map(
        (section) => section.dataset.motionSection,
      ),
    ).toEqual(['projects', 'stack', 'process', 'trajectory', 'notes', 'contact']);

    expect(container.querySelectorAll('[data-motion-title]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-motion-copy]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-project-plane]')).toHaveLength(projetos.length);
    expect(container.querySelectorAll('[data-motion-item]').length).toBeGreaterThanOrEqual(
      projetos.length + 3,
    );
    expect(container.querySelectorAll('[style*="opacity: 0"]')).toHaveLength(0);
  });
});
