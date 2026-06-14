import { NextRequest, NextResponse } from 'next/server';
import { getTipsByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const tips = await getTipsByUsername(username);
  return NextResponse.json(tips);
}
