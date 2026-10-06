import { NextResponse } from 'next/server';
import { createQuestion } from '@/lib/store';
import { getIp } from '@/lib/ip';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }
  try {
    const res = await createQuestion({
      question: body.question,
      message: body.message,
      fromName: body.fromName,
      isPublic: body.isPublic,
      category: body.category,
      ip: getIp(request),
    });
    if (res.error) return NextResponse.json({ error: res.error }, { status: res.status });
    return NextResponse.json({ id: res.id, ownerToken: res.ownerToken }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao criar a pergunta.' }, { status: 500 });
  }
}
