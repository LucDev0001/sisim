import Nav from '@/components/Nav';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade | Sim Sim',
  description: 'Política de privacidade e LGPD da plataforma Sim Sim.',
};

export default function PrivacidadePage() {
  return (
    <>
      <Nav tag="privacidade" />
      <main className="wrap section">
        <div className="card stack" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '40px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '10px' }}>
            Política de <span className="grad-text">Privacidade</span>
          </h1>
          <p className="hint" style={{ textAlign: 'left', marginBottom: '30px' }}>Em conformidade com a LGPD (Lei nº 13.709/2018)</p>

          <div style={{ display: 'grid', gap: '20px', color: 'var(--ink-dim)', lineHeight: '1.6' }}>
            <p>
              A sua privacidade e segurança são os pilares fundamentais do <b>Sim Sim</b>. Esta política explica como lidamos (ou melhor, como NÃO lidamos) com seus dados pessoais.
            </p>

            <h3 style={{ color: 'var(--ink)' }}>1. O que coletamos e por quê?</h3>
            <p>Nossa arquitetura é construída com o princípio de "Privacy by Design" (Privacidade desde a concepção):</p>
            <ul style={{ paddingLeft: '20px', display: 'grid', gap: '8px' }}>
              <li><b>Textos Inseridos:</b> Coletamos o texto da pergunta e a mensagem secreta para que a mecânica do jogo funcione.</li>
              <li><b>Endereço IP (Anonimizado):</b> Nós recebemos o IP para evitar spam (limite de tentativas), mas ele é aplicado a uma função criptográfica irreversível (hash SHA-256) com um "salt". O IP bruto <b>nunca</b> é salvo no banco de dados.</li>
              <li><b>Progresso (Gamificação):</b> Seus XP, nível e emblemas ficam salvos <b>localmente no seu dispositivo</b> (LocalStorage). O servidor não sabe quem você é nem quantos pontos você tem.</li>
            </ul>

            <h3 style={{ color: 'var(--ink)' }}>2. O que NÃO coletamos</h3>
            <p>
              Não exigimos cadastro. Não pedimos e-mail, telefone, CPF, nome completo ou senhas. Nós não rastreamos sua navegação em outros sites, nem usamos cookies de terceiros para publicidade direcionada.
            </p>

            <h3 style={{ color: 'var(--ink)' }}>3. Retenção de Dados (Ciclo de Vida)</h3>
            <p>
              Não mantemos dados para sempre. Nosso sistema funciona de forma efêmera:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'grid', gap: '8px' }}>
              <li>Toda caixinha expira automaticamente após <b>7 dias</b>. Depois disso, é impossível responder.</li>
              <li>Nosso banco de dados executa limpezas automáticas regulares que <b>apagam permanentemente</b> perguntas e mensagens antigas do sistema após 30 dias. Nenhuma cópia é mantida.</li>
            </ul>

            <h3 style={{ color: 'var(--ink)' }}>4. Compartilhamento de Dados</h3>
            <p>
              Nós <b>não vendemos, alugamos ou compartilhamos</b> os textos inseridos na plataforma com empresas de marketing ou terceiros.
            </p>

            <h3 style={{ color: 'var(--ink)' }}>5. Seus Direitos (LGPD)</h3>
            <p>
              A LGPD garante direitos como acesso e exclusão de dados. Como o Sim Sim é 100% anônimo e não cria perfis vinculados a identidades reais (não temos seu e-mail nem seu nome), a exclusão de uma pergunta pode ser feita indiretamente através do sistema de "Denúncia" na própria interface ou aguardando o prazo de exclusão automática. Você também pode apagar seu progresso de jogo limpando os dados do navegador (LocalStorage).
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
