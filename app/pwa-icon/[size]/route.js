import { ImageResponse } from 'next/og';
import { iconJsx } from '@/lib/icon';

export const dynamic = 'force-static';

export async function GET(request, { params }) {
  const { size } = await params;
  const px = size === '512' ? 512 : 192;
  const maskable = new URL(request.url).searchParams.has('maskable');
  return new ImageResponse(iconJsx(px, maskable ? 0.72 : 1), {
    width: px,
    height: px,
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
