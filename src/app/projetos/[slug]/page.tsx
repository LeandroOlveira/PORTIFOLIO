import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getProjeto, getProjetos } from '@/lib/content';
import { Selo } from '@/components/Selo';
import { Botao } from '@/components/Botao';
import { whatsappLink } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjetos().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjeto(slug);
  if (!p) return {};
  return { title: p.titulo, description: p.linha };
}

export default async function Projeto({ params }: Props) {
  const { slug } = await params;
  const p = getProjeto(slug);
  if (!p) notFound();

  return (
    <article className="bg-ink pt-14">
      <div className="shell py-16 md:py-24">
        <Link
          href="/#entregas"
          className="burn group inline-flex items-center gap-3 text-dim transition-colors hover:text-mark"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Entregas
        </Link>

        <h1 className="title-tight mt-10 max-w-[20ch] text-[2rem] text-paper sm:text-[2.75rem] md:text-[3.25rem]">
          {p.titulo}
        </h1>
        {p.linha ? (
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-mid sm:text-lg">
            {p.linha}
          </p>
        ) : null}

        <div className="slate mt-10">
          {p.ano ? (
            <span className="slate-field burn">
              <span className="slate-key">Ano</span>
              <span className="slate-val">{p.ano}</span>
            </span>
          ) : null}
          {p.setor ? (
            <span className="slate-field burn">
              <span className="slate-key">Setor</span>
              <span className="slate-val">{p.setor}</span>
            </span>
          ) : null}
          {p.duracao ? (
            <span className="slate-field burn">
              <span className="slate-key">Duração</span>
              <span className="slate-val">{p.duracao}</span>
            </span>
          ) : null}
          {p.demo ? (
            <span className="ml-auto">
              <Selo />
            </span>
          ) : null}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-0">
          <div className="md:pr-10 lg:pr-16">
            <p className="burn text-dim">Bruto</p>
            <ul className="mt-5 space-y-4">
              {p.bruto.map((b) => (
                <li key={b} className="relative pl-6">
                  <span
                    aria-hidden
                    className="absolute top-[0.7em] left-0 block h-px w-3 bg-dim"
                  />
                  <span className="text-[0.9375rem] leading-relaxed text-mid">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:border-l md:border-line md:pl-10 lg:pl-16">
            <p className="burn text-mark">Corte final</p>
            <ul className="mt-5 space-y-4">
              {p.corte.map((c) => (
                <li key={c} className="relative pl-6">
                  <span
                    aria-hidden
                    className="absolute top-[0.7em] left-0 block h-px w-3 bg-mark"
                  />
                  <span className="text-[0.9375rem] leading-relaxed text-paper">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {p.stack.map((t) => (
            <li key={t} className="burn tag">
              {t}
            </li>
          ))}
        </ul>

        <div className="prose-cut mt-16 max-w-[68ch] border-t border-line pt-12">
          <MDXRemote source={p.corpo} />
        </div>

        {(p.url || p.repo) && (
          <div className="mt-12 flex flex-wrap gap-6 border-t border-line pt-8">
            {p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="burn text-paper underline decoration-line-strong underline-offset-4 transition-colors hover:text-mark hover:decoration-mark"
              >
                Ver o sistema
              </a>
            ) : null}
            {p.repo ? (
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="burn text-paper underline decoration-line-strong underline-offset-4 transition-colors hover:text-mark hover:decoration-mark"
              >
                Repositório
              </a>
            ) : null}
          </div>
        )}

        <div className="mt-16 border-t border-line pt-12">
          <p className="title-tight max-w-[24ch] text-[1.5rem] text-paper sm:text-[1.875rem]">
            Seu processo se parece com esse?
          </p>
          <div className="mt-7">
            <Botao href={whatsappLink()}>Chamar no WhatsApp</Botao>
          </div>
        </div>
      </div>
    </article>
  );
}
