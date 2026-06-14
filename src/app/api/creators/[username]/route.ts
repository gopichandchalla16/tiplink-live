import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const creator = await getCreatorByUsername(params.username);
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  return NextResponse.json({ creator });
}
