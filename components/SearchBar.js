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
    <form onSubmit={submit} className="search-bar-form">
      <input
        type="text"
        placeholder="Buscar assuntos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input search-input"
      />
      <button type="submit" style={{ display: 'none' }}>Buscar</button>
    </form>
  );
}
