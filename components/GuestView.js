'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { findMine, loadGuest, saveGuest } from '@/lib/local';

export default function GuestView({ id, question, expired }) {
  // ask | sending | answered | revealed | mine
  const [view, setView] = useState('ask');
  const [message, setMessage] = useState('');
  const [revealMsg, setRevealMsg] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const testing = new URLSearchParams(window.location.search).has('teste');
    if (!testing && findMine(id)) return setView('mine');
    const g = loadGuest(id);
    if (!g?.token) return;
    (async () => {
      try {
        const res = await fetch(`/api/questions/${id}/result?role=guest&token=${encodeURIComponent(g.token)}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (data.state === 'revealed') {
          setRevealMsg(data.message || null);
          setView('revealed');
        } else setView('answered');
      } catch {}
    })();
  }, [id]);

  async function answer(value) {
    setView('sending');
    setError('');
    try {
      const res = await fetch(`/api/questions/${id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: value, message, guestToken: loadGuest(id)?.token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Algo deu errado.');
      saveGuest(id, { token: data.guestToken });
      if (data.revealed) {
        setRevealMsg(data.message || null);
        setView('revealed');
      } else setView('answered');
    } catch (e) {
      setError(e.message);
      setView('ask');
    }
  }

  if (expired) {
    return (
      <div className="card flow-card">
        <span className="badge">⌛ expirou</span>
        <h2>Essa pergunta expirou</h2>
        <p style={{ margin: '10px 0 22px' }}>O link só funciona por 7 dias.</p>
        <Link href="/" className="btn btn-primary">Fazer meu Sim Sim</Link>
      </div>
    );
  }

  if (view === 'mine') {
    return (
      <div className="card flow-card">
        <span className="badge">👀 você criou esta pergunta</span>
        <h2>Este link é para <span className="grad-text">a outra pessoa</span></h2>
        <p style={{ margin: '10px 0 22px' }}>Copie o link e mande para ela. Você acompanha o status no seu painel.</p>
        <Link href={`/c/${id}`} className="btn btn-primary">Ver status</Link>
      </div>
    );
  }

  if (view === 'revealed') {
    return (
      <div className="card flow-card">
        <Reveal message={revealMsg} who="guest" />
      </div>
    );
  }

  if (view === 'answered') {
    return (
      <div className="card flow-card">
        <span className="badge">🔒 resposta guardada</span>
        <h2>Pronto. Fica entre você e o silêncio.</h2>
        <p style={{ margin: '12px 0 8px' }}>
          Se vocês dois tiverem dito sim, a revelação aparece. Caso contrário, <b>ninguém fica sabendo</b> de nada.
        </p>
        <div className="viral">
          <p>Agora é a sua vez de perguntar algo que está engasgado.</p>
          <div className="actions">
            <Link href="/" className="btn btn-primary" id="answered-new">Fazer meu próprio Sim Sim →</Link>
            <button className="btn btn-ghost" onClick={() => setView('ask')} id="change-mind">Mudei de ideia</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card flow-card">
      <span className="badge">🔥 uma pergunta anônima está no ar</span>
      <div className="quote">{question}</div>
      <p>
        Você toparia? <b>Só se vocês dois disserem sim</b> a resposta aparece. Um “não” é apagado para sempre e ninguém sabe quem foi.
      </p>

      <div className="stack" style={{ marginTop: 24, textAlign: 'left' }}>
        <details className="details">
          <summary>Deixar uma mensagem secreta (aparece só se for sim)</summary>
          <textarea
            className="input"
            rows={2}
            maxLength={200}
            placeholder="Ex.: Achei que você nunca ia perguntar 😅"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="guest-message"
          />
        </details>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="btn-row">
          <button className="btn btn-sim" onClick={() => answer(true)} disabled={view === 'sending'} id="answer-yes">
            Sim 💚
          </button>
          <button className="btn btn-nao" onClick={() => answer(false)} disabled={view === 'sending'} id="answer-no">
            Não
          </button>
        </div>
        <p className="hint">Sem cadastro. Ninguém vê o seu não.</p>
      </div>
    </div>
  );
}
