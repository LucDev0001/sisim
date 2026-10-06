'use client';

import { useEffect, useState } from 'react';
import { getState } from '@/lib/game';

export default function OnlineCounter() {
  const [online, setOnline] = useState(0);

  useEffect(() => {
    let alive = true;
    const s = getState();
    const id = s.id || Math.random().toString(36).slice(2, 10);

    const ping = async () => {
      try {
        const res = await fetch('/api/online', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (alive && data.count) setOnline(data.count);
      } catch (err) {}
    };

    ping();
    const interval = setInterval(ping, 25000); // Ping a cada 25 segundos
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (!online) return null;

  return (
    <div className="online-counter" title="Pessoas online agora">
      <div className="pulse-dot"></div>
      <span><b>{online}</b> online</span>
    </div>
  );
}
