import { ImageResponse } from 'next/og';

export const alt = 'Sim Sim — só aparece se os dois disserem sim';
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
          justifyContent: 'center',
          padding: '0 90px',
          color: '#f6f1ff',
          background:
            'radial-gradient(900px 600px at 85% 0%, rgba(130,60,255,0.55), transparent 60%), radial-gradient(800px 600px at 0% 100%, rgba(255,60,160,0.45), transparent 60%), #0a0614',
        }}
      >
        <div style={{ display: 'flex', position: 'relative', width: 120, height: 70, marginBottom: 40 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 70, height: 70, borderRadius: 70, background: '#9d5cff' }} />
          <div style={{ position: 'absolute', left: 50, top: 0, width: 70, height: 70, borderRadius: 70, background: '#ff4fa8', opacity: 0.85 }} />
        </div>
        <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, display: 'flex', flexDirection: 'column' }}>
          <span>Alguem te fez uma</span>
          <span style={{ color: '#ff6fb6' }}>pergunta secreta.</span>
        </div>
        <div style={{ fontSize: 38, marginTop: 34, color: 'rgba(246,241,255,0.7)', display: 'flex' }}>
          So aparece se os dois disserem sim.
        </div>
        <div style={{ position: 'absolute', right: 90, bottom: 60, fontSize: 44, fontWeight: 800, display: 'flex' }}>
          Sim Sim
        </div>
      </div>
    ),
    { ...size },
  );
}
