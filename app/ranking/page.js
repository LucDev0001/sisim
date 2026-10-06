'use client';

import Nav from '@/components/Nav';
import Link from 'next/link';

import { useEffect, useState } from 'react';

// Se não houver ninguém no banco ainda, usamos esses dados de demonstração
const FALLBACK_DATA = [
  { id: 'f1', name: 'Anônimo Supremo', role: 'Mestre do Sim', xp: 14500, emoji: '👑' },
  { id: 'f2', name: 'Cupido Sombrio', role: 'Lenda do Sim', xp: 12300, emoji: '🌟' },
  { id: 'f3', name: 'Corajoso_99', role: 'Destemido', xp: 9800, emoji: '🔥' },
  { id: 'f4', name: 'João das Neves', role: 'Destemido', xp: 8500, emoji: '🔥' },
  { id: 'f5', name: 'Visitante22', role: 'Cupido', xp: 6200, emoji: '💘' },
];

export default function RankingPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.items && json.items.length > 0) {
          setData(json.items);
        } else {
          setData(FALLBACK_DATA);
        }
      })
      .catch(() => setData(FALLBACK_DATA));
  }, []);
  return (
    <>
      <Nav tag="liga dos mestres" />
      <main className="wrap section">
        <div className="ranking-hero">
          <h1>Liga dos Mestres</h1>
          <p>Os usuários mais corajosos do Sim Sim. Acumule XP revelando segredos.</p>
        </div>

        <div className="wrap" style={{ maxWidth: '800px' }}>
          <div className="tier-list">
            {!data ? (
              <p style={{ textAlign: 'center', color: 'var(--ink-dim)' }}>Carregando a liga...</p>
            ) : (
              data.map((user, index) => {
                const tierClass = index === 0 ? 'tier-1' : index === 1 ? 'tier-2' : index === 2 ? 'tier-3' : 'tier-other';
                return (
                  <div key={user.id} className={`tier-item ${tierClass}`}>
                    <div className="tier-rank">#{index + 1}</div>
                    <div className="tier-avatar">{user.emoji}</div>
                    <div className="tier-info">
                      <h3>{user.name}</h3>
                      <p>{user.role}</p>
                    </div>
                    <div className="tier-score">
                      <h4>{user.xp.toLocaleString()}</h4>
                      <span>XP</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link href="/" className="btn btn-primary">
              Começar a jogar
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
