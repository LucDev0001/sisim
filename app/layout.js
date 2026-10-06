import { Outfit } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import ToastHost from '@/components/ToastHost';
import LiveToast from '@/components/LiveToast';
import PwaRegister from '@/components/PwaRegister';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Sim Sim — A pergunta que você nunca teve coragem de fazer',
  description: 'Faça aquela pergunta difícil sem medo de rejeição. Só se os dois disserem sim a resposta é revelada. Se um disser não, o segredo morre. 100% Anônimo.',
  keywords: ['perguntas anônimas', 'duplo cego', 'fazer perguntas difíceis', 'crush', 'perguntar se quer ficar', 'jogo de perguntas', 'sim ou não', 'quiz anônimo', 'coragem'],
  authors: [{ name: 'Luciano', url: 'https://lucianossantoswebdev.vercel.app/' }],
  creator: 'Luciano',
  publisher: 'Sim Sim App',
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sim Sim — O Teste do Duplo Sim',
    description: 'A resposta só aparece se os dois disserem sim. Ninguém passa vergonha! Faça sua pergunta anônima agora.',
    url: siteUrl,
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Sim Sim',
    images: [
      {
        url: '/opengraph-image', 
        width: 1200,
        height: 630,
        alt: 'Sim Sim - A mágica do duplo sim',
      },
    ],
  },
  twitter: { 
    card: 'summary_large_image',
    title: 'Sim Sim — A pergunta sem medo da rejeição',
    description: 'Faça perguntas anônimas. A resposta só aparece se ambos disserem SIM!',
    creator: '@LucDev0001',
  },
  applicationName: 'Sim Sim',
  appleWebApp: { capable: true, title: 'Sim Sim', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: '#0a0614',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={outfit.variable} data-scroll-behavior="smooth">
      <body>
        {/* JSON-LD Schema (Rich Snippets do Google) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Sim Sim',
              operatingSystem: 'Any',
              applicationCategory: 'EntertainmentApplication',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '89424'
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'BRL'
              },
              description: 'O aplicativo web que permite fazer perguntas anônimas onde a resposta só é revelada se ambos concordarem com o SIM.',
            })
          }}
        />
        <div className="aurora" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        {children}
        <Footer />
        <ToastHost />
        <LiveToast />
        <PwaRegister />
      </body>
    </html>
  );
}
