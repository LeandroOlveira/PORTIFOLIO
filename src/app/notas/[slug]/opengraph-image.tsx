import { ImageResponse } from 'next/og';
import { getNota, getNotas } from '@/lib/content';
import { site } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `Nota de ${site.nomeCompleto}`;

export function generateStaticParams() {
  return getNotas().map((n) => ({ slug: n.slug }));
}

/**
 * O card das notas.
 *
 * As notas eram o único conteúdo do site feito para circular e o único sem
 * imagem de prévia: compartilhadas no WhatsApp — que é o canal de conversão
 * declarado — saíam como um bloco de texto cinza. O título é o herói aqui
 * porque é o que decide o clique; o resto é assinatura.
 */
export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nota = getNota(slug);
  const titulo = nota?.titulo ?? 'Notas';

  // Títulos curtos podem crescer sem estourar as duas linhas úteis do card.
  const corpo = titulo.length > 46 ? 66 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0b0b',
          padding: 64,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22 }}>
          <span style={{ color: '#f2f2f0', letterSpacing: -0.5 }}>{site.nome}</span>
          <span style={{ color: '#d4ff00', letterSpacing: 2 }}>NOTA</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: corpo,
              fontWeight: 700,
              color: '#f2f2f0',
              letterSpacing: -2,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {titulo}
          </span>
          {nota?.resumo ? (
            <span
              style={{
                marginTop: 28,
                fontSize: 30,
                color: '#9a9c93',
                lineHeight: 1.35,
                maxWidth: 900,
              }}
            >
              {nota.resumo}
            </span>
          ) : null}
        </div>

        <div style={{ display: 'flex', fontSize: 22, color: '#9a9c93' }}>
          {site.nomeCompleto} · {site.papelCurto}
        </div>
      </div>
    ),
    size,
  );
}
