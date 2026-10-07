'use client';

import Link from 'next/link';
import Confetti from '@/components/Confetti';
import { nativeShare, whatsappLink } from '@/lib/local';

const VIRAL_TEXT = 'Acabei de ter um SIM SIM 🎉 Faça sua pergunta secreta, só aparece se os dois toparem:';

export default function Reveal({ message, who, fromName }) {
  async function share() {
    const url = window.location.origin;
    const ok = await nativeShare(url, VIRAL_TEXT);
    if (!ok) window.open(whatsappLink(url, VIRAL_TEXT), '_blank', 'noopener');
  }

  return (
    <div className="reveal" role="status" aria-live="polite">
      <Confetti />
      <span className="badge">✨ revelação</span>
      <div className="reveal-title grad-text">SIM SIM!</div>
      <p>
        {who === 'owner' ? 'A outra pessoa também disse ' : 'A pessoa que perguntou também queria. Os dois disseram '}
        <b>sim</b> 💜
      </p>

      {who === 'guest' && (
        <div style={{ margin: '24px 0', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--violet)' }}>
          <small style={{ color: 'var(--ink-dim)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identidade Revelada</small>
          Foi <b className="grad-text" style={{ fontSize: '1.6rem', display: 'block' }}>{fromName || 'Alguém misterioso 🕵️'}</b> <br/>quem te perguntou!
        </div>
      )}

      {message && (
        <div className="secret">
          <small>{who === 'owner' ? 'Mensagem secreta dela(e)' : 'Mensagem secreta para você'}</small>
          <p>{message}</p>
        </div>
      )}

      <div className="viral">
        <p>Tem outra pergunta engasgada? Faça a sua em 20 segundos.</p>
        <div className="actions">
          <Link href="/" className="btn btn-primary" id="reveal-new">Fazer meu próprio Sim Sim →</Link>
          <button className="btn btn-ghost" onClick={share} id="reveal-share">Contar pros amigos</button>
        </div>
      </div>
    </div>
  );
}
