export default function manifest() {
  return {
    name: 'Sim Sim — a resposta só aparece se os dois disserem sim',
    short_name: 'Sim Sim',
    description: 'Faça a pergunta difícil sem medo de rejeição. Só se os dois disserem sim a resposta é revelada.',
    id: '/',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0614',
    theme_color: '#0a0614',
    lang: 'pt-BR',
    categories: ['social', 'lifestyle'],
    icons: [
      { src: '/pwa-icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/pwa-icon/512?maskable=1', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Nova pergunta', url: '/#create-form' },
      { name: 'Minha coragem', url: '/coragem' },
    ],
  };
}
