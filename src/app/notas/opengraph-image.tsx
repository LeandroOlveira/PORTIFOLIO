import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `Notas — ${site.nomeCompleto}`;

/** O card do índice. Mesmo esqueleto das notas, com o assunto no lugar do título. */
export default function OG() {
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
          <span style={{ color: '#d4ff00', letterSpacing: 2 }}>NOTAS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 118,
              fontWeight: 800,
              color: '#d4ff00',
              letterSpacing: -4,
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            Notas
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 34,
              color: '#f2f2f0',
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            Produto, integração, IA aplicada e software em operação.
          </span>
        </div>

        <div style={{ display: 'flex', fontSize: 22, color: '#9a9c93' }}>
          {site.nomeCompleto} · {site.papelCurto}
        </div>
      </div>
    ),
    size,
  );
}
