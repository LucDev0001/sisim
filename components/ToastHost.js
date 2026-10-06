'use client';

import { useEffect, useRef, useState } from 'react';

let uid = 0;

// Toasts de jogo: XP ganho, conquistas e subida de nível (topo da tela).
export default function ToastHost() {
  const [items, setItems] = useState([]);
  const timers = useRef([]);

  useEffect(() => {
    const on = (e) => {
      const id = ++uid;
      const n = e.detail;
      const life = n.type === 'xp' ? 3600 : 5600;
      setItems((cur) => [...cur.slice(-3), { id, ...n }]);
      timers.current.push(setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), life));
    };
    window.addEventListener('simsim:toast', on);
    const ts = timers.current;
    return () => {
      window.removeEventListener('simsim:toast', on);
      ts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) =>
        t.type === 'xp' ? (
          <div key={t.id} className="toast toast-xp">
            <b>+{t.amount} XP</b>
            <span>{t.label}</span>
          </div>
        ) : t.type === 'badge' ? (
          <div key={t.id} className="toast toast-badge">
            <span className="toast-big">{t.badge.emoji}</span>
            <div>
              <small>Conquista desbloqueada · +{t.amount} XP</small>
              <b>{t.badge.name}</b>
              <span>{t.badge.desc}</span>
            </div>
          </div>
        ) : (
          <div key={t.id} className="toast toast-level">
            <span className="toast-big">{t.emoji}</span>
            <div>
              <small>Subiu de nível!</small>
              <b>Nível {t.level} · {t.name}</b>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
