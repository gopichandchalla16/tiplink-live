import { NextRequest, NextResponse } from 'next/server';
import { getAllCreators, createCreator } from '@/lib/storage';

export async function GET() {
  try {
    const creators = await getAllCreators();
    return NextResponse.json({ creators });
  } catch (error) {
    console.error('GET /api/creators error:', error);
    return NextResponse.json({ creators: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, displayName, bio, walletAddress, avatarUrl } = body;

    if (!username || !walletAddress) {
      return NextResponse.json({ error: 'username and walletAddress are required' }, { status: 400 });
    }

    const creator = await createCreator({ username, displayName: displayName ?? username, bio: bio ?? '', walletAddress, avatarUrl });
    return NextResponse.json({ creator }, { status: 201 });
  } catch (error) {
    console.error('POST /api/creators error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
