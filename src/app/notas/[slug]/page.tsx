import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { dataCurta, getNota, getNotas } from '@/lib/content';
import { Selo } from '@/components/Selo';
import { Botao } from '@/components/Botao';
import { whatsappLink } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getNotas().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = getNota(slug);
  if (!n) return {};
  return {
    title: n.titulo,
    description: n.resumo,
    openGraph: { type: 'article', title: n.titulo, description: n.resumo },
  };
}

export default async function Nota({ params }: Props) {
  const { slug } = await params;
  const n = getNota(slug);
  if (!n) notFound();

  return (
    <article className="bg-ink pt-14">
      <div className="shell py-16 md:py-24">
        <Link
          href="/notas"
          className="burn group inline-flex items-center gap-3 text-dim transition-colors hover:text-mark"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Notas
        </Link>

        <h1 className="title-tight mt-10 max-w-[22ch] text-[2rem] text-paper sm:text-[2.75rem] md:text-[3.25rem]">
          {n.titulo}
        </h1>

        <div className="slate mt-8 max-w-[68ch]">
          <span className="slate-field burn">
            <span className="slate-key">Data</span>
            <span className="slate-val">
              <time dateTime={n.data}>{dataCurta(n.data)}</time>
            </span>
          </span>
          {n.leitura ? (
            <span className="slate-field burn">
              <span className="slate-key">Leitura</span>
              <span className="slate-val">{n.leitura}</span>
            </span>
          ) : null}
          {n.demo ? (
            <span className="ml-auto">
              <Selo>Rascunho de exemplo</Selo>
            </span>
          ) : null}
        </div>

        <div className="prose-cut mt-12 max-w-[68ch]">
          <MDXRemote source={n.corpo} />
        </div>

        <div className="mt-16 max-w-[68ch] border-t border-line pt-12">
          <p className="title-tight max-w-[26ch] text-[1.5rem] text-paper sm:text-[1.875rem]">
            Tem um processo aí que se parece com isso?
          </p>
          <div className="mt-7">
            <Botao href={whatsappLink()}>Chamar no WhatsApp</Botao>
          </div>
        </div>
      </div>
    </article>
  );
}
