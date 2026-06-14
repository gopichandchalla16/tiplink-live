import { NextRequest, NextResponse } from 'next/server';
import { getTipsByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const tips = await getTipsByUsername(params.username);
    return NextResponse.json({ tips });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ tips: [] });
  }
}
