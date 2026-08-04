import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variante = 'marcador' | 'contorno' | 'invertido';

const base =
  'group relative inline-flex items-center gap-3 px-6 py-3.5 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ease-out';

const variantes: Record<Variante, string> = {
  marcador: 'bg-mark text-black hover:bg-mark-press',
  contorno:
    'border border-line-strong text-paper hover:border-mark hover:text-mark',
  invertido: 'border-2 border-black text-black hover:bg-black hover:text-mark',
};

type Props = {
  href: string;
  variante?: Variante;
  children: React.ReactNode;
} & Omit<ComponentProps<typeof Link>, 'href' | 'children'>;

export function Botao({ href, variante = 'marcador', children, ...rest }: Props) {
  const externo = href.startsWith('http');

  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variantes[variante]}`}
      >
        {children}
        <Seta />
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${variantes[variante]}`} {...rest}>
      {children}
      <Seta />
    </Link>
  );
}

/** A seta anda um passo, como um frame avançando. */
function Seta() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
    >
      &rarr;
    </span>
  );
}
