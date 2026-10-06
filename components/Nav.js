import Link from 'next/link';
import GameHud from '@/components/GameHud';
import OnlineCounter from '@/components/OnlineCounter';
import SearchBar from '@/components/SearchBar';

export default function Nav({ tag = 'perguntas sem medo de rejeição' }) {
  return (
    <header className="wrap nav">
      <Link href="/" className="logo" aria-label="Sim Sim — página inicial">
        <span className="logo-mark" aria-hidden="true">
          <i />
          <i />
        </span>
        <span>
          Sim <span className="grad-text">Sim</span>
        </span>
      </Link>
      <div className="nav-right">
        <OnlineCounter />
        <SearchBar />
        <span className="nav-tag">{tag}</span>
        <Link href="/ranking" className="nav-link">Ranking 👑</Link>
        <Link href="/sobre" className="nav-link hide-mobile">Sobre</Link>
        <GameHud />
      </div>
    </header>
  );
}
