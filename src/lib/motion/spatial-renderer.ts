import type { FramePlatform, RenderLoop } from '@/lib/motion/render-loop';
import { createRenderLoop } from '@/lib/motion/render-loop';
import { profileDpr } from '@/lib/motion/profile';
import type { MotionProfile } from '@/lib/motion/profile';
import { spatialFragmentShader, spatialVertexShader } from '@/lib/motion/spatial-shaders';

export type SpatialSection = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SpatialTarget = {
  progress: number;
  section: SpatialSection;
  energy: number;
  depth: number;
  density: number;
  pointerX: number;
  pointerY: number;
};

export type SpatialRenderer = {
  setTarget: (patch: Partial<SpatialTarget>) => void;
  resize: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
};

const initialTarget: SpatialTarget = {
  progress: 0,
  section: 0,
  energy: 0.35,
  depth: 1,
  density: 0.3,
  pointerX: 0,
  pointerY: 0,
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
  profile: Exclude<MotionProfile, 'static'>,
  platform?: FramePlatform,
): SpatialRenderer | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  }) as WebGL2RenderingContext | null;

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

  const current: Record<keyof SpatialTarget, number> = { ...initialTarget };
  const target: SpatialTarget = { ...initialTarget };
  let lastTime = 0;
  let destroyed = false;
  let loop: RenderLoop;

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

  loop = createRenderLoop((time) => {
    resize();
    const delta = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
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
    setTarget: (patch) => Object.assign(target, patch),
    resize,
    pause: loop.pause,
    resume: loop.resume,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      loop.destroy();
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
