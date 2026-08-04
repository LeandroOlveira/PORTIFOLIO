/**
 * Um único observador de scroll para a página inteira. O cabeçote de
 * reprodução é o scroll, e todo mundo que mostra timecode lê daqui em vez de
 * registrar o próprio listener.
 */

type Sub = (progresso: number) => void;

const subs = new Set<Sub>();
let quadro = 0;
let ligado = false;

/** 2 minutos a 24 quadros por segundo. A página inteira é esse rolo. */
export const FPS = 24;
export const QUADROS_TOTAIS = 24 * 60 * 2;

function medir() {
  quadro = 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  for (const s of subs) s(p);
}

function agendar() {
  if (!quadro) quadro = requestAnimationFrame(medir);
}

export function ouvirPlayhead(fn: Sub): () => void {
  subs.add(fn);
  if (!ligado) {
    ligado = true;
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar, { passive: true });
  }
  agendar();
  return () => {
    subs.delete(fn);
  };
}

/** 0.5 → "00:01:00:00" */
export function timecode(progresso: number, total = QUADROS_TOTAIS): string {
  const f = Math.round(progresso * total);
  const ff = f % FPS;
  const s = Math.floor(f / FPS);
  const ss = s % 60;
  const m = Math.floor(s / 60);
  const mm = m % 60;
  const hh = Math.floor(m / 60);
  const p2 = (n: number) => String(n).padStart(2, '0');
  return `${p2(hh)}:${p2(mm)}:${p2(ss)}:${p2(ff)}`;
}
