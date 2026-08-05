import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ScrollExperience } from '@/components/ScrollExperience';

const renderer = {
  setTarget: vi.fn(),
  resize: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  destroy: vi.fn(),
};
const createSpatialRenderer = vi.fn(() => renderer);
const createMotionOrchestrator = vi.fn(() => vi.fn());

vi.mock('@/lib/motion/spatial-renderer', () => ({ createSpatialRenderer }));
vi.mock('@/lib/motion/orchestrator', () => ({ createMotionOrchestrator }));
vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.motionProfile;
  delete document.documentElement.dataset.motionReady;
  vi.restoreAllMocks();
  createSpatialRenderer.mockClear();
  createMotionOrchestrator.mockClear();
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

it('starts scroll choreography only after WebGL succeeds and cleans it up on unmount', async () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as WebGL2RenderingContext);

  const { unmount } = render(<ScrollExperience />);

  await waitFor(() => expect(createSpatialRenderer).toHaveBeenCalled());
  await waitFor(() => expect(createMotionOrchestrator).toHaveBeenCalled());
  expect(document.documentElement.dataset.motionReady).toBe('true');

  unmount();
  expect(renderer.destroy).toHaveBeenCalled();
});
