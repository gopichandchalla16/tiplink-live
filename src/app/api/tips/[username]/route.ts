import { NextRequest, NextResponse } from 'next/server';
import { getTipsByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const tips = await getTipsByUsername(username);
    return NextResponse.json(tips);
  } catch (err) {
    console.error('[GET /api/tips/[username]]', err);
    return NextResponse.json({ error: 'Failed to fetch tips' }, { status: 500 });
  }
}
