import type { MotionProfile } from '@/lib/motion/profile';
import type { SpatialRenderer, SpatialSection, SpatialTarget } from '@/lib/motion/spatial-renderer';

type Killable = { kill: () => void };

type TriggerProgress = { progress: number };

export type ScrollTriggerAdapter = {
  create: (config: Record<string, unknown>) => Killable;
};

type Timeline = Killable & {
  fromTo: (
    targets: Element | Element[],
    from: Record<string, unknown>,
    to: Record<string, unknown>,
  ) => Timeline;
};

export type GsapAdapter = {
  fromTo: (
    targets: Element | Element[],
    from: Record<string, unknown>,
    to: Record<string, unknown>,
  ) => Killable;
  timeline: (config: Record<string, unknown>) => Timeline;
};

export type MotionOrchestratorOptions = {
  root: ParentNode;
  profile: MotionProfile;
  renderer?: SpatialRenderer;
  gsap: GsapAdapter;
  ScrollTrigger: ScrollTriggerAdapter;
};

type SectionName = 'projects' | 'stack' | 'process' | 'trajectory' | 'notes' | 'contact';

const sceneTargets: Record<SectionName, Partial<SpatialTarget>> = {
  projects: { section: 1, energy: 0.88, depth: 0.82, density: 0.92 },
  stack: { section: 2, energy: 0.58, depth: 1.12, density: 0.75 },
  process: { section: 3, energy: 0.76, depth: 0.95, density: 0.58 },
  trajectory: { section: 4, energy: 0.52, depth: 1.28, density: 0.4 },
  notes: { section: 5, energy: 0.3, depth: 1.4, density: 0.24 },
  contact: { section: 6, energy: 1, depth: 0.7, density: 0.85 },
};

function asSection(name: string | undefined): SectionName | undefined {
  if (name && name in sceneTargets) return name as SectionName;
  return undefined;
}

function sectionProgress(section: SpatialSection, progress: number): Partial<SpatialTarget> {
  return {
    section,
    progress,
  };
}

export function createMotionOrchestrator({
  root,
  profile,
  renderer,
  gsap,
  ScrollTrigger,
}: MotionOrchestratorOptions) {
  if (profile === 'static' || !renderer) return () => undefined;

  const killables: Killable[] = [];
  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-motion-section]'));

  for (const section of sections) {
    const name = asSection(section.dataset.motionSection);
    if (!name) continue;

    const target = sceneTargets[name];
    const scene = target.section as SpatialSection;
    const activate = () => renderer.setTarget(target);

    killables.push(
      ScrollTrigger.create({
        trigger: section,
        start: 'top 72%',
        end: 'bottom 28%',
        onEnter: activate,
        onEnterBack: activate,
        onUpdate: (self: TriggerProgress) => renderer.setTarget(sectionProgress(scene, self.progress)),
      }),
    );

    const elements = Array.from(
      section.querySelectorAll<Element>(
        '[data-motion-title], [data-motion-copy], [data-motion-item], [data-contact-link]',
      ),
    );

    if (elements.length > 0) {
      killables.push(
        gsap.fromTo(
          elements,
          { opacity: 0.48, y: profile === 'full' ? 48 : 24 },
          {
            opacity: 1,
            y: 0,
            duration: profile === 'full' ? 0.85 : 0.55,
            stagger: profile === 'full' ? 0.055 : 0.03,
            ease: 'power3.out',
            overwrite: 'auto',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          },
        ),
      );
    }
  }

  const projectStage = root.querySelector<HTMLElement>('[data-project-stage]');
  if (profile === 'full' && projectStage) {
    const planes = Array.from(projectStage.querySelectorAll<Element>('[data-project-plane]'));
    const media = Array.from(projectStage.querySelectorAll<Element>('[data-project-media]'));
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: projectStage,
        start: 'top 12%',
        end: 'bottom 88%',
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self: TriggerProgress) =>
          renderer.setTarget({ progress: self.progress, section: 1, energy: 0.92 }),
      },
    });

    timeline.fromTo(
      planes,
      { opacity: 0.6, yPercent: 14, rotateX: 6, transformPerspective: 1400 },
      { opacity: 1, yPercent: 0, rotateX: 0, stagger: 0.08, duration: 1 },
    );
    timeline.fromTo(
      media,
      { scale: 1.08, yPercent: -4 },
      { scale: 1, yPercent: 0, stagger: 0.08, duration: 0.9 },
    );
    killables.push(timeline);
  }

  const view = root.ownerDocument?.defaultView;
  const supportsHover = view?.matchMedia('(hover: hover)').matches ?? false;
  const pointer = (event: PointerEvent) => {
    if (!view) return;
    renderer.setTarget({
      pointerX: (event.clientX / view.innerWidth - 0.5) * 2,
      pointerY: (event.clientY / view.innerHeight - 0.5) * -2,
    });
  };

  if (profile === 'full' && supportsHover) {
    view?.addEventListener('pointermove', pointer, { passive: true });
  }

  return () => {
    for (const killable of killables) killable.kill();
    if (profile === 'full' && supportsHover) view?.removeEventListener('pointermove', pointer);
  };
}
