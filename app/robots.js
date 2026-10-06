export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/c/', '/q/'], // Não indexar páginas de perguntas individuais (privadas)
    },
    sitemap: 'https://simsim.app/sitemap.xml', // Trocar pelo domínio real depois
  };
}
