'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      router.push(`/explorar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={submit} className="search-bar" style={{ display: 'flex', marginLeft: 'auto', marginRight: '16px' }}>
      <input
        type="text"
        placeholder="Buscar assuntos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input"
        style={{
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid var(--line)',
          background: 'var(--glass)',
          color: 'var(--ink)',
          fontSize: '0.85rem',
          width: '180px',
          outline: 'none',
        }}
      />
      <button type="submit" style={{ display: 'none' }}>Buscar</button>
    </form>
  );
}
