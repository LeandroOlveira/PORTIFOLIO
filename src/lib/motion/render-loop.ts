export type FramePlatform = {
  request: (callback: FrameRequestCallback) => number;
  cancel: (id: number) => void;
  addVisibilityListener: (callback: () => void) => void;
  removeVisibilityListener: (callback: () => void) => void;
  isHidden: () => boolean;
};

export type RenderLoop = {
  pause: () => void;
  resume: () => void;
  destroy: () => void;
};

export const browserFramePlatform: FramePlatform = {
  request: (callback) => window.requestAnimationFrame(callback),
  cancel: (id) => window.cancelAnimationFrame(id),
  addVisibilityListener: (callback) => document.addEventListener('visibilitychange', callback),
  removeVisibilityListener: (callback) => document.removeEventListener('visibilitychange', callback),
  isHidden: () => document.hidden,
};

export function createRenderLoop(
  render: (time: number) => void,
  platform: FramePlatform = browserFramePlatform,
): RenderLoop {
  let frame: number | null = null;
  let destroyed = false;

  const tick = (time: number) => {
    frame = null;
    if (destroyed || platform.isHidden()) return;

    render(time);
    frame = platform.request(tick);
  };

  const pause = () => {
    if (frame !== null) platform.cancel(frame);
    frame = null;
  };

  const resume = () => {
    if (!destroyed && frame === null && !platform.isHidden()) {
      frame = platform.request(tick);
    }
  };

  const onVisibilityChange = () => {
    if (platform.isHidden()) pause();
    else resume();
  };

  platform.addVisibilityListener(onVisibilityChange);
  resume();

  return {
    pause,
    resume,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      pause();
      platform.removeVisibilityListener(onVisibilityChange);
    },
  };
}
