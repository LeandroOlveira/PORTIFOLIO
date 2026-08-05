import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ScrollExperience } from '@/components/ScrollExperience';

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.motionProfile;
  delete document.documentElement.dataset.motionReady;
});

it('renders one decorative canvas without exposing it to assistive technology', () => {
  const { container } = render(<ScrollExperience />);
  const canvas = container.querySelector('[data-spatial-canvas]');

  expect(canvas).toHaveAttribute('aria-hidden', 'true');
  expect(canvas).toHaveClass('pointer-events-none');
});

it('keeps the page static without allocating a graphics context for reduced motion', () => {
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');

  render(<ScrollExperience />);

  expect(getContext).not.toHaveBeenCalled();
  expect(document.documentElement.dataset.motionProfile).toBe('static');
});
