import { describe, expect, it, vi } from 'vitest';
import type { FramePlatform } from '@/lib/motion/render-loop';
import { createSpatialRenderer } from '@/lib/motion/spatial-renderer';

function createFakeWebGl2() {
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
    getExtension: vi.fn((name: string) => (name === 'WEBGL_lose_context' ? { loseContext } : null)),
  };

  return { gl, loseContext };
}

const framePlatform: FramePlatform = {
  request: vi.fn(() => 23),
  cancel: vi.fn(),
  addVisibilityListener: vi.fn(),
  removeVisibilityListener: vi.fn(),
  isHidden: () => false,
};

describe('spatial renderer', () => {
  it('does not allocate a renderer when WebGL2 is unavailable', () => {
    const canvas = document.createElement('canvas');
    vi.spyOn(canvas, 'getContext').mockReturnValue(null);

    expect(createSpatialRenderer(canvas, 'full', framePlatform)).toBeNull();
  });

  it('releases graphics and its pending frame when the portfolio unmounts', () => {
    const { gl, loseContext } = createFakeWebGl2();
    const canvas = document.createElement('canvas');
    vi.spyOn(canvas, 'getContext').mockReturnValue(gl as never);

    const renderer = createSpatialRenderer(canvas, 'compact', framePlatform);
    renderer?.destroy();

    expect(gl.deleteProgram).toHaveBeenCalledTimes(1);
    expect(framePlatform.cancel).toHaveBeenCalledWith(23);
    expect(loseContext).toHaveBeenCalledTimes(1);
  });
});
