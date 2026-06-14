import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(creator);
}
