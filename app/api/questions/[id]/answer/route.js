import { NextResponse } from 'next/server';
import { submitAnswer } from '@/lib/store';
import { getIp } from '@/lib/ip';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }
  try {
    const res = await submitAnswer(id, {
      answer: body.answer,
      message: body.message,
      guestToken: body.guestToken,
      ip: getIp(request),
    });
    if (res.error) return NextResponse.json({ error: res.error }, { status: res.status });
    return NextResponse.json(res, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao enviar a resposta.' }, { status: 500 });
  }
}
