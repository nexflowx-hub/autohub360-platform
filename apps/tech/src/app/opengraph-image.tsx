import { ImageResponse } from 'next/og';

export const alt = 'AutoHub360 — Auto • Tech • Smart Living';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 55%, #101e33 100%)',
          color: '#f1f5f9',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: '#ffffff' }}>AUTO</span>
          <span style={{ color: '#1e6feb' }}>HUB</span>
          <span style={{ color: '#f97316' }}>360</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 26, letterSpacing: '0.35em', color: '#9fb1c9' }}>
          AUTO • TECH • SMART LIVING
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 34,
            color: '#cbd5e1',
            display: 'flex',
            maxWidth: 860,
            textAlign: 'center',
          }}
        >
          Tecnologia para o carro, para a casa e para o seu dia.
        </div>
        <div style={{ position: 'absolute', bottom: 40, fontSize: 22, color: '#4d90ff' }}>
          autohub360.tech
        </div>
      </div>
    ),
    { ...size },
  );
}
