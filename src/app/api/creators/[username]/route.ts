import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const creator = await getCreatorByUsername(username);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json(creator);
  } catch (err) {
    console.error('GET /api/creators/[username]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
