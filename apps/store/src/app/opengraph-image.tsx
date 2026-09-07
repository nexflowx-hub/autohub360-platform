import { ImageResponse } from 'next/og';

export const alt = 'AutoHub360 Store — Auto • Tech • Smart Living';
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
          background: 'linear-gradient(135deg, #081120 0%, #0a1628 55%, #101e33 100%)',
          position: 'relative',
        }}
      >
        {/* Orbital glow accents */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(30,111,235,0.30) 0%, transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -180,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(249,115,22,0.20) 0%, transparent 65%)',
          }}
        />
        {/* Grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            opacity: 0.08,
            backgroundImage:
              'linear-gradient(rgba(124,176,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,176,255,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 28,
            border: '2px solid rgba(124,176,255,0.35)',
            background: 'rgba(13,27,48,0.65)',
            padding: '18px 46px',
            marginBottom: 42,
          }}
        >
          <span style={{ display: 'flex', fontSize: 72, fontWeight: 800, letterSpacing: 2 }}>
            <span style={{ color: '#ffffff' }}>AUTO</span>
            <span style={{ color: '#1e6feb' }}>HUB</span>
            <span style={{ color: '#f97316' }}>360</span>
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 40,
            fontWeight: 700,
            color: '#7cb0ff',
            letterSpacing: 6,
            marginBottom: 20,
          }}
        >
          AUTO • TECH • SMART LIVING
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#cbd5e1',
            maxWidth: 820,
            textAlign: 'center',
          }}
        >
          Tecnologia para o carro, para a casa e para o seu dia — com entrega nacional e instalação
          especializada.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 44,
            display: 'flex',
            fontSize: 20,
            color: '#64748b',
            letterSpacing: 1,
          }}
        >
          autohub360.store
        </div>
      </div>
    ),
    { ...size },
  );
}
