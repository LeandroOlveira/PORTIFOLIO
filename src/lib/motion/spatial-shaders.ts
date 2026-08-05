export const spatialVertexShader = `#version 300 es
precision highp float;

out vec2 vUv;

void main() {
  vec2 point = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = point * 0.5;
  gl_Position = vec4(point * 2.0 - 1.0, 0.0, 1.0);
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

  float depth = max(0.2, uDepth + length(uv) * 0.35);
  vec2 warped = uv / depth;
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
