import { describe, expect, it, vi } from 'vitest';
import { createRenderLoop, type FramePlatform } from '@/lib/motion/render-loop';

function createPlatform(hidden = false) {
  let isHidden = hidden;
  let callback: FrameRequestCallback | undefined;
  const listeners = new Set<() => void>();

  const platform: FramePlatform = {
    request: vi.fn((next) => {
      callback = next;
      return 41;
    }),
    cancel: vi.fn(),
    addVisibilityListener: vi.fn((listener) => listeners.add(listener)),
    removeVisibilityListener: vi.fn((listener) => listeners.delete(listener)),
    isHidden: () => isHidden,
  };

  return {
    platform,
    frame(time: number) {
      callback?.(time);
    },
    setHidden(value: boolean) {
      isHidden = value;
      listeners.forEach((listener) => listener());
    },
    listenerCount: () => listeners.size,
  };
}

describe('render loop', () => {
  it('renders one frame at a time and cancels the pending frame on destroy', () => {
    const fixture = createPlatform();
    const render = vi.fn();
    const loop = createRenderLoop(render, fixture.platform);

    expect(fixture.platform.request).toHaveBeenCalledTimes(1);
    fixture.frame(16);
    expect(render).toHaveBeenCalledWith(16);
    expect(fixture.platform.request).toHaveBeenCalledTimes(2);

    loop.destroy();
    expect(fixture.platform.cancel).toHaveBeenCalledWith(41);
    expect(fixture.listenerCount()).toBe(0);
  });

  it('pauses when the page becomes hidden and resumes when it becomes visible', () => {
    const fixture = createPlatform();
    const loop = createRenderLoop(vi.fn(), fixture.platform);

    fixture.setHidden(true);
    expect(fixture.platform.cancel).toHaveBeenCalledWith(41);
    fixture.setHidden(false);
    expect(fixture.platform.request).toHaveBeenCalledTimes(2);

    loop.destroy();
  });
});
