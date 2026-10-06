import Link from 'next/link';

export const metadata = {
  title: 'Sem conexão · Sim Sim',
  robots: { index: false, follow: false },
};

export default function Offline() {
  return (
    <main className="wrap flow">
      <div className="card flow-card">
        <span className="badge">📡 sem internet</span>
        <h2>Você está offline</h2>
        <p style={{ margin: '10px 0 22px' }}>
          Para fazer ou responder uma pergunta secreta o Sim Sim precisa de conexão. Volte quando a internet voltar.
        </p>
        <Link href="/" className="btn btn-primary">Tentar de novo</Link>
      </div>
    </main>
  );
}
