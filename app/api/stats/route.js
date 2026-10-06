import { NextResponse } from 'next/server';
import { getStats } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ questions: 0, reveals: 0 });
  }
}
