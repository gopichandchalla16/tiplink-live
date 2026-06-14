import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByUsername, getCreatorByWallet, createCreator } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const wallet = searchParams.get('wallet');

  if (username) {
    const creator = await getCreatorByUsername(username);
    if (!creator) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ creator });
  }

  if (wallet) {
    const creator = await getCreatorByWallet(wallet);
    if (!creator) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ creator });
  }

  return NextResponse.json({ error: 'Provide username or wallet query param' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, displayName, bio, walletAddress, avatarUrl } = body;
    if (!username || !walletAddress) {
      return NextResponse.json({ error: 'username and walletAddress required' }, { status: 400 });
    }
    const existing = await getCreatorByUsername(username);
    if (existing) return NextResponse.json({ creator: existing });
    const creator = await createCreator({
      username,
      displayName: displayName ?? username,
      bio: bio ?? '',
      walletAddress,
      avatarUrl,
    });
    return NextResponse.json({ creator }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
