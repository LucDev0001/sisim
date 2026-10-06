import Nav from '@/components/Nav';
import Link from 'next/link';

export const metadata = {
  title: 'Sobre | Sim Sim',
  description: 'A história e as regras por trás da plataforma mais corajosa da internet.',
};

export default function AboutPage() {
  return (
    <>
      <Nav tag="sobre nós" />
      <main className="wrap section">
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '24px' }}>
            Nascido da <span className="grad-text">Curiosidade</span>
          </h1>
          
          <div className="card stack">
            <p className="lede">
              O <b>Sim Sim</b> foi criado com um único objetivo: acabar com a famosa dúvida "será que ele(a) também quer?".
            </p>
            
            <p>
              Quantas vezes você deixou de perguntar algo por medo da rejeição? Medo de ouvir um "não" que estragaria uma amizade ou causaria um clima estranho? Nós acreditamos que a sinceridade não deveria ser tão arriscada.
            </p>

            <h3 style={{ marginTop: '20px', fontSize: '1.4rem' }}>A Regra de Ouro</h3>
            <p>
              O sistema é desenhado em torno do <b>Duplo Blind</b> (Duplo Cego).
            </p>
            <ul style={{ paddingLeft: '20px', display: 'grid', gap: '10px', color: 'var(--ink-dim)' }}>
              <li>Quando você envia uma pergunta, ninguém sabe quem foi (a menos que você coloque seu nome).</li>
              <li>A pessoa que recebe só pode responder SIM ou NÃO.</li>
              <li>Se ela responder NÃO, ou ignorar, a resposta secreta nunca é revelada.</li>
              <li>Se ambos disserem SIM (A intenção de quem criou e a resposta de quem recebeu), a mágica acontece.</li>
            </ul>

            <h3 style={{ marginTop: '20px', fontSize: '1.4rem' }}>Por que viraliza?</h3>
            <p>
              O mistério. Aquele frio na barriga de ver uma pergunta na sua caixinha e não saber de quem é. A vontade incontrolável de dizer SIM para descobrir o segredo.
            </p>

            <div style={{ marginTop: '30px' }}>
              <Link href="/" className="btn btn-primary">
                Crie sua caixinha agora
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
