import { NextRequest, NextResponse } from 'next/server';
import {
  getCreatorByUsername,
  getCreatorByWallet,
  createCreator,
  type Creator,
} from '@/lib/storage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const wallet = searchParams.get('wallet');

  if (username) {
    const creator = await getCreatorByUsername(username);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json(creator);
  }

  if (wallet) {
    const creator = await getCreatorByWallet(wallet);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json(creator);
  }

  return NextResponse.json(
    { error: 'Provide ?username= or ?wallet= query param' },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<Creator>;

    if (!body.username || !body.name || !body.walletAddress) {
      return NextResponse.json(
        { error: 'username, name, and walletAddress are required' },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(body.username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 lowercase alphanumeric chars or underscores' },
        { status: 400 }
      );
    }

    const existing = await getCreatorByUsername(body.username);
    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    const saved = await createCreator({
      username: body.username,
      name: body.name,
      bio: body.bio ?? '',
      avatarUrl: body.avatarUrl ?? '',
      category: body.category ?? 'Other',
      walletAddress: body.walletAddress,
      personality: body.personality ?? 'warm',
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('[POST /api/creator]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
