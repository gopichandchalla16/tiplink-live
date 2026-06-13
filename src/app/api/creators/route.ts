import { NextRequest, NextResponse } from 'next/server';
import { getAllCreators, createCreator, getCreatorByUsername } from '@/lib/storage';

export async function GET() {
  try {
    const creators = await getAllCreators();
    return NextResponse.json(creators);
  } catch (err) {
    console.error('[GET /api/creators]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, bio, avatarUrl, category, personality, walletAddress } = body;

    if (!username || username.length < 3)
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return NextResponse.json({ error: 'Username: letters, numbers, underscores only' }, { status: 400 });
    if (!name || name.length < 2)
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    if (!walletAddress || walletAddress.length < 32)
      return NextResponse.json({ error: 'Invalid Solana wallet address' }, { status: 400 });

    const existing = await getCreatorByUsername(username);
    if (existing)
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });

    const creator = await createCreator({
      username: username.toLowerCase(),
      name,
      bio: bio || '',
      avatarUrl: avatarUrl || '',
      category: category || 'creator',
      personality: personality || 'grateful',
      walletAddress,
    });

    return NextResponse.json(creator, { status: 201 });
  } catch (err) {
    console.error('[POST /api/creators]', err);
    return NextResponse.json({ error: 'Failed to create creator' }, { status: 500 });
  }
}
