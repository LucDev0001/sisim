'use client';

import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferred, setDeferred] = useState(null);
  const [ios, setIos] = useState(false);
  const [hint, setHint] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) return setInstalled(true);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || (!deferred && !ios)) return null;

  async function install() {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else setHint((h) => !h);
  }

  return (
    <div className="install">
      <button className="btn btn-ghost" onClick={install} id="install-app">📲 Instalar o app</button>
      {hint && <p className="hint">No iPhone: toque em Compartilhar e depois em “Adicionar à Tela de Início”.</p>}
    </div>
  );
}
