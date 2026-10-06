import Nav from '@/components/Nav';
import CreateForm from '@/components/CreateForm';
import MyQuestions from '@/components/MyQuestions';
import Onboarding from '@/components/Onboarding';

const USES = [
  '💬 “Vamos voltar a ser amigos?”',
  '🤝 “Você toparia ser meu sócio?”',
  '💘 “Você está a fim?”',
  '🏠 “Quer continuar morando comigo?”',
  '💼 “Você também quer sair daqui?”',
  '👨‍👩‍👧 “Podemos fazer as pazes?”',
];

export default function Home() {
  return (
    <>
      <Onboarding />
      <Nav />
      <main className="wrap">
        <section className="hero" aria-labelledby="titulo">
          <div>
            <span className="eyebrow">A pergunta que você nunca fez</span>
            <h1 id="titulo">
              Só aparece se os dois disserem <span className="grad-text">sim.</span>
            </h1>
            <p className="lede">
              Faça a pergunta difícil <b>sem medo de rejeição.</b> Se um dos dois disser não, ninguém nunca fica
              sabendo.
            </p>
            <div className="orbs" aria-hidden="true" style={{ marginTop: 36 }}>
              <div className="orb a" />
              <div className="orb b" />
              <div className="orbs-core">SIM SIM</div>
              <div className="orbs-label">dois “sims” se encontram → revelação 🎉</div>
            </div>
          </div>
          <div>
            <CreateForm />
            <MyQuestions />
          </div>
        </section>

        <section className="section" aria-labelledby="como">
          <h2 id="como">Como funciona</h2>
          <div className="steps">
            <article className="step">
              <div className="step-n">1</div>
              <h3>Você pergunta</h3>
              <p>Escreve a pergunta. O seu “sim” já fica guardado em segredo — sem cadastro, sem login.</p>
            </article>
            <article className="step">
              <div className="step-n">2</div>
              <h3>Ela responde no escuro</h3>
              <p>Manda o link. A outra pessoa responde sim ou não sem ver nada do que você respondeu.</p>
            </article>
            <article className="step">
              <div className="step-n">3</div>
              <h3>Só o duplo sim aparece</h3>
              <p>Dois sims = revelação com confete. Qualquer outro caso fica em silêncio. Para sempre.</p>
            </article>
          </div>
        </section>

        <section className="section" aria-labelledby="usos">
          <h2 id="usos">Para as perguntas que ficam engasgadas</h2>
          <div className="uses">
            {USES.map((u) => (
              <span className="use" key={u}>{u}</span>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="promise">
            <p>Um “não” nunca é revelado. Ninguém passa vergonha. Só existe o duplo sim.</p>
          </div>
        </section>
      </main>
      <footer className="footer wrap">Sim Sim · feito para quem tem coragem de perguntar (quase).</footer>
    </>
  );
}
