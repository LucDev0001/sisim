'use client';

import { useEffect, useState } from 'react';

// Prova social REAL (contadores do banco). Só aparece quando os números já fazem sentido.
export default function StatsBar() {
  const [s, setS] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setS)
      .catch(() => {});
  }, []);

  if (!s || s.questions < 10) return null;
  const fmt = (n) => n.toLocaleString('pt-BR');

  return (
    <div className="stats" aria-label="Estatísticas do Sim Sim">
      <span><b>{fmt(s.questions)}</b> perguntas feitas</span>
      <span className="dot" aria-hidden="true">•</span>
      <span><b>{fmt(s.reveals)}</b> Sim Sims revelados 🎉</span>
    </div>
  );
}
