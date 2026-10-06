'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { award, getState, levelInfo } from '@/lib/game';

export default function GameHud() {
  const [s, setS] = useState(null);

  useEffect(() => {
    setS(getState());
    const on = (e) => setS(e.detail);
    window.addEventListener('simsim:game', on);
    award('visit');
    return () => window.removeEventListener('simsim:game', on);
  }, []);

  if (!s) return <span className="hud hud-ghost" aria-hidden="true" />;
  const l = levelInfo(s.xp);

  return (
    <Link href="/coragem" className="hud" id="game-hud" aria-label={`Nível ${l.level} ${l.name}, ${s.xp} XP. Ver minha coragem`}>
      <span className="hud-emoji">{l.emoji}</span>
      <span className="hud-info">
        <span className="hud-top">
          <b>Nv {l.level}</b>
          <span>{s.xp} XP</span>
          {s.streak > 1 && <span className="hud-streak">🔥{s.streak}</span>}
        </span>
        <span className="hud-bar"><i style={{ width: `${Math.round(l.progress * 100)}%` }} /></span>
      </span>
    </Link>
  );
}
