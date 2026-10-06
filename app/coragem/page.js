'use client';

import Nav from '@/components/Nav';
import Profile from '@/components/Profile';
import MyQuestions from '@/components/MyQuestions';

export default function CoragemPage() {
  return (
    <>
      <Nav tag="minha coragem" />
      <main className="wrap section">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '24px' }}>
            Seu <span className="grad-text">Arsenal</span> de Coragem
          </h1>
          <p className="lede" style={{ marginBottom: '40px' }}>
            Acompanhe seu nível, ofensiva diária e as perguntas que você criou.
          </p>
          
          <div style={{ display: 'grid', gap: '40px' }}>
            <Profile />
            
            <div className="card">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Caixinhas Criadas</h3>
              <MyQuestions />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
