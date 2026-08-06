import { site } from '@/lib/site';

/**
 * A assinatura ao pé da nota.
 *
 * Um texto sobre operação vale pelo repertório de quem escreveu, e até aqui as notas
 * não diziam de quem eram. Fica depois do corpo e antes da chamada de contato — quem
 * chegou ao fim já leu o argumento e é aí que a pergunta "quem está falando" aparece.
 */
export function AutorNota() {
  return (
    <aside className="mt-16 max-w-[68ch] border-t border-line pt-10">
      <p className="meta text-dim">Escrito por</p>
      <p className="title-tight mt-4 text-xl text-paper sm:text-2xl">{site.nomeCompleto}</p>
      <p className="mt-3 text-sm leading-6 text-mid sm:text-base">{site.bio}</p>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer me"
          className="sub meta text-mid transition-colors hover:text-mark"
        >
          GitHub
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer me"
          className="sub meta text-mid transition-colors hover:text-mark"
        >
          LinkedIn
        </a>
      </div>
    </aside>
  );
}
