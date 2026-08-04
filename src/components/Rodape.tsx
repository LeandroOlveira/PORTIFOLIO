import Link from 'next/link';
import { site } from '@/lib/site';

/** O rabicho do rolo: preto, curto, e fora do caminho da barra de transporte. */
export function Rodape() {
  return (
    <footer className="border-t border-line bg-black">
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-10 pb-24 md:pb-20">
        <p className="burn text-dim">
          {site.nome} — {new Date().getFullYear()}
        </p>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/" className="burn text-dim transition-colors hover:text-mark">
            Início
          </Link>
          <Link href="/notas" className="burn text-dim transition-colors hover:text-mark">
            Notas
          </Link>
          {site.github ? (
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="burn text-dim transition-colors hover:text-mark"
            >
              GitHub
            </a>
          ) : null}
        </nav>
      </div>
    </footer>
  );
}
