'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BADGES, LEVELS, getState, levelInfo, questDone, setRankingName } from '@/lib/game';
import { nativeShare, whatsappLink } from '@/lib/local';

const CHALLENGES = [
  'Pergunte a alguém se vocês podem fazer as pazes.',
  'Pergunte a um amigo distante se ele quer reativar a amizade.',
  'Pergunte a um colega se ele toparia um projeto juntos.',
  'Pergunte a quem você gosta se existe um “a gente”.',
  'Pergunte a alguém da família o que você nunca teve coragem de perguntar.',
  'Pergunte a um sócio em potencial se ele topa começar.',
  'Pergunte a alguém se vocês deveriam se encontrar mais.',
];

export default function Profile() {
  const [s, setS] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [editingName, setEditingName] = useState(false);
  const lastSyncXp = useRef(-1);

  useEffect(() => {
    const st = getState();
    setS(st);
    if (st.rankingName) setNameInput(st.rankingName);
    const on = (e) => setS(e.detail);
    window.addEventListener('simsim:game', on);
    return () => window.removeEventListener('simsim:game', on);
  }, []);

  useEffect(() => {
    if (!s || !s.rankingName) return;
    if (lastSyncXp.current === s.xp) return;
    lastSyncXp.current = s.xp;
    
    const l = levelInfo(s.xp);
    fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: s.id,
        name: s.rankingName,
        role: l.name,
        xp: s.xp,
        emoji: l.emoji
      }),
    }).catch(() => {});
  }, [s]);

  const saveName = () => {
    if (nameInput.trim().length >= 2) {
      setRankingName(nameInput.trim());
      setEditingName(false);
    }
  };

  if (!s) return null;
  const l = levelInfo(s.xp);
  const unlocked = BADGES.filter((b) => s.badges[b.id]).length;
  const challenge = CHALLENGES[Math.floor(Date.now() / 86400000) % CHALLENGES.length];
  const done = questDone(s);

  async function share() {
    const text = `Sou ${l.emoji} ${l.name} (nível ${l.level}) no Sim Sim, com ${s.xp} XP e ${unlocked} conquistas. Qual é o seu nível de coragem?`;
    const url = window.location.origin;
    const ok = await nativeShare(url, text);
    if (!ok) window.open(whatsappLink(url, text), '_blank', 'noopener');
  }

  return (
    <div className="stack" style={{ gap: 22 }}>
      <section className="card profile-hero" aria-labelledby="nivel">
        <div className="profile-emoji" aria-hidden="true">{l.emoji}</div>
        <div className="profile-main">
          <span className="badge">Nível {l.level}</span>
          <h2 id="nivel">{l.name}</h2>
          <div className="xpbar" role="progressbar" aria-valuenow={s.xp} aria-valuemin={l.min} aria-valuemax={l.next?.min ?? s.xp}>
            <i style={{ width: `${Math.round(l.progress * 100)}%` }} />
          </div>
          <p className="hint" style={{ textAlign: 'left', marginTop: 8 }}>
            {l.next ? `${s.xp} XP · faltam ${l.toNext} XP para ${l.next.emoji} ${l.next.name}` : `${s.xp} XP · nível máximo 👑`}
          </p>
        </div>
      </section>

      <section className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Aparecer na Liga dos Mestres</h3>
        {!s.rankingName || editingName ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Seu apelido..." 
              value={nameInput} 
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={20}
            />
            <button className="btn btn-ghost" onClick={saveName}>Salvar</button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--ink)' }}><b>{s.rankingName}</b></p>
            <button className="btn btn-ghost" onClick={() => setEditingName(true)} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>Editar</button>
          </div>
        )}
        <p className="hint" style={{ marginTop: '10px', textAlign: 'left' }}>
          Adicione um apelido para sincronizar seu XP com o Ranking Global automaticamente.
        </p>
      </section>

      <div className="stat-grid">
        <div className="stat"><b>{s.streak || 0}🔥</b><span>dias seguidos</span></div>
        <div className="stat"><b>{s.created}</b><span>perguntas feitas</span></div>
        <div className="stat"><b>{s.answered}</b><span>respondidas</span></div>
        <div className="stat"><b>{s.reveals}</b><span>Sim Sims</span></div>
      </div>

      <section className="card quest" aria-labelledby="missao">
        <div>
          <span className="badge">{done ? '✅ missão concluída' : '🎯 missão do dia · +15 XP'}</span>
          <h3 id="missao">Desafio de hoje</h3>
          <p>{challenge}</p>
        </div>
        <Link href="/#create-form" className="btn btn-primary" id="quest-go">
          {done ? 'Fazer outra' : 'Aceitar desafio'}
        </Link>
      </section>

      <section aria-labelledby="conquistas">
        <h3 id="conquistas" className="section-sub">Conquistas <small>{unlocked}/{BADGES.length}</small></h3>
        <div className="badge-grid">
          {BADGES.map((b) => {
            const on = Boolean(s.badges[b.id]);
            return (
              <div key={b.id} className={`ach ${on ? 'on' : ''}`}>
                <span className="ach-emoji">{on ? b.emoji : '🔒'}</span>
                <b>{b.name}</b>
                <span>{b.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="niveis">
        <h3 id="niveis" className="section-sub">Níveis</h3>
        <ol className="levels">
          {LEVELS.map((x, i) => (
            <li key={x.name} className={i <= l.index ? 'on' : ''}>
              <span>{x.emoji}</span> {x.name} <small>{x.min} XP</small>
            </li>
          ))}
        </ol>
      </section>

      <div className="actions">
        <button className="btn btn-ghost" onClick={share} id="share-profile">Compartilhar meu nível</button>
        <p className="hint">Seu progresso fica salvo neste aparelho — sem cadastro.</p>
      </div>
    </div>
  );
}
