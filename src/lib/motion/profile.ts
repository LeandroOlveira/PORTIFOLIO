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

export function profileDpr(profile: MotionProfile, devicePixelRatio: number): number {
  const dpr = Math.max(1, devicePixelRatio || 1);
  return Math.min(dpr, profile === 'full' ? 1.5 : 1);
}
