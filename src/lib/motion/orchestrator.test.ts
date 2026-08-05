import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SpatialRenderer } from '@/lib/motion/spatial-renderer';
import { createMotionOrchestrator } from '@/lib/motion/orchestrator';

type TriggerConfig = Record<string, unknown>;

function createRoot() {
  document.body.innerHTML = `
    <section data-motion-section="projects"><div data-project-stage><article data-project-plane="alinnea"></article></div><h2 data-motion-title></h2><p data-motion-copy></p></section>
    <section data-motion-section="stack"><h2 data-motion-title></h2><p data-motion-copy></p><li data-motion-item></li></section>
    <section data-motion-section="process"><h2 data-motion-title></h2><p data-motion-copy></p><li data-motion-item></li></section>
    <section data-motion-section="trajectory"><h2 data-motion-title></h2><p data-motion-copy></p><li data-motion-item></li></section>
    <section data-motion-section="notes"><h2 data-motion-title></h2><p data-motion-copy></p><li data-motion-item></li></section>
    <section data-motion-section="contact"><h2 data-motion-title></h2><p data-motion-copy></p></section>
  `;
  return document;
}

function createHarness() {
  const kill = vi.fn();
  const timeline = {
    fromTo: vi.fn().mockReturnThis(),
    kill,
  };
  const gsap = {
    fromTo: vi.fn(() => ({ kill })),
    timeline: vi.fn(() => timeline),
  };
  const configs: TriggerConfig[] = [];
  const ScrollTrigger = {
    create: vi.fn((config: TriggerConfig) => {
      configs.push(config);
      return { kill };
    }),
  };
  const renderer = {
    setTarget: vi.fn(),
    resize: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    destroy: vi.fn(),
  } as SpatialRenderer;

  return { configs, gsap, kill, renderer, ScrollTrigger, timeline };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createMotionOrchestrator', () => {
  it('does nothing for the static fallback', () => {
    const harness = createHarness();

    const stop = createMotionOrchestrator({
      root: createRoot(),
      profile: 'static',
      renderer: harness.renderer,
      gsap: harness.gsap,
      ScrollTrigger: harness.ScrollTrigger,
    });

    expect(harness.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(harness.gsap.timeline).not.toHaveBeenCalled();
    stop();
    expect(harness.kill).not.toHaveBeenCalled();
  });

  it('maps section activation to renderer state and pins only the full project stage', () => {
    const harness = createHarness();

    const stop = createMotionOrchestrator({
      root: createRoot(),
      profile: 'full',
      renderer: harness.renderer,
      gsap: harness.gsap,
      ScrollTrigger: harness.ScrollTrigger,
    });

    const projects = harness.configs.find((config) => config.trigger instanceof HTMLElement && config.trigger.dataset.motionSection === 'projects');
    expect(projects).toBeDefined();
    (projects?.onEnter as (() => void))();

    expect(harness.renderer.setTarget).toHaveBeenCalledWith(
      expect.objectContaining({ section: 1, energy: expect.any(Number) }),
    );
    expect(harness.gsap.timeline).toHaveBeenCalledWith(
      expect.objectContaining({
        scrollTrigger: expect.objectContaining({ pin: true }),
      }),
    );

    stop();
    expect(harness.kill).toHaveBeenCalled();
  });

  it('keeps the project flow vertical in the compact profile', () => {
    const harness = createHarness();

    createMotionOrchestrator({
      root: createRoot(),
      profile: 'compact',
      renderer: harness.renderer,
      gsap: harness.gsap,
      ScrollTrigger: harness.ScrollTrigger,
    });

    expect(harness.gsap.timeline).not.toHaveBeenCalled();
  });
});
