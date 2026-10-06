'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { findMine, saveMine, shareUrl, nativeShare, whatsappLink } from '@/lib/local';
import { playSound } from '@/lib/sfx';

export default function OwnerView({ id, question }) {
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState('');
  const [state, setState] = useState('pending');
  const [message, setMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [denied, setDenied] = useState(false);
  const [views, setViews] = useState(0);

  // Descobre o token do dono: vem no #hash ao criar, ou do localStorage.
  useEffect(() => {
    const m = window.location.hash.match(/t=([\w-]+)/);
    const t = m?.[1] || findMine(id)?.token || null;
    if (!t) setDenied(true);
    else {
      setToken(t);
      saveMine({ id, token: t, question });
    }
    setUrl(shareUrl(id));
  }, [id, question]);

  const check = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/questions/${id}/result?role=owner&token=${encodeURIComponent(token)}`, {
        cache: 'no-store',
      });
      if (res.status === 403) return setDenied(true);
      const data = await res.json();
      if (data.state) {
        if (state !== 'revealed' && data.state === 'revealed') {
          playSound('win');
        }
        setState(data.state);
        if (data.views !== undefined) setViews(data.views);
        if (data.state === 'revealed') setMessage(data.message || null);
      }
    } catch {}
  }, [id, token]);

  useEffect(() => {
    if (!token || state !== 'pending') return;
    check();
    const timer = setInterval(check, 4000);
    const onVisible = () => document.visibilityState === 'visible' && check();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [token, state, check]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function share() {
    const ok = await nativeShare(url);
    if (!ok) window.open(whatsappLink(url), '_blank', 'noopener');
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;
    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  }

  function generateInstagramStory() {
    const c = document.createElement('canvas');
    c.width = 1080;
    c.height = 1920;
    const ctx = c.getContext('2d');
    
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#0f0c29');
    grad.addColorStop(0.5, '#302b63');
    grad.addColorStop(1, '#24243e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);
    
    // Card
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.roundRect(100, 600, 880, 400, 40);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    wrapText(ctx, question, 540, 750, 780, 60);

    // Call to action
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 45px sans-serif';
    ctx.fillText('Responda no link do Story 👀', 540, 1200);

    // Brand
    ctx.fillStyle = '#ffffff';
    ctx.font = '35px sans-serif';
    ctx.globalAlpha = 0.5;
    ctx.fillText('simsim.app', 540, 1800);
    
    // Download
    const link = document.createElement('a');
    link.download = 'simsim-story.png';
    link.href = c.toDataURL('image/png');
    link.click();
    playSound('coin');
  }

  if (denied) {
    return (
      <div className="card flow-card">
        <h2>Esse link é só de quem criou</h2>
        <p style={{ margin: '10px 0 22px' }}>Abra a pergunta no mesmo navegador em que você a criou.</p>
        <Link href="/" className="btn btn-primary">Criar um Sim Sim</Link>
      </div>
    );
  }

  return (
    <div className="card flow-card">
      {state === 'revealed' ? (
        <Reveal message={message} who="owner" />
      ) : state === 'expired' ? (
        <>
          <span className="badge">⌛ expirou</span>
          <h2>Essa pergunta expirou</h2>
          <p style={{ margin: '10px 0 22px' }}>Passaram 7 dias. Nada foi revelado — e está tudo bem.</p>
          <Link href="/" className="btn btn-primary">Fazer outra pergunta</Link>
        </>
      ) : (
        <>
          <span className="badge">🔒 pergunta criada · seu sim está guardado</span>
          <h2>Agora é só mandar o link</h2>
          <div className="quote">{question}</div>

          <div className="linkbox">
            <code id="share-url">{url}</code>
            <button className="btn btn-ghost" onClick={copy} id="copy-link">
              {copied ? 'Copiado ✓' : 'Copiar'}
            </button>
          </div>

          <div className="actions" style={{ flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <a className="btn btn-wa" href={url ? whatsappLink(url) : '#'} target="_blank" rel="noopener noreferrer" id="share-whatsapp" style={{ flex: 1 }}>
                WhatsApp
              </a>
              <button className="btn btn-ghost" onClick={share} id="share-native" style={{ flex: 1 }}>Compartilhar</button>
            </div>
            <button className="btn btn-primary btn-block" onClick={generateInstagramStory} style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', border: 'none', color: 'white' }}>
              📷 Postar nos Stories do Insta
            </button>
          </div>

          <div className="waiting" aria-live="polite">
            <span className="dots"><i /><i /><i /></span>
            Esperando a outra pessoa responder
          </div>

          {views > 0 && (
             <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '12px', color: 'var(--pink)', fontWeight: 'bold', textAlign: 'center', animation: 'popIn 0.5s ease-out' }}>
               🔥 {views} pessoa{views === 1 ? '' : 's'} visualizar{views === 1 ? 'ou' : 'aram'} o link mas não respondeu ainda!
             </div>
          )}

          <p className="hint" style={{ marginTop: 14 }}>
            Deixe esta página aberta ou volte depois. Só vai aparecer algo se os dois disserem sim.
          </p>
        </>
      )}
    </div>
  );
}
