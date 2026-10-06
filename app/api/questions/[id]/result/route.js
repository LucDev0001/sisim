import { NextResponse } from 'next/server';
import { getResult } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  try {
    if (searchParams.get('role') === 'guest') {
      const { store } = require('@/lib/store');
      try {
        // Ignora erros de view
        if (store && store().incrementView) {
          store().incrementView(id).catch(() => {});
        }
      } catch (e) {}
    }
    const res = await getResult(id, searchParams.get('role'), searchParams.get('token'));
    if (res.error) return NextResponse.json({ error: res.error }, { status: res.status });
    return NextResponse.json(res, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao consultar.' }, { status: 500 });
  }
}
