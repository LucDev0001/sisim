import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import GuestView from '@/components/GuestView';
import { getPublic } from '@/lib/store';

export const dynamic = 'force-dynamic';

// Metadados genéricos de propósito para Disfarce/Efeito Manada
export const metadata = {
  title: '🔥 Uma pergunta anônima está circulando... · Sim Sim',
  description: 'Você toparia? Abra para ler e responda. O seu NÃO é sempre 100% secreto.',
  robots: { index: false, follow: false },
};

export default async function GuestPage({ params }) {
  const { id } = await params;
  const q = await getPublic(id);
  if (!q) notFound();
  return (
    <>
      <Nav tag="uma pergunta secreta" />
      <main className="wrap flow">
        <GuestView id={id} question={q.question} expired={q.expired} />
      </main>
    </>
  );
}
