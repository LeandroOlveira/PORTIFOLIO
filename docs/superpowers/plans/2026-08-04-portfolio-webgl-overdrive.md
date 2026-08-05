# Portfolio WebGL Overdrive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a continuous WebGL2 spatial field and high-level scroll choreography to every homepage section after the approved hero, using real sanitized project material and preserving native scrolling, accessibility, and mobile performance.

**Architecture:** A client-only `ScrollExperience` owns one decorative fixed canvas and dynamically imports a raw WebGL2 renderer plus an isolated GSAP ScrollTrigger orchestrator. Semantic HTML stays visible by default; animation activates only after capability selection and successful renderer initialization. Section components expose stable `data-motion-*` hooks, while pure profile and lifecycle utilities keep fallbacks and cleanup testable.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, raw WebGL2/GLSL ES 3.0, GSAP 3.13 ScrollTrigger, Vitest, Testing Library.

## Global Constraints

- Work directly on `main`; the user explicitly declined a branch.
- Keep the existing hero copy, composition, automatic masks, and first-view behavior recognizable.
- Use one canvas and one `requestAnimationFrame`; do not create a canvas per section.
- Do not add Three.js, OGL, Lenis, smooth-scroll libraries, audio, WebGPU, custom cursors, or scroll hijacking.
- The canvas is decorative: `aria-hidden="true"`, `pointer-events: none`, never focusable.
- Content must be visible and usable without JavaScript, WebGL, or animation.
- `prefers-reduced-motion: reduce` must choose the static profile before creating WebGL or ScrollTrigger timelines.
- Profiles: `full` caps DPR at `1.5`; `compact` caps DPR at `1`; `static` creates no renderer.
- Only the existing lime `#d4ff00` may act as accent; WebGL uses black/graphite/warm-white/lime.
- Do not publish source captures containing names, email, CNPJ, CPF, passwords, UUIDs, or internal identifiers.
- Use strict TDD for new functions and behavior: observe RED before production code, then GREEN.
- Run the Impeccable craft floor immediately before Task 1 implementation; do not rerun the context or detector scripts already run in this session.

## File Structure

- Create `src/lib/motion/profile.ts`: pure capability-to-profile decision.
- Create `src/lib/motion/profile.test.ts`: profile contract and DPR limits.
- Create `src/lib/motion/render-loop.ts`: single pausable animation-frame lifecycle.
- Create `src/lib/motion/render-loop.test.ts`: scheduling, pause, resume, and cleanup.
- Create `src/lib/motion/spatial-shaders.ts`: full-screen triangle vertex shader and procedural spatial fragment shader.
- Create `src/lib/motion/spatial-renderer.ts`: WebGL2 context, uniforms, resize, state interpolation, and teardown.
- Create `src/lib/motion/spatial-renderer.test.ts`: unsupported-context and resource-cleanup behavior.
- Create `src/lib/motion/orchestrator.ts`: isolated GSAP/ScrollTrigger timelines and pointer influence.
- Create `src/lib/motion/orchestrator.test.ts`: static/reduced path, timeline cleanup, and section state mapping.
- Create `src/components/ScrollExperience.tsx`: lazy client boundary, canvas, capability detection, and lifecycle ownership.
- Create `src/components/ScrollExperience.test.tsx`: decorative canvas and static fallback behavior.
- Create `src/components/HomeMotion.test.tsx`: semantic section hooks and visible-by-default contract.
- Modify `src/app/page.tsx`: mount the experience once.
- Modify `src/components/Titulo.tsx`: expose title and support-copy motion hooks.
- Modify `src/components/Projetos.tsx`, `Stack.tsx`, `Processo.tsx`, `Trajetoria.tsx`, `Notas.tsx`, `Contato.tsx`: stable hooks and section-specific composition.
- Modify `src/app/globals.css`: canvas layer, 3D transforms, masks, sticky project stage, compact profile, static fallback, and reduced motion.
- Modify `content/projetos/roadmap.mdx`, `dochub.mdx`, `radar-fiscal.mdx`: safe public image paths.
- Add `public/projetos/roadmap.png`, `dochub.png`, `radar-fiscal.png`: selected/sanitized real project material.
- Modify `src/lib/content.test.ts`: require real visual material for Alinnea, Roadmap, DocHub, and Radar Fiscal.
- Modify `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, and `.impeccable/surfaces/src-app-page-tsx.md`: record the shipped spatial system after QA.

---

### Task 1: Motion profiles and frame lifecycle

**Files:**
- Create: `src/lib/motion/profile.ts`
- Create: `src/lib/motion/profile.test.ts`
- Create: `src/lib/motion/render-loop.ts`
- Create: `src/lib/motion/render-loop.test.ts`

**Interfaces:**
- Produces: `type MotionProfile = 'static' | 'compact' | 'full'`.
- Produces: `selectMotionProfile(capabilities: MotionCapabilities): MotionProfile`.
- Produces: `profileDpr(profile: MotionProfile, devicePixelRatio: number): number`.
- Produces: `createRenderLoop(render: (time: number) => void, platform?: FramePlatform): RenderLoop`.
- `FramePlatform` exposes `request`, `cancel`, `addVisibilityListener`, `removeVisibilityListener`, and `isHidden`.

- [ ] **Step 1: Write failing profile tests**

```ts
import { describe, expect, it } from 'vitest';
import { profileDpr, selectMotionProfile } from '@/lib/motion/profile';

