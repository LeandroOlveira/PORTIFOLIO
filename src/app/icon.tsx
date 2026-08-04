import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** O ponto de lhs.oliveira, no verde do marcador, sobre o preto de projeção. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          background: '#0b0b0b',
        }}
      >
        <div style={{ width: 20, height: 20, background: '#d4ff00' }} />
      </div>
    ),
    size,
  );
}
