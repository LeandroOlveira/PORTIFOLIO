'use client';

import { useEffect, useRef } from 'react';
import { selectMotionProfile } from '@/lib/motion/profile';
import type { GsapAdapter, ScrollTriggerAdapter } from '@/lib/motion/orchestrator';

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function ScrollExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let active = true;
    let destroyRenderer: (() => void) | undefined;
    let stopMotion: (() => void) | undefined;
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

    void Promise.all([
      import('@/lib/motion/spatial-renderer'),
      import('@/lib/motion/orchestrator'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
      .then(([{ createSpatialRenderer }, { createMotionOrchestrator }, gsapModule, { ScrollTrigger }]) => {
        if (!active) return;

        const renderer = createSpatialRenderer(canvas, profile);
        if (!renderer) {
          document.documentElement.dataset.motionProfile = 'static';
          return;
        }

        destroyRenderer = renderer.destroy;
        gsapModule.default.registerPlugin(ScrollTrigger);
        document.documentElement.dataset.motionReady = 'true';
        stopMotion = createMotionOrchestrator({
          root: document,
          profile,
          renderer,
          gsap: gsapModule.default as unknown as GsapAdapter,
          ScrollTrigger: ScrollTrigger as unknown as ScrollTriggerAdapter,
        });
      })
      .catch(() => {
        if (!active) return;
        stopMotion?.();
        stopMotion = undefined;
        destroyRenderer?.();
        destroyRenderer = undefined;
        delete document.documentElement.dataset.motionReady;
        document.documentElement.dataset.motionProfile = 'static';
      });

    return () => {
      active = false;
      stopMotion?.();
      destroyRenderer?.();
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
