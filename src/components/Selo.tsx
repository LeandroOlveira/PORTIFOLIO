export function Selo({ children = 'Demonstração' }: { children?: React.ReactNode }) {
  return (
    <span className="meta inline-flex items-center gap-2 border border-dim/70 px-2 py-1.5 text-dim">
      <span aria-hidden className="block h-1.5 w-1.5 bg-dim" />
      {children}
    </span>
  );
}
