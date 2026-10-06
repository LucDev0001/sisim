'use client';

import { useEffect } from 'react';

// Registra o service worker (somente em produção, para não atrapalhar o desenvolvimento).
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return null;
}
