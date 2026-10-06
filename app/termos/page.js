import Nav from '@/components/Nav';
import Link from 'next/link';

export const metadata = {
  title: 'Termos de Uso | Sim Sim',
  description: 'Termos de uso da plataforma Sim Sim.',
};

export default function TermosPage() {
  return (
    <>
      <Nav tag="legal" />
      <main className="wrap section">
        <div className="card stack" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '40px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '10px' }}>
            Termos de <span className="grad-text">Uso</span>
          </h1>
          <p className="hint" style={{ textAlign: 'left', marginBottom: '30px' }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <div style={{ display: 'grid', gap: '20px', color: 'var(--ink-dim)', lineHeight: '1.6' }}>
            <p>
              Bem-vindo ao <b>Sim Sim</b>. Ao utilizar nossa plataforma, você concorda expressamente com estes Termos de Uso. 
              Por favor, leia-os com atenção antes de criar ou responder caixinhas.
            </p>

            <h3 style={{ color: 'var(--ink)' }}>1. Aceitação e Natureza do Serviço</h3>
            <p>
              O Sim Sim é uma plataforma de entretenimento baseada no anonimato e na mecânica de "duplo cego" (duplo sim). 
              A plataforma é fornecida "no estado em que se encontra", sem garantias de que o destinatário responderá à sua pergunta.
            </p>

            <h3 style={{ color: 'var(--ink)' }}>2. Regras de Conduta</h3>
            <p>
              Você concorda em usar o Sim Sim apenas para fins lícitos. É terminantemente proibido:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'grid', gap: '8px' }}>
              <li>Enviar mensagens com discurso de ódio, assédio, racismo, homofobia, ou qualquer forma de discriminação.</li>
              <li>Praticar bullying, ameaças ou intimidações contra outros usuários.</li>
              <li>Enviar links maliciosos, spam ou conteúdo pornográfico/ilegal.</li>
              <li>Tentar quebrar o anonimato da plataforma através de engenharia reversa.</li>
            </ul>

            <h3 style={{ color: 'var(--ink)' }}>3. Moderação e Denúncias</h3>
            <p>
              Apesar do nosso filtro automatizado de palavras sensíveis, não revisamos manualmente cada pergunta. 
              Contamos com um sistema de denúncias: qualquer pergunta que receba múltiplas denúncias é automaticamente ocultada e banida do sistema.
            </p>

            <h3 style={{ color: 'var(--ink)' }}>4. Idade Mínima</h3>
            <p>
              O serviço é destinado a maiores de 16 anos. Menores de 16 anos não devem utilizar a plataforma.
            </p>

            <h3 style={{ color: 'var(--ink)' }}>5. Limitação de Responsabilidade</h3>
            <p>
              O Sim Sim não se responsabiliza pelo conteúdo gerado pelos usuários. O autor da pergunta (caso inclua seu nome na mensagem secreta) 
              ou do link compartilhado é o único responsável pelas reações e consequências de suas perguntas.
            </p>

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
              <Link href="/" className="btn btn-ghost">Voltar ao Início</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
