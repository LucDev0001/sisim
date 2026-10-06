'use client';

import { useState, useEffect } from 'react';
import { award, setRankingName } from '@/lib/game';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [nick, setNick] = useState('');

  useEffect(() => {
    // Only show once
    const done = localStorage.getItem('simsim:onboard');
    if (!done) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const finish = () => {
    if (nick.trim().length >= 2) {
      setRankingName(nick.trim());
    } else if (step === 3) {
      return; // force them to enter something or we can just allow them to skip. Let's allow skip by putting a secondary button, but if they click the main button they must type.
    }
    
    setVisible(false);
    localStorage.setItem('simsim:onboard', 'done');
    // Reward the user for finishing the tutorial!
    setTimeout(() => {
      award('onboard_bonus', { amount: 50, label: 'Bônus de Boas-Vindas 🎉' });
    }, 600);
  };

  const skipNick = () => {
    setVisible(false);
    localStorage.setItem('simsim:onboard', 'done');
    setTimeout(() => {
      award('onboard_bonus', { amount: 50, label: 'Bônus de Boas-Vindas 🎉' });
    }, 600);
  };

  if (!visible) return null;

  return (
    <div className="onboard-overlay">
      <div className="onboard-modal">
        {step === 0 && (
          <div className="onboard-slide reveal">
            <h2>Seja sincero... 🫣</h2>
            <p>Quantas vezes você deixou de fazer aquela pergunta "arriscada" por medo de ouvir um <b>Não</b>?</p>
            <div className="onboard-opts">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Muitas vezes</button>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Algumas vezes</button>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Nunca, sou cara de pau</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="onboard-slide reveal">
            <h2>Como funciona o Sim Sim 🤫</h2>
            <p>Você cria uma pergunta (ex: <i>"Vamos tentar de novo?"</i>) e manda o link. É <b>100% anônimo</b>.</p>
            <p>A pessoa que abrir só pode responder <b>Sim</b> ou <b>Não</b>.</p>
            <div className="onboard-opts">
              <button className="btn btn-primary" onClick={() => setStep(2)}>Entendi!</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboard-slide reveal">
            <h2>O Duplo Cego 🎭</h2>
            <p>Se ela responder <b>NÃO</b>, o seu segredo morre ali. Ninguém descobre o que era.</p>
            <p>Mas se ela disser <b>SIM</b>... a mágica acontece! ✨</p>
            <div className="onboard-opts" style={{ marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Incrível!</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboard-slide reveal">
            <h2>Sua Identidade Secreta 🥷</h2>
            <p>Você acabou de ganhar <b>+50 XP</b>! Escolha um apelido para aparecer na <b>Liga dos Mestres</b> (nosso ranking global).</p>
            <div className="onboard-opts" style={{ marginTop: '20px', gap: '16px' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Seu apelido lendário..." 
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                maxLength={20}
                style={{ textAlign: 'center', fontSize: '1.1rem' }}
              />
              <button 
                className="btn btn-sim" 
                onClick={finish} 
                disabled={nick.trim().length < 2}
                style={{ fontSize: '1.1rem', padding: '16px' }}
              >
                Bora criar minha caixinha!
              </button>
              <button className="btn btn-ghost" onClick={skipNick} style={{ fontSize: '0.9rem', padding: '10px' }}>
                Deixar anônimo por enquanto
              </button>
            </div>
          </div>
        )}

        <div className="onboard-dots">
          <i className={step === 0 ? 'active' : ''} />
          <i className={step === 1 ? 'active' : ''} />
          <i className={step === 2 ? 'active' : ''} />
          <i className={step === 3 ? 'active' : ''} />
        </div>
      </div>
    </div>
  );
}
