'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Exemplos honestos: aparecem rotulados como "populares", sem fingir que alguém acabou de perguntar.
const SEEDS = [
  'Vamos voltar a ser amigos?',
  'Você toparia ser meu sócio?',
  'Você está a fim de mim?',
  'Quer continuar morando comigo?',
  'Você também quer sair dessa empresa?',
  'A gente podia tentar de novo?',
  'Você ainda pensa em mim?',
  'Podemos fazer as pazes?',
  'Você quer dividir o aluguel comigo?',
  'Você topa viajar comigo?',
];

const ago = (ms) => {
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'agora mesmo';
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  return `há ${Math.floor(h / 24)} d`;
};

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

// Toast flutuante com perguntas passando o tempo todo (somente as liberadas pelos autores + exemplos).
export default function LiveToast() {
  const pathname = usePathname();
  const hidden = pathname.startsWith('/q/') || pathname.startsWith('/c/');
  const [real, setReal] = useState([]);
  const [current, setCurrent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const paused = useRef(false);
  const idx = useRef(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('simsim:live-closed')) setClosed(true);
    } catch {}
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/feed');
        const d = await r.json();
        if (alive) setReal(d.items || []);
      } catch {}
    };
    load();
    const t = setInterval(load, 90000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (hidden || closed) return;
    const queue = () => [
      ...real.map((r) => ({ text: r.text, label: `🔥 Alguém perguntou ${ago(r.ageMs)}` })),
      ...shuffle(SEEDS).map((text) => ({ text, label: '💭 Pergunta popular no Sim Sim' })),
    ];
    let q = queue();
    let timers = [];
    let stopped = false;

    const cycle = () => {
      if (stopped) return;
      if (paused.current) return void timers.push(setTimeout(cycle, 1500));
      if (idx.current >= q.length) {
        idx.current = 0;
        q = queue();
      }
      setCurrent(q[idx.current++]);
      setVisible(true);
      timers.push(
        setTimeout(() => {
          setVisible(false);
          timers.push(setTimeout(cycle, 2800));
        }, 6000),
      );
    };
    timers.push(setTimeout(cycle, 3500));
    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
      setVisible(false);
    };
  }, [real, hidden, closed]);

  if (hidden || closed || !current) return null;

  return (
    <aside
      className={`live ${visible ? 'live-in' : ''}`}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      aria-label="Perguntas no Sim Sim"
    >
      <button
        className="live-x"
        aria-label="Fechar notificações"
        onClick={() => {
          setClosed(true);
          try {
            sessionStorage.setItem('simsim:live-closed', '1');
          } catch {}
        }}
      >
        ×
      </button>
      <small>{current.label}</small>
      <p>“{current.text}”</p>
      <Link href="/#create-form" className="live-cta">Fazer a minha →</Link>
    </aside>
  );
}
