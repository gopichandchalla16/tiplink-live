import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByWallet, getTipsByUsername } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;
    if (!wallet) {
      return NextResponse.json(
        { error: 'wallet param missing' },
        { status: 400 }
      );
    }
    const creator = await getCreatorByWallet(wallet);
    if (!creator) {
      return NextResponse.json({ creator: null, tips: [] });
    }
    const tips = await getTipsByUsername(creator.username);
    return NextResponse.json({ creator, tips });
  } catch (err) {
    console.error('[GET /api/tips/by-wallet]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
