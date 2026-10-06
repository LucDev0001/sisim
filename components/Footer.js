import Link from 'next/link';
import InstallButton from '@/components/InstallButton';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo" aria-label="Sim Sim — página inicial">
            <span className="logo-mark" aria-hidden="true"><i /><i /></span>
            <span>Sim <span className="grad-text">Sim</span></span>
          </Link>
          <p>A pergunta que você nunca teve coragem de fazer. Só aparece se os dois disserem sim.</p>
          <InstallButton />
        </div>

        <nav className="footer-col" aria-label="Navegação">
          <h4>Sim Sim</h4>
          <Link href="/">Criar pergunta</Link>
          <Link href="/coragem">Minha coragem</Link>
          <Link href="/ranking">Ranking Global</Link>
          <Link href="/sobre">Sobre</Link>
        </nav>

        <nav className="footer-col" aria-label="Legal">
          <h4>Legal</h4>
          <Link href="/termos">Termos de uso</Link>
          <Link href="/privacidade">Política de privacidade</Link>
        </nav>

        <div className="footer-col">
          <h4>Créditos</h4>
          <span>Feito com 💜 por Luciano</span>
          <a href="https://lucianossantoswebdev.vercel.app/" target="_blank" rel="noopener noreferrer">🌐 Portfólio</a>
          <a href="https://github.com/LucDev0001" target="_blank" rel="noopener noreferrer">🐙 GitHub · LucDev0001</a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        © {new Date().getFullYear()} Sim Sim · Desenvolvido por{' '}
        <a href="https://lucianossantoswebdev.vercel.app/" target="_blank" rel="noopener noreferrer">Luciano</a> ·{' '}
        <a href="https://github.com/LucDev0001" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </footer>
  );
}
