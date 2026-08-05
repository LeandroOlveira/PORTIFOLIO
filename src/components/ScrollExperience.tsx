'use client';

import { useEffect, useRef } from 'react';
import { selectMotionProfile } from '@/lib/motion/profile';

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function ScrollExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let active = true;
    let destroy: (() => void) | undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      document.documentElement.dataset.motionProfile = 'static';
      return;
    }

    const connection = (navigator as NavigatorWithConnection).connection;
    const webgl2 = Boolean(canvas.getContext('webgl2'));
    const profile = selectMotionProfile({
      reducedMotion,
      webgl2,
      saveData: connection?.saveData === true,
      width: window.innerWidth,
      cores: navigator.hardwareConcurrency || 4,
    });

    document.documentElement.dataset.motionProfile = profile;
    if (profile === 'static') return;

    void import('@/lib/motion/spatial-renderer').then(({ createSpatialRenderer }) => {
      if (!active) return;

      const renderer = createSpatialRenderer(canvas, profile);
      if (!renderer) {
        document.documentElement.dataset.motionProfile = 'static';
        return;
      }

      document.documentElement.dataset.motionReady = 'true';
      destroy = renderer.destroy;
    });

    return () => {
      active = false;
      destroy?.();
      delete document.documentElement.dataset.motionReady;
      delete document.documentElement.dataset.motionProfile;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-spatial-canvas
      aria-hidden="true"
      className="spatial-canvas pointer-events-none"
    />
  );
}
