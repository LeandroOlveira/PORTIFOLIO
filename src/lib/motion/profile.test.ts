import { describe, expect, it } from 'vitest';
import { profileDpr, selectMotionProfile } from '@/lib/motion/profile';

describe('motion profile', () => {
  it('keeps the experience static when reduced motion is requested or WebGL2 is unavailable', () => {
    expect(
      selectMotionProfile({
        reducedMotion: true,
        webgl2: true,
        saveData: false,
        width: 1440,
        cores: 8,
      }),
    ).toBe('static');
    expect(
      selectMotionProfile({
        reducedMotion: false,
        webgl2: false,
        saveData: false,
        width: 1440,
        cores: 8,
      }),
    ).toBe('static');
  });

  it('uses a compact profile for narrow, power-saving, or low-core devices', () => {
    expect(
      selectMotionProfile({
        reducedMotion: false,
        webgl2: true,
        saveData: true,
        width: 1440,
        cores: 8,
      }),
    ).toBe('compact');
    expect(
      selectMotionProfile({
        reducedMotion: false,
        webgl2: true,
        saveData: false,
        width: 390,
        cores: 8,
      }),
    ).toBe('compact');
    expect(
      selectMotionProfile({
        reducedMotion: false,
        webgl2: true,
        saveData: false,
        width: 1440,
        cores: 4,
      }),
    ).toBe('compact');
  });

  it('uses the full profile and caps pixel density by profile', () => {
    expect(
      selectMotionProfile({
        reducedMotion: false,
        webgl2: true,
        saveData: false,
        width: 1440,
        cores: 8,
      }),
    ).toBe('full');
    expect(profileDpr('full', 3)).toBe(1.5);
    expect(profileDpr('compact', 3)).toBe(1);
    expect(profileDpr('static', 3)).toBe(1);
  });
});
