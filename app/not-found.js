import Link from 'next/link';
import Nav from '@/components/Nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="wrap flow">
        <div className="card flow-card">
          <span className="badge">404</span>
          <h2>Essa pergunta não existe (ou já sumiu)</h2>
          <p style={{ margin: '10px 0 22px' }}>Confira o link ou crie um novo Sim Sim.</p>
          <Link href="/" className="btn btn-primary">Criar um Sim Sim</Link>
        </div>
      </main>
    </>
  );
}
