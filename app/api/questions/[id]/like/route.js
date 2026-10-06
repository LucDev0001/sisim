import { NextResponse } from 'next/server';
import { likeQuestion } from '@/lib/store';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    await likeQuestion(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Falha' }, { status: 500 });
  }
}