describe('motion profile', () => {
  it('chooses static before allocating graphics when motion is reduced or WebGL2 is absent', () => {
    expect(selectMotionProfile({ reducedMotion: true, webgl2: true, saveData: false, width: 1440, cores: 8 })).toBe('static');
    expect(selectMotionProfile({ reducedMotion: false, webgl2: false, saveData: false, width: 1440, cores: 8 })).toBe('static');
  });

  it('chooses compact for constrained or narrow devices and full otherwise', () => {
    expect(selectMotionProfile({ reducedMotion: false, webgl2: true, saveData: true, width: 1440, cores: 8 })).toBe('compact');
    expect(selectMotionProfile({ reducedMotion: false, webgl2: true, saveData: false, width: 390, cores: 8 })).toBe('compact');
    expect(selectMotionProfile({ reducedMotion: false, webgl2: true, saveData: false, width: 1440, cores: 8 })).toBe('full');
  });

  it('caps rendering density by profile', () => {
    expect(profileDpr('full', 3)).toBe(1.5);
    expect(profileDpr('compact', 3)).toBe(1);
    expect(profileDpr('static', 3)).toBe(1);
  });
});
```

- [ ] **Step 2: Run the profile test and observe RED**

Run: `npm test -- src/lib/motion/profile.test.ts`

Expected: FAIL because `@/lib/motion/profile` does not exist.

- [ ] **Step 3: Implement the pure profile contract**

```ts
export type MotionProfile = 'static' | 'compact' | 'full';

export type MotionCapabilities = {
  reducedMotion: boolean;
  webgl2: boolean;
  saveData: boolean;
  width: number;
  cores: number;
};

export function selectMotionProfile(input: MotionCapabilities): MotionProfile {
  if (input.reducedMotion || !input.webgl2) return 'static';
  if (input.saveData || input.width < 768 || input.cores <= 4) return 'compact';
  return 'full';
}

export function profileDpr(profile: MotionProfile, value: number): number {
  return Math.min(Math.max(value || 1, 1), profile === 'full' ? 1.5 : 1);
}
```

- [ ] **Step 4: Write and run failing render-loop lifecycle tests**

```ts
import { describe, expect, it, vi } from 'vitest';
import { createRenderLoop } from '@/lib/motion/render-loop';

it('keeps one frame scheduled and cancels it on destroy', () => {
  const request = vi.fn(() => 41);
  const cancel = vi.fn();
  const render = vi.fn();
  const listeners = new Set<() => void>();
  const platform = {
    request,
    cancel,
    addVisibilityListener: (fn: () => void) => listeners.add(fn),
    removeVisibilityListener: (fn: () => void) => listeners.delete(fn),
    isHidden: () => false,
  };

  const loop = createRenderLoop(render, platform);
  expect(request).toHaveBeenCalledTimes(1);
  loop.destroy();
  expect(cancel).toHaveBeenCalledWith(41);
  expect(listeners.size).toBe(0);
});
```

Run: `npm test -- src/lib/motion/render-loop.test.ts`

Expected: FAIL because `createRenderLoop` does not exist.

- [ ] **Step 5: Implement one pausable loop and verify GREEN**

```ts
export type FramePlatform = {
  request: (callback: FrameRequestCallback) => number;
  cancel: (id: number) => void;
  addVisibilityListener: (callback: () => void) => void;
  removeVisibilityListener: (callback: () => void) => void;
  isHidden: () => boolean;
};

export type RenderLoop = { pause(): void; resume(): void; destroy(): void };

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
    if (!destroyed && frame === null && !platform.isHidden()) frame = platform.request(tick);
  };
  const visibility = () => (platform.isHidden() ? pause() : resume());
  platform.addVisibilityListener(visibility);
  resume();
  return {
    pause,
    resume,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      pause();
      platform.removeVisibilityListener(visibility);
    },
  };
}
```

Define `browserFramePlatform` in the same file using `requestAnimationFrame`, `cancelAnimationFrame`, and `document.visibilityState`.

Run: `npm test -- src/lib/motion/profile.test.ts src/lib/motion/render-loop.test.ts`

Expected: both files PASS.

- [ ] **Step 6: Commit the tested foundation**

```bash
git add src/lib/motion/profile.ts src/lib/motion/profile.test.ts src/lib/motion/render-loop.ts src/lib/motion/render-loop.test.ts
git commit -m "feat: add adaptive motion runtime foundation"
```

---

### Task 2: Raw WebGL2 spatial renderer

**Files:**
- Create: `src/lib/motion/spatial-shaders.ts`
- Create: `src/lib/motion/spatial-renderer.ts`
- Create: `src/lib/motion/spatial-renderer.test.ts`

**Interfaces:**
- Consumes: `MotionProfile`, `profileDpr`, and `createRenderLoop` from Task 1.
- Produces: `type SpatialSection = 0 | 1 | 2 | 3 | 4 | 5 | 6` for hero through contact.
- Produces: `type SpatialTarget = { progress: number; section: SpatialSection; energy: number; depth: number; density: number; pointerX: number; pointerY: number }`.
- Produces: `createSpatialRenderer(canvas: HTMLCanvasElement, profile: Exclude<MotionProfile, 'static'>, platform?: FramePlatform): SpatialRenderer | null`.
- `SpatialRenderer` exposes `setTarget(partial)`, `resize()`, `pause()`, `resume()`, and `destroy()`.

- [ ] **Step 1: Write renderer failure and cleanup tests**

```ts
import { describe, expect, it, vi } from 'vitest';
import { createSpatialRenderer } from '@/lib/motion/spatial-renderer';

