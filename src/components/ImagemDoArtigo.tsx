import { medirImagemPublica } from '@/lib/content';

/**
 * A imagem dentro do corpo de um artigo.
 *
 * Substitui o `<img>` que o MDX geraria sozinho, por dois motivos:
 *
 * 1. **Dimensões.** Sem `width`/`height` o navegador não sabe que altura
 *    reservar, e a página pula quando a imagem chega. As dimensões são lidas do
 *    cabeçalho do arquivo no build — nada a digitar no Markdown, nada a
 *    dessincronizar quando a imagem for trocada.
 * 2. **Legenda.** O `title` do Markdown vira `<figcaption>` de verdade, em vez
 *    do tooltip que ninguém vê. O `alt` continua sendo o `alt`: um descreve
 *    para quem vê, o outro para quem não vê, e repetir os dois é ruído em
 *    leitor de tela.
 *
 * Uso no `.mdx`:
 *
 * ```markdown
 * ![Painel do Radar Fiscal com a carteira consolidada](/notas/carteira.png "A tela que substituiu 140 consultas manuais")
 * ```
 */
export function ImagemDoArtigo({
  src,
  alt,
  title,
}: {
  src?: string;
  alt?: string;
  title?: string;
}) {
  if (!src) return null;

  const medida = medirImagemPublica(src);

  return (
    <figure>
      <img
        src={src}
        {...(medida ? { width: medida.largura, height: medida.altura } : {})}
        // Um artigo ilustrado sem `alt` é um artigo que exclui leitor de tela e
        // some da busca por imagem. O teste em content.test.ts falha se faltar.
        alt={alt ?? ''}
        className="block h-auto w-full border border-line bg-panel"
        loading="lazy"
        decoding="async"
      />
      {title ? <figcaption>{title}</figcaption> : null}
    </figure>
  );
}
