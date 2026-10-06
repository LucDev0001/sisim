import { NextResponse } from 'next/server';
import { getFeed } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const items = await getFeed(12, q);
    return NextResponse.json(
      { items },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ items: [] });
  }
}
