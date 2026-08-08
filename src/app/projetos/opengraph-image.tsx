import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `Projetos — ${site.nomeCompleto}`;

/** O card do índice de projetos. Mesmo esqueleto do card das notas. */
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
          <span style={{ color: '#d4ff00', letterSpacing: 2 }}>PROJETOS</span>
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
            Projetos
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
            SaaS próprios, ferramentas internas e sites profissionais.
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
