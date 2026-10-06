import { NextResponse } from 'next/server';
import { pingOnline } from '@/lib/store';

export async function POST(req) {
  try {
    const { id } = await req.json();
    const count = await pingOnline(id);
    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json({ count: 1 });
  }
}
