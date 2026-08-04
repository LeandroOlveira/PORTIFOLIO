import Link from 'next/link';
import { site } from '@/lib/site';

export function Rodape() {
  return (
    <footer className="border-t border-line bg-black">
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-10">
        <p className="burn text-mid">
          {site.nome} — {new Date().getFullYear()}
        </p>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/" className="burn text-mid transition-colors hover:text-mark">
            Início
          </Link>
          <a href={`mailto:${site.email}`} className="burn text-mid transition-colors hover:text-mark">
            E-mail
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="burn text-mid transition-colors hover:text-mark">
            LinkedIn
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="burn text-mid transition-colors hover:text-mark">
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  );
}

