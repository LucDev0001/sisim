'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveMine } from '@/lib/local';

const SUGGESTIONS = [
  'Vamos voltar a ser amigos?',
  'Você toparia ser meu sócio?',
  'Você tem interesse em mim?',
  'Quer continuar morando comigo?',
  'Você também quer sair dessa empresa?',
  'A gente podia tentar de novo?',
];

const CATEGORIES = [
  { name: 'Romance', emoji: '💘' },
  { name: 'Amizade', emoji: '🤝' },
  { name: 'Negócios', emoji: '💼' },
  { name: 'Fofoca', emoji: '🤫' },
  { name: 'Reconciliação', emoji: '🕊️' },
];

export default function CreateForm() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(false);
  const [fromName, setFromName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    
    if (!fromName.trim()) {
      const ok = window.confirm(
        'Você deixou sua "Identidade / Dica" em branco!\n\n' +
        'Se a pessoa disser SIM, ela não vai saber que foi você que perguntou.\n' +
        'Deseja enviar como 100% Anônimo mesmo assim?'
      );
      if (!ok) {
        const details = document.querySelector('.details');
        if (details) details.open = true;
        setTimeout(() => document.getElementById('fromName')?.focus(), 100);
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, message, category: category || 'Geral', fromName, isPublic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Algo deu errado.');
      saveMine({ id: data.id, token: data.ownerToken, question: question.trim() });
      router.push(`/c/${data.id}#t=${data.ownerToken}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="card stack" onSubmit={submit} id="create-form">
      <div>
        <label className="field-label" htmlFor="question">
          Qual é a sua pergunta secreta?
          <small>{question.length}/160</small>
        </label>
        <textarea
          id="question"
          className="input big"
          placeholder="Aquilo que você nunca teve coragem de perguntar…"
          maxLength={160}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <div className="chips" role="list" aria-label="Sugestões de pergunta">
          {SUGGESTIONS.map((s) => (
            <button type="button" key={s} className="chip" role="listitem" onClick={() => setQuestion(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="category">Assunto da Pergunta</label>
        <div className="chips" role="list" style={{ marginBottom: '8px' }}>
          {CATEGORIES.map((c) => (
            <button 
              type="button" 
              key={c.name} 
              className={`chip ${category === c.name ? 'active' : ''}`} 
              onClick={() => { setCategory(c.name); setCustomCategory(false); }}
              style={category === c.name ? { background: 'var(--violet)', color: 'white', borderColor: 'var(--violet)' } : {}}
            >
              {c.emoji} {c.name}
            </button>
          ))}
          <button 
            type="button" 
            className={`chip ${customCategory ? 'active' : ''}`} 
            onClick={() => { setCategory(''); setCustomCategory(true); }}
            style={customCategory ? { background: 'var(--violet)', color: 'white', borderColor: 'var(--violet)' } : {}}
          >
            ✏️ Outro...
          </button>
        </div>
        {customCategory && (
          <input
            id="category"
            type="text"
            className="input"
            placeholder="Digite o assunto (ex: Faculdade, Jogo, Família)..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={30}
          />
        )}
      </div>

      <details className="details">
        <summary>Disfarce e Revelação Secreta (Opcional)</summary>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          <div>
            <label className="field-label" htmlFor="fromName" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Sua Identidade / Dica (Revelada APENAS se houver o Duplo SIM)</label>
            <input
              id="fromName"
              className="input"
              type="text"
              maxLength={30}
              placeholder="Ex: Seu Nome, 'O cara de azul', etc..."
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="message" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Deixar uma mensagem extra (Aparece só no SIM)</label>
            <textarea
              id="message"
              className="input"
              rows={2}
              maxLength={200}
              placeholder="Ex.: Achei que você não ia topar 😅"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </details>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
        <input 
          type="checkbox" 
          id="isPublic" 
          checked={isPublic} 
          onChange={(e) => setIsPublic(e.target.checked)} 
          style={{ width: '18px', height: '18px', accentColor: 'var(--violet)' }}
        />
        <label htmlFor="isPublic" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
          Publicar no feed anônimo (Explorar)
        </label>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <button id="create-submit" className="btn btn-primary btn-block" disabled={loading || question.trim().length < 5}>
        {loading ? 'Criando…' : 'Criar meu Sim Sim →'}
      </button>
      <p className="hint">Sem cadastro. Você já entra com o seu “sim” guardado.</p>
    </form>
  );
}
