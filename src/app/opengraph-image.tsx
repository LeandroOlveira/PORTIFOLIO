import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.nome} — ${site.papel}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          <span style={{ color: '#f2f2f0', letterSpacing: -0.5 }}>lhs.oliveira</span>
          <span style={{ color: '#9a9c93', letterSpacing: 2 }}>PRODUTO · OPERAÇÃO</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 132,
              fontWeight: 800,
              color: '#d4ff00',
              letterSpacing: -4,
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            Produtos digitais
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 40,
              color: '#f2f2f0',
              lineHeight: 1.25,
              maxWidth: 900,
            }}
          >
            para operações reais.
          </span>
        </div>

        <div style={{ display: 'flex', fontSize: 22, color: '#9a9c93' }}>
          {site.papel}
        </div>
      </div>
    ),
    size,
  );
}
