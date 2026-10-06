import { NextResponse } from 'next/server';
import { reportQuestion } from '@/lib/store';
import { getIp } from '@/lib/ip';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const res = await reportQuestion(id, getIp(request));
    if (res.error) return NextResponse.json({ error: res.error }, { status: res.status });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao denunciar.' }, { status: 500 });
  }
}