function makeFakeWebGl2Context() {
  const loseContext = vi.fn();
  const gl = {
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    COMPILE_STATUS: 3,
    LINK_STATUS: 4,
    BLEND: 5,
    SRC_ALPHA: 6,
    ONE_MINUS_SRC_ALPHA: 7,
    COLOR_BUFFER_BIT: 8,
    TRIANGLES: 9,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ''),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => ''),
    deleteProgram: vi.fn(),
    getUniformLocation: vi.fn(() => ({})),
    useProgram: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    enable: vi.fn(),
    blendFunc: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
    viewport: vi.fn(),
    drawArrays: vi.fn(),
    getExtension: vi.fn((name: string) => name === 'WEBGL_lose_context' ? { loseContext } : null),
  };
  return { gl, loseContext };
}

const framePlatform = {
  request: vi.fn(() => 9),
  cancel: vi.fn(),
  addVisibilityListener: vi.fn(),
  removeVisibilityListener: vi.fn(),
  isHidden: () => false,
};

it('returns null without a WebGL2 context', () => {
  const canvas = document.createElement('canvas');
  vi.spyOn(canvas, 'getContext').mockReturnValue(null);
  expect(createSpatialRenderer(canvas, 'full')).toBeNull();
});

it('releases the program and loses the context on destroy', () => {
  const { gl, loseContext } = makeFakeWebGl2Context();
  const canvas = document.createElement('canvas');
  vi.spyOn(canvas, 'getContext').mockReturnValue(gl as never);
  const renderer = createSpatialRenderer(canvas, 'compact', framePlatform);
  renderer?.destroy();
  expect(gl.deleteProgram).toHaveBeenCalledTimes(1);
  expect(loseContext).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run the renderer test and observe RED**

Run: `npm test -- src/lib/motion/spatial-renderer.test.ts`

Expected: FAIL because the renderer module does not exist.

- [ ] **Step 3: Add the full-screen shaders**

```ts
export const spatialVertexShader = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p * 0.5;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const spatialFragmentShader = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float uTime;
uniform float uProgress;
uniform float uSection;
uniform float uEnergy;
uniform float uDepth;
uniform float uDensity;
uniform vec2 uPointer;
uniform float uAspect;

float line(float value, float width) {
  return 1.0 - smoothstep(width, width + 0.012, abs(value));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uAspect;
  uv += uPointer * vec2(0.08, 0.05);
  float z = max(0.2, uDepth + length(uv) * 0.35);
  vec2 warped = uv / z;
  warped.y += sin(warped.x * 2.0 + uTime * 0.18 + uSection) * 0.08 * uEnergy;
  float scale = mix(4.0, 11.0, uDensity);
  vec2 gridUv = fract(warped * scale + vec2(uProgress * 0.7, uTime * 0.025)) - 0.5;
  float grid = max(line(gridUv.x, 0.012), line(gridUv.y, 0.012));
  float pulse = pow(max(0.0, sin((warped.x + warped.y) * 3.5 - uTime * 0.65 + uSection)), 10.0);
  float vignette = smoothstep(1.45, 0.15, length(uv));
  vec3 paper = vec3(0.949, 0.949, 0.941);
  vec3 lime = vec3(0.831, 1.0, 0.0);
  vec3 color = mix(paper, lime, clamp(pulse * uEnergy + uSection / 12.0, 0.0, 0.72));
  float alpha = (grid * 0.16 + pulse * 0.24) * vignette * uEnergy;
  outColor = vec4(color, alpha);
}`;
```

- [ ] **Step 4: Implement renderer allocation and interpolation**

Use this renderer shape; `compileShader` throws with `getShaderInfoLog`, and `linkProgram` deletes both shaders after linking:

```ts
export type SpatialTarget = {
  progress: number;
  section: SpatialSection;
  energy: number;
  depth: number;
  density: number;
  pointerX: number;
  pointerY: number;
};

const initial: SpatialTarget = {
  progress: 0, section: 0, energy: 0.35, depth: 1, density: 0.3, pointerX: 0, pointerY: 0,
};

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('WebGL: shader indisponível');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'falha de compilação';
    gl.deleteShader(shader);
    throw new Error(`WebGL: ${message}`);
  }
  return shader;
}

function linkProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error('WebGL: programa indisponível');
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? 'falha de link';
    gl.deleteProgram(program);
    throw new Error(`WebGL: ${message}`);
  }
  return program;
}

