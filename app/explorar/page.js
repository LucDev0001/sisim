'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { playSound } from '@/lib/sfx';

function timeAgo(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s atrás`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

const CATEGORIES = [
  { name: 'Romance', emoji: '💘' },
  { name: 'Amizade', emoji: '🤝' },
  { name: 'Negócios', emoji: '💼' },
  { name: 'Fofoca', emoji: '🤫' },
  { name: 'Reconciliação', emoji: '🕊️' },
];

function ExplorarContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/feed?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [q]);

  const handleLike = async (index, id) => {
    // Optimistic UI update
    const newResults = [...results];
    newResults[index].likes = (newResults[index].likes || 0) + 1;
    setResults(newResults);
    playSound('coin');

    try {
      await fetch(`/api/questions/${id}/like`, { method: 'POST' });
    } catch(e) {}
  };

  return (
    <>
      <Nav tag="explorar assuntos" />
      <main className="wrap section" style={{ minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {q ? (<span>Explorar: <span className="grad-text">"{q}"</span></span>) : (<span>Explorar <span className="grad-text">Segredos</span></span>)}
          </h1>
          <p className="hint">Perguntas públicas criadas recentemente.</p>
          
          <div className="chips" style={{ justifyContent: 'center', marginTop: '20px' }}>
            {CATEGORIES.map(c => (
              <Link 
                key={c.name} 
                href={`/explorar?q=${c.name}`}
                className={`chip ${q === c.name ? 'active' : ''}`}
                style={q === c.name ? { background: 'var(--violet)', color: 'white', borderColor: 'var(--violet)' } : {}}
              >
                {c.emoji} {c.name}
              </Link>
            ))}
            {q && (
              <Link href="/explorar" className="chip">❌ Limpar filtro</Link>
            )}
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--ink-dim)' }}>Buscando segredos...</p>
        ) : results && results.length > 0 ? (
          <div className="feed-grid" style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {results.map((r, i) => (
              <div key={i} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge" style={{ background: 'var(--glass)', color: 'var(--pink)' }}>{r.category || 'Geral'}</span>
                  <small className="hint">{timeAgo(r.ageMs)}</small>
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 }}>"{r.text}"</p>
                <div style={{ display: 'flex', marginTop: '16px', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => handleLike(i, r.id)} className="btn btn-ghost" style={{ padding: '8px', fontSize: '0.85rem', flex: 1, border: '1px solid var(--line)' }}>
                    🔥 Eu também faria! {r.likes > 0 && `(${r.likes})`}
                  </button>
                  <Link href={`/?q=${encodeURIComponent(r.text)}#create-form`} className="btn btn-primary" style={{ padding: '8px', fontSize: '0.85rem' }}>
                    Usar essa ➡️
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ color: 'var(--ink-dim)', marginBottom: '20px' }}>Nenhuma pergunta pública encontrada com esse assunto.</p>
            <Link href="/#create-form" className="btn btn-primary">Seja o primeiro a perguntar!</Link>
          </div>
        )}
      </main>
    </>
  );
}

export default function Explorar() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px', color: 'var(--ink)' }}>Carregando Segredos...</div>}>
      <ExplorarContent />
    </Suspense>
  );
}
