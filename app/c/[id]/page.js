import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import OwnerView from '@/components/OwnerView';
import { getPublic } from '@/lib/store';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Seu Sim Sim · status',
  robots: { index: false, follow: false },
};

export default async function OwnerPage({ params }) {
  const { id } = await params;
  const q = await getPublic(id);
  if (!q) notFound();
  return (
    <>
      <Nav tag="seu painel" />
      <main className="wrap flow">
        <OwnerView id={id} question={q.question} />
      </main>
    </>
  );
}