export function createSpatialRenderer(
  canvas: HTMLCanvasElement,
  profile: 'compact' | 'full',
  platform?: FramePlatform,
): SpatialRenderer | null {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const program = linkProgram(gl, spatialVertexShader, spatialFragmentShader);
  const locations = {
    time: gl.getUniformLocation(program, 'uTime'),
    progress: gl.getUniformLocation(program, 'uProgress'),
    section: gl.getUniformLocation(program, 'uSection'),
    energy: gl.getUniformLocation(program, 'uEnergy'),
    depth: gl.getUniformLocation(program, 'uDepth'),
    density: gl.getUniformLocation(program, 'uDensity'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    aspect: gl.getUniformLocation(program, 'uAspect'),
  };
  const current: Record<keyof SpatialTarget, number> = { ...initial };
  const target = { ...initial };
  let last = 0;
  const resize = () => {
    const dpr = profileDpr(profile, window.devicePixelRatio);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };
  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const loop = createRenderLoop((time) => {
    resize();
    const delta = Math.min(0.05, (time - last) / 1000 || 0.016);
    last = time;
    const damping = 1 - Math.exp(-8 * delta);
    for (const key of Object.keys(current) as (keyof SpatialTarget)[]) {
      current[key] += (target[key] - current[key]) * damping;
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(locations.time, time / 1000);
    gl.uniform1f(locations.progress, current.progress);
    gl.uniform1f(locations.section, current.section);
    gl.uniform1f(locations.energy, current.energy);
    gl.uniform1f(locations.depth, current.depth);
    gl.uniform1f(locations.density, current.density);
    gl.uniform2f(locations.pointer, current.pointerX, current.pointerY);
    gl.uniform1f(locations.aspect, canvas.width / canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, platform);
  canvas.dataset.profile = profile;
  return {
    setTarget(patch) { Object.assign(target, patch); },
    resize,
    pause: loop.pause,
    resume: loop.resume,
    destroy() {
      loop.destroy();
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
```

- [ ] **Step 5: Verify renderer GREEN and compile the app**

Run: `npm test -- src/lib/motion/spatial-renderer.test.ts && npm run typecheck`

Expected: renderer tests PASS and TypeScript exits 0.

- [ ] **Step 6: Commit the renderer**

```bash
git add src/lib/motion/spatial-shaders.ts src/lib/motion/spatial-renderer.ts src/lib/motion/spatial-renderer.test.ts
git commit -m "feat: add procedural WebGL spatial renderer"
```

---

### Task 3: Client experience boundary and static fallback

**Files:**
- Create: `src/components/ScrollExperience.tsx`
- Create: `src/components/ScrollExperience.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: Task 1 profile selection and Task 2 renderer.
- Produces: one `<canvas data-spatial-canvas>` and root state `document.documentElement.dataset.motionProfile`.
- Later tasks consume the mounted canvas and profile through `ScrollExperience`; no global singleton is exported.

- [ ] **Step 1: Write failing component tests**

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ScrollExperience } from '@/components/ScrollExperience';

it('renders one decorative non-interactive canvas', () => {
  const { container } = render(<ScrollExperience />);
  const canvas = container.querySelector('[data-spatial-canvas]');
  expect(canvas).toHaveAttribute('aria-hidden', 'true');
  expect(canvas).toHaveClass('pointer-events-none');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('does not initialize graphics when reduced motion is active', async () => {
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');
  render(<ScrollExperience />);
  expect(getContext).not.toHaveBeenCalled();
  expect(document.documentElement.dataset.motionProfile).toBe('static');
});
```

The shared test setup already reports `prefers-reduced-motion: reduce`, so the second assertion covers the static path.

- [ ] **Step 2: Run the component test and observe RED**

Run: `npm test -- src/components/ScrollExperience.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement lazy initialization**

`ScrollExperience` uses `useEffect` and a canvas ref. In this task it owns the renderer; Task 6 adds the orchestrator after that module exists.

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { selectMotionProfile } from '@/lib/motion/profile';

export function ScrollExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let destroy: (() => void) | undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      document.documentElement.dataset.motionProfile = 'static';
      return;
    }
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
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
      if (disposed) return;
      const renderer = createSpatialRenderer(canvas, profile);
      if (!renderer) {
        document.documentElement.dataset.motionProfile = 'static';
        return;
      }
      document.documentElement.dataset.motionReady = 'true';
      destroy = () => renderer.destroy();
    });
    return () => {
      disposed = true;
      destroy?.();
      delete document.documentElement.dataset.motionReady;
      delete document.documentElement.dataset.motionProfile;
    };
  }, []);
  return <canvas ref={canvasRef} data-spatial-canvas aria-hidden="true" className="spatial-canvas pointer-events-none" />;
}
```

- [ ] **Step 4: Mount once and add base layer CSS**

Place `<ScrollExperience />` before `<Abertura />` in `src/app/page.tsx` and add:

```css
.spatial-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 600ms var(--ease-fast);
}

html[data-motion-ready='true'][data-motion-profile='full'] .spatial-canvas,
html[data-motion-ready='true'][data-motion-profile='compact'] .spatial-canvas {
  opacity: 1;
}

main > section {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 5: Verify static fallback GREEN**

Run: `npm test -- src/components/ScrollExperience.test.tsx src/components/Abertura.test.tsx && npm run typecheck`

Expected: tests PASS, hero contract remains PASS, typecheck exits 0.

- [ ] **Step 6: Commit the isolated client boundary**

```bash
git add src/components/ScrollExperience.tsx src/components/ScrollExperience.test.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: mount accessible spatial experience boundary"
```

---

### Task 4: Safe real project media

**Files:**
- Add: `public/projetos/roadmap.png`
- Add: `public/projetos/dochub.png`
- Add: `public/projetos/radar-fiscal.png`
- Modify: `content/projetos/roadmap.mdx`
- Modify: `content/projetos/dochub.mdx`
- Modify: `content/projetos/radar-fiscal.mdx`
- Modify: `src/lib/content.test.ts`

**Interfaces:**
- Produces project image paths `/projetos/alinnea.png`, `/projetos/roadmap.png`, `/projetos/dochub.png`, `/projetos/radar-fiscal.png` through the existing `Projeto.imagem` field.
- Consumed by `Projetos` without schema changes.

- [ ] **Step 1: Write the failing visual-material contract**

```ts
it('loads safe visual proof for the four operational products', () => {
  const images = Object.fromEntries(getProjetos().map(({ slug, imagem }) => [slug, imagem]));
  expect(images).toMatchObject({
    alinnea: '/projetos/alinnea.png',
    roadmap: '/projetos/roadmap.png',
    dochub: '/projetos/dochub.png',
    'radar-fiscal': '/projetos/radar-fiscal.png',
  });
  for (const path of Object.values(images).filter(Boolean)) {
    expect(fs.existsSync(join(process.cwd(), 'public', String(path).replace(/^\//, '')))).toBe(true);
  }
});
```

Add `node:fs` and `node:path` imports to the test.

- [ ] **Step 2: Run the test and observe RED**

Run: `npm test -- src/lib/content.test.ts`

Expected: FAIL because Roadmap, DocHub, and Radar Fiscal have no public image.

- [ ] **Step 3: Add the safe DocHub and Roadmap sources**

- Copy `C:\Users\leand\OneDrive\Documentos\ShareX\Screenshots\2026-08\screencapture-localhost-5173-obras-nova-2026-08-02-16_57_23.png` to `public/projetos/dochub.png`.
- Copy `C:\Users\leand\AppData\Local\Temp\codex-clipboard-2ff71d18-9eec-44fe-ab6b-3bcf5ce18692.png` to `public/projetos/roadmap.png`.
- Inspect both copied files at original detail and confirm no personal names, credentials, CNPJ, CPF, or internal UUIDs are visible.

- [ ] **Step 4: Create and inspect the Radar Fiscal derivative**

Use the image editing tool with source `C:\Users\leand\AppData\Local\Temp\codex-clipboard-670dddba-4fbd-450c-a741-e6621cefab44.png` and this exact intent: preserve the Parcelamentos interface, replace the top CNPJ and partial email with neutral demo labels, keep the already blurred client row blurred, remove any remaining identifiers, and do not invent metrics. Save the resulting flat image as `public/projetos/radar-fiscal.png`, then inspect at original detail. Never copy the source screenshot into `public`.

- [ ] **Step 5: Point MDX to the safe assets and verify GREEN**

Add `imagem: /projetos/roadmap.png`, `imagem: /projetos/dochub.png`, and `imagem: /projetos/radar-fiscal.png` to the respective frontmatter.

Run: `npm test -- src/lib/content.test.ts`

Expected: all content tests PASS.

- [ ] **Step 6: Commit only public derivatives and content references**

```bash
git add public/projetos/roadmap.png public/projetos/dochub.png public/projetos/radar-fiscal.png content/projetos/roadmap.mdx content/projetos/dochub.mdx content/projetos/radar-fiscal.mdx src/lib/content.test.ts
git commit -m "feat: add safe visual proof for operational projects"
```

---

### Task 5: Stable semantic motion hooks

**Files:**
- Create: `src/components/HomeMotion.test.tsx`
- Modify: `src/components/Titulo.tsx`
- Modify: `src/components/Projetos.tsx`
- Modify: `src/components/Stack.tsx`
- Modify: `src/components/Processo.tsx`
- Modify: `src/components/Trajetoria.tsx`
- Modify: `src/components/Notas.tsx`
- Modify: `src/components/Contato.tsx`

**Interfaces:**
- Produces `data-motion-section="projects|stack|process|trajectory|notes|contact"` on six sections.
- Produces reusable hooks: `data-motion-title`, `data-motion-copy`, `data-motion-item`, `data-project-stage`, `data-project-plane`, `data-project-media`, and `data-contact-link`.
- Orchestrator in Task 6 consumes only these hooks, never Tailwind class names.

- [ ] **Step 1: Write failing semantic hook tests**

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Projetos } from '@/components/Projetos';
import { Stack } from '@/components/Stack';
import { Processo } from '@/components/Processo';
import { Trajetoria } from '@/components/Trajetoria';
import { Notas } from '@/components/Notas';
import { Contato } from '@/components/Contato';
import { getNotas, getProjetos } from '@/lib/content';

it('exposes semantic hooks without hiding content before runtime activation', () => {
  const projetos = getProjetos();
  const { container } = render(<>
    <Projetos projetos={projetos} />
    <Stack />
    <Processo />
    <Trajetoria />
    <Notas notas={getNotas()} />
    <Contato />
  </>);
  expect(Array.from(container.querySelectorAll('[data-motion-section]')).map((node) => node.getAttribute('data-motion-section'))).toEqual([
    'projects', 'stack', 'process', 'trajectory', 'notes', 'contact',
  ]);
  expect(container.querySelectorAll('[data-project-plane]')).toHaveLength(projetos.length);
  for (const section of container.querySelectorAll('[data-motion-section]')) {
    expect(section.querySelector('[data-motion-title], #contato-titulo')).not.toBeNull();
  }
  expect(screen.getByRole('heading', { name: 'Projetos selecionados' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'WhatsApp' })).toBeVisible();
  for (const element of container.querySelectorAll<HTMLElement>('[data-motion-item], [data-motion-title], [data-motion-copy]')) {
    expect(element.style.opacity).toBe('');
    expect(element.style.visibility).toBe('');
  }
});
```

- [ ] **Step 2: Run the hook test and observe RED**

Run: `npm test -- src/components/HomeMotion.test.tsx`

Expected: FAIL because the motion data attributes do not exist.

- [ ] **Step 3: Add section and title hooks without changing copy**

Apply this exact mapping while keeping DOM order, heading levels, links, and copy unchanged:

```tsx
// Titulo.tsx
<h2
  data-motion-title
  className="title max-w-[14ch] text-[2.25rem] text-paper sm:text-[3rem] md:text-[3.75rem]"
>
  {children}
</h2>
<div data-motion-copy className="lg:pb-2">
  <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-mid sm:text-base">{apoio}</p>
  {acao ? <div className="mt-6">{acao}</div> : null}
</div>

// Repeated items: add the attribute to these exact existing opening tags.
<li data-motion-item key={item.nome} className="grid gap-4 border-t border-line py-7 sm:grid-cols-[3rem_minmax(0,0.8fr)_minmax(16rem,1fr)] sm:items-baseline sm:gap-8 md:py-9">
<li data-motion-item key={etapa.numero} className="flex min-h-full flex-col bg-ink p-6 sm:p-8">
<li data-motion-item key={marco.periodo} className="grid gap-4 border-t border-line py-8 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8 md:py-10">
<li data-motion-item key={nota.slug} className="border-t border-line">
<a data-contact-link href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group flex min-h-14 items-center justify-between gap-4 border-b border-black/30 py-4 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-mark sm:text-base">
```

Set the section-root values directly on their existing `<section>` elements: `projects` in `Projetos`, `stack` in `Stack`, `process` in `Processo`, `trajectory` in `Trajetoria`, `notes` in `Notas`, and `contact` in `Contato`. The project image wrapper receives `data-project-media`; no attribute may duplicate an existing `id`.

- [ ] **Step 4: Reshape projects into an intentional stage**

Wrap both highlighted and secondary groups in a single `data-project-stage`. Pass `index` into `ProjetoCard` and set the custom property without changing the existing order:

```tsx
<article
  data-motion-item
  data-project-plane={projeto.slug}
  style={{ '--project-index': index } as React.CSSProperties}
  className={`group flex min-h-full flex-col bg-ink ${className}`}
>
```

Preserve a normal vertical flow in HTML; sticky/perspective behavior is progressive enhancement only.

- [ ] **Step 5: Verify semantic GREEN**

Run: `npm test -- src/components/HomeMotion.test.tsx src/lib/content.test.ts`

Expected: hooks and content tests PASS.

- [ ] **Step 6: Commit semantic hooks**

```bash
git add src/components/HomeMotion.test.tsx src/components/Titulo.tsx src/components/Projetos.tsx src/components/Stack.tsx src/components/Processo.tsx src/components/Trajetoria.tsx src/components/Notas.tsx src/components/Contato.tsx
git commit -m "feat: expose semantic hooks for spatial choreography"
```

---

### Task 6: Scroll choreography across every section

**Files:**
- Create: `src/lib/motion/orchestrator.ts`
- Create: `src/lib/motion/orchestrator.test.ts`
- Modify: `src/components/ScrollExperience.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes Task 2 `SpatialRenderer`, Task 5 data hooks, GSAP, and ScrollTrigger.
- Produces `createMotionOrchestrator({ root, renderer, profile, gsap, ScrollTrigger }): () => void` where the return value kills every trigger/timeline and pointer listener created by this instance.
- Section-to-scene mapping is fixed: hero `0`, projects `1`, stack `2`, process `3`, trajectory `4`, notes `5`, contact `6`.

- [ ] **Step 1: Write failing orchestrator lifecycle tests**

```ts
import { beforeEach, expect, it, vi } from 'vitest';
import { createMotionOrchestrator } from '@/lib/motion/orchestrator';

function fixture() {
  document.body.innerHTML = ['projects', 'stack', 'process', 'trajectory', 'notes', 'contact']
    .map((name) => `<section data-motion-section="${name}"><h2 data-motion-title>${name}</h2><p data-motion-copy>copy</p><div data-motion-item></div></section>`)
    .join('');
  document.querySelector('[data-motion-section="projects"]')?.insertAdjacentHTML('beforeend', '<div data-project-stage><article data-project-plane="demo"><div data-project-media></div></article></div>');
}

function adapters() {
  const configs: Record<string, unknown>[] = [];
  const kill = vi.fn();
  const scrollTrigger = { kill };
  const timelineObject = { fromTo: vi.fn(), kill, scrollTrigger };
  timelineObject.fromTo.mockReturnValue(timelineObject);
  const gsap = {
    fromTo: vi.fn(() => ({ scrollTrigger })),
    timeline: vi.fn(() => timelineObject),
  };
  const ScrollTrigger = {
    create: vi.fn((config: Record<string, unknown>) => {
      configs.push(config);
      return { kill };
    }),
  };
  return { configs, kill, gsap, ScrollTrigger };
}

beforeEach(fixture);

it('creates nothing for the static profile', () => {
  const api = adapters();
  const destroy = createMotionOrchestrator({ root: document, renderer: { setTarget: vi.fn() }, profile: 'static', gsap: api.gsap, ScrollTrigger: api.ScrollTrigger });
  expect(api.ScrollTrigger.create).not.toHaveBeenCalled();
  destroy();
});

it('pins projects only in full and maps project progress to scene one', () => {
  const api = adapters();
  const setTarget = vi.fn();
  const destroy = createMotionOrchestrator({ root: document, renderer: { setTarget }, profile: 'full', gsap: api.gsap, ScrollTrigger: api.ScrollTrigger });
  expect(api.gsap.timeline).toHaveBeenCalledWith(expect.objectContaining({ scrollTrigger: expect.objectContaining({ pin: true, end: '+=180%' }) }));
  const projectConfig = api.configs.find((config) => (config.trigger as HTMLElement)?.dataset.motionSection === 'projects');
  (projectConfig?.onUpdate as (self: { progress: number }) => void)({ progress: 0.5 });
  expect(setTarget).toHaveBeenCalledWith(expect.objectContaining({ section: 1, progress: 0.5 }));
  destroy();
  expect(api.kill).toHaveBeenCalled();
});

it('does not create a pinned timeline in compact mode', () => {
  const api = adapters();
  createMotionOrchestrator({ root: document, renderer: { setTarget: vi.fn() }, profile: 'compact', gsap: api.gsap, ScrollTrigger: api.ScrollTrigger });
  expect(api.gsap.timeline).not.toHaveBeenCalled();
});
```

The test adapter type for `renderer` is `Pick<SpatialRenderer, 'setTarget'>`; production passes the full renderer.

- [ ] **Step 2: Run the orchestrator test and observe RED**

Run: `npm test -- src/lib/motion/orchestrator.test.ts`

Expected: FAIL because the orchestrator does not exist.

- [ ] **Step 3: Implement shared section transitions**

Define the section state table and track every resource created by this instance:

```ts
const sectionTargets = {
  projects: { section: 1, energy: 0.78, depth: 0.72, density: 0.62 },
  stack: { section: 2, energy: 0.9, depth: 0.88, density: 0.9 },
  process: { section: 3, energy: 0.72, depth: 0.64, density: 0.55 },
  trajectory: { section: 4, energy: 0.62, depth: 1.1, density: 0.42 },
  notes: { section: 5, energy: 0.38, depth: 1.25, density: 0.28 },
  contact: { section: 6, energy: 1, depth: 0.55, density: 0.82 },
} as const;

export function createMotionOrchestrator({ root, renderer, profile, gsap, ScrollTrigger }: Options) {
  if (profile === 'static') return () => {};
  const resources: Array<{ kill(): void }> = [];
  const sections = root.querySelectorAll<HTMLElement>('[data-motion-section]');
  sections.forEach((section) => {
    const name = section.dataset.motionSection as keyof typeof sectionTargets;
    const target = sectionTargets[name];
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      end: 'bottom 22%',
      scrub: 0.65,
      onUpdate(self) {
        renderer.setTarget({ ...target, progress: self.progress });
      },
    });
    resources.push(trigger);
    for (const element of section.querySelectorAll<HTMLElement>('[data-motion-title], [data-motion-copy]')) {
      const tween = gsap.fromTo(
        element,
        { yPercent: element.hasAttribute('data-motion-title') ? 48 : 22, opacity: 0.25 },
        { yPercent: 0, opacity: 1, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: element, start: 'top 88%', end: 'top 58%', scrub: 0.45 } },
      );
      if (tween.scrollTrigger) resources.push(tween.scrollTrigger);
    }
  });
  return () => resources.splice(0).forEach((resource) => resource.kill());
}
```

Keep `Options` structural and testable: `root: ParentNode`, `renderer: SpatialRenderer`, `profile: MotionProfile`, and injected GSAP/ScrollTrigger adapters with only the methods used above and below.

- [ ] **Step 4: Implement the project signature moment**

Add this branch inside the orchestrator and push the timeline plus its trigger into `resources`:

```ts
const stage = root.querySelector<HTMLElement>('[data-project-stage]');
const planes = stage ? Array.from(stage.querySelectorAll<HTMLElement>('[data-project-plane]')) : [];
if (stage && profile === 'full') {
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: stage, start: 'top 12%', end: '+=180%', scrub: 0.8, pin: true, anticipatePin: 1 },
  });
  planes.forEach((plane, index) => {
    timeline.fromTo(
      plane,
      { z: -260 - index * 90, y: 110 + index * 24, rotateX: 9, rotateY: index % 2 ? -7 : 7, scale: 0.88, opacity: 0.18 },
      { z: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, opacity: 1, ease: 'power3.out', immediateRender: false },
      index * 0.16,
    );
    const media = plane.querySelector<HTMLElement>('[data-project-media]');
    if (media) timeline.fromTo(media, { yPercent: -5 }, { yPercent: 5, ease: 'none' }, index * 0.16);
  });
  resources.push(timeline);
} else {
  planes.forEach((plane) => {
    const tween = gsap.fromTo(plane, { y: 64, rotateX: 5, opacity: 0.35 }, {
      y: 0, rotateX: 0, opacity: 1, immediateRender: false, ease: 'power3.out',
      scrollTrigger: { trigger: plane, start: 'top 90%', end: 'top 62%', scrub: 0.4 },
    });
    if (tween.scrollTrigger) resources.push(tween.scrollTrigger);
  });
}
```

- [ ] **Step 5: Implement section-specific motion**

Insert the following blocks before the Task 3 return, then replace that return with the cleanup shown at the end. Use one helper for item groups and explicit per-section parameters:

```ts
function revealItems(sectionName: string, from: Record<string, string | number>, stagger = 0.08) {
  const section = root.querySelector<HTMLElement>(`[data-motion-section="${sectionName}"]`);
  if (!section) return;
  const items = section.querySelectorAll<HTMLElement>('[data-motion-item], [data-contact-link]');
  const tween = gsap.fromTo(items, from, {
    x: 0, y: 0, z: 0, rotateX: 0, opacity: 1,
    stagger, ease: 'power3.out', immediateRender: false,
    scrollTrigger: { trigger: section, start: 'top 76%', end: 'bottom 48%', scrub: 0.55 },
  });
  if (tween.scrollTrigger) resources.push(tween.scrollTrigger);
}

revealItems('stack', { y: 72, z: -90, opacity: 0.2 }, 0.07);
revealItems('process', { y: 90, z: -180, rotateX: 12, opacity: 0.18 }, 0.13);
revealItems('trajectory', { x: 44, z: -70, opacity: 0.25 }, 0.08);
revealItems('notes', { y: 38, z: -28, opacity: 0.35 }, 0.06);
revealItems('contact', { y: 32, z: -55, opacity: 0.4 }, 0.09);

const trajectory = root.querySelector<HTMLElement>('[data-motion-section="trajectory"]');
if (trajectory) {
  const lineTween = gsap.fromTo(trajectory, { '--timeline-progress': 0 }, {
    '--timeline-progress': 1, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: trajectory, start: 'top 70%', end: 'bottom 55%', scrub: true },
  });
  if (lineTween.scrollTrigger) resources.push(lineTween.scrollTrigger);
}

let pointerCleanup: (() => void) | undefined;
if (profile === 'full' && window.matchMedia('(pointer: fine)').matches) {
  const pointer = (event: PointerEvent) => renderer.setTarget({
    pointerX: Math.max(-1, Math.min(1, event.clientX / innerWidth * 2 - 1)),
    pointerY: Math.max(-1, Math.min(1, 1 - event.clientY / innerHeight * 2)),
  });
  window.addEventListener('pointermove', pointer, { passive: true });
  pointerCleanup = () => window.removeEventListener('pointermove', pointer);
}

const process = root.querySelector<HTMLElement>('[data-motion-section="process"]');
if (process) {
  const processTween = gsap.fromTo(process, { '--process-progress': 0 }, {
    '--process-progress': 1, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: process, start: 'top 72%', end: 'bottom 58%', scrub: true },
  });
  if (processTween.scrollTrigger) resources.push(processTween.scrollTrigger);
}

return () => {
  pointerCleanup?.();
  resources.splice(0).forEach((resource) => resource.kill());
};
```

Add a `::before` line on the process grid that scales from `0` to `1` using `--process-progress`.

- [ ] **Step 6: Add progressive-enhancement CSS**

Define perspective and `transform-style: preserve-3d` only under `html[data-motion-ready='true']`. Use opaque/near-opaque section surfaces where text needs contrast and transparent windows only around intentional spatial moments. Under `static` or reduced motion, reset transform/clip-path/opacity and disable sticky project behavior.

- [ ] **Step 7: Verify choreography GREEN**

Run: `npm test -- src/lib/motion/orchestrator.test.ts src/components/ScrollExperience.test.tsx src/components/HomeMotion.test.tsx && npm run typecheck`

Expected: all focused tests PASS and typecheck exits 0.

- [ ] **Step 8: Commit the complete choreography**

```bash
git add src/lib/motion/orchestrator.ts src/lib/motion/orchestrator.test.ts src/components/ScrollExperience.tsx src/app/globals.css
git commit -m "feat: choreograph spatial portfolio scroll experience"
```

---

### Task 7: Production QA, finish review, and durable documentation

**Files:**
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`
- Modify: `.impeccable/design.json`
- Modify: `.impeccable/surfaces/src-app-page-tsx.md`

**Interfaces:**
- Consumes the complete implementation and the approved spec.
- Produces verified production artifacts and updated design documentation; no runtime interface is added.

- [ ] **Step 1: Run the full automated gate**

Run:

```powershell
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: 0 failing tests, typecheck exit 0, 19 static/SSG pages generated, and no diff-check errors.

- [ ] **Step 2: Run production browser QA in one bounded pass**

Serve the fresh production build on an unused localhost port. Capture desktop `1440×900` and mobile `390×844` at hero, projects, stack/process, trajectory/notes, and contact. Verify console, horizontal overflow, header/WhatsApp visibility, focusable links during the project pin, and DOM visibility in the static profile.

- [ ] **Step 3: Measure runtime behavior**

During one complete automated scroll, collect animation-frame samples and `PerformanceObserver` long tasks. Confirm one canvas, one active render loop, no increasing trigger/listener count after reload, no sustained long task caused by rendering, DPR at or below the profile cap, and no rendering while `document.hidden` is true.

- [ ] **Step 4: Apply one batched correction and one confirmation**

Group every material issue found in the desktop/mobile/performance pass into one code correction. Rebuild once and capture one confirmation set. Do not enter an open-ended polish loop.

- [ ] **Step 5: Obtain the Impeccable finish verdict**

Send the approved spec, desktop/mobile captures, performance evidence, and reduced-motion evidence to the finish reviewer. Fix only material remaining items; final `remaining` must be `clear` or an honestly documented external limitation.

- [ ] **Step 6: Update durable product and design truth**

Record the WebGL2 field, profiles, data hooks, project-media privacy rule, section choreography, fallback, and performance constraints in `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, and the homepage surface brief. Use the Impeccable documenter for `DESIGN.md` and its sidecar; do not rerun the detector.

- [ ] **Step 7: Run the final verification fresh**

Run:

```powershell
npm test
npm run typecheck
npm run build
git diff --check
```

Read the full output before claiming completion.

- [ ] **Step 8: Commit documentation and verified corrections**

```bash
git add PRODUCT.md DESIGN.md .impeccable/design.json .impeccable/surfaces/src-app-page-tsx.md src public content
git commit -m "docs: record spatial portfolio motion system"
```

Stage exact intended files if unrelated untracked captures or tool caches remain present.
