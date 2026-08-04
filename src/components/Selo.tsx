/**
 * O selo de material não-real.
 *
 * Nada neste site finge ser prova que não existe. Enquanto o conteúdo for de
 * demonstração, ele carrega este selo — e o selo some sozinho quando o
 * frontmatter perde a flag `demo`.
 */
export function Selo({ children = 'Demonstração' }: { children?: React.ReactNode }) {
  return (
    <span className="burn inline-flex items-center gap-2 border border-dim/70 px-2 py-1.5 text-dim">
      <span aria-hidden className="block h-1.5 w-1.5 bg-dim" />
      {children}
    </span>
  );
}

/** Aviso de bloco, para uma seção inteira ainda não preenchida. */
export function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-3 border border-line-strong bg-panel px-4 py-4 text-[0.875rem] leading-relaxed text-mid">
      <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 bg-mark" />
      <span>{children}</span>
    </p>
  );
}
