import { NextResponse } from 'next/server';
import { syncLeaderboard, getLeaderboard } from '@/lib/store';

export async function GET() {
  try {
    const list = await getLeaderboard();
    return NextResponse.json({ items: list });
  } catch (err) {
    return NextResponse.json({ error: 'Falha ao buscar ranking' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const r = await syncLeaderboard(data);
    if (r.error) return NextResponse.json({ error: r.error }, { status: r.status });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
