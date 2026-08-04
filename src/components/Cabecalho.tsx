import Link from 'next/link';
import { navegacao, whatsappLink } from '@/lib/site';

export function Cabecalho() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/95 backdrop-blur-sm">
      <div className="shell flex h-14 items-center justify-between gap-5">
        <Link
          href="/"
          className="title-tight shrink-0 text-[0.9375rem] tracking-[-0.01em] text-paper"
        >
          lhs<span className="text-mark">.</span>oliveira
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navegacao.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-mid transition-colors hover:text-paper"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center bg-mark px-4 text-xs font-semibold tracking-[0.08em] text-black uppercase transition-colors hover:bg-mark-press"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
