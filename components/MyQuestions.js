'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadMine } from '@/lib/local';

export default function MyQuestions() {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(loadMine().slice(0, 5));
  }, []);

  if (!list.length) return null;

  return (
    <nav className="mine" aria-label="Minhas perguntas">
      <h4>Minhas perguntas</h4>
      {list.map((q) => (
        <Link key={q.id} href={`/c/${q.id}#t=${q.token}`}>
          <span>{q.question}</span>
          <span>ver status →</span>
        </Link>
      ))}
    </nav>
  );
}
